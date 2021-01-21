chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  console.log("webListener Executes!!");
  // Send message to content Script -> Page was changed
  // or execute parser from here
  // or execute script
  const executeScript = `$("input[type=file]").each(function () {
    $(this).off("click");
    $(this).on("click", async () => {
    current_file_input = $(this);
    iframe = document.createElement("iframe");
    iframe.src = chrome.extension.getURL("modal.html");
    iframe.setAttribute("allowTransparency", true);
    iframe.setAttribute(
        "style",
        "position: absolute; border: none; left: 0px; top: 0px; height: 100vh; width: 100vw; z-index: 20000000; display: grid; place-items: center;"
    );
    iframe.id = "fileDialogFrame";
    $(iframe).appendTo("body");
    $(this).attr("type", "hidden");
    await new Promise((resolve) => setTimeout(resolve, 0));
    $(this).attr("type", "file");
    });
  });`;

  chrome.tabs.executeScript({ file: "jquery.min.js" }, function () {
    if (chrome.runtime.lastError) {
      console.log(
        "Script injection failed: " + chrome.runtime.lastError.message
      );
    }
    chrome.tabs.executeScript({ code: executeScript }, function () {
      if (chrome.runtime.lastError) {
        console.log(
          "Script injection failed: " + chrome.runtime.lastError.message
        );
      }
    });
  });
});
