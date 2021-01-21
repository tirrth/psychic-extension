"use strict";
console.log("Chrome Extension(trial) executes!!");

// Anonymous function (Just to teach myself a little more about them, not necessary to use)
(function () {
  $(window).on("load", _onInputFileClickFnBind);
})();

// --------------------------------------- Below code is to observe changes(mutation) in dom and webNaviagtion --------------------------------------- //
// Select the node that will be observed for mutations
const targetNode = document.body;
// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };
// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  try {
    for (const mutation of mutationsList) {
      // console.log("mutation.addedNodes", mutation.addedNodes);
      if (mutation && mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          if (
            mutation.addedNodes[i] instanceof HTMLElement &&
            mutation.addedNodes[i].querySelectorAll("input[type='file']")
              .length > 0
          ) {
            _onInputFileClickFnBind();
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};
// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
observer.observe(targetNode, config);
// Later, you can stop observing
// observer.disconnect();
// --------------------------------------- Exit --------------------------------------- //

var current_file_input;
var iframe = document.createElement("iframe");
let toBool = (string) => (string === "true" ? true : false);
const get_modal_url = chrome.extension.getURL("modal.html");
iframe.src = get_modal_url;
iframe.setAttribute("allowTransparency", true);
iframe.setAttribute(
  "style",
  "position: absolute; border: none; left: 0px; top: 0px; height: 100vh; width: 100vw; z-index: 20000000; display: grid; place-items: center;"
);
iframe.id = "fileDialogFrame";

function _onInputFileClickFnBind() {
  $("input[type=file]").each(function () {
    $(this).off("click");
    $(this).on("click", async (event) => {
      event.preventDefault();
      current_file_input = $(this);

      iframe.setAttribute(
        "data-multiple",
        $(this).attr("multiple") ? true : false
      );
      iframe.setAttribute("data-accept", $(this).attr("accept") || "");
      $(iframe).appendTo("body");

      // $(this).attr("type", "hidden");
      // await new Promise((resolve) => setTimeout(resolve, 0));
      // $(this).attr("type", "file");
    });
  });
}

window.addEventListener(
  "message",
  async (event) => {
    switch (event.data.type) {
      case "iframeLoaded":
        try {
          // One way to send data back to the child iframe
          if (
            iframe &&
            iframe.src &&
            event.origin === iframe.src.split("/").splice(0, 3).join("/")
          ) {
            var _window = iframe.contentWindow;
            _window.postMessage(
              { multiple: toBool(iframe.getAttribute("data-multiple")) },
              iframe.src
            );
          }
        } catch (err) {
          console.log(err);
        }
        break;

      case "hideFrame":
        $("#fileDialogFrame").remove();
        break;

      case "openLocalFileDialog":
        if (toBool(iframe.getAttribute("data-multiple"))) {
          const random_id = `${
            Math.random().toString(36).substr(2, 9) + new Date().valueOf()
          }`;
          try {
            let hidden_file_input = `<input id=${random_id} style="display: none;" type="file" />`;
            $(hidden_file_input).appendTo(document.body);
            if (toBool(iframe.getAttribute("data-multiple"))) {
              document.getElementById(random_id).setAttribute("multiple", "");
            }
            iframe.getAttribute("data-accept")
              ? document
                  .getElementById(random_id)
                  .setAttribute("accept", iframe.getAttribute("data-accept"))
              : null;
            document.getElementById(random_id).click();
            let list = new DataTransfer();
            $(`#${random_id}`).on("change", function (e) {
              for (let i = 0; i < e.target.files.length; i++) {
                list.items.add(e.target.files[i]);
              }
              let customisedFileList = list.files;
              current_file_input.prop("files", customisedFileList);
            });
          } catch (err) {
            console.log(err);
          } finally {
            document.getElementById(random_id).remove();
          }
        } else {
          let fileHandle;
          const pickerOpts = {
            types: [
              {
                description: "Files",
                accept: {
                  "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                  "video/*": [".mp4"],
                },
              },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
          };
          try {
            [fileHandle] = await window.showOpenFilePicker(pickerOpts);
            const fileData = await fileHandle.getFile();
            let list = new DataTransfer();
            list.items.add(fileData);
            let customisedFileList = list.files;
            current_file_input.prop("files", customisedFileList);
          } catch (err) {
            console.log(err);
          }
        }
        break;

      case "uploadFiles":
        try {
          // Second way to send data back to the child iframe
          _uploadFiles(event.data.src_arr)
            .then((res) => {
              event.source.postMessage(
                { type: "uploadResponse" },
                event.origin
              );
            })
            .catch((err) => {
              console.log(err);
              try {
                event.source.postMessage(
                  { type: "uploadError", error: err },
                  event.origin
                );
              } catch (error) {
                console.log(error);
              } finally {
                alert(err);
              }
            });
        } catch (err) {
          console.log(err);
        }
        break;

      default:
        $("#fileDialogFrame").remove();
    }
  },
  false
);

async function _uploadFiles(file_src_arr) {
  let list = new DataTransfer();

  const URLtoFile = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const file_extension = blob.type.split("/")[1];
        const filename_index = url.lastIndexOf("/") + 1;
        const filename = `${url
          .substr(filename_index)
          .split("?")[0]
          .replace(`.${file_extension}`, "")}`.replace(".", "_");

        let file_obj = new File([blob], `${filename}.${file_extension}`, {
          type: blob.type,
        });
        return Promise.resolve(file_obj);
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject(new Error(err.message));
      });

  await Promise.all(
    file_src_arr.map(async (file_src) => {
      await URLtoFile(file_src)
        .then((fileData) => {
          list.items.add(fileData);
        })
        .catch((err) => {
          console.log(err);
          throw JSON.stringify(err.message);
        });
    })
  );

  let customisedFileList = list.files;
  current_file_input.prop("files", customisedFileList);
  console.log("File/s Uploaded successfully!!");
  return JSON.stringify("File/s Uploaded successfully!!");
}