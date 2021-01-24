var img_loader = `<div class="h-100 d-flex align-items-center justify-content-center">
<div class="spinner-grow text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>`;
var bottom_file_loader = `<div class="bottom_file_loader mt-2 d-flex align-items-center justify-content-center">
<div class="spinner-border spinner-border-sm text-secondary" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>`;
var no_results_found = `<div class="h-100 d-flex align-items-center justify-content-center">
  <p>No Results Found!!</p>
</div>`;
var hover_btns = `<div class="position-absolute file_hover_btn_container w-100">
  <div data-type="select" class="button file_hover_btn"><i class="fa fa-check"/></div>
  <div data-type="download" class="button file_hover_btn"><i class="fa fa-download"/></div>
  <div data-type="zoom" class="button file_hover_btn"><i class="fa fa-joomla"/></div>
</div>`;

var url = "";
var current_page = 1;
var total_pages = 1;
var next_page_url = "";
var headers = {};
var fetch_data_key = "";
var file_source = "";
var query = "";
var is_multiple_selection_allowed = false;

window.addEventListener("message", function (event) {
  is_multiple_selection_allowed = event.data.multiple;
  if (is_multiple_selection_allowed) {
    document.getElementById("upload_files").innerHTML = "Upload File/s";
  }
});

function _clearVariables() {
  url = "";
  current_page = 1;
  total_pages = 1;
  next_page_url = "";
  headers = {};
  fetch_data_key = "";
  file_source = "";
  query = "";
}

function _clearMainElement() {
  $(".bottom_file_loader").remove();
  $("#main").empty();
  $(".vertical_scrollbar").remove();
}

// Image Search API
function _imageSearch(url_query, source_of_img) {
  _clearMainElement();
  $("#main").off("scroll", _scrollHandler);
  _clearVariables();
  $(document).trigger("customSubmitBtnHandler");

  query = url_query;
  file_source = source_of_img;

  $("#main").append(img_loader);
  $(".image_logo").remove();

  // Initial set-up based on file_source
  switch (file_source) {
    case "unsplash":
      url = query
        ? "https://api.unsplash.com/search/photos?per_page=15&query="
        : "https://api.unsplash.com/photos";
      headers = {
        "Accept-Version": "v1",
        Authorization: `Client-ID -Juz6uzdcIiywIM3pbnMrxjKZaL4-82jVOotqyJjoME`,
      };
      $(".modal-footer").prepend(
        `<img src='images/unsplash_logo.png' class="ml-3 image_logo" />`
      );
      break;
    case "pexels":
      url = "https://api.pexels.com/v1/search?query=";
      headers = {
        Authorization:
          "563492ad6f91700001000001d18016e313e04637b8e2eabb6f87d384",
      };
      $(".modal-footer").prepend(
        `<img src='images/pexels_logo.png' class="ml-3 image_logo" />`
      );
      break;
    case "bing":
      url = "https://bing-image-search1.p.rapidapi.com/images/search?q=";
      headers = {
        "x-rapidapi-key": "6b0f2538bdmshca141a8ca779bfbp1de1c5jsn5b65eb720b00",
        "x-rapidapi-host": "bing-image-search1.p.rapidapi.com",
      };
      $(".modal-footer").prepend(
        `<img src='images/bing_logo.png' class="ml-3 image_logo" />`
      );
      break;
    case "pixabay":
      const API_KEY = "19907633-95e0364ff69736ca0f88b70a8";
      url = "https://pixabay.com/api/?key=" + API_KEY + "&q=";
      headers = {};
      $(".modal-footer").prepend(
        `<img src='images/pixabay_logo.png' class="ml-3 image_logo" />`
      );
      break;
  }

  fetch(url + encodeURIComponent(query), {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);

      // To get Next Page URL
      switch (file_source) {
        case "unsplash":
          if (query) {
            total_pages = json.total_pages;
            fetch_data_key = "results";
            if (current_page < total_pages) {
              next_page_url =
                url + encodeURIComponent(query) + "&page=" + (current_page + 1);
            } else {
              next_page_url = null;
            }
          } else {
            fetch_data_key = "";
            total_pages = 30;
            if (current_page < total_pages) {
              next_page_url = url + "?page=" + (current_page + 1);
            } else {
              next_page_url = null;
            }
          }
          break;
        case "pexels":
          next_page_url = json.next_page;
          fetch_data_key = "photos";
          break;
        case "bing":
          next_page_url =
            json &&
            json.relatedSearches &&
            json.relatedSearches.length &&
            json.relatedSearches[0].text
              ? url + encodeURIComponent(json.relatedSearches[0].text)
              : null;
          fetch_data_key = "value";
          break;
        case "pixabay":
          next_page_url = null;
          fetch_data_key = "hits";
          break;
      }

      if (fetch_data_key ? json[fetch_data_key].length : json.length) {
        _clearMainElement();
        $("#main").off("scroll", _scrollHandler);

        $("#main").append(`<div class="row"></div>`);

        // Badges for Body Content
        if (
          file_source === "bing" &&
          json &&
          json.relatedSearches &&
          json.relatedSearches.length
        ) {
          $(".vertical_scrollbar").remove();
          $(
            `<div class="modal-header vertical_scrollbar w-100 d-flex align-items-center m-0 pl-1 pt-0 pb-0"></div>`
          ).insertAfter($(".modal-header").last());

          json.relatedSearches.map((data) => {
            $(".vertical_scrollbar").append(
              `<span class="badge badge-pill mt-2 mb-2 ml-2"><p class="m-0 p-1">${data.text}</p></span>`
            );
          });
          $(`<span class="ml-2 invisible">-</span>`).insertAfter(
            $(".badge").last()
          );
          $(".badge").each(function () {
            $(this).on("click", () => {
              console.log($(this).text());
              _imageSearch($(this).text(), file_source);
            });
          });
        }

        _imageHandler(json);

        $("#main").on("scroll", _scrollHandler);
      } else {
        _clearMainElement();
        $("#main").off("scroll", _scrollHandler);
        $("#main").append(no_results_found);
      }
    })
    .catch((err) => {
      console.log(err);
      $(".bottom_file_loader").remove();
      $("#main").off("scroll", _scrollHandler);
    });

  function _scrollHandler() {
    let currentHeight = $(this).scrollTop() + $(this).innerHeight() + 10;
    let scrollHeight = $(this)[0].scrollHeight;
    if (currentHeight >= scrollHeight) {
      $("#main").off("scroll", _scrollHandler);
      next_page_url ? _imageSearchLoadMore(next_page_url) : null;
    }
  }

  function _imageSearchLoadMore(request_url) {
    $(".bottom_file_loader").remove();
    $("#main").append(bottom_file_loader);
    console.log("url", request_url);

    fetch(request_url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);

        // To get Next Page URL
        switch (file_source) {
          case "unsplash":
            current_page = current_page + 1;
            if (query) {
              if (current_page < total_pages) {
                next_page_url =
                  url +
                  encodeURIComponent(query) +
                  "&page=" +
                  (current_page + 1);
              } else {
                next_page_url = null;
              }
            } else {
              if (current_page < total_pages) {
                next_page_url = url + "?page=" + (current_page + 1);
              } else {
                next_page_url = null;
              }
            }
            break;
          case "pexels":
            next_page_url = json.next_page;
            break;
          case "bing":
            next_page_url =
              json &&
              json.relatedSearches.length &&
              json.relatedSearches[0].text
                ? url + encodeURIComponent(json.relatedSearches[0].text)
                : null;
            break;
          case "pixabay":
            break;
        }

        if (fetch_data_key ? json[fetch_data_key].length : json.length) {
          _imageHandler(json);

          $("#main").off("scroll", _scrollHandler);
          $("#main").on("scroll", _scrollHandler);
          $(".bottom_file_loader").remove();
        } else {
          _clearMainElement();
          $("#main").off("scroll", _scrollHandler);
          $("#main").append(no_results_found);
        }
      })
      .catch((err) => {
        console.log(err);
        $(".bottom_file_loader").remove();
        $("#main").off("scroll", _scrollHandler);
      });
  }

  function _imageHandler(json) {
    // To append data in the body
    const data_length = fetch_data_key
      ? json[fetch_data_key].length
      : json.length;
    for (let i = 0; i < data_length; i++) {
      const data = fetch_data_key ? json[fetch_data_key][i] : json[i];
      switch (file_source) {
        case "unsplash":
          $(".row").append(
            `<div class="column mb-2"><div class="position-relative file_container w-100 h-100"><div class="bg-light w-100 h-100 border h-100 file_container_div w-100 d-flex align-items-center justify-content-center"><img data-src=${data.urls.regular} src=${data.urls.small} class="m-0 p-0"/></div>${hover_btns}</div></div>`
          );
          break;
        case "pexels":
          $(".row").append(
            `<div class="column mb-2"><div class="position-relative file_container w-100 h-100"><div class="bg-light w-100 h-100 border h-100 file_container_div w-100 d-flex align-items-center justify-content-center"><img data-src=${data.src.original} src=${data.src.small} class="m-0 p-0"/></div>${hover_btns}</div></div>`
          );
          break;
        case "bing":
          $(".row").append(
            `<div class="column mb-2"><div class="position-relative file_container w-100 h-100"><div class="bg-light w-100 h-100 border h-100 file_container_div w-100 d-flex align-items-center justify-content-center"><img data-src=${data.contentUrl} src=${data.thumbnailUrl} class="m-0 p-0"/></div>${hover_btns}</div></div>`
          );
          break;
        case "pixabay":
          $(".row").append(
            `<div class="column mb-2"><div class="position-relative file_container w-100 h-100"><div class="bg-light w-100 h-100 border h-100 file_container_div w-100 d-flex align-items-center justify-content-center"><img data-src=${data.largeImageURL} src=${data.webformatURL} class="m-0 p-0"/></div>${hover_btns}</div></div>`
          );
          break;
      }
    }

    $(".file_container_div").each(function () {
      $(this).off("click");
      $(this).on("click", function () {
        var prev_status = $(this)
          .parent()
          .find(".file_hover_btn_container")
          .hasClass("file_selected");
        // If Multiple Selection is allowed
        if (!is_multiple_selection_allowed) {
          $(".file_container_div")
            .parent()
            .find(".file_hover_btn_container")
            .removeClass("file_selected file_hover_btn_container_visible");
          $(".file_container_div").removeClass("file_container_div_filter");
        }

        if (prev_status) {
          $(this)
            .parent()
            .find(".file_hover_btn_container")
            .removeClass("file_selected file_hover_btn_container_visible");
          $(this).removeClass("file_container_div_filter");
        } else {
          $(this)
            .parent()
            .find(".file_hover_btn_container")
            .addClass("file_selected file_hover_btn_container_visible");
          $(this).addClass("file_container_div_filter");
        }

        $(document).trigger("customSubmitBtnHandler");
      });
    });

    $(".file_hover_btn").each(function () {
      $(this).off("click");
      $(this).on("click", function () {
        const img_src = $(this)
          .parent()
          .parent()
          .find("img:first")
          .attr("data-src");
        if ($(this).attr("data-type") === "zoom") {
          chrome.tabs.create({
            url: img_src,
          });
        } else if ($(this).attr("data-type") === "download") {
          chrome.downloads.download({ url: img_src });
        } else if ($(this).attr("data-type") === "select") {
          var prev_status = $(this).parent().hasClass("file_selected");
          // If Multiple Selection is allowed
          if (!is_multiple_selection_allowed) {
            $(".file_container_div")
              .parent()
              .find(".file_hover_btn_container")
              .removeClass("file_selected file_hover_btn_container_visible");
            $(".file_container_div").removeClass("file_container_div_filter");
          }

          if (prev_status) {
            $(this)
              .parent()
              .removeClass("file_selected file_hover_btn_container_visible");
            $(this)
              .parent()
              .parent()
              .find(".file_container_div")
              .removeClass("file_container_div_filter");
          } else {
            $(this)
              .parent()
              .addClass("file_selected file_hover_btn_container_visible");
            $(this)
              .parent()
              .parent()
              .find(".file_container_div")
              .addClass("file_container_div_filter");
          }

          $(document).trigger("customSubmitBtnHandler");
        }
      });
    });

    $("img").each(function () {
      $(this).off("error");
      $(this).on("error", function () {
        $(this).parent().parent().remove();
      });
    });
  }
}

// Video Search API
function _videoSearch(url_query, source_of_video) {
  _clearMainElement();
  $("#main").off("scroll", _scrollHandler);
  _clearVariables();
  $(document).trigger("customSubmitBtnHandler");

  query = url_query;
  file_source = source_of_video;

  $("#main").append(img_loader);
  $(".image_logo").remove();

  // Initial set-up based on file_source
  switch (file_source) {
    case "pexels":
      url = "https://api.pexels.com/videos/search?query=";
      headers = {
        Authorization:
          "563492ad6f91700001000001d18016e313e04637b8e2eabb6f87d384",
      };
      $(".modal-footer").prepend(
        `<img src='images/pexels_logo.png' class="ml-3 image_logo" />`
      );
      break;
    case "pixabay":
      const API_KEY = "19907633-95e0364ff69736ca0f88b70a8";
      url = "https://pixabay.com/api/videos/?key=" + API_KEY + "&q=";
      headers = {};
      $(".modal-footer").prepend(
        `<img src='images/pixabay_logo.png' class="ml-3 image_logo" />`
      );
      break;
  }

  fetch(url + encodeURIComponent(query), {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);

      // To get Next Page URL
      switch (file_source) {
        case "pexels":
          total_pages = Math.ceil(json.total_results / json.per_page);
          if (current_page < total_pages) {
            next_page_url =
              url + encodeURIComponent(query) + "&page=" + (current_page + 1);
          } else {
            next_page_url = null;
          }
          fetch_data_key = "videos";
          break;
        case "pixabay":
          next_page_url = null;
          fetch_data_key = "hits";
          break;
      }

      if (fetch_data_key ? json[fetch_data_key].length : json.length) {
        _clearMainElement();
        $("#main").off("scroll", _scrollHandler);

        $("#main").append(`<div class="row"></div>`);

        _videoHandler(json);

        $("#main").on("scroll", _scrollHandler);
      } else {
        _clearMainElement();
        $("#main").off("scroll", _scrollHandler);
        $("#main").append(no_results_found);
      }
    })
    .catch((err) => {
      console.log(err);
      $(".bottom_file_loader").remove();
      $("#main").off("scroll", _scrollHandler);
    });

  function _scrollHandler() {
    let currentHeight = $(this).scrollTop() + $(this).innerHeight() + 10;
    let scrollHeight = $(this)[0].scrollHeight;
    if (currentHeight >= scrollHeight) {
      $("#main").off("scroll", _scrollHandler);
      next_page_url ? _videoSearchLoadMore(next_page_url) : null;
    }
  }

  function _videoSearchLoadMore(request_url) {
    $(".bottom_file_loader").remove();
    $("#main").append(bottom_file_loader);
    console.log("url", request_url);

    fetch(request_url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);

        // To get Next Page URL
        switch (file_source) {
          case "pexels":
            if (current_page < total_pages) {
              current_page += 1;
              next_page_url =
                url + encodeURIComponent(query) + "&page=" + (current_page + 1);
            } else {
              next_page_url = null;
            }
            break;
          case "pixabay":
            next_page_url = null;
            break;
        }

        if (fetch_data_key ? json[fetch_data_key].length : json.length) {
          _videoHandler(json);

          $("#main").off("scroll", _scrollHandler);
          $("#main").on("scroll", _scrollHandler);
          $(".bottom_file_loader").remove();
        } else {
          _clearMainElement();
          $("#main").off("scroll", _scrollHandler);
          $("#main").append(no_results_found);
        }
      })
      .catch((err) => {
        console.log(err);
        $(".bottom_file_loader").remove();
        $("#main").off("scroll", _scrollHandler);
      });
  }

  function _videoHandler(json) {
    // To append data in the body
    const data_length = fetch_data_key
      ? json[fetch_data_key].length
      : json.length;
    for (let i = 0; i < data_length; i++) {
      const data = fetch_data_key ? json[fetch_data_key][i] : json[i];
      switch (file_source) {
        case "pexels":
          const video_src_thumbnail = Array.isArray(
            data.video_files.filter((data) => data.quality === "sd")
          )
            ? data.video_files.filter((data) => data.quality === "sd")[0].link
            : data.video_files[0].link;
          const video_src_original = Array.isArray(
            data.video_files.filter((data) => data.quality === "hd")
          )
            ? data.video_files.filter((data) => data.quality === "hd")[0].link
            : data.video_files[0].link;
          const video_type = Array.isArray(
            data.video_files.filter((data) => data.quality === "sd")
          )
            ? data.video_files.filter((data) => data.quality === "sd")[0]
                .file_type
            : data.video_files[0].file_type;
          $(".row").append(
            `<div class="column mb-2"><div class="position-relative file_container w-100 h-100"><div class="bg-light w-100 h-100 border h-100 file_container_div w-100 d-flex align-items-center justify-content-center"><video class="m-0 p-0" width="100%" height="100%" autoplay muted><source data-src=${video_src_original} src=${video_src_thumbnail} type=${video_type}></video></div>${hover_btns}</div></div>`
          );
          break;
        case "pixabay":
          $(".row").append(
            `<div class="column mb-2"><div class="position-relative file_container w-100 h-100"><div class="bg-light w-100 h-100 border h-100 file_container_div w-100 d-flex align-items-center justify-content-center"><video class="m-0 p-0" width="100%" height="100%" autoplay muted><source data-src=${data.videos.tiny.url} src=${data.videos.tiny.url}></video></div>${hover_btns}</div></div>`
          );
          break;
      }
    }

    $(".file_container_div").each(function () {
      $(this).off("click");
      $(this).on("click", function () {
        var prev_status = $(this)
          .parent()
          .find(".file_hover_btn_container")
          .hasClass("file_selected");
        // If Multiple Selection is allowed
        if (!is_multiple_selection_allowed) {
          $(".file_container_div")
            .parent()
            .find(".file_hover_btn_container")
            .removeClass("file_selected file_hover_btn_container_visible");
          $(".file_container_div").removeClass("file_container_div_filter");
        }

        if (prev_status) {
          $(this)
            .parent()
            .find(".file_hover_btn_container")
            .removeClass("file_selected file_hover_btn_container_visible");
          $(this).removeClass("file_container_div_filter");
        } else {
          $(this)
            .parent()
            .find(".file_hover_btn_container")
            .addClass("file_selected file_hover_btn_container_visible");
          $(this).addClass("file_container_div_filter");
        }

        $(document).trigger("customSubmitBtnHandler");
      });
    });

    $(".file_hover_btn").each(function () {
      $(this).off("click");
      $(this).on("click", function () {
        const video_src = $(this)
          .parent()
          .parent()
          .find("video:first source")
          .attr("data-src");
        if ($(this).attr("data-type") === "zoom") {
          chrome.tabs.create({
            url: video_src,
          });
        } else if ($(this).attr("data-type") === "download") {
          chrome.downloads.download({ url: video_src });
        } else if ($(this).attr("data-type") === "select") {
          var prev_status = $(this).parent().hasClass("file_selected");
          // If Multiple Selection is allowed
          if (!is_multiple_selection_allowed) {
            $(".file_container_div")
              .parent()
              .find(".file_hover_btn_container")
              .removeClass("file_selected file_hover_btn_container_visible");
            $(".file_container_div").removeClass("file_container_div_filter");
          }

          if (prev_status) {
            $(this)
              .parent()
              .removeClass("file_selected file_hover_btn_container_visible");
            $(this)
              .parent()
              .parent()
              .find(".file_container_div")
              .removeClass("file_container_div_filter");
          } else {
            $(this)
              .parent()
              .addClass("file_selected file_hover_btn_container_visible");
            $(this)
              .parent()
              .parent()
              .find(".file_container_div")
              .addClass("file_container_div_filter");
          }

          $(document).trigger("customSubmitBtnHandler");
        }
      });
    });

    $("video").each(function () {
      $(this).off("error");
      $(this).on("error", function () {
        $(this).parent().parent().remove();
      });
    });
  }
}

function _googleImageSearch(url_query) {
  _clearMainElement();
  _clearVariables();
  $(document).trigger("customSubmitBtnHandler");

  $("#main").append(img_loader);
  $(".image_logo").remove();

  url = "https://www.google.com/search?tbm=isch&gbv=1&q=";
  headers = {};
  $(".modal-footer").prepend(
    `<img src='images/google_logo.png' class="ml-3 image_logo" />`
  );
  query = url_query;

  fetch(url + encodeURIComponent(query))
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      $("#main").off("scroll", _scrollHandler);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      if (
        typeof doc.getElementById("captcha-form") != "undefined" &&
        doc.getElementById("captcha-form") != null
      ) {
        _captchAlert();
        next_page_url = null;
        throw "CAPTCHA FORM";
      }

      _clearMainElement();

      if (doc.getElementsByClassName("TwVfHd").length) {
        $(
          `<div class="modal-header vertical_scrollbar w-100 d-flex align-items-center m-0 pl-1 pt-0 pb-0"></div>`
        ).insertAfter($(".modal-header").last());

        for (let i = 0; i < doc.getElementsByClassName("TwVfHd").length; i++) {
          $(".vertical_scrollbar").append(
            `<span class="badge badge-pill mt-2 mb-2 ml-2"><p class="m-0 p-1">${doc
              .getElementsByClassName("TwVfHd")
              [i].innerHTML.toLowerCase()
              .replace(/\b(\w)/g, (x) => x.toUpperCase())}</p></span>`
          );
        }

        $(`<span class="ml-2 invisible">-</span>`).insertAfter(
          $(".badge").last()
        );
        $(".badge").each(function () {
          $(this).on("click", () => {
            _googleImageSearch($(this).text());
          });
        });
      }

      $("#main").append(`<div class="row"></div>`);

      _googleImageHandler(doc);

      next_page_url =
        url + encodeURIComponent(query) + "&start=" + current_page * 20;

      $("#main").on("scroll", _scrollHandler);
    })
    .catch(function (err) {
      console.log(err);
      $("#main").off("scroll", _scrollHandler);
      chrome.tabs.create({
        url: url + encodeURIComponent(query),
      });
    });

  function _onGoogleImagesLoadMore(request_url) {
    $(".bottom_file_loader").remove();
    $("#main").append(bottom_file_loader);
    $("#main").off("scroll", _scrollHandler);

    fetch(request_url)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        if (
          typeof doc.getElementById("captcha-form") != "undefined" &&
          doc.getElementById("captcha-form") != null
        ) {
          _captchAlert();
          next_page_url = null;
          $(".bottom_file_loader").remove();
          throw "CAPTCHA FORM";
        } else {
          _googleImageHandler(doc);

          current_page += 1;
          next_page_url =
            url + encodeURIComponent(query) + "&start=" + current_page * 20;

          $(".bottom_file_loader").remove();
          $("#main").on("scroll", _scrollHandler);
        }
      })
      .catch(function (err) {
        console.log("Something went wrong.", err);
        $("#main").off("scroll", _scrollHandler);
        $(".bottom_file_loader").remove();
        chrome.tabs.create({
          url: url + encodeURIComponent(query),
        });
      });
  }

  function _googleImageHandler(doc) {
    for (let i = 0; i < doc.getElementsByClassName("t0fcAb").length; i++) {
      $(".row").append(
        `<div class="column mb-2"><div class="position-relative file_container w-100 h-100"><div class="bg-light w-100 h-100 border h-100 file_container_div w-100 d-flex align-items-center justify-content-center"><img data-src=${doc
          .getElementsByClassName("t0fcAb")
          [i].getAttribute("src")} src=${doc
          .getElementsByClassName("t0fcAb")
          [i].getAttribute(
            "src"
          )} class="m-0 p-0"/></div>${hover_btns}</div></div>`
      );
    }

    /* -------------------------------------- Image Handling Events -------------------------------------- */

    $(".file_container_div").each(function () {
      $(this).off("click");
      $(this).on("click", function () {
        var prev_status = $(this)
          .parent()
          .find(".file_hover_btn_container")
          .hasClass("file_selected");
        // If Multiple Selection is allowed
        if (!is_multiple_selection_allowed) {
          $(".file_container_div")
            .parent()
            .find(".file_hover_btn_container")
            .removeClass("file_selected file_hover_btn_container_visible");
          $(".file_container_div").removeClass("file_container_div_filter");
        }

        if (prev_status) {
          $(this)
            .parent()
            .find(".file_hover_btn_container")
            .removeClass("file_selected file_hover_btn_container_visible");
          $(this).removeClass("file_container_div_filter");
        } else {
          $(this)
            .parent()
            .find(".file_hover_btn_container")
            .addClass("file_selected file_hover_btn_container_visible");
          $(this).addClass("file_container_div_filter");
        }

        $(document).trigger("customSubmitBtnHandler");
      });
    });

    $(".file_hover_btn").each(function () {
      $(this).off("click");
      $(this).on("click", function () {
        const img_src = $(this)
          .parent()
          .parent()
          .find("img:first")
          .attr("data-src");
        if ($(this).attr("data-type") === "zoom") {
          chrome.tabs.create({
            url: img_src,
          });
        } else if ($(this).attr("data-type") === "download") {
          chrome.downloads.download({ url: img_src });
        } else if ($(this).attr("data-type") === "select") {
          var prev_status = $(this).parent().hasClass("file_selected");
          // If Multiple Selection is allowed
          if (!is_multiple_selection_allowed) {
            $(".file_container_div")
              .parent()
              .find(".file_hover_btn_container")
              .removeClass("file_selected file_hover_btn_container_visible");
            $(".file_container_div").removeClass("file_container_div_filter");
          }

          if (prev_status) {
            $(this)
              .parent()
              .removeClass("file_selected file_hover_btn_container_visible");
            $(this)
              .parent()
              .parent()
              .find(".file_container_div")
              .removeClass("file_container_div_filter");
          } else {
            $(this)
              .parent()
              .addClass("file_selected file_hover_btn_container_visible");
            $(this)
              .parent()
              .parent()
              .find(".file_container_div")
              .addClass("file_container_div_filter");
          }

          $(document).trigger("customSubmitBtnHandler");
        }
      });
    });

    $("img").each(function () {
      $(this).off("error");
      $(this).on("error", function () {
        $(this).parent().parent().remove();
      });
    });

    /* -------------------------------------- END -------------------------------------- */
  }

  function _captchAlert() {
    _clearMainElement();
    $("#main").append(
      `<div class='container'><h3>Click on the below link after Submitting the captcha form...</h3><p id='extension_google_captch_form_refresh'>Click Here</p></div>`
    );
    $("#extension_google_captch_form_refresh").css("color", "blue");
    $("#extension_google_captch_form_refresh").css("cursor", "pointer");
    $("#extension_google_captch_form_refresh").on("click", () => {
      _googleImageSearch(query);
    });
  }

  function _scrollHandler() {
    let currentHeight = $(this).scrollTop() + $(this).innerHeight() + 10;
    let scrollHeight = $(this)[0].scrollHeight;
    if (currentHeight >= scrollHeight) {
      $("#main").off("scroll", _scrollHandler);
      next_page_url ? _onGoogleImagesLoadMore(next_page_url) : null;
    }
  }
}
