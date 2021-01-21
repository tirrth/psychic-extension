// Prevent user From right clicking and opening inspect element
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

var selected_dropdown = "";
var file_type = "";
var file_upload_loader = `<div class="spinner-border text-primary ml-2" role="status">
<span class="sr-only">Loading...</span>
</div>`;

window.parent.postMessage({ type: "iframeLoaded" }, "*");

$(window).on("load", function () {
  $(document).on("customSubmitBtnHandler", function (event, arg1, arg2) {
    if ($(".file_selected").length) {
      $("#upload_files").removeClass("disabled");
      $("#upload_files").css({ cursor: "pointer" });
    } else {
      $("#upload_files").addClass("disabled");
      $("#upload_files").css({ cursor: "no-drop" });
    }
  });

  $("#fileSelectionDialog").modal("show");
  $("#fileDialogControlSelectFiles").text("Unsplash");
  file_type = "image";
  selected_dropdown = "unsplash";
  _imageSearch("", selected_dropdown);

  $(".open_local_filesystem").on("click", () => {
    window.parent.postMessage({ type: "hideFrame" }, "*"); //The second argument to postMessage() can be '*' to indicate no preference about the origin of the destination. A target origin should always be provided when possible, to avoid disclosing the data you send to any other site.
    window.parent.postMessage({ type: "openLocalFileDialog" }, "*");
  });

  $(".dropdown-item").each(function () {
    $(this).on("click", () => {
      $("#fileDialogControlSelectFiles").text($(this).text());
      selected_dropdown = $(this).attr("data-item").split("_")[0];
      file_type = $(this).attr("data-item").split("_")[1];
      let query_string = $(".query_string").val() || file_type;

      if (file_type === "image") {
        switch (selected_dropdown) {
          case "unsplash":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "pexels":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "bing":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "pixabay":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "googleilr":
            _googleImageSearch(
              query_string === "image"
                ? "google founders and current ceo"
                : query_string
            );
            break;
        }
      } else if (file_type === "video") {
        switch (selected_dropdown) {
          case "pexels":
            _videoSearch(query_string, selected_dropdown);
            break;
          case "bing":
            _videoSearch(query_string, selected_dropdown);
            break;
          case "pixabay":
            _videoSearch(query_string, selected_dropdown);
            break;
        }
      }
    });
  });

  $(".query_search_submit").on("click", (e) => {
    e.preventDefault();
    let query_string = $(".query_string").val() || file_type;
    if (selected_dropdown) {
      if (file_type === "image") {
        switch (selected_dropdown) {
          case "unsplash":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "pexels":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "bing":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "pixabay":
            _imageSearch(query_string, selected_dropdown);
            break;
          case "googleilr":
            _googleImageSearch(query_string);
            break;
        }
      } else if (file_type === "video") {
        switch (selected_dropdown) {
          case "pexels":
            _videoSearch(query_string, selected_dropdown);
            break;
          case "bing":
            _videoSearch(query_string, selected_dropdown);
            break;
          case "pixabay":
            _videoSearch(query_string, selected_dropdown);
            break;
        }
      }
    } else {
      alert("Please select a file source!!");
    }
  });

  $("#upload_files").on("click", function () {
    if ($(".file_selected").length > 0) {
      $("#upload_files").off("click");
      $("#upload_files").addClass("disabled");
      $("#upload_files").css({ cursor: "no-drop" });
      $(file_upload_loader).appendTo($(".modal-footer"));

      let file_src_arr = [];
      let file_specific_src_key;

      if (file_type === "image") {
        file_specific_src_key = "img";
      } else if (file_type === "video") {
        file_specific_src_key = "video source";
      } else {
        file_specific_src_key = "img";
      }

      if (!is_multiple_selection_allowed) {
        if ($(".file_selected").length > 1) {
          alert("Only One File is allowed to upload!!");
        } else {
          file_src_arr.push(
            $(".file_selected")
              .parent()
              .find(`.file_container_div:first ${file_specific_src_key}`)
              .attr("data-src")
          );
        }
      } else {
        $(".file_selected").each(function () {
          file_src_arr.push(
            $(this)
              .parent()
              .find(`.file_container_div:first ${file_specific_src_key}`)
              .attr("data-src")
          );
        });
      }
      console.log(file_src_arr);
      window.parent.postMessage(
        { type: "uploadFiles", src_arr: file_src_arr },
        "*"
      );
    }
  });
});

window.addEventListener(
  "message",
  async (event) => {
    if (`${event.data.type}` === "uploadResponse") {
      $(".modal_close_btn").click();
    } else if (`${event.data.type}` === "uploadError") {
      $(".modal_close_btn").click();
      console.log("error:", event.data.error);
    }
  },
  false
);

$(document).on("click", ".modal_close_btn", async () => {
  setTimeout(() => {
    window.parent.postMessage({ type: "hideFrame" }, "*");
  }, 250);
});

// const toDataURL = (url) =>
//   fetch(url)
//     .then((response) => response.blob())
//     .then(
//       (blob) =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = () => resolve(reader.result);
//           reader.onerror = reject;
//           reader.readAsDataURL(blob);
//         })
//     )
//     .catch((err) => {
//       alert("Invalid File URL!!");
//       return Promise.reject(new Error("Oops!"));
//     });

// // Here is code for converting "Base64" to javascript "File Object".
// function dataURLtoFile(dataurl, filename) {
//   var arr = dataurl.split(","),
//     mime = arr[0].match(/:(.*?);/)[1],
//     bstr = atob(arr[1]),
//     n = bstr.length,
//     u8arr = new Uint8Array(n);

//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], `${filename}.${mime.split("/")[1]}`, {
//     type: mime,
//   });
// }

// if (fileURL) {
//   var reg = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
//   if (fileURL.match(reg)) {
//     var is_file_url = true;
//     // let is_file_url = true; // Now you see why we cannot use let here!!
//   } else {
//     var is_file_url = false;
//     // let is_file_url = false; // Now you see why we cannot use let here!!
//   }

// var proxyUrl = "https://cors-anywhere.herokuapp.com/";
// fileURL = proxyUrl + fileURL;

// Calling both function
// if (is_file_url) {
//   toDataURL(fileURL)
//     .then((dataUrl) => {
//       // console.log("Here is Base64 Url", dataUrl);
//       var file_type = dataUrl.split(",")[0].split(":")[1].split("/")[0];
//       var file_extension = dataUrl
//         .split(",")[0]
//         .split(":")[1]
//         .split("/")[1]
//         .split(";")[0];

//       if (file_type === "image" || file_type === "application") {
//         console.log("file_typpppppe", file_type, file_extension);
//         var filename_index = fileURL.lastIndexOf("/") + 1;
//         var filename = fileURL.substr(filename_index).split("?")[0];
//         var fileData = dataURLtoFile(dataUrl, filename);
//         // console.log("Here is JavaScript File Object", fileData);
//         let src_car = URL.createObjectURL(fileData);
//         console.log(src_car);
//         let list = new DataTransfer();
//         list.items.add(fileData);
//         let customisedFileList = list.files;
//         input.files = customisedFileList;
//       } else if (file_type == "text") {
//         alert("Invalid File URL!!!");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// } else {
//   alert("Invalid File URL");
// }
// }
