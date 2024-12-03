
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
$(function () {
  $(".multiple-select").multipleSelect();
});
var listTags;
function scrollToRowFromCell(cell) {
  var isAutoScroll = $("#chkAutoScroll").iCheck("update")[0].checked;
  if (!isAutoScroll) return;

  if (cell) {
    // Get the parent row (<tr>) of the given cell (<td>)
    var row = cell.closest("tr");

    if (row) {
      // Scroll the row into view smoothly and align it to the center
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.log("The parent row does not exist.");
    }
  } else {
    console.log("The specified cell does not exist.");
  }
}

function isDarkMode() {
  return document.body.classList.contains("dark-mode");
}

function getDefaultDarkModeColor() {
  return "#2c2c2c";
}

function setTextByPhoneNumber(
  phoneNumber,
  newText,
  backgroundColor,
  foregroundColor
) {
  var table = document.querySelector(".htCore");
  var rows = table.querySelectorAll("tbody tr");

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var phoneNumberCell = row.querySelector("td:nth-child(2)");

    if (phoneNumberCell && phoneNumberCell.textContent.trim() === phoneNumber) {
      var trangThaiCell = row.querySelector("td:nth-child(4)");
      scrollToRowFromCell(trangThaiCell);

      if (trangThaiCell) {
        trangThaiCell.textContent = newText;
        trangThaiCell.style.color = foregroundColor;
        return;
      }
    }
  }
}

function setTextNameByPhoneNumber(
  phoneNumber,
  newText,
  backgroundColor,
  foregroundColor
) {
  var table = document.querySelector(".htCore");
  var rows = table.querySelectorAll("tbody tr");

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var phoneNumberCell = row.querySelector("td:nth-child(2)");

    if (phoneNumberCell && phoneNumberCell.textContent.trim() === phoneNumber) {
      var trangThaiCell = row.querySelector("td:nth-child(3)");

      if (trangThaiCell) {
        trangThaiCell.textContent = newText;
        trangThaiCell.style.color = foregroundColor;
        return;
      }
    }
  }
}

function setTextByName(name, newText, backgroundColor, foregroundColor) {
  var table = document.querySelector(".htCore");
  var rows = table.querySelectorAll("tbody tr");

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var nameCell = row.querySelector("td:nth-child(2)");

    if (nameCell && nameCell.textContent.trim() === name) {
      var trangThaiCell = row.querySelector("td:nth-child(4)");

      if (trangThaiCell) {
        trangThaiCell.textContent = newText;
        trangThaiCell.style.color = foregroundColor;
        return;
      }
    }
  }
}

//setTextByPhoneNumber("0937903300", "Active", "#fefefe");

// Function to update jQuery Confirm theme
function updateJQueryConfirmTheme(isDarkMode) {
  if (isDarkMode) {
    $.confirm.defaults = {
      ...$.confirm.defaults,
      theme: "dark",
      backgroundDismiss: "dark",
      animation: "scale",
      closeAnimation: "scale",
      animateFromElement: false,
      boxWidth: "30%",
      useBootstrap: false,
      onOpen: function () {
        this.$body.addClass("dark-mode");
      },
    };
  } else {
    $.confirm.defaults = {
      ...$.confirm.defaults,
      theme: "light",
      backgroundDismiss: true,
      animation: "scale",
      closeAnimation: "scale",
      animateFromElement: false,
      boxWidth: "30%",
      useBootstrap: false,
      onOpen: function () {
        this.$body.removeClass("dark-mode");
      },
    };
  }
}
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  // Save the current mode preference to localStorage
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);

  // Update the checkbox state
  const checkbox = document.getElementById("checkbox");
  checkbox.checked = isDarkMode;

  if (isDarkMode) {
    $("#imgBackground").hide();
  } else {
    $("#imgBackground").show();
  }

  // Update jQuery Confirm theme
  updateJQueryConfirmTheme(isDarkMode);

  // Update emoji picker
  updateEmojiPicker(isDarkMode);
}

// Function to update emoji picker
function updateEmojiPicker(isDarkMode) {
  const emojiPicker = document.getElementById("emojiPicker");
  if (isDarkMode) {
    emojiPicker.classList.add("dark-mode");
  } else {
    emojiPicker.classList.remove("dark-mode");
  }
}

// Function to set the initial mode based on user's preference
function setInitialMode() {
  const body = document.body;
  const checkbox = document.getElementById("checkbox");

  // Check if user has a saved preference
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "true") {
    body.classList.add("dark-mode");
    checkbox.checked = true;
    updateJQueryConfirmTheme(true);
    updateEmojiPicker(true);
  } else {
    body.classList.remove("dark-mode");
    checkbox.checked = false;
    updateJQueryConfirmTheme(false);
    updateEmojiPicker(false);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("checkbox");
  checkbox.addEventListener("change", toggleDarkMode);

  setTimeout(() => {
    chrome.runtime.sendMessage({ task: "COPY_COOKIE" });
  }, 5000);

  chrome.storage.local.get(["introShown"], function (result) {
    if (!result.introShown) {
      // If the intro has not been shown, display it
      introJs()
        .setOptions({
          nextLabel: "Tiếp",
          prevLabel: "Quay lại",
          doneLabel: "Hoàn tất",
          // skipLabel: 'test skip',
          steps: [
            {
              intro: "Chào bạn, Zalo Marketing Pro",
            },
            {
              element: document.querySelector(".white-preview"),
              intro: "Chuyển chế độ sáng/tối.",
            },
            {
              element: document.querySelector("#divAvatar"),
              intro: "Bấm vào đây để quản lý nhiều tài khoản zalo.",
            },
            {
              element: document.querySelector("#txtTaiKhoanEmail"),
              intro: "Bấm vào đây xem thông tin gói cước sử dụng.",
            },
            {
              intro: "Bắt đầu sử dụng.",
            },
          ],
        })
        .start();

      chrome.storage.local.set({ introShown: true });
    }
  });

  // Set initial mode
  setInitialMode();
  if (isDarkMode) {
    $("#imgBackground").hide();
  } else {
    $("#imgBackground").show();
  }
  chrome.storage.local.get(["userEmail", "loginExpiration"], function (result) {
    var emailStore = result.userEmail;
    $.ajax({
      url: "",
      method: "POST",
      data: {
        email: emailStore,
        app_id: 1,
      },
    })
      .done(function (response) {
        row_update_id = response.id;
        let usageTermClass =
          response.days_remaining === "Vĩnh viễn"
            ? "bg-green-500 text-white"
            : "bg-green-500 text-white";

        const manifest = chrome.runtime.getManifest();
        const version = manifest.version;

        var phienban = `${version}`;

        if (response.days_remaining === "Vĩnh viễn") {
          $("#txtThoiHan").html(
            `Thời hạn: <span style='color: green; font-weight: bold;'>${response.days_remaining}.</span> | ${phienban}`
          );
        } else if (Number(response.days_remaining) <= 3) {
          $("#txtThoiHan").html(
            `Sắp hết hạn: còn <span style='color: red; font-weight: bold;'>${response.days_remaining} ngày.</span> | ${phienban}`
          );
        } else {
          $("#txtThoiHan").html(
            `Thời hạn: <span style='color: green; font-weight: bold;'>${response.days_remaining} ngày.</span> | ${phienban}`
          );
        }

        //   console.log("USER_INFO", response);
      })
      .fail(function () {
        console.error("Lỗi khi tải thông tin người dùng.");
      });
  });

  chrome.storage.sync.get(["running"], initializePopup);

  function initializePopup({ running }) {
    function updateTheme(isDarkMode) {
      if (isDarkMode) {
        document.body.classList.add("dark-mode");
        checkbox.checked = true;
      } else {
        document.body.classList.remove("dark-mode");
        checkbox.checked = false;
      }
    }

    console.log({ running });

    // Convert running to boolean, treating "false" as false
    let isDarkMode = running + "" !== "false";

    const checkbox = document.querySelector("#checkbox");

    updateTheme(isDarkMode);

    checkbox.addEventListener("change", () => {
      isDarkMode = checkbox.checked;

      chrome.storage.sync.set({ running: isDarkMode }, (...args) => {
        console.log({ err: args });
      });

      updateTheme(isDarkMode);
    });
  }

  const txtmessage = document.getElementById("txtMessage");
  const btnSend = document.getElementById("btnSend");
  const btnShare = document.getElementById("btnShareAllFen");
  const btnStop = document.getElementById("btnStop");
  const btnReset = document.getElementById("btnReset");
  const btnXoaCache = document.getElementById("btnXoaCache");
  const btnLogout = document.getElementById("btnLogout");
  const btnXuatExcel = document.getElementById("btnXuatExcel");
  const btnXuatTxt = document.getElementById("btnXuatTxt");
  const btnNhapDienThoai = document.getElementById("btnNhapDienThoai");
  const btnOpenExcel = document.getElementById("btnImportExcel");
  const btnXuatVcard = document.getElementById("btnXuatVcard");
  const btnXuatDanhBa = document.getElementById("btnXuatDanhBa");
  const btnOpenImage = document.getElementById("btnOpenImage");
  const fileDanhSach = document.getElementById("fileDanhSach");
  const fileMedia = document.getElementById("fileMedia");
  const emojiButton = document.getElementById("emojiButton");
  const emojiPicker = document.getElementById("emojiPicker");
  const textarea = document.getElementById("txtMessage");
  const clearIcon = document.getElementById("clearIcon");
  const charCount = document.getElementById("charCount");
  const divAvatar = document.getElementById("divAvatar");
  const btnADDfriden = document.getElementById("btnADDfriden");

  function loadAccountLogined() {
    chrome.storage.local.get(
      ["userEmail", "loginExpiration"],
      function (result) {
        $("#txtTaiKhoanEmail").text(result.userEmail);
      }
    );
  }
  loadAccountLogined();

 
  // Update character count
  const updateCharCount = () => {
    const length = textarea.value.length;
    charCount.textContent = `${length} ký tự`;
  };

  // Show clear icon when there is text in the textarea
  textarea.addEventListener("input", () => {
    if (textarea.value.length > 0) {
      clearIcon.classList.remove("hidden");
      charCount.classList.remove("hidden");
    } else {
      clearIcon.classList.add("hidden");
      charCount.classList.add("hidden");
    }
    updateCharCount();
  });

  // Clear the textarea when clear icon is clicked
  clearIcon.addEventListener("click", () => {
    textarea.value = "";
    clearIcon.classList.add("hidden");
    charCount.classList.add("hidden");
    textarea.focus();
    updateCharCount();
  });

  // Initial character count update
  updateCharCount();

  function isValidVietnamesePhoneNumber(phoneNumber) {
    // Regular expression to match Vietnamese phone numbers with the following formats:
    // 0xxxxxxxxx (with leading 0)
    // +84xxxxxxxxx (with country code +84)
    // 84xxxxxxxxx (with country code 84)
    // xxxxxxxxx (without leading 0 or country code)
    const vietnamPhonePattern = /^(0|\+?84)?(3|5|7|8|9)(\d{8})$/;

    // Remove non-digit characters from the input to handle formats like "+84" or spaces
    const sanitizedPhoneNumber = phoneNumber.replace(/[\s+]/g, "");

    return vietnamPhonePattern.test(sanitizedPhoneNumber);
  }

  let isStartShare = false;
  var current_email = "";
  $(document).ready(function () {

    function getCountryCode(callback) {
      // Default country code
      var defaultCountryCode = "+84";
    
      // Retrieve the country code from chrome.storage.local
      chrome.storage.local.get(['countryCode'], function(result) {
        if (result.countryCode) {
          console.log('Country code found: ' + result.countryCode);
          callback(result.countryCode); // Pass result to the callback
        } else {
          console.log('No country code found, using default: ' + defaultCountryCode);
          callback(defaultCountryCode); // Pass default to the callback
        }
      });
    }

    function autoSaveCountryCode() {
      const countryCode = document.getElementById("countryCodeInput").value;
      chrome.storage.local.set({ countryCode: countryCode }, function() {
        console.log('Country code saved: ' + countryCode);
      });
    }

    // Load the saved country code on page load
    window.onload = function() {
      getCountryCode(function(countryCode) {
        if (countryCode) {
          document.getElementById("countryCodeInput").value = countryCode;
        }
      });

      //const savedCode = localStorage.getItem("countryCode");
      
      
      // Add event listener to save the input value automatically on change
      document.getElementById("countryCodeInput").addEventListener("input", autoSaveCountryCode);
    }

    chrome.storage.local.get(
      ["userEmail", "loginExpiration"],
      function (result) {
        current_email = result.userEmail;
      }
    );
  });
  function formatDateStringToDDMMYYYY(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  $(document).on("click", "#txtTaiKhoanEmail", function () {
    var row_update_id = "";
    $.confirm({
      title:
        '<span class="text-yellow-600 text-lg font-bold">Thông tin tài khoản</span>',
      boxWidth: "550px",
      useBootstrap: false,
      content: function () {
        var self = this;
        return $.ajax({
          url: "https://key.laptrinhvb.net/api/get_user_info", // Replace with your actual endpoint
          method: "POST",
          data: {
            email: current_email,
            app_id: 1,
          },
        })
          .done(function (response) {
            row_update_id = response.id;
            let usageTermClass =
              response.days_remaining === "Vĩnh viễn"
                ? "bg-green-500 text-white"
                : "bg-green-500 text-white";

            self.setContent(`
                  <div class="p-4 flex">
                    <div class="flex-grow">
                        <p class="mb-2"><strong>Email:</strong> ${
                          response.email
                        }</p>
                        <p class="mb-2"><strong>Địa chỉ:</strong> ${
                          response.address
                        }</p>
                        <p class="mb-2"><strong>Ngày đăng ký:</strong> ${formatDateStringToDDMMYYYY(
                          response.register_date
                        )}</p>
                        <p class="mb-2"><strong>Ngày hết hạn:</strong> ${formatDateStringToDDMMYYYY(
                          response.expiry_date
                        )}</p>
                        <p class="mb-2"><strong>Gói tài khoản:</strong> <span style='color: green; font-weight: bold;'>${
                          response.license_type
                        }</span></p>
                        <p class="mb-4">
                            <strong>Số ngày còn lại:</strong> 
                            <span class="px-2 py-1 rounded ${usageTermClass}">
                                ${response.days_remaining}
                            </span>
                        </p>
                        
                        <button id="togglePasswordFields" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4">
                            Đổi mật khẩu
                        </button>
                    </div>
                    <div class="flex-shrink-0 ml-4 text-center">
                        <img src="https://laptrinhvb.net/vietqr.png" alt="Support Admin" class="w-32 h-32 object-cover  mb-2" style="margin: 0 auto;">
                        <p class="text-sm font-bold" style="margin-top: 8px;">Donate Support Admin</p>
                    </div>
                    </div>
        
                    <div id="passwordFields" style="display: none;">
                        <div class="mb-4">
                        <input type="password" id="oldPassword" placeholder="Mật khẩu cũ" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="mb-4">
                        <input type="password" id="newPassword" placeholder="Mật khẩu mới" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button id="submitChangePassword" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
                        Xác nhận đổi mật khẩu
                        </button>
                    </div>

                    <hr class="my-4 border-t border-gray-300">

                    <div class="mb-4">
                    <p class="font-bold">Thông tin liên hệ:</p>
                    <p>Zalo: <a href="https://zalo.me/0933913122" target="_blank">https://zalo.me/0933913122</a></p>
                    <p>Điện thoại: +84 933.913.122</p>
                    </div>

                    <div class="mt-4">
                    <a href="https://chrome.google.com/webstore/detail/kgbfpnnjchndjegeckjggbgcmklefman" target="_blank" class="text-blue-500 hover:underline">
                    📌 Đánh giá tiện ích trên Chrome Web Store
                    </a>
                    </div>
                  </div>
                `);
          })
          .fail(function () {
            self.setContent("Lỗi khi tải thông tin người dùng.");
          });
      },
      onContentReady: function () {
        $("#togglePasswordFields").on("click", function () {
          $("#passwordFields").toggle();
        });

        // Add click event for submitting password change
        $("#submitChangePassword").on("click", function () {
          toastr.options = {
            toastClass: "toastr toastr-high-z-index",
          };
          var oldPassword = $("#oldPassword").val();
          var newPassword = $("#newPassword").val();
          if (!oldPassword || !newPassword) {
            toastr["error"]("Vui lòng nhập đầy đủ cả mật khẩu cũ và mới.");
            return false;
          }

          $.ajax({
            url: "https://key.laptrinhvb.net/api/change_password", // Your CodeIgniter route
            method: "POST",
            data: {
              id: row_update_id,
              old_password: oldPassword,
              new_password: newPassword,
            },
            success: function (response) {
              if (response.success) {
                toastr["success"](
                  "Mật khẩu đã được thay đổi thành công, vui lòng đăng nhập lại."
                );
                setTimeout(() => {
                  chrome.storage.local.remove(["userEmail", "loginExpiration"]);
                  chrome.storage.local.get(["tabZalo"], function (result) {
                    const activeTab = result.tabZalo.id;
                    chrome.tabs.sendMessage(activeTab, {
                      task: "CHANGE_PAGE",
                      page: "../page/login.html",
                    });
                  });
                }, 3000);
              } else {
                toastr["error"](
                  response.message ||
                    "Không thể thay đổi mật khẩu. Vui lòng thử lại."
                );
              }
            },
            error: function () {
              toastr["error"](
                "Đã xảy ra lỗi khi kết nối với máy chủ. Vui lòng thử lại sau."
              );
            },
          });
        });
      },
      buttons: {
        close: {
          text: "Đóng",
          btnClass:
            "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded",
          action: function () {
            // Close the dialog
          },
        },
      },
    });
  });
  function waitMinutes(minutes) {
    const milliseconds = minutes; // Convert minutes to milliseconds
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  btnShare.addEventListener("click", () => {
    chrome.storage.local.get(["tabZalo"], function (result) {
      const activeTab = result.tabZalo.id;
      chrome.tabs.sendMessage(activeTab, { task: "GET_ALL_TAG" });
    });
    waitMinutes(800);

    var isShowModal = $("#chkShowModal").iCheck("update")[0].checked;

    if (isShowModal == false) {
      $("#chkShowModal").iCheck("check");
    }

    var $selecttags;
    $.confirm({
      title:
        '<span style="color: #B97902; font-size: 18px; font-weight: bold;">Chọn nội dung</span>',
      boxWidth: "550px",
      columnClass: "medium", // Adjusts the width of the dialog
      useBootstrap: false,
      content: `<div style="margin-left: 4px; margin-right: 4px; margin-bottom: 4px">
            <div style='float: right;'></select><span><b>Phân loại:</b> </span><select id="labelSelect2" class="multiple-select2" multiple style="margin-top: 6px;"> 
              
            </select></div>
            <div id="taskContainer" class="form-group" style="padding: 4px; clear: both;"></div>
            <button id="btnAddContent" class="add-task-button text-base shadow-lg appearance-none border border-blue-300 rounded-lg w-full py-2 px-4 mt-2 bg-white text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">Thêm nội dung</button>
            <div style="padding: 4px; clear: both; margin-top: 8px;">
                <label for="delay" class="block text-sm font-medium text-gray-700">Nhập tin nhắn đính kèm: (nếu muốn)</label>
                <textarea rows="2" class="text-base shadow-lg appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="txtMessageShare" placeholder="Nhập tin nhắn..." style='margin-top: 4px;'></textarea>
              
            </div>
            <div id="statusShare"></div>
            </div>
        `,
      onOpen: function () {
        if (document.body.classList.contains("dark-mode")) {
          this.$body.addClass("dark-mode");
        }
      },
      buttons: {
        formSubmit: {
          text: "Chia sẻ",
          btnClass: "share-button",
          action: function (button) {
            console.log("Button", button);
            function getAllTextContentAsJSON() {
              var taskContainer = document.getElementById("taskContainer");
              var cards = taskContainer.getElementsByClassName("card");

              var data = [];

              for (var i = 0; i < cards.length; i++) {
                var cardContent =
                  cards[i].getElementsByClassName("card-content")[0];
                data.push({
                  content: cardContent.textContent.trim(),
                });
              }

              return data;
            }

            if (isStartShare === false) {
              var jsonData = getAllTextContentAsJSON();
              //  var jsonDataString = JSON.stringify(jsonData, null, 2)

              if (jsonData.length <= 0) {
                toastr["error"]("Chưa chọn nội dung để chia sẻ, bạn ơi.");
                return false;
              }

              button.setText("Dừng lại");
              button.addClass("stop-button");
              button.removeClass("share-button");
              isStartShare = true;
              var messageShare =
                document.getElementById("txtMessageShare").value;

              var statusShare = document.getElementById("statusShare");
              statusShare.textContent =
                "Trạng thái: Hệ thống đang tiến hành bắt đầu share...";

              chrome.storage.local.get(["tabZalo"], function (result) {
                const activeTab = result.tabZalo.id;

                chrome.tabs.sendMessage(activeTab, {
                  task: "REQUEST_SHOW_MODAL",
                  isShowModal: true,
                });
              });

              var tags = $selecttags.multipleSelect("getSelects", "text");

              chrome.storage.local.get(["tabZalo"], function (result) {
                const activeTab = result.tabZalo.id;
                chrome.tabs.sendMessage(activeTab, {
                  task: "START_SHARE",
                  data: jsonData,
                  tags: tags,
                  message: messageShare,
                });
              });
            } else {
              isStartShare = false;
              toastr["info"]("Bạn đã yêu cầu dừng share thành công.");

              button.setText("Chia sẻ");
              button.removeClass("stop-button");
              button.addClass("share-button");
              chrome.storage.local.get(["tabZalo"], function (result) {
                const activeTab = result.tabZalo.id;
                chrome.tabs.sendMessage(activeTab, {
                  task: "STOP_SHARE",
                  data: jsonData,
                });
              });
            }

            return false;
          },
        },
        close: {
          text: "Đóng",
          action: function () {
            // Close the dialog
          },
        },
      },
      onContentReady: function () {
        const btnAddContent = document.getElementById("btnAddContent");
        btnAddContent.addEventListener("click", function () {
          if (btnAddContent.textContent === "Hủy chọn") {
            btnAddContent.textContent = "Thêm nội dung";

            chrome.storage.local.get(["tabZalo"], function (result) {
              const activeTab = result.tabZalo.id;
              chrome.tabs.sendMessage(activeTab, { task: "HUY_CONTENT_SHARE" });
            });

            chrome.storage.local.get(["tabZalo"], function (result) {
              const activeTab = result.tabZalo.id;
              chrome.tabs.sendMessage(activeTab, {
                task: "REQUEST_SHOW_MODAL",
                isShowModal: true,
              });
            });
          } else {
            btnAddContent.textContent = "Hủy chọn";

            chrome.storage.local.get(["tabZalo"], function (result) {
              const activeTab = result.tabZalo.id;
              chrome.tabs.sendMessage(activeTab, {
                task: "CHOICE_CONTENT_SHARE",
              });
            });

            chrome.storage.local.get(["tabZalo"], function (result) {
              const activeTab = result.tabZalo.id;
              chrome.tabs.sendMessage(activeTab, {
                task: "REQUEST_SHOW_MODAL",
                isShowModal: false,
              });
            });
          }
        });

        if (listTags) {
          const selectElement = document.getElementById("labelSelect2");

          listTags.forEach((label) => {
            if (label !== "Không có nhãn") {
              const option = document.createElement("option");
              option.value = label;
              option.text = label;
              selectElement.add(option);
            }
          });
          var $select = $(".multiple-select2");
          $selecttags = $(".multiple-select2");

          $select.multipleSelect({
            onClick: function (view) {
              var selectedOptions = $select.multipleSelect(
                "getSelects",
                "text"
              );
              console.log("option", selectedOptions);
            },
          });

          const element = document.querySelector(".multiple-select2");

          if (element) {
            // Set the width to 100% with !important using inline style
            element.style.width = "100% !important";
          } else {
            console.log('Element with class "multiple-select2" not found.');
          }
          $select.multipleSelect("checkAll");
        }
      },
    });
  });

  function checkAvatarExists(avatar, callback) {
    chrome.storage.local.get({ cookies: [] }, function (result) {
      var cookies = result.cookies;
      var exists = false;

      cookies.forEach(function (cookie) {
        if (cookie.avatar === avatar) {
          exists = true;
        }
      });

      callback(exists);
    });
  }

  function storeCookie(data) {
    chrome.storage.local.get({ cookies: [] }, function (result) {
      var cookies = result.cookies;
      cookies.push(data);
      chrome.storage.local.set({ cookies: cookies }, function () {
        displayCookies();
      });
    });
  }

  function deleteCookie(index) {
    chrome.storage.local.get({ cookies: [] }, function (result) {
      var cookies = result.cookies;
      cookies.splice(index, 1);
      chrome.storage.local.set({ cookies: cookies }, function () {
        displayCookies();
      });
    });
  }

  function displayCookies() {
    chrome.storage.local.get({ cookies: [] }, function (result) {
      var cookies = result.cookies;
      var tableContainer = document.getElementById("tableContainer");

      if (cookies.length === 0) {
        tableContainer.innerHTML = "<p>Chưa có tài khoản nào.</p>";
        return;
      }

      var tableHTML =
        '<table style="border: 1px solid #ddd;" class="table table-striped table-bordered  w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  w-screen"><thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0"><tr class="bg-white border dark:bg-gray-300 darkborder-gray-700 hover:bg-gray-50 min-w-200"><th class="px-1 py-3 border border-gray-300 bg-gray-300 text-center cursor-pointer" style="width: 120px;">Hành động</th><th class="px-1 py-3 border border-gray-300 bg-gray-300 text-center cursor-pointer" style="width: 150px;">TÀI KHOẢN</th><th class="px-1 py-3 border border-gray-300 bg-gray-300 text-center cursor-pointer" style="width: 250px;">Chuyển tài khoản</th></tr></thead>';
      cookies.forEach(function (cookie, index) {
        tableHTML +=
          '<tr style="border: 1px solid #ddd;">' +
          '<td style="text-align: center; padding: 16px;"><a style="cursor: pointer; text-decoration: underline;"><span style="padding: 4px; color: red;" class="delete-cookie" data-username="' +
          cookie.username +
          '" data-index="' +
          index +
          '">Xóa</span></a></td>' +
          '<td style="text-align: center; vertical-align: middle;"><div class="flex flex-row items-center"><img id="img_avatar" src="' +
          cookie.avatar +
          '" alt="User Avatar" class="w-10 h-10 rounded-full hover:cursor-pointer"><div style="margin-left: 8px;">' +
          cookie.username +
          "</div>  </div>          </td>" +
          '<td style="text-align: center;">' +
          '<a data-username="' +
          cookie.username +
          '" class="btnChuyenDoi" data-index="' +
          index +
          '" hreft="#" style="cursor: pointer; text-decoration: underline;"><span style="color: blue;"><i class="fa fa-external-link" aria-hidden="true"></i> Chuyển đổi</span></a>' +
          "</td>" +
          "</tr>";
      });
      tableHTML += "</table>";

      tableContainer.innerHTML = tableHTML;

      document.querySelectorAll(".btnChuyenDoi").forEach(function (button) {
        button.addEventListener("click", function () {
          var index = this.getAttribute("data-index");
          var username = this.getAttribute("data-username");

          $.confirm({
            title: "Thông báo!",
            content:
              'Bạn có muốn chuyển tài khoản: <span style="color: red; font-weight: bold;">' +
              username +
              "</span>?",
            boxWidth: "350px",
            useBootstrap: false,
            onOpen: function () {
              if (document.body.classList.contains("dark-mode")) {
                this.$body.addClass("dark-mode");
              }
            },
            buttons: {
              "Chuyển tài khoản": {
                btnClass: "btn-green",
                action: function () {
                  chrome.storage.local.get({ cookies: [] }, function (result) {
                    var cookies = result.cookies;
                    var cookie = cookies[index];
                    //  alert(JSON.stringify(cookie));
                    chrome.runtime.sendMessage({
                      task: "SET_COOKIE",
                      data: cookie,
                    });
                  });

                  //return false;
                },
              },
              Đóng: {
                btnClass: "btn-gray",
                action: function () {
                  //  $.alert('You clicked No!');
                },
              },
            },
          });
        });
      });

      // Attach event listeners to delete buttons
      document.querySelectorAll(".delete-cookie").forEach(function (button) {
        button.addEventListener("click", function () {
          var index = this.getAttribute("data-index");
          var username = this.getAttribute("data-username");
          $.confirm({
            title: "Thông báo!",
            content:
              'Bạn có muốn xóa tài khoản: <span style="color: red; font-weight: bold;">' +
              username +
              "</span>?",
            boxWidth: "350px",
            useBootstrap: false,
            onOpen: function () {
              if (document.body.classList.contains("dark-mode")) {
                this.$body.addClass("dark-mode");
              }
            },
            buttons: {
              Xóa: {
                btnClass: "btn-red",
                action: function () {
                  deleteCookie(index);
                },
              },
              Không: {
                btnClass: "btn-gray",
                action: function () {
                  //  $.alert('You clicked No!');
                },
              },
            },
          });
        });
      });
    });
  }

  divAvatar.addEventListener("click", () => {
    $.confirm({
      title:
        '<span style="color: #006EDC; font-size: 18px; font-weight: bold;">Quản lý tài khoản</span> <a id="btnCopyCookie" style="text-align: right; float: right; color: gray; font-size: 14px; margin-right: 8px;" href="#"><i class="fa fa-user-plus" aria-hidden="true"></i> Thêm tài khoản</a>',
      boxWidth: "550px",
      columnClass: "medium", // Adjusts the width of the dialog
      useBootstrap: false,
      content:
        "" +
        '<div class="form-group" style="padding: 4px; display: none;">' +
        '<textarea style="font-size: 12px;" id="txtCookie" class="phoneNumbers text-base shadow-lg appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="3" placeholder="Nhập cookie..."></textarea>' +
        "</div>" +
        '<div class="form-group" style="padding: 4px" style=""><input id="txtImage" type="hidden" />' +
        '<input id="txtUsername" style="font-size: 12px;" type="hidden" class="username text-base shadow-lg appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập tên người dùng..."><div style="margin-top: 10px; height: 250px;" id="tableContainer" class="table-container"></div>' +
        "</div>",
      onOpen: function () {
        if (document.body.classList.contains("dark-mode")) {
          this.$body.addClass("dark-mode");
        }
      },
      buttons: {
        formSubmit: {
          text: "Cập nhật",
          btnClass: "btn-blue btn-add-acc",
          action: function () {
            var txtCookie = document.getElementById("txtCookie");
            var txtUsername = document.getElementById("txtUsername");
            var txtImage = document.getElementById("txtImage");

            console.log(txtCookie.value.trim());

            if (txtCookie.value.trim() === "") {
              $(txtCookie).notify("Bạn chưa nhập cookie.", {
                position: "bottom",
              });
              return false;
            }

            if (txtUsername.value.trim() === "") {
              $(txtUsername).notify("Bạn chưa nhập tên người dùng.", {
                position: "top",
              });
              return false;
            }
            var avatar = $("#img_avatar").attr("src");
            // console.log("avatar", avatar)

            checkAvatarExists(avatar, function (exists) {
              if (exists) {
                $("#btnCopyCookie").notify("Đã tồn tại.", "error", {
                  position: "bottom",
                });
                return false;
              } else {
                var cookieData = {
                  username: txtUsername.value.trim(),
                  cookie: txtCookie.value.trim(),
                  avatar: txtImage.value.trim(),
                };

                storeCookie(cookieData);
                $("#btnCopyCookie").notify("Đã thêm.", "success", {
                  position: "bottom",
                });
                txtCookie.value = "";
                txtUsername.value = "";
                txtImage.value = "";
                displayCookies();
              }
            });

            return false;
          },
        },
        close: {
          text: "Đóng",
          action: function () {
            // Close the dialog
          },
        },
      },
      onContentReady: function () {
        // $("#txtListPhone").focus()
        var btnCopy = document.getElementById("btnCopyCookie");

        btnCopy.addEventListener("click", () => {
          chrome.runtime.sendMessage({ task: "COPY_COOKIE" });
        });

        displayCookies();
      },
    });
  });

  btnNhapDienThoai.addEventListener("click", () => {
    $.confirm({
      title:
        '<span style="color: #CA3486; font-size: 18px; font-weight: bold;">Thêm mới</span>',
      boxWidth: "350px",
      columnClass: "medium", // Adjusts the width of the dialog
      useBootstrap: false,
      content:
        "" +
        '<div class="form-group" style="padding: 4px">' +
        "" +
        '<textarea id="txtListPhone" class="phoneNumbers text-base shadow-lg appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="5" placeholder="Nhập số điện thoại..."></textarea>' +
        "</div>",
      onOpen: function () {
        if (document.body.classList.contains("dark-mode")) {
          this.$body.addClass("dark-mode");
        }
      },
      buttons: {
        formSubmit: {
          text: "Cập nhật",
          btnClass: "btn-blue",
          action: function () {
            var phoneNumbers = this.$content
              .find(".phoneNumbers")
              .val()
              .split("\n");
            var validPhoneNumbers = phoneNumbers.filter(
              isValidVietnamesePhoneNumber
            );
            if (validPhoneNumbers.length <= 0) {
              toastr["error"]("Không tìm thấy số điện thoại nào hợp lệ");
              $("#txtListPhone").focus();
              return false;
            } else {
              var uniqueValidPhoneNumbers = [...new Set(validPhoneNumbers)];

              // Transform the valid phone numbers into the desired format
              var phoneList = [
                ["PHONE", "NAME"],
                ...uniqueValidPhoneNumbers.map((phone) => [phone, ""]),
              ];
              if ($("tbody").length) {
                $("tbody tr").each(function () {
                  var existingPhone = $(this)
                    .find("td:nth-child(2)")
                    .text()
                    .trim();
                  if (
                    existingPhone &&
                    !uniqueValidPhoneNumbers.includes(existingPhone)
                  ) {
                    uniqueValidPhoneNumbers.push(existingPhone);
                    phoneList.push([
                      existingPhone,
                      $(this).find("td:nth-child(3)").text().trim() || "",
                    ]);
                  }
                });
              }

              displayExcelData(phoneList, "khách hàng");
            }
          },
        },
        close: {
          text: "Đóng",
          action: function () {
            // Close the dialog
          },
        },
      },
      onContentReady: function () {
        $("#txtListPhone").focus();
      },
    });
  });
  function getCheckedCount() {
    setTimeout(getCheckedCountTimeOut, 200);
  }

  function getCheckedCountTimeOut() {
    var table = document.querySelector("table");
    var tbody = table.querySelector("tbody");

    if (!tbody) {
      console.log("No tbody found");
      return "0/0";
    }

    var checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
    var checkedCount = 0;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedCount++;
      }
    });

    var totalCount = checkboxes.length;
    var totalText = document.getElementById("total_item");
    totalText.textContent = `(${checkedCount}/${totalCount})`;
    return checkedCount + "/" + totalCount;
  }

  btnXuatVcard.addEventListener("click", () => {
    document.getElementById("dropdown-menu").classList.toggle("hidden");
    chrome.storage.local.get(["tabZalo"], function (result) {
      const activeTab = result.tabZalo.id;
      chrome.tabs.sendMessage(activeTab, { task: "EXPORT_ALL_VCARD" });
    });
  });

  btnXuatDanhBa.addEventListener("click", () => {
    document.getElementById("dropdown-menu").classList.toggle("hidden");
    chrome.storage.local.get(["tabZalo"], function (result) {
      const activeTab = result.tabZalo.id;
      chrome.tabs.sendMessage(activeTab, { task: "EXPORT_ALL_FRIENDS" });
    });
  });

  document
    .getElementById("menu-button2")
    .addEventListener("click", function () {
      document.getElementById("dropdown-menu2").classList.toggle("hidden");
    });

  document.getElementById("menu-button").addEventListener("click", function () {
    document.getElementById("dropdown-menu").classList.toggle("hidden");
  });

  document.addEventListener("click", function (event) {
    var isClickInside = document
      .getElementById("menu-button")
      .contains(event.target);
    var dropdownMenu = document.getElementById("dropdown-menu");
    if (!isClickInside && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.add("hidden");
    }
  });

  $("input.icheck").iCheck({
    checkboxClass: "icheckbox_flat-green",
    increaseArea: "16%", // optional
  });

  function exportToTxt_OTP() {
    let rows = document.querySelectorAll("tbody tr");
    let data = "";

    rows.forEach((row) => {
      let phone = row.cells[1].innerText;
      let noidung = row.cells[2].innerText;
      let status = row.cells[3].innerText.includes("Đã gửi") ? "OK" : "ERROR";
      data += `${phone}|${noidung}|${status}\n`;
    });

    let blob = new Blob([data], { type: "text/plain" });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "DATA_SEND_OTP_OK.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  btnXuatTxt.addEventListener("click", () => {
    document.getElementById("dropdown-menu").classList.toggle("hidden");
    const table = document.querySelector(".htCore");
    if (!table) {
      toastr["error"]("Không có dữ liệu để xuất file, bạn ơi.");
      console.error('Table with class "htCore" not found.');
      return;
    }

    chrome.storage.local.get(["IS_PHAT_CODE"], function (result) {
      var isphatcode = result.IS_PHAT_CODE;
      if (isphatcode == 1) {
        exportToTxt_OTP();
      } else {
        const rows = table.querySelectorAll("tr");
        const phoneNumbers = [];

        rows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 3 && cells[3].textContent.trim() === "OK") {
            const phoneNumber = cells[1].textContent.trim();
            phoneNumbers.push(phoneNumber);
          }
        });

        const fileContent = phoneNumbers.join("\n");

        const blob = new Blob([fileContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "DANHSACH_PHONE_OK_ZALO.txt";
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  });

  btnXuatExcel.addEventListener("click", () => {
    const table = document.querySelector(".htCore");
    const exportData = [];
    const headers = [];
    document.getElementById("dropdown-menu").classList.toggle("hidden");
    table.querySelectorAll("thead th").forEach((header) => {
      headers.push(header.innerText.trim());
    });

    if (headers.length > 0) {
      exportData.push(headers);
    } else {
      const colHeaders = hot.getColHeader();
      exportData.push(colHeaders);
    }

    table.querySelectorAll("tbody tr").forEach((row) => {
      const rowData = [];
      row.querySelectorAll("td").forEach((cell) => {
        rowData.push(cell.innerText.trim());
      });
      exportData.push(rowData);
    });

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(exportData);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "zalo_data_export.xlsx"
    );
  });
  emojiButton.addEventListener("click", () => {
    const rect = emojiButton.getBoundingClientRect();
    emojiPicker.style.height = "200px";
    emojiPicker.style.left = `${rect.left - 160}px`;
    emojiPicker.style.top = `${
      rect.top - emojiPicker.offsetHeight + window.scrollY - 200
    }px`;
    emojiPicker.style.overflow = "auto";
    $(emojiPicker).toggle();
    //emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
  });

  // Function to toggle the display of the emoji picker
  // emojiButton.addEventListener('click', () => {
  //     const rect = emojiButton.getBoundingClientRect();
  //     emojiPicker.style.left = `${rect.left}px`;
  //     emojiPicker.style.top = `${rect.bottom + window.scrollY}px`;
  //     emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
  // });

  // Function to handle emoji selection
  emojiPicker.addEventListener("click", (event) => {
    if (event.target.tagName === "SPAN") {
      const emoji = event.target.textContent;
      const cursorPosition = txtmessage.selectionStart;
      const textBefore = txtmessage.value.substring(0, cursorPosition);
      const textAfter = txtmessage.value.substring(cursorPosition);
      txtmessage.value = textBefore + emoji + textAfter;
      txtmessage.focus();
      txtmessage.selectionEnd = cursorPosition + emoji.length;

      // Hide the emoji picker after selection
      //  emojiPicker.style.display = 'none';
    }
  });

  // Optional: Hide emoji picker when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !emojiButton.contains(event.target) &&
      !emojiPicker.contains(event.target)
    ) {
      emojiPicker.style.display = "none";
    }
  });

  chrome.storage.local.get(["settings"], function (result) {
    if (result.settings) {
      let delay = result.settings.delay;
      let delay1 = result.settings.delay1;
      let delay2 = result.settings.delay2;
      let isKiemTraHopLe = result.settings.isKiemTraHopLe;
      let isKetBan = result.settings.isKetBan;

      console.log("LOAD SETTINGS", result.settings);

      var isCheck = isKiemTraHopLe ? "check" : "uncheck";
      var isKetBan2 = isKetBan ? "check" : "uncheck";

      $("#chkKiemTraHopLe").iCheck(isCheck);
      $("#chkKetBan").iCheck(isKetBan2);

      $("#delay").val(delay);
      $("#delay1").val(delay1);
      $("#delay2").val(delay2);
    }
  });

  btnLogout.addEventListener("click", () => {
    $.confirm({
      title: "Thông báo!",
      content: "Bạn có muốn đăng xuất tài khoản zalo?",
      boxWidth: "350px",
      useBootstrap: false,
      onOpen: function () {
        if (document.body.classList.contains("dark-mode")) {
          this.$body.addClass("dark-mode");
        }
      },
      buttons: {
        "Đăng xuất": {
          btnClass: "btn-red",
          action: function () {
            chrome.storage.local.get(["tabZalo"], function (result) {
              const activeTab = result.tabZalo.id;
              chrome.runtime.sendMessage({ task: "LOGOUT" });
              chrome.tabs.sendMessage(activeTab, { task: "LOGOUT" });

              // setTimeout(() => {
              //     window.location.href = "https://id.zalo.me/";
              // }, 1500);
            });
          },
        },
        Không: {
          btnClass: "btn-gray",
          action: function () {
            //  $.alert('You clicked No!');
          },
        },
      },
    });
  });
  btnXoaCache.addEventListener("click", () => {
    $.confirm({
      title: "Thông báo!",
      content:
        "Bạn có đồng ý muốn xóa cache bộ nhớ đệm không, khi xóa xong hệ thống sẽ reload lại trang?",
      boxWidth: "350px",
      useBootstrap: false,
      onOpen: function () {
        if (document.body.classList.contains("dark-mode")) {
          this.$body.addClass("dark-mode");
        }
      },
      buttons: {
        Xóa: {
          btnClass: "btn-red",
          action: function () {
            chrome.storage.local.get(["tabZalo"], function (result) {
              const activeTab = result.tabZalo.id;

              chrome.tabs.sendMessage(activeTab, { task: "XOA_CACHE" });
            });
          },
        },
        Đóng: {
          btnClass: "btn-gray",
          action: function () {
            //  $.alert('You clicked No!');
          },
        },
      },
    });
  });

  btnReset.addEventListener("click", () => {
    $.confirm({
      title: "Thông báo!",
      content: "Bạn có đồng ý muốn làm mới dữ liệu?",
      boxWidth: "350px",
      useBootstrap: false,
      onOpen: function () {
        if (document.body.classList.contains("dark-mode")) {
          this.$body.addClass("dark-mode");
        }
      },
      buttons: {
        "Đồng ý": {
          btnClass: "btn-green",
          action: function () {
            currentFiles = [];
            $("#fileMedia").val("");
            $("#thumbnailPreview").empty();
            $("#thumbnailPreview").height("0px");
            $("#dataTableContainer").empty();
            document.querySelectorAll("td:nth-child(4)").forEach(function (td) {
            });
            $("#txtMessage").val("");
            $("#tableCount").empty();
            $("#selectedItemsCount").html(
              `Bạn đã chọn <span class="text-blue-500 font-bold">0</span> tập tin.`
            );
            chrome.storage.local.set({ DanhSach: [] });
          },
        },
        Không: {
          btnClass: "btn-red",
          action: function () {
            //  $.alert('You clicked No!');
          },
        },
      },
    });
  });

  function jsonToVCard(json) {
    // Ensure no leading/trailing spaces and correct line breaks
    return `BEGIN:VCARD
VERSION:3.0
FN:${json.zaloName}
TEL;TYPE=CELL:${json.phoneNumber}
CATEGORIES:myContacts
BDAY:${json.sdob}
END:VCARD`;
  }

  function exportToVCARD(dataJson, filename) {
    const filteredArray = dataJson.filter((contact) => contact.phoneNumber);
    console.log("JSON FILTER", filteredArray);

    const vCards = filteredArray.map(jsonToVCard).join("\n");
    const blob = new Blob([vCards], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportToExcel(data, filename) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Friends");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    console.log(message);

    if (message.task === "USER_INFO") {
      var userinfo = message.data;
      $("#txtusername_zalo").text(userinfo.name);
      $("#img_avatar").attr("src", userinfo.avatarUrl);
      console.log("POPUP USERINFO", userinfo);
    }

    if (message.task === "COOKIES_COPIED") {
      var txtCookie = document.getElementById("txtCookie");
      var txtUsername = document.getElementById("txtUsername");
      var txtImage = document.getElementById("txtImage");

      if (txtUsername) {
        txtUsername.value = $("#txtusername_zalo").text();
        if (txtImage) {
          txtImage.value = $("#img_avatar").attr("src");
        }

        txtCookie.value = message.data;
        var btnCapnhat = document.querySelector(".btn-add-acc");
        if (btnCapnhat) {
          btnCapnhat.click();
        }
      }
    }

    if (message.task === "TRANGTHAI_SHARE") {
      var statusShare = document.getElementById("statusShare");
      statusShare.textContent = message.message;
    }

    if (message.task == "CHON_XONG_NOIDUNG") {
      var xpath = message.data;
      var taskContainer = document.getElementById("taskContainer");
      var btnAdd = document.getElementById("btnAddContent");
      btnAdd.textContent = "Thêm nội dung";
      // Create a new card element
      var card = document.createElement("div");
      card.className = "card"; // Add a class for CSS styling

      // Create the content div
      var contentDiv = document.createElement("div");
      contentDiv.className = "card-content";
      contentDiv.textContent = xpath;

      // Create the clear button
      var clearButton = document.createElement("button");
      clearButton.className = "clear-button";
      clearButton.textContent = "Xóa";
      clearButton.style.display = "none"; // Initially hidden

      // Add hover event to show/hide the clear button
      card.addEventListener("mouseover", () => {
        clearButton.style.display = "block";
      });
      card.addEventListener("mouseout", () => {
        clearButton.style.display = "none";
      });

      // Add click event to remove the card
      clearButton.addEventListener("click", () => {
        card.remove();
      });

      // Append the content and button to the card
      card.appendChild(contentDiv);
      card.appendChild(clearButton);

      // Append the card to the taskContainer
      taskContainer.appendChild(card);
    }

    if (message.task === "FINISH_SEND_MESSAGE") {
      btnSend.style.display = "block";
      btnStop.style.display = "none";
      toastr["success"]("Đã thực hiện nghiệp vụ hoàn tất, bạn ơi.");
    }

    if (message.task === "CURRENT_PROCESSING_ITEM") {
      var data = message.data;
      btnStop.textContent = `Dừng gởi`;
      let total_item_div = document.getElementById("total_item");
      total_item_div.textContent = `${data}`;
    }

    if (message.task === "PROCESSING_ITEM") {
      var data = message.data;
      setTextByPhoneNumber(data[0], "Đang gởi...", "#ffd6e7", "#eb2f96");
    }

    if (message.task === "SLEEP_COUNT_DOWN") {
      var count = message.countdown;
      var item = message.item;
      if (count == -1) {
        setTextByPhoneNumber(
          item[0],
          `Hệ thống dừng gởi tin...`,
          "#bfbfbf",
          "#262626"
        );
      } else {
        setTextByPhoneNumber(
          item[0],
          `Chờ xử lý (${count})`,
          "#ffffff",
          "#cf1322"
        );
      }
    }

    if (message.task === "TRANGTHAI_SEND_MESSAGE") {
      var data = message.data;
      var isKiemTraHopLe = $("#chkKiemTraHopLe").iCheck("update")[0].checked;

      if (isKiemTraHopLe) {
        if (data.status == "ok") {
          setTextByPhoneNumber(
            data.phone.phone,
            data.message,
            "#d9f7be",
            "#389e0d"
          );
          setTextNameByPhoneNumber(
            data.phone.phone,
            data.phone.username,
            "#fff",
            "#eb2f96"
          );
        } else if (data.status == "block") {
          setTextByPhoneNumber(data.phone, data.message, "#cf1322", "#ff7875");
          btnStop.click();
        } else {
          setTextByPhoneNumber(data.phone, data.message, "#d9d9d9", "#434343");
        }
      } else {
        if (data.status == "ok") {
          setTextByPhoneNumber(data.phone, data.message, "#d9f7be", "#389e0d");
        } else if (data.status == "block") {
          setTextByPhoneNumber(data.phone, data.message, "#cf1322", "#ff7875");
          btnStop.click();
        } else {
          setTextByPhoneNumber(data.phone, data.message, "#d9d9d9", "#434343");
        }
      }
    }

    if (message.task === "DATA_LIST_TAGS") {
      const jsonFriendsall = message.friends;
      const jsonFriends = jsonFriendsall.filter((friend) =>
        [0, 1, 2].includes(friend.type)
      );
      const friendsArray = jsonFriends
        .map((friend) => [friend.userId, friend.displayName])
        .sort((a, b) => a[1].localeCompare(b[1]));
      friendsArray.unshift(["UID", "Name"]);

      const distinctLabels = new Set();
      jsonFriends.forEach((item) => {
        distinctLabels.add(item.tag);
      });

      listTags = Array.from(distinctLabels);
    }

    if (message.task === "DATA_LIST_FRIEND_RECEIVED_EXPORT") {
      let jsonFriends = message.friends;
      // console.log('LIST FRIEND EXPORT', jsonFriends)
      exportToExcel(jsonFriends, "ZALO_FRIENDS_ALL");
    }

    if (message.task === "DATA_LIST_FRIEND_VCARD_EXPORT") {
      let jsonFriends = message.friends;
      // console.log('LIST FRIEND EXPORT', jsonFriends)
      exportToVCARD(jsonFriends, "ZALO_CONTACT_VCARD");
    }

    if (message.task === "DATA_LIST_FRIEND_RECEIVED") {
      const jsonFriendsall = message.friends;
      const jsonFriends = jsonFriendsall.filter((friend) =>
        [0, 1, 2].includes(friend.type)
      );

      //console.log(friends)
      // let friendsArray = jsonFriends.map(item => [item.userId, item.displayName])
      //                                              .sort((a, b) => a[1].localeCompare(b[1]));;

      // let friendsArray = jsonFriends.map(item => [item.userId, item.displayName])
      //                   .sort((a, b) => b[1].localeCompare(a[1]));

      const friendsArray = jsonFriends
        .map((friend) => [friend.userId, friend.displayName])
        .sort((a, b) => a[1].localeCompare(b[1]));
      friendsArray.unshift(["UID", "Name"]);
      $("#tableCount")
        .html(`Bạn đã chọn <span class="text-blue-500 font-bold" id="total_item">${
        friendsArray.length - 1
      }</span> bạn bè.  <select id="labelSelect" class="multiple-select" multiple style="margin-top: 6px;"> 
              
            </select>
              <div style="position: relative; float: right;">
                    <input type="text" id="searchInput" placeholder="Tìm kiếm..." class="w-full px-3 py-1 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style="margin-top: -2px;">
                    </div>
            
            `);

      function normalizeString(str) {
        // Remove Vietnamese diacritics
        const from =
          "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ";
        const to =
          "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";

        str = str.toLowerCase();

        // Replace Vietnamese diacritics
        for (let i = 0; i < from.length; i++) {
          str = str.replace(new RegExp(from[i], "gi"), to[i]);
        }

        // Remove all whitespace characters and trim
        str = str.replace(/\s/g, "").trim();

        return str;
      }

      function removeAllSpaces(str) {
        return str.toLowerCase().replace(/ /g, "").trim();
      }

      function filterTable() {
        const input = document.getElementById("searchInput");
        const filter = normalizeString(input.value);
        const table = document.querySelector("#dataTableContainer table");
        const rows = table.getElementsByTagName("tr");

        let visibleRowCount = 0;

        // Remove existing "No data" row if it exists
        const existingNoDataRow = table.querySelector(".no-data-row");
        if (existingNoDataRow) {
          existingNoDataRow.remove();
        }

        console.log("Name: ", filter);

        for (let i = 1; i < rows.length; i++) {
          const nameCell = rows[i].getElementsByTagName("td")[2];
          if (nameCell) {
            const name = normalizeString(nameCell.textContent);

            if (name.indexOf(filter) > -1) {
              rows[i].style.display = "";
              visibleRowCount++;
            } else {
              rows[i].style.display = "none";
            }
          }
        }

        // If no visible rows, add "No data" row
        if (visibleRowCount === 0) {
          const noDataRow = table.insertRow();
          noDataRow.className = "no-data-row";
          const cell = noDataRow.insertCell(0);
          cell.colSpan = 4; // Adjust this number based on your table's column count
          cell.textContent = "Không tìm thấy dữ liệu...";
          cell.style.textAlign = "center";
          cell.style.padding = "10px";
          cell.style.width = "800px";
          cell.style.color = "red";
          cell.style.fontWeight = "bold";
          cell.style.border = "1px solid gray";
        }
      }

      function clearSearch() {
        const input = document.getElementById("searchInput");
        input.value = "";
        const table = document.querySelector("#dataTableContainer table");
        const rows = table.getElementsByTagName("tr");

        for (let i = 1; i < rows.length; i++) {
          rows[i].style.display = "";
        }
      }

      // Add event listener to search input
      document
        .getElementById("searchInput")
        .addEventListener("input", filterTable);

      // Add clear button to search input
      const searchInput = document.getElementById("searchInput");
      const clearButton = document.createElement("button");
      clearButton.textContent = "✕";
      clearButton.className =
        "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600";
      clearButton.addEventListener("click", clearSearch);

      // Wrap the search input in a relative positioned div
      const wrapper = document.createElement("div");
      wrapper.className = "relative";
      searchInput.parentNode.insertBefore(wrapper, searchInput);
      wrapper.appendChild(searchInput);
      wrapper.appendChild(clearButton);

      const distinctLabels = new Set();
      jsonFriends.forEach((item) => {
        distinctLabels.add(item.tag);
      });

      distinctLabelsArray = Array.from(distinctLabels);

      const selectElement = document.getElementById("labelSelect");
      distinctLabelsArray.forEach((label) => {
        const option = document.createElement("option");
        option.value = label;
        option.text = label;
        selectElement.add(option);
      });

      var $select = $(".multiple-select");
      $select.multipleSelect({
        onCheckAll: function () {
          var selectedOptions = $select.multipleSelect("getSelects", "text");
          console.log("option", selectedOptions);

          const filteredFriendsArray = jsonFriends.filter((friend) => {
            if (selectedOptions.length === 0) {
              return true;
            }
            return selectedOptions.includes(friend.tag);
          });

          const friendsArray = filteredFriendsArray
            .map((friend) => [friend.userId, friend.displayName])
            .sort((a, b) => a[1].localeCompare(b[1]));

          friendsArray.unshift(["UID", "Name"]);

          $("#total_item").text(friendsArray.length - 1 + "");

          // let namesToRemove = ["Zalo", "Truyền File"];
          // friendsArray = removeFriendsByNames(friendsArray, namesToRemove);

          // $("#tableCount").html(`Bạn đã chọn <span class="text-blue-500 font-bold" id="total_item">${friendsArray.length - 1}</span> bạn bè.  <select id="labelSelect" class="multiple-select" multiple style="margin-top: 6px;">
          // </select>`);
          displayExcelData(friendsArray, "bạn bè");
        },
        onUncheckAll: function () {
          var friendsArray = [];
          friendsArray.unshift(["UID", "Name"]);
          $("#total_item").text(0 + "");
          displayExcelData(friendsArray, "bạn bè");
        },
        onClick: function (view) {
          // console.log('onClick event fire! view: ' + JSON.stringify(data) + '\n')
          var selectedOptions = $select.multipleSelect("getSelects", "text");
          console.log("option", selectedOptions);

          const filteredFriendsArray = jsonFriends.filter((friend) => {
            if (selectedOptions.length === 0) {
              var friendsArray = [];
              friendsArray.unshift(["UID", "Name"]);
              $("#total_item").text(0 + "");
              displayExcelData(friendsArray, "bạn bè");
              return;
            }
            return selectedOptions.includes(friend.tag);
          });

          const friendsArray = filteredFriendsArray
            .map((friend) => [friend.userId, friend.displayName])
            .sort((a, b) => a[1].localeCompare(b[1]));

          friendsArray.unshift(["UID", "Name"]);

          $("#total_item").text(friendsArray.length - 1 + "");

          // let namesToRemove = ["Zalo", "Truyền File"];
          // friendsArray = removeFriendsByNames(friendsArray, namesToRemove);

          // $("#tableCount").html(`Bạn đã chọn <span class="text-blue-500 font-bold" id="total_item">${friendsArray.length - 1}</span> bạn bè.  <select id="labelSelect" class="multiple-select" multiple style="margin-top: 6px;">
          // </select>`);
          displayExcelData(friendsArray, "bạn bè");
        },
      });

      //       displayExcelData(friendsArray, "bạn bè");
      $select.multipleSelect("checkAll");
    }
  });

  function removeFriendsByNames(friendsArray, namesToRemove) {
    return friendsArray.filter((item) => !namesToRemove.includes(item[1]));
  }

  let currentFiles = [];
  var isShowApp = $("#frameMain_th").width() === 0 ? true : false;
  chrome.storage.local.set({ DanhSach: [], isShowApp });

  $(".btngetfriend_nhom").on("click", function () {
    document.getElementById("dropdown-menu2").classList.toggle("hidden");
    var option = $(this).attr("data-option");
    chrome.storage.local.get(["tabZalo"], function (result) {
      const activeTab = result.tabZalo.id;
      chrome.tabs.sendMessage(activeTab, {
        task: "GET_ALL_FRIENDS",
        option: option,
      });
    });
  });

  function saveSetting() {
    var delay = $("#delay").val();
    var delay1 = $("#delay1").val();
    var delay2 = $("#delay2").val();
    var isKiemTraHopLe = $("#chkKiemTraHopLe").iCheck("update")[0].checked;
    var isKetBan = $("#chkKetBan").iCheck("update")[0].checked;
    var settings = { delay, delay1, delay2, isKiemTraHopLe, isKetBan };

    chrome.storage.local.set({ settings: settings });

    console.log("SAVE SETTINGS SUCCESSFUL.", settings);
  }

  $("#delay, #delay1, #delay2").on("change", saveSetting);
  $("#chkKetBan").on("ifChanged", function (event) {
    // var isKetBan =  $('#chkKetBan').iCheck('update')[0].checked ? "uncheck" : "check";
    //$('#chkKiemTraHopLe').iCheck(isKetBan);
    saveSetting();
  });

  $("#chkKiemTraHopLe").on("ifChanged", function (event) {
    //  var isKetBan =  $('#chkKiemTraHopLe').iCheck('update')[0].checked ? "uncheck" : "check";
    // $('#chkKetBan').iCheck(isKetBan);
    saveSetting();
  });

  $("#chkShowModal").on("ifChanged", function (event) {
    var isShowModal = $("#chkShowModal").iCheck("update")[0].checked;

    if (isShowModal) {
      toastr["info"]("Đã bật show modal thành công, bạn ơi.");
    } else {
      toastr["error"]("Đã tắt ẩn show modal, bạn ơi.");
    }

    chrome.storage.local.get(["tabZalo"], function (result) {
      const activeTab = result.tabZalo.id;
      chrome.tabs.sendMessage(activeTab, {
        task: "REQUEST_SHOW_MODAL",
        isShowModal: isShowModal,
      });
    });
  });

  $("#chkAutoScroll").on("ifChanged", function (event) {
    var isAutoScroll = $("#chkAutoScroll").iCheck("update")[0].checked;

    if (isAutoScroll) {
      toastr["info"]("Đã bật chế độ tự động cuộn, bạn ơi.");
    } else {
      toastr["error"]("Đã tắt chế độ tự động cuộn, bạn ơi.");
    }
  });

  function getCheckedRows() {
    var table = document.querySelector("table");
    if (!table) {
      //toastr["error"]("Chưa có danh sách để thực hiện, em trai.")
      return [];
    }
    var tbody = table.querySelector("tbody");

    if (!tbody) {
      console.log("No tbody found");
      return [];
    }

    var rows = tbody.querySelectorAll("tr");
    var data = [];

    rows.forEach((row) => {
      var checkbox = row.querySelector(
        'td:nth-child(1) input[type="checkbox"]'
      );
      if (checkbox && checkbox.checked) {
        var rowData = [
          row.querySelector("td:nth-child(2)").textContent,
          row.querySelector("td:nth-child(3)").textContent,
        ];
        data.push(rowData);
      }
    });

    console.log(JSON.stringify(data));
    return data;
  }

  btnSend.addEventListener("click", () => {
    var listSelected = getCheckedRows();
    let IS_PHAT_CODE = 0;
    if ($("thead").length) {
      $("thead th:nth-child(3)").each(function () {
        var headerText = $(this).text().trim();
        console.log("Header text from second column: " + headerText);
        if (headerText.toLowerCase() == "nội dung") {
          IS_PHAT_CODE = 1;
        }
      });
    }

    if (listSelected.length === 0) {
      toastr["error"]("Bạn chưa chọn danh sách để thực hiện.");
      return;
    }
    chrome.storage.local.set({ DanhSach: listSelected });

    var delay = $("#delay").val();
    var delay1 = $("#delay1").val();
    var delay2 = $("#delay2").val();

    if (delay.trim() == "" || Number(delay) <= 0) {
      toastr["error"](
        "Thông số nhập cấu hình không hợp lệ, không phải số, hoặc < 0, em trai."
      );
      $("#delay").focus();
      return;
    }
    if (delay1.trim() == "" || Number(delay1) <= 0) {
      toastr["error"](
        "Thông số nhập cấu hình không hợp lệ, không phải số, hoặc < 0, em trai."
      );
      $("#delay1").focus();
      return;
    }

    if (delay2.trim() == "" || Number(delay2) <= 0) {
      toastr["error"](
        "Thông số nhập cấu hình không hợp lệ, không phải số, hoặc < 0, em trai."
      );
      $("#delay2").focus();
      return;
    }

    saveSetting();
    chrome.storage.local.set({ IS_PHAT_CODE: IS_PHAT_CODE });
    document.querySelectorAll("td:nth-child(4)").forEach(function (td) {
    });

    var isKetBan = $("#chkKetBan").iCheck("update")[0].checked;
    var isKiemTraHopLe = $("#chkKiemTraHopLe").iCheck("update")[0].checked;

    if (isKetBan && isKiemTraHopLe) {
      toastr["error"](
        "Vui lòng chỉ chọn 1 trong 2 chức năng kiểm tra số điện thoại hoặc kêt bạn."
      );
      return;
    }

    chrome.storage.local.get("DanhSach", function (data) {
      if (data.DanhSach.length == 0) {
        toastr["error"]("Bạn chưa chọn danh sách để gởi tin nhắn.");
        return;
      }

      console.log("danhsachkh:", data);

      var phone = data.DanhSach;
      var message = txtmessage.value;

      var isKiemTraHopLe = $("#chkKiemTraHopLe").iCheck("update")[0].checked;
      var isKetBan = $("#chkKetBan").iCheck("update")[0].checked;
      console.log("IS_PHAT_CODE", IS_PHAT_CODE);
      if (
        isKiemTraHopLe === false &&
        isKetBan === false &&
        IS_PHAT_CODE === 0 &&
        message.length == 0
      ) {
        toastr["error"]("Chưa nhập nội dung tin nhắn, bạn ơi.");
        txtmessage.focus();
        return;
      }

      const files = fileMedia.files;
      console.log("files chosen from popup: ", files);

      btnSend.style.display = "none";
      btnStop.style.display = "block";

      let type = $("#tableCount").text().includes("bạn bè")
        ? "BAN_BE"
        : "KHACH_HANG";

      var data = {
        phone,
        message,
      };

      const fileList = [];
      if (files.length > 0) {
        Array.from(files).forEach((file) => {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            fileList.push({
              fileData: fileReader.result,
              fileName: file.name,
            });

            if (fileList.length === files.length) {
              chrome.runtime.sendMessage({
                task: "SEND_MESSAGE_TO_FRIENDS",
                data: data,
                files: fileList,
                type: type,
              });
            }
          };
          fileReader.readAsDataURL(file);
        });
      } else {
        chrome.runtime.sendMessage({
          task: "SEND_MESSAGE_TO_FRIENDS",
          data: data,
          files: [],
          type: type,
        });
      }

      console.log("file list", fileList);

      var cellsInTrangThaiColumn = document.querySelectorAll(
        ".htCore tbody tr td:nth-child(4)"
      );
      cellsInTrangThaiColumn.forEach(function (cell) {
        cell.textContent = "";
      });
    });
  });

  btnStop.addEventListener("click", () => {
    btnSend.style.display = "block";
    btnStop.style.display = "none";
    toastr["success"]("Đã dừng thực hiện thành công, bạn ơi.");
    chrome.runtime.sendMessage({ task: "stop_send_message" });
  });

  btnOpenExcel.addEventListener("click", function () {
    fileDanhSach.click();
  });

  btnOpenImage.addEventListener("click", function () {
    fileMedia.click();
  });

  fileMedia.addEventListener("change", function (event) {
    currentFiles = Array.from(event.target.files);
    updatePreviewAndCount();
  });

  function updatePreviewAndCount() {
    const thumbnailPreview = document.getElementById("thumbnailPreview");
    const selectedItemsCount = document.getElementById("selectedItemsCount");

    // Clear any existing thumbnails
    thumbnailPreview.innerHTML = "";

    // Update the selected items count message with Tailwind CSS styling
    updateSelectedItemsCount(currentFiles.length);

    const fileIcons = {
      "application/pdf": "📘", // Example icon for PDF files
      "application/vnd.ms-excel": "📊", // Example icon for Excel files
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊", // Example icon for Excel files
      // Add more file types and their icons as needed
    };

    // Function to truncate file names
    function truncateFileName(name, maxLength) {
      const ext = name.slice(name.lastIndexOf("."));
      const baseName = name.slice(0, name.lastIndexOf("."));
      if (baseName.length + ext.length >= maxLength) {
        return name;
      }
      const truncatedBase = baseName.slice(0, maxLength - ext.length - 3); // -3 for the ellipsis
      return truncatedBase + "..." + ext;
    }

    if (currentFiles.length > 0) {
      $("#thumbnailPreview").height("155px");
    } else {
      $("#thumbnailPreview").height("0px");
    }

    // Iterate through the selected files
    currentFiles.forEach((file, index) => {
      const fileType = file.type;

      const fileItem = document.createElement("div");
      fileItem.className =
        "thumbnail-container w-24 m-2 flex flex-col items-center";
      fileItem.dataset.index = index;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = "❌";
      deleteButton.addEventListener("click", function () {
        removeFile(index);
      });

      fileItem.appendChild(deleteButton);

      if (fileType.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className =
            "w-full h-24 object-cover border border-gray-300 rounded-md shadow-md";
          fileItem.appendChild(img);

          const fileName = document.createElement("span");
          fileName.className = "mt-1 text-center text-xs truncate w-full";
          fileName.textContent = truncateFileName(file.name, 10); // Truncate file name
          fileItem.appendChild(fileName);
        };

        reader.readAsDataURL(file);
      } else {
        const icon = fileIcons[fileType] || "📑"; // Default icon for unknown file types
        const iconDiv = document.createElement("div");
        iconDiv.className =
          "w-full h-24 flex items-center justify-center border border-gray-300 rounded-md shadow-md text-4xl";
        iconDiv.textContent = icon;
        fileItem.appendChild(iconDiv);

        const fileName = document.createElement("span");
        fileName.className = "mt-1 text-center text-xs truncate w-full";
        fileName.textContent = truncateFileName(file.name, 10); // Truncate file name
        fileItem.appendChild(fileName);
      }

      thumbnailPreview.appendChild(fileItem);
    });
  }

  function removeFile(index) {
    currentFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
    currentFiles.forEach((file) => dataTransfer.items.add(file));
    fileMedia.files = dataTransfer.files;
    updatePreviewAndCount();
  }

  function updateSelectedItemsCount(count) {
    const selectedItemsCount = document.getElementById("selectedItemsCount");
    selectedItemsCount.innerHTML = `Bạn đã chọn <span class="text-blue-500 font-bold">${count}</span> tập tin.`;
  }

  function processExcelFile(data) {
    var workbook = XLSX.read(new Uint8Array(data), { type: "array" });

    var sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[sheetName];
    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    var seenValues = new Set();
    jsonData = jsonData.filter((row) => {
      if (row.length > 0) {
        row[0] = String(row[0]).trim();
        if (seenValues.has(row[0])) {
          return false;
        } else {
          seenValues.add(row[0]);
          return true;
        }
      }
      return false;
    });

    var formattedData = jsonData.map(function (row) {
      return { phoneNumber: row[0] };
    });

    displayExcelData(jsonData, "khách hàng");
  }

  function processXlsxFileWithCodeOTP(data) {
    // Read the workbook from the provided data
    var workbook = XLSX.read(new Uint8Array(data), { type: "array" });

    // Get the first sheet name
    var sheetName = workbook.SheetNames[0];
    // Get the worksheet
    var sheet = workbook.Sheets[sheetName];
    // Convert the worksheet to JSON format
    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Remove duplicate phone numbers and filter rows
    var seenValues = new Set();
    jsonData = jsonData.filter((row) => {
      if (row.length >= 2 && row[1].trim().length > 0) {
        row[0] = String(row[0]).trim();
        if (seenValues.has(row[0])) {
          return false;
        } else {
          seenValues.add(row[0]);
          return true;
        }
      }
      return false;
    });

    // Add headers
    var headers = ["Phone", "Nội dung"];
    var dataWithHeaders = [...jsonData];

    // Display the data with headers
    displayExcelData(dataWithHeaders, "khách hàng");
  }

  function processTextFileWithCodeOTP(data) {
    console.log("OTP", data);
    var rows = data
      .split("\n")
      .map(function (line) {
        var parts = line.split("|").map(function (column) {
          return column.trim();
        });
        return parts.length === 2 && parts[1].length > 0 ? parts : null;
      })
      .filter(function (row) {
        return row !== null;
      });

    var seenValues = new Set();
    rows = rows.filter(function (row) {
      var phone = row[0];
      if (seenValues.has(phone)) {
        return false;
      } else {
        seenValues.add(phone);
        return true;
      }
    });

    var headers = ["Phone", "Nội dung"];
    var dataWithHeaders = [headers, ...rows];

    displayExcelData(dataWithHeaders, "khách hàng");
  }

  function processTextFile(data) {
    var rows = data
      .split("\n")
      .map(function (line) {
        return line.split(",").map(function (column) {
          return column.trim();
        });
      })
      .filter(function (row) {
        return (
          row.length > 0 &&
          row.some(function (cell) {
            return cell.length > 0;
          })
        );
      });

    var seenValues = new Set();
    rows = rows.filter(function (row) {
      if (row.length > 0) {
        var phone = row[0];
        if (seenValues.has(phone)) {
          return false;
        } else {
          seenValues.add(phone);
          return true;
        }
      }
      return false;
    });
    var headers = ["Phone", "Name"];
    var dataWithHeaders = [headers, ...rows];

    displayExcelData(dataWithHeaders, "khách hàng");
  }

  fileDanhSach.addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    if (!file) {
      return;
    }
    // Check file type
    var fileType = file.name.split(".").pop().toLowerCase();

    reader.onload = function (e) {
      var data = e.target.result;
      // console.log("DATA", data)
      if (fileType === "txt") {
        if (data.includes("|")) {
          processTextFileWithCodeOTP(data);
        } else {
          processTextFile(data);
        }
      } else if (fileType === "xlsx") {
        //  processExcelFile(data);
        var workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        // Get the first sheet name
        var sheetName = workbook.SheetNames[0];
        // Get the worksheet
        var sheet = workbook.Sheets[sheetName];
        // Convert the worksheet to JSON format
        var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if(jsonData[0][1].trim().toLowerCase() == "nội dung"){
            processXlsxFileWithCodeOTP(data);
        }else{
            processExcelFile(data);
        }

        
      }
    };

    // Read file as text or binary based on file type
    if (fileType === "txt") {
      reader.readAsText(file);
    } else if (fileType === "xlsx") {
      reader.readAsArrayBuffer(file);
    }

    fileDanhSach.value = "";
  });
  var hot;

  function displayExcelData(data, type) {
    chrome.storage.local.set({ DanhSach: data, type: type });
    console.log("displayExcel", data);

    // Add "Trạng Thái" to column headers
    var columnHeaders = data[0].concat("Trạng Thái");

    // Add an empty "Trạng Thái" cell to each row
    data.forEach(function (row) {
      row.push("");
    });

    // Update the count display

    if (type === "khách hàng") {
      $("#tableCount").html(
        `Bạn đã chọn <span class="text-blue-500 font-bold" id="total_item">${
          data.length - 1
        }</span> ${type}.`
      );
    }

    // Clear the existing table
    var tableContainer = document.getElementById("dataTableContainer");
    tableContainer.innerHTML = "";

    // Create a new table
    var table = document.createElement("table");
    table.className =
      "table table-striped table-bordered htCore w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  w-screen"; // Bootstrap table classes

    // Create the table header
    var thead = document.createElement("thead");
    thead.className =
      "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0";
    var tr = document.createElement("tr");
    var th_checkbox = document.createElement("th");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function () {
      getCheckedCount();
    });
    checkbox.className =
      "form-checkbox h-4 w-4 text-green-600 cursor-pointer transition duration-150 ease-in-out hover:text-green-500";
    th_checkbox.className =
      "px-1 py-3 border border-gray-300 bg-gray-300 text-center cursor-pointer";
    th_checkbox.appendChild(checkbox);
    tr.appendChild(th_checkbox);

    columnHeaders.forEach(function (header) {
      var th = document.createElement("th");
      th.className = "px-1 py-3 border border-gray-300 bg-gray-300";
      th.textContent = header;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    // Create the table body
    var tbody = document.createElement("tbody");
    tbody.className = "h-25 overflow-y-auto";
    for (var i = 1; i < data.length; i++) {
      // Skip the header row

      var tr = document.createElement("tr");
      tr.addEventListener("click", function () {
        getCheckedCount();
      });

      // tr.className = 'bg-white border dark:bg-gray-300 darkborder-gray-700 hover:bg-gray-50 min-w-200';
      tr.className =
        "border dark:bg-gray-300 darkborder-gray-700 hover:bg-gray-50 min-w-200";
      var k = 0;

      var td_checkbox = document.createElement("td");
      td_checkbox.addEventListener("click", function () {
        getCheckedCount();
      });
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", function () {
        getCheckedCount();
      });
      checkbox.className =
        "mt-1 form-checkbox h-4 w-4 text-green-600 cursor-pointer transition duration-150 ease-in-out hover:text-green-500";
      td_checkbox.className =
        "border border-gray-300 px-1 text-center cursor-pointer";
      td_checkbox.style.width = "55px";
      td_checkbox.appendChild(checkbox);
      tr.appendChild(td_checkbox);

      data[i].forEach(function (cellData) {
        if (k > 1) return;

        var td = document.createElement("td");
        td.className = "border border-gray-300 px-1";
        td.textContent = cellData;
        td.style.width = "200px";
        tr.appendChild(td);
        k++;
      });
      var tdTrangthai = document.createElement("td");
      tdTrangthai.style.width = "350px";
      tdTrangthai.className = "border border-gray-300";
      tr.appendChild(tdTrangthai);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    // Append the table to the container
    tableContainer.appendChild(table);

    $("table").simpleCheckboxTable();
  }
});
document.addEventListener("DOMContentLoaded", function() {
  // Khởi tạo Quill editor
  const quill = new Quill('#quillEditor', {
      theme: 'snow',
      placeholder: 'Nhập nội dung tin nhắn...',
      modules: {
          toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link']
          ]
      }
  });
});
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Lấy dữ liệu từ sheet đầu tiên
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });  // Convert sheet thành mảng 2D

        // Hiển thị dữ liệu vào bảng
        const tableBody = document.getElementById('previewTable');
        tableBody.innerHTML = ''; // Xóa các dòng cũ

        if (jsonData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có dữ liệu.</td></tr>';
            return;
        }

        jsonData.forEach((row, index) => {
            const tr = document.createElement('tr');
            row.forEach((cell, cellIndex) => {
                const td = document.createElement('td');
                td.textContent = cell || '';
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    };

    reader.readAsBinaryString(file);  // Đọc file dưới dạng nhị phân
}

document.addEventListener("DOMContentLoaded", function () {
  // Bắt sự kiện click vào nút "Bắt đầu gửi"
  document.getElementById('startButton').addEventListener('click', function () {
      // Dãy số điện thoại để nhập
      const phoneNumber = "0898712033";

      // Gửi message đến content.js để thực hiện các hành động
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { task: "START_SEND", phone: phoneNumber });
      });
  });
});

// Lấy danh sách số điện thoại và nội dung tin nhắn, sau đó gửi qua content.js
document.getElementById('startButton').addEventListener('click', function () {
  const rows = document.querySelectorAll('#previewTable tr');
  const quillContent = document.querySelector('#quillEditor .ql-editor').innerHTML;

  if (!quillContent.trim()) {
      alert("Vui lòng nhập nội dung tin nhắn trong Quill Editor!");
      return;
  }

  const phoneNumbers = [];
  rows.forEach((row, index) => {
      if (index > 0) { // Bỏ qua hàng tiêu đề
          const phone = row.cells[1]?.textContent.trim();
          if (phone) phoneNumbers.push(phone);
      }
  });

  if (phoneNumbers.length === 0) {
      alert("Không tìm thấy số điện thoại trong bảng.");
      return;
  }

  chrome.runtime.sendMessage({ task: "START_SEND", phoneNumbers, quillContent });
});


