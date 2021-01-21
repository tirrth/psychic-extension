$(function () {
  $("#form").submit(function (e) {
    e.preventDefault();
    if (e.target[0].value) {
      $("img").remove();
      $("#submit-button-google-chrome-extension").remove();
      $(
        `<img id="selected-image" src='${e.target[0].value}' style='width:400px;'>`
      ).appendTo("body");
      $(
        `<div id="submit-button-google-chrome-extension" style="margin-top:10px;"><button>Submit</button></div>`
      ).appendTo("body");

      //image-onerror
      document.getElementById("selected-image").onerror = function () {
        alert("Please enter valid url");
        e.target[0].value = "";
        $("#selected-image").remove();
        $("#submit-button-google-chrome-extension").remove();
      };
    } else {
      alert("Please enter valid url");
      e.target[0].value = "";
      $("#selected-image").remove();
      $("#submit-button-google-chrome-extension").remove();
    }
  });
});
