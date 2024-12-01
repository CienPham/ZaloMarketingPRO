let stopProcessing = false;
let mdata;
let fileSend;


function isValidVietnamesePhoneNumber(phoneNumber) {
  const vietnamPhonePattern = /^(0|\+?84)?(3|5|7|8|9)(\d{8})$/;
  const sanitizedPhoneNumber = phoneNumber.replace(/[\s+]/g, '');
  return vietnamPhonePattern.test(sanitizedPhoneNumber);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.message === "getActiveTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        sendResponse({ tab: tabs[0] });
      } else {
        sendResponse({ tab: null });
      }
    });
    return true; 
  }
  if(message.task === "COPY_COOKIE"){
    chrome.cookies.getAll({url: "https://chat.zalo.me"}, function(cookies) {    
      console.log("COOKIES", cookies)
      const cookiesJson = JSON.stringify(cookies);

      chrome.runtime.sendMessage({ task: "COOKIES_COPIED", data: cookiesJson });
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: copyToClipboard,
              args: [cookiesJson]
          }, (results) => {
              if (results && results[0] && results[0].result === 'success') {
                  console.log('Cookies copied to clipboard');
                  //alert('Cookies copied to clipboard');
              } else {
                  console.error('Error copying cookies to clipboard');
                //  alert('Error copying cookies to clipboard');
              }
          });
      });

    });
  }

  if(message.task === "SET_COOKIE"){
        
    const { cookie, username } = message.data;
    setCookies(cookie, username);
  }
  function setCookies(cookies, username) {
    try {
        const cookieArray = JSON.parse(cookies);

        if (!Array.isArray(cookieArray)) {
            console.error('Parsed cookies are not an array:', cookieArray);
            return;
        }

        cookieArray.forEach(cookie => {
            let cookieDetails = {
                url: "https://chat.zalo.me",
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                secure: cookie.secure || false,
                httpOnly: cookie.httpOnly || false,
                sameSite: cookie.sameSite || 'no_restriction'
            };

            if (cookie.expirationDate) {
                cookieDetails.expirationDate = Math.round(cookie.expirationDate);
            }

            chrome.cookies.set(cookieDetails, function(result) {
                if (result) {
                    console.log('Cookie set:', result);
                } else {
                    console.error('Error setting cookie:', chrome.runtime.lastError);
                }
            });
        });

        chrome.storage.local.get(['tabZalo'], function (result) {
          const activeTab = result.tabZalo.id;
   
          chrome.tabs.sendMessage(activeTab, { task: "XOA_CACHE" });
  
        });
        
        console.log('All cookies set for user:', username);
    } catch (error) {
        console.error('Error parsing cookies JSON:', error);
    }
}


function clearCookies(url) {
  chrome.cookies.getAll({ url: url }, function(cookies) {
      if (!cookies || cookies.length === 0) {
          console.log('No cookies found for the URL:', url);
          return;
      }

      cookies.forEach(cookie => {
          let cookieDetails = {
              url: `${cookie.secure ? 'https://' : 'http://'}${cookie.domain}${cookie.path}`,
              name: cookie.name
          };

          chrome.cookies.remove(cookieDetails, function(result) {
              if (result) {
                  console.log('Cookie removed:', result);
              } else {
                  console.error('Error removing cookie:', chrome.runtime.lastError);
              }
          });
      });

      console.log('All cookies cleared for the URL:', url);
  });
}
  function copyToClipboard(text) {
    try {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Text copied to clipboard');
        }).catch(function(error) {
            console.error('Error copying text to clipboard: ', error);
        });
        return 'success';
    } catch (error) {
        console.error('Error copying text to clipboard: ', error);
        return 'failure';
    }
}

  if (message.task === "OPEN_CHAT_SUCCESS") {
    console.log("background OPEN_CHAT_SUCCESS", mdata);
    chrome.storage.local.get(["tabZalo"], function (result) {
      const activeTab = result.tabZalo.id;
      sendMedia(activeTab, fileSend);
    });
  }

  if (message.task === "SEND_MESSAGE_TO_FRIENDS") {
    chrome.storage.local.get(["settings"], function (result) {
      let delay = result.settings.delay;
      let delay1 = result.settings.delay1;
      let delay2 = result.settings.delay2;

      console.log("background.js: settings", result);
      let isBanBe = message.type;
      console.log("is Ban Be", isBanBe);

      stopProcessing = false;
      console.log("Data received in content.js:", message.data.phone);
      mdata = message.data;
      fileSend = message.files;

      async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      async function processItem(item) {
        const phone = item[0];
        const name = item[1];
    
        try {
            const result = await new Promise((resolve, reject) => {
                chrome.storage.local.get(["tabZalo", "settings"], (result) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }
                    resolve(result);
                });
            });
    
            const activeTab = result.tabZalo.id;
            const isKiemTraHopLe = result.settings.isKiemTraHopLe;
    
            // Thay thế @@ bằng tên người nhận trong tin nhắn
            const personalizedMessage = mdata.message.replace(/@@/g, name);
    
            if (isBanBe === "KHACH_HANG") {
                await new Promise((resolve, reject) => {
                    if (isValidVietnamesePhoneNumber(phone) === false) {
                        var data = {
                            status: "error",
                            phone: phone,
                            message: "Số điện thoại này không hợp lệ.",
                        };
    
                        chrome.runtime.sendMessage({ task: "TRANGTHAI_SEND_MESSAGE", data: data });
                        return reject("Số điện thoại không hợp lệ.");
                    }
    
                    chrome.tabs.sendMessage(
                        activeTab,
                        {
                            task: "clickAddContact",
                            item: item,
                            phone: phone,
                            message: personalizedMessage, // Gửi tin nhắn đã thay thế
                            isCheck: isKiemTraHopLe,
                            isKetBan: result.settings.isKetBan,
                        },
                        (response) => {
                            if (chrome.runtime.lastError) {
                                return reject(chrome.runtime.lastError);
                            }
                            resolve(response);
                        }
                    );
                });
            }
    
            if (isBanBe === "BAN_BE") {
                await new Promise((resolve, reject) => {
                    chrome.tabs.sendMessage(
                        activeTab,
                        {
                            task: "clickInputFriend",
                            name: name,
                            message: personalizedMessage, // Gửi tin nhắn đã thay thế
                            uid: phone,
                        },
                        (response) => {
                            if (chrome.runtime.lastError) {
                                return reject(chrome.runtime.lastError);
                            }
                            resolve(response);
                        }
                    );
                });
            }
        } catch (error) {
            console.error("Error in processItem:", error);
        }
    }
    
     
      async function processItemsWithDelay(items) {
        console.log('Teddt',items);

        const shortDelay = Number(delay) * 1000;
        let longDelay = Number(delay2) * 1000; 
        const numprocessWait = Number(delay1);
        console.log("shortDelay", shortDelay);
        console.log("longDelay", longDelay);
        console.log("numprocessWait", numprocessWait);
        let processedCount = 0;    
        for (let i = 0; i < items.length; i++) {
          if (stopProcessing) return;
          const item = items[i];
          let messageInfo = `(${i +1 }/${items.length})`;
          chrome.runtime.sendMessage(
            { task: "CURRENT_PROCESSING_ITEM", data: messageInfo },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Runtime error:", chrome.runtime.lastError);
              } else if (response) {
                console.log("Message response:", response.status);
              }
            }
          );
          if (i === 1) {
            chrome.runtime.sendMessage(
              { task: "PROCESSING_ITEM", data: item },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error("Runtime error:", chrome.runtime.lastError);
                } else if (response) {
                  console.log("Message response:", response.status);
                }
              }
            );
          }
          await processItem(item);
          await sleep(2000);
          processedCount++;
          if (processedCount % numprocessWait === 0) {
            if (i + 1 < items.length) {
              let nextItem = items[i + 1];
              await startCountdown(nextItem, longDelay);
              if (stopProcessing) return;
              chrome.runtime.sendMessage(
                { task: "PROCESSING_ITEM", data: nextItem },
                (response) => {
                  if (chrome.runtime.lastError) {
                    console.error("Runtime error:", chrome.runtime.lastError);
                  } else if (response) {
                    console.log("Message response:", response.status);
                  }
                }
              );
              console.log("PROCESSING_ITEM", nextItem);
            }
            await sleep(500);
          } else {
            if (i + 1 < items.length) {
              let nextItem = items[i + 1];
              await startCountdown(nextItem, shortDelay);
              if (stopProcessing) return;
              chrome.runtime.sendMessage(
                { task: "PROCESSING_ITEM", data: nextItem },
                (response) => {
                  if (chrome.runtime.lastError) {
                    console.error("Runtime error:", chrome.runtime.lastError);
                  } else if (response) {
                    console.log("Message response:", response.status);
                  }
                }
              );
              console.log("PROCESSING_ITEM", nextItem);
            }
            await sleep(500);
          }
        }

        chrome.runtime.sendMessage(
          { task: "FINISH_SEND_MESSAGE" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
            } else if (response) {
              console.log("Message response:", response.status);
            }
          }
        );
      }

      function startCountdown(item, initialTime) {
        return new Promise((resolve) => {
          let countdownTime = initialTime / 1000;
          let countdownInterval;

          countdownInterval = setInterval(() => {
            if (stopProcessing) {
              chrome.runtime.sendMessage({
                task: "SLEEP_COUNT_DOWN",
                countdown: -1,
                item: item,
              });
              clearInterval(countdownInterval);
              resolve();
              return;
            }

            if (countdownTime > 0) {
              countdownTime--;
              console.log("SLEEP_COUNT_DOWN", countdownTime);
              console.log("NEXT_ITEM", item);
              chrome.runtime.sendMessage(
                {
                  task: "SLEEP_COUNT_DOWN",
                  countdown: countdownTime,
                  item: item,
                },
                (response) => {
                  if (chrome.runtime.lastError) {
                    console.error("Runtime error:", chrome.runtime.lastError);
                  }
                }
              );
            } else {
              clearInterval(countdownInterval);
              resolve();
            }
          }, 1000);
        });
      }

      processItemsWithDelay(mdata.phone);
    });
  } else if (message.task === "stop_send_message") {
    stopProcessing = true;
  } else if (message.task === "LOGOUT") {
    var currentTabUrl = "https://chat.zalo.me";

    clearCookies(currentTabUrl);
    executeScriptInActiveTab();

    
    
    // chrome.cookies.getAll({ url: currentTabUrl }, function (cookies) {
    //   for (let cookie of cookies) {
    //     const cookieUrl =
    //       "http" +
    //       (cookie.secure ? "s" : "") +
    //       "://" +
    //       cookie.domain +
    //       cookie.path;
    //     chrome.cookieStore.get(cookieUrl, function (cookieStore) {
    //       cookieStore.removeCookies(
    //         { name: cookie.name, url: cookieUrl },
    //         function (removedCookies) {
    //           console.log("Removed cookies:", removedCookies);
    //         }
    //       );
    //     });
    //   }
    // });
  }

  function executeScriptInActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
            let activeTab = tabs[0];


                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    func: yourFunction
                }, (results) => {
                    if (chrome.runtime.lastError) {
                        console.error('Script injection failed: ' + chrome.runtime.lastError.message);
                    } else {
                        console.log('Script executed successfully:', results);
                    }
                });
           
        }
    });
}

function yourFunction() {
    console.log('This script is running on id.zalo.me');
    window.location.href = 'https://id.zalo.me';
}


  function sendMedia(activeTab, files) {
    console.log("file in send media", activeTab, files);
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab },
        func: (files) => {
          const dataURLToFile = (dataURL, fileName) => {
            const [metadata, base64Data] = dataURL.split(",");
            const byteString = atob(base64Data);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < byteString.length; i++) {
              uint8Array[i] = byteString.charCodeAt(i);
            }

            const mimeString = metadata.split(";")[0].split(":")[1];
            const file = new File([uint8Array], fileName, { type: mimeString });
            return file;
          };

          files.forEach((file) => {
            const dataTransfer = new DataTransfer();
            const newFile = dataURLToFile(file.fileData, file.fileName);
            dataTransfer.items.add(newFile);

            const createDragEvent = (type, dataTransfer) => {
              return new DragEvent(type, {
                bubbles: true,
                cancelable: true,
                dataTransfer,
              });
            };

            const targetElement = document.getElementById(
              "dragOverlayInputbox"
            );
            if (targetElement) {
              ["dragstart", "dragenter", "dragover", "drop"].forEach(
                (eventType) => {
                  const dragEvent = createDragEvent(eventType, dataTransfer);
                  targetElement.dispatchEvent(dragEvent);
                }
              );
            } else {
              console.error('Element with ID "chatInput" not found.');
            }
          });
        },
        args: [files],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log("Script executed successfully.");

          chrome.tabs.sendMessage(activeTab, { task: "click_send_button" });
        }
      }
    );
  }
});


// let thecookies = []
chrome.action.onClicked.addListener(function (tab) {
  if (tab.url.includes('chat.zalo.me')) {
    chrome.storage.local.set({ tabZalo: tab });

    chrome.storage.local.get(["tabZalo", "isShowApp"], function (result) {
      var isShowApp = !result.isShowApp
      chrome.storage.local.set({ isShowApp: isShowApp });

      const activeTab = result.tabZalo.id;
      chrome.tabs.sendMessage(activeTab, {
        task: "SHOW_HIDE_APP",
        status: isShowApp,
      });

      chrome.tabs.sendMessage(activeTab, {
        task: "GET_USER_INFO",
        status: isShowApp,
      });
    });
  } else {
    chrome.tabs.create({ url: 'https://chat.zalo.me' });
  }

  // chrome.cookies.getAll({url: "https://chat.zalo.me"}, function(cookies) {
  //   //thecookies = cookies
  //   // sendResponse(cookies);
  //   console.log("COOKIES", cookies)
  // });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({ url: "https://chat.zalo.me" });
  chrome.storage.sync.set({ running: true }, (...args) => {
      console.log({ err: args });
  });
});

