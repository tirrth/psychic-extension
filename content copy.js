// // let inputs = document.querySelectorAll("input[type=file]");
// // console.log("extension go!!");
// // console.log("inputs", inputs);
// var current_file_input;

// // Anonymous function (Just to teach myself a little more about them, not necessary to use)
// (function () {
//   $("input[type=file]").each(function () {
//     $(this).on("click", async () => {
//       // _toggleCustomisedDialogueBox($(this));
//       current_file_input = $(this);
//       var iframe = document.createElement("iframe");
//       iframe.src = chrome.extension.getURL("modal.html");
//       iframe.setAttribute("allowTransparency", true);
//       iframe.setAttribute(
//         "style",
//         "position: absolute; border: none; left: 0px; top: 0px; height: 100vh; width: 100vw; z-index: 20000000; display: grid; place-items: center;"
//       );
//       iframe.id = "fileDialogFrame";
//       $(iframe).appendTo("body");

//       $(this).attr("type", "hidden");
//       await new Promise((resolve) => setTimeout(resolve, 0));
//       $(this).attr("type", "file");
//     });
//   });
// })();

// window.addEventListener("message", async (event) => {
//   switch (event.data.type) {
//     case "hideFrame":
//       $("#fileDialogFrame").remove();
//       break;

//     case "openLocalFileDialog":
//       let fileHandle;
//       const pickerOpts = {
//         types: [
//           {
//             description: "Images",
//             accept: {
//               "image/*": [".png", ".gif", ".jpeg", ".jpg"],
//             },
//           },
//         ],
//         excludeAcceptAllOption: true,
//         multiple: false,
//       };
//       try {
//         [fileHandle] = await window.showOpenFilePicker(pickerOpts);
//         const fileData = await fileHandle.getFile();
//         let list = new DataTransfer();
//         list.items.add(fileData);
//         let customisedFileList = list.files;
//         current_file_input.prop("files", customisedFileList);
//       } catch (err) {
//         console.log(err);
//       }
//       break;

//     default:
//       $("#fileDialogFrame").remove();
//   }
// });

// // (function () {
// //   for (let index = 0; index < inputs.length; index++) {
// //     console.log("file_input", inputs[index]);
// //     inputs[index].addEventListener("click", async () => {
// //       // _toggleCustomisedDialogueBox(inputs[index]);

// //       var iframe = document.createElement("iframe");
// //       iframe.src = chrome.extension.getURL("modal.html");
// //       iframe.setAttribute("allowTransparency", true);
// //       iframe.setAttribute(
// //         "style",
// //         "position: absolute; border: none; left: 0px; top: 0px; height: 100vh; width: 100vw; z-index: 20000000; display: grid; place-items: center;"
// //       );
// //       iframe.id = "fileDialogFrame";
// //       $(iframe).appendTo("body");
// //       // var iframe_elements = iframe.contentWindow.document;
// //       // console.log(iframe_elements);
// //       // $("#myModal").modal({
// //       //   backdrop: "static",
// //       //   keyboard: false,
// //       // });

// //       inputs[index].type = "hidden";
// //       await new Promise((resolve) => setTimeout(resolve, 0));
// //       inputs[index].type = "file";
// //     });
// //   }
// // })();

// function _toggleCustomisedDialogueBox(input) {
//   // Here is the code for converting "image source" (url) to "Base64".
//   var fileURL = prompt("Enter File URL:");

//   const toDataURL = (url) =>
//     fetch(url)
//       .then((response) => response.blob())
//       .then(
//         (blob) =>
//           new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(blob);
//           })
//       )
//       .catch((err) => {
//         alert("Invalid File URL!!");
//         return Promise.reject(new Error("Oops!"));
//       });

//   // Here is code for converting "Base64" to javascript "File Object".
//   function dataURLtoFile(dataurl, filename) {
//     var arr = dataurl.split(","),
//       mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]),
//       n = bstr.length,
//       u8arr = new Uint8Array(n);

//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], `${filename}.${mime.split("/")[1]}`, {
//       type: mime,
//     });
//   }

//   if (fileURL) {
//     var reg = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
//     if (fileURL.match(reg)) {
//       var is_file_url = true;
//       // let is_file_url = true; // Now you see why we cannot use let here!!
//     } else {
//       var is_file_url = false;
//       // let is_file_url = false; // Now you see why we cannot use let here!!
//     }

//     // var proxyUrl = "https://cors-anywhere.herokuapp.com/";
//     // fileURL = proxyUrl + fileURL;

//     // Calling both function
//     if (is_file_url) {
//       toDataURL(fileURL)
//         .then((dataUrl) => {
//           // console.log("Here is Base64 Url", dataUrl);
//           var file_type = dataUrl.split(",")[0].split(":")[1].split("/")[0];
//           var file_extension = dataUrl
//             .split(",")[0]
//             .split(":")[1]
//             .split("/")[1]
//             .split(";")[0];

//           if (file_type === "image" || file_type === "application") {
//             console.log("file_typpppppe", file_type, file_extension);
//             var filename_index = fileURL.lastIndexOf("/") + 1;
//             var filename = fileURL.substr(filename_index).split("?")[0];
//             var fileData = dataURLtoFile(dataUrl, filename);
//             // console.log("Here is JavaScript File Object", fileData);
//             let src_car = URL.createObjectURL(fileData);
//             console.log(src_car);
//             let list = new DataTransfer();
//             list.items.add(fileData);
//             let customisedFileList = list.files;
//             input.files = customisedFileList;
//           } else if (file_type == "text") {
//             alert("Invalid File URL!!!");
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else {
//       alert("Invalid File URL");
//     }
//   }
// }

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

// "use strict";
// console.log("Chrome Extension(trial) executes!!");
// // if (document.readyState !== "loading") {
// //   // console.log("document is already ready, just execute code here");
// //   _myInitCode(); // Or setTimeout(_myInitCode, 0); if you want it consistently async
// // } else {
// //   // console.log("document was not ready, executing it now");
// //   document.addEventListener("DOMContentLoaded", _myInitCode);
// // }
// // function _myInitCode() {
// //   // Anonymous function (Just to teach myself a little more about them, not necessary to use)
// //   (function () {
// //     $(window).on("load", _onInputFileClickFnBind);
// //   })();
// // }

// // Anonymous function (Just to teach myself a little more about them, not necessary to use)
// (function () {
//   $(window).on("load", _onInputFileClickFnBind);
// })();

// // --------------------------------------- Below code is to observe changes in dom and webNaviagtion --------------------------------------- //
// // Select the node that will be observed for mutations
// const targetNode = document.body;
// // Options for the observer (which mutations to observe)
// const config = { childList: true, subtree: true };
// // Callback function to execute when mutations are observed
// const callback = function (mutationsList, observer) {
//   // Use traditional 'for loops' for IE 11
//   for (const mutation of mutationsList) {
//     if (
//       mutation &&
//       mutation.addedNodes &&
//       mutation.addedNodes.length &&
//       mutation.addedNodes[0].querySelectorAll("input[type='file']").length
//     ) {
//       _onInputFileClickFnBind();
//     }
//   }
// };
// // Create an observer instance linked to the callback function
// const observer = new MutationObserver(callback);
// // Start observing the target node for configured mutations
// observer.observe(targetNode, config);
// // Later, you can stop observing
// // observer.disconnect();
// // --------------------------------------- Exit --------------------------------------- //

// var current_file_input;
// var iframe;
// let toBool = (string) => (string === "true" ? true : false);
// function _onInputFileClickFnBind() {
//   $("input[type=file]").each(function () {
//     $(this).off("click");
//     $(this).on("click", async () => {
//       current_file_input = $(this);
//       iframe = document.createElement("iframe");
//       iframe.src = chrome.extension.getURL("modal.html");
//       iframe.setAttribute(
//         "data-multiple",
//         $(this).attr("multiple") ? true : false
//       );
//       iframe.setAttribute("data-accept", $(this).attr("accept") || "");
//       iframe.setAttribute("allowTransparency", true);
//       iframe.setAttribute(
//         "style",
//         "position: absolute; border: none; left: 0px; top: 0px; height: 100vh; width: 100vw; z-index: 20000000; display: grid; place-items: center;"
//       );
//       iframe.id = "fileDialogFrame";
//       $(iframe).appendTo("body");
//       $(this).attr("type", "hidden");
//       await new Promise((resolve) => setTimeout(resolve, 0));
//       $(this).attr("type", "file");
//     });
//   });
// }

// window.addEventListener(
//   "message",
//   async (event) => {
//     switch (event.data.type) {
//       case "iframeLoaded":
//         try {
//           // One way to send data back to the child iframe
//           if (
//             iframe &&
//             iframe.src &&
//             event.origin === iframe.src.split("/").splice(0, 3).join("/")
//           ) {
//             var _window = iframe.contentWindow;
//             _window.postMessage(
//               { multiple: toBool(iframe.getAttribute("data-multiple")) },
//               iframe.src
//             );
//           }
//         } catch (err) {
//           console.log(err);
//         }
//         break;

//       case "hideFrame":
//         $("#fileDialogFrame").remove();
//         break;

//       case "openLocalFileDialog":
//         const random_id = `${
//           Math.random().toString(36).substr(2, 9) + new Date().valueOf()
//         }`;
//         try {
//           let hidden_file_input = `<input id=${random_id} style="display: none;" type="file" />`;
//           $(hidden_file_input).appendTo(document.body);
//           if (toBool(iframe.getAttribute("data-multiple"))) {
//             document.getElementById(random_id).setAttribute("multiple", "");
//           }

//           iframe.getAttribute("data-accept")
//             ? document
//                 .getElementById(random_id)
//                 .setAttribute("accept", iframe.getAttribute("data-accept"))
//             : null;
//           document.getElementById(random_id).click();
//           let list = new DataTransfer();

//           $(`#${random_id}`).on("change", function (e) {
//             for (let i = 0; i < e.target.files.length; i++) {
//               list.items.add(e.target.files[i]);
//             }
//             let customisedFileList = list.files;
//             current_file_input.prop("files", customisedFileList);
//           });
//         } catch (err) {
//           console.log(err);
//         } finally {
//           document.getElementById(random_id).remove();
//         }
//         break;

//       case "uploadFiles":
//         try {
//           // Second way to send data back to the child iframe
//           _uploadFiles(event.data.src_arr)
//             .then((res) => {
//               event.source.postMessage(
//                 { type: "uploadResponse" },
//                 event.origin
//               );
//             })
//             .catch((err) => {
//               console.log(err);
//               event.source.postMessage(
//                 { type: "uploadError", error: err },
//                 event.origin
//               );
//               alert(err);
//             });
//         } catch (err) {
//           console.log(err);
//         }
//         break;

//       default:
//         $("#fileDialogFrame").remove();
//     }
//   },
//   false
// );

// async function _uploadFiles(file_src_arr) {
//   let list = new DataTransfer();

//   const URLtoFile = (url) =>
//     fetch(url)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const file_extension = blob.type.split("/")[1];
//         const filename_index = url.lastIndexOf("/") + 1;
//         const filename = `${url
//           .substr(filename_index)
//           .split("?")[0]
//           .replace(`.${file_extension}`, "")}`.replace(".", "_");

//         let file_obj = new File([blob], `${filename}.${file_extension}`, {
//           type: blob.type,
//         });
//         return Promise.resolve(file_obj);
//       })
//       .catch((err) => {
//         console.log(err);
//         return Promise.reject(new Error(err.message));
//       });

//   await Promise.all(
//     file_src_arr.map(async (file_src) => {
//       await URLtoFile(file_src)
//         .then((fileData) => {
//           list.items.add(fileData);
//         })
//         .catch((err) => {
//           console.log(err);
//           throw JSON.stringify(err.message);
//         });
//     })
//   );

//   let customisedFileList = list.files;
//   current_file_input.prop("files", customisedFileList);
//   return JSON.stringify("File Uploaded successfully!!");

//   // const toDataURL = (url) =>
//   //   // This method is only useful for small files
//   //   fetch(url)
//   //     .then((response) => response.blob())
//   //     .then((blob) => {
//   //       return new Promise(async (resolve, reject) => {
//   //         const reader = new FileReader();
//   //         reader.onloadend = () => resolve(reader.result);
//   //         reader.onerror = reject;
//   //         reader.onprogress = (e) => console.log((100 * e.loaded) / e.total);
//   //         reader.readAsDataURL(blob);

//   //         // reader.addEventListener("loadstart", handleEvent);
//   //         // reader.addEventListener('load', handleEvent);
//   //         // reader.addEventListener('loadend', handleEvent);
//   //         // reader.addEventListener('progress', handleEvent);
//   //         // reader.addEventListener('error', handleEvent);
//   //         // reader.addEventListener('abort', handleEvent);
//   //         // reader.onload = function () {
//   //         //   var arrayBuffer = reader.result;
//   //         //   var bytes = new Uint8Array(arrayBuffer);
//   //         //   console.log("first", bytes);
//   //         // };
//   //         // reader.onloadend = () => console.log("second", reader.result);
//   //         // reader.readAsArrayBuffer(blob);
//   //       });
//   //     })
//   //     .catch((err) => {
//   //       console.log("Error:", err);
//   //       return Promise.reject(new Error("Oops!"));
//   //     });

//   // // Here is code for converting "Base64" to javascript "File Object".
//   // function dataURLtoFile(dataurl, filename) {
//   //   var arr = dataurl.split(","),
//   //     mime = arr[0].match(/:(.*?);/)[1],
//   //     bstr = atob(arr[1]),
//   //     n = bstr.length,
//   //     u8arr = new Uint8Array(n);

//   //   while (n--) {
//   //     u8arr[n] = bstr.charCodeAt(n);
//   //   }
//   //   console.log("u8arr", u8arr);
//   //   return new File([u8arr], `${filename}.${mime.split("/")[1]}`, {
//   //     type: mime,
//   //   });
//   // }

//   // await Promise.all(
//   //   file_src_arr.map(async (img_src) => {
//   //     console.log(img_src);
//   //     await toDataURL(img_src)
//   //       .then((dataUrl) => {
//   //         // console.log("resolved");
//   //         // console.log("Here is Base64 Url", dataUrl);
//   //         const file_type = dataUrl.split(",")[0].split(":")[1].split("/")[0];
//   //         const file_extension = dataUrl
//   //           .split(",")[0]
//   //           .split(":")[1]
//   //           .split("/")[1]
//   //           .split(";")[0];

//   //         if (
//   //           file_type === "image" ||
//   //           file_type === "video" ||
//   //           file_type === "application"
//   //         ) {
//   //           const filename_index = img_src.lastIndexOf("/") + 1;
//   //           const filename = `${img_src
//   //             .substr(filename_index)
//   //             .split("?")[0]
//   //             .replace(`.${file_extension}`, "")}`.replace(".", "_");
//   //           const fileData = dataURLtoFile(dataUrl, filename);
//   //           // console.log("Here is JavaScript File Object", fileData);
//   //           // let src_car = URL.createObjectURL(fileData);
//   //           // console.log(src_car);
//   //           list.items.add(fileData);
//   //         } else if (file_type === "text") {
//   //           console.log("Invalid File URL!!!");
//   //           throw JSON.stringify("Error Found!!");
//   //         } else {
//   //           console.log("Invalid File URL!!!");
//   //           throw JSON.stringify("Error Found!!");
//   //         }
//   //       })
//   //       .catch((err) => {
//   //         console.log(err);
//   //         throw JSON.stringify("Error Found!!");
//   //       });
//   //   })
//   // );
// }

// // let fileHandle;
// // const pickerOpts = {
// //   types: [
// //     {
// //       description: "Images",
// //       accept: {
// //         "image/*": [".png", ".gif", ".jpeg", ".jpg"],
// //       },
// //     },
// //   ],
// //   excludeAcceptAllOption: true,
// //   multiple: toBool(iframe.getAttribute("data-multiple")),
// // };
// // try {
// // [fileHandle] = await window.showOpenFilePicker(pickerOpts);
// // const fileData = await fileHandle.getFile();
// // console.log("fileData", fileData);
// // let list = new DataTransfer();
// // list.items.add(fileData);
// // let customisedFileList = list.files;
// // current_file_input.prop("files", customisedFileList);
// // }
// // catch(err){
// // console.log(err)
// // }

// // function _toggleCustomisedDialogueBox(input) {
// //   // Here is the code for converting "image source" (url) to "Base64".
// //   var fileURL = prompt("Enter File URL:");

// //   const toDataURL = (url) =>
// //     fetch(url)
// //       .then((response) => response.blob())
// //       .then(
// //         (blob) =>
// //           new Promise((resolve, reject) => {
// //             const reader = new FileReader();
// //             reader.onloadend = () => resolve(reader.result);
// //             reader.onerror = reject;
// //             reader.readAsDataURL(blob);
// //           })
// //       )
// //       .catch((err) => {
// //         alert("Invalid File URL!!");
// //         return Promise.reject(new Error("Oops!"));
// //       });

// //   // Here is code for converting "Base64" to javascript "File Object".
// //   function dataURLtoFile(dataurl, filename) {
// //     var arr = dataurl.split(","),
// //       mime = arr[0].match(/:(.*?);/)[1],
// //       bstr = atob(arr[1]),
// //       n = bstr.length,
// //       u8arr = new Uint8Array(n);

// //     while (n--) {
// //       u8arr[n] = bstr.charCodeAt(n);
// //     }
// //     return new File([u8arr], `${filename}.${mime.split("/")[1]}`, {
// //       type: mime,
// //     });
// //   }

// //   if (fileURL) {
// //     var reg = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
// //     if (fileURL.match(reg)) {
// //       var is_file_url = true;
// //       // let is_file_url = true; // Now you see why we cannot use let here!!
// //     } else {
// //       var is_file_url = false;
// //       // let is_file_url = false; // Now you see why we cannot use let here!!
// //     }

// //     // var proxyUrl = "https://cors-anywhere.herokuapp.com/";
// //     // fileURL = proxyUrl + fileURL;

// //     // Calling both function
// //     if (is_file_url) {
// //       toDataURL(fileURL)
// //         .then((dataUrl) => {
// //           // console.log("Here is Base64 Url", dataUrl);
// //           var file_type = dataUrl.split(",")[0].split(":")[1].split("/")[0];
// //           var file_extension = dataUrl
// //             .split(",")[0]
// //             .split(":")[1]
// //             .split("/")[1]
// //             .split(";")[0];

// //           if (file_type === "image" || file_type === "application") {
// //             console.log("file_typpppppe", file_type, file_extension);
// //             var filename_index = fileURL.lastIndexOf("/") + 1;
// //             var filename = fileURL.substr(filename_index).split("?")[0];
// //             var fileData = dataURLtoFile(dataUrl, filename);
// //             // console.log("Here is JavaScript File Object", fileData);
// //             let src_car = URL.createObjectURL(fileData);
// //             console.log(src_car);
// //             let list = new DataTransfer();
// //             list.items.add(fileData);
// //             let customisedFileList = list.files;
// //             input.files = customisedFileList;
// //           } else if (file_type == "text") {
// //             alert("Invalid File URL!!!");
// //           }
// //         })
// //         .catch((err) => {
// //           console.log(err);
// //         });
// //     } else {
// //       alert("Invalid File URL");
// //     }
// //   }
// // }
