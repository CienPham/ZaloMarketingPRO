
setTimeout(() => {
  $("#container.WEB").stop(true, true);
  $("#frameMain_th").stop(true, true);

  var width = $("#frameMain_th").width();
  console.log("width", width);
  if (width ==  0) {
      $("#container.WEB").animate({"width": "54%"}, "slow");
      $("#frameMain_th").animate({"width": "45%"}, "fast", function() {
          // Use plain JavaScript to set the width with !important after the animation completes
          document.getElementById('frameMain_th').style.setProperty('width', '45%', 'important');
          
      });
      $("#frameMain_th").animate({"right": "0"}, "slow");

      chrome.runtime.sendMessage({ message: "getActiveTab" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else if (response.tab) {
          console.log("Active tab info:", response.tab);
          
          // Optionally save the active tab information to storage
          chrome.storage.local.set({ tabZalo: response.tab }, function() {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            } else {
              console.log('Active tab data saved:', response.tab);
            }
          });

          
        } else {
          console.log("No active tab found");
        }
      });

 

  }
  //alert("working");
}, 1500);


var f = document.createElement('iframe');
f.id = "frameMain_th";
f.src = chrome.runtime.getURL('../page/popup.html');

document.body.insertBefore(f, document.body.firstChild);
document.addEventListener('drop', (event) => {
});


function setModalDisplay(shouldHide) {
var existingStyle = document.querySelector('style[data-zl-modal-style]');

console.log("style[data-zl-modal-style]", existingStyle)

if (!existingStyle) {  
    existingStyle = document.createElement('style');
    existingStyle.setAttribute('data-zl-modal-style', '');
    document.head.appendChild(existingStyle);
}
}

setModalDisplay(true)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
console.log("Data received in content.js:", message); 


if (message.task === "click_send_button") {
  const sendButton = document.querySelector('[data-translate-title="STR_SEND"]');
  if (sendButton) {
    sendButton.click();
    console.log("Send button clicked");
  } else {
    console.log("Send button not found");
  }
}

function showHideApp(message){

  var status = message.status;
  console.log(status);

  // Stop all ongoing animations and clear the queue
  $("#container.WEB").stop(true, true);
  $("#frameMain_th").stop(true, true);

  var width = $("#frameMain_th").width();
  console.log("width", width);

  if (width ==  0) {
      $("#container.WEB").animate({"width": "54%"}, "slow");
      $("#frameMain_th").animate({"width": "45%"}, "fast", function() {
          // Use plain JavaScript to set the width with !important after the animation completes
          document.getElementById('frameMain_th').style.setProperty('width', '45%', 'important');
          
      });
      $("#frameMain_th").animate({"right": "0"}, "slow");
     
  } else {
      $("#container.WEB").animate({"width": "100%"}, "slow");
      $("#frameMain_th").animate({"right": "-800px"}, "slow", function() {
          document.getElementById('frameMain_th').style.setProperty('width', '0%', 'important');
      });
  }
}

if (message.task === "SHOW_HIDE_APP") {
  showHideApp(message);
}



});

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickInputFriend(name, message, uid) {
console.log("clickInputfriend", name, message, uid)
const searchFriend = document.getElementById('contact-search-input');
    if(searchFriend){
      searchFriend.value = name;
      const event = new Event('input', { bubbles: true });
      searchFriend.dispatchEvent(event);
      await sleep(1000)

      const observer = new MutationObserver((mutationsList, observer) => {
        //const friendId = document.getElementById(`friend-item-${uid}`)
        const prefix = uid.startsWith('g') ? 'group-item-' : 'friend-item-';
        const elementId = `${prefix}${uid}`;
        const friendId = document.getElementById(elementId);

        if (friendId) {
          friendId.click();
          observer.disconnect();
     
            setTimeout(function () {
              chrome.runtime.sendMessage({ task: "OPEN_CHAT_SUCCESS" });
            }, 1000);
            setTimeout(function () {
           
              findChatMessage(message, uid, "BAN_BE");
            }, 2000);
          


        }else{
          var data = {
            status: "error",
            phone: uid,
            message: "Không tìm thấy thông tin bạn bè.",
          };
      
          chrome.runtime.sendMessage({ task: "TRANGTHAI_SEND_MESSAGE", data: data });
        }
      });
      
      observer.observe(document, { childList: true, subtree: true });
}
}


//Hàm click "Thêm Bạn" 
function clickAddContact(phone, message, isCheck, isKetBan, item) {
  const addButton = document.querySelector('[data-id="btn_Main_AddFrd"]');
  if (addButton) {
      addButton.click();
      fillPhoneContact(phone, message, isCheck, isKetBan, item);
  } else {
      console.error("Button not found");
  }
}

//Hàm click nút "Tìm Kiếm" sau khi đã nhập số
function clickSearchButton(phone, message, isCheck, isKetBan, item) {
  const searchButton = document.querySelector('[data-id="btn_Main_AddFrd_Search"]');
  if (searchButton) {
      searchButton.click();
      waitAndExecute(() => {
          const isBlockRequest = document.querySelector('.error__msg');
          if (isBlockRequest) {
              chrome.runtime.sendMessage({ 
                  task: "TRANGTHAI_SEND_MESSAGE", 
                  data: { 
                      status: "block", 
                      phone, 
                      message: isBlockRequest.textContent 
                  } 
              });
              return;
          }

          isKetBan ? clickKetBan(phone, message) : clickStartChat(phone, message, isCheck, item);
      }, 1000);
  } else {
      console.error("Search Button not found");
  }
}

function clickKetBan(phone, message) {
const ketbanButton = document.querySelector('[data-translate-inner="STR_PROFILE_ADD_FRIEND"]');
console.log("ketban button: ", ketbanButton, );

if (ketbanButton) {  
    
  ketbanButton.click();
    setTimeout(function () {
      chrome.runtime.sendMessage({ task: "OPEN_CHAT_SUCCESS" });
    }, 1000);
    setTimeout(function () {
  
      findKetBan(message, phone);
    }, 2000);
  

} else {
  const DAketbanButton = document.querySelector('[data-translate-inner="STR_UNDO_REQUEST"]');

  if(DAketbanButton){
    console.log("Số điện thoại đã gởi kết bạn.");
    var data = {
      status: "error",
      phone: phone,
      message: "Số điện thoại này đã gởi kết bạn trước đó.",
    };
  }else{
    const isBanBe = document.querySelector('[data-translate-inner="STR_CHAT"]');
    if(!isBanBe){
      console.log("Lỗi, Số điện thoại này chặn kết bạn.");
      var data = {
        status: "error",
        phone: phone,
        message: "Lỗi, Số điện thoại này chặn kết bạn.",
      };
    }else{
      console.log("Số điện thoại này đã là bạn bè.");
      var data = {
        status: "ok",
        phone: phone,
        message: "Số điện thoại này đã là bạn bè.",
      };
    }
    
  }


  

  chrome.runtime.sendMessage({ task: "TRANGTHAI_SEND_MESSAGE", data: data });

  const addButton = document.querySelector('[data-id="btn_Main_AddFrd"]');
  if (addButton) {
    addButton.click();
  }
}
}

function findKetBan(message, phone) {

if(message !== ""){
  const richInput = document.querySelector('[data-translate-placeholder="STR_PROFILE_ENTER_GREETING"]');

  if (richInput) {
      console.log("richInput kết bạn:", richInput);
      richInput.value = message;  // Set the value of the textarea
    
      // Optionally, you can clear the placeholder and make it contentEditable if needed
      richInput.placeholder = "";
      richInput.contentEditable = "true";
      richInput.classList.remove("empty");
  
      // Dispatch the input event to simulate the user typing
      const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
      });
      richInput.dispatchEvent(inputEvent);
  } else {
      console.log("richInput not found");
  }
} 
var type = "KHACH_HANG";

const sendButton = document.querySelector('[data-translate-inner="STR_PROFILE_ADD_FRIEND"]');
console.log("GỞI KẾT BẠN  button", sendButton);
if (sendButton) {
  var username = document.querySelector(".pi-mini-info-section__name").textContent;

  console.log("Thông tin kết bạn, ", username);


    var data = {
      status: "ok",
      phone: phone,
      type,
      message: `Đã gửi kết bạn đến: ${username}`,
    };

    chrome.runtime.sendMessage({ task: "TRANGTHAI_SEND_MESSAGE", data: data });

    sendButton.click();
 


}else{
  console.log("not found GỞI KẾT BẠN button")
}
}


//Hàm tìm phần tử "richInput" và nhập ô tin nhắn
function findChatMessage(message, phone, type, item) {
  const richInput = document.getElementById("richInput");
  richInput.placeholder = "";
  richInput.contentEditable = "true";
  richInput.classList.remove("empty");

  chrome.storage.local.get(['IS_PHAT_CODE'], (result) => {
      const isphatcode = result.IS_PHAT_CODE;
      const finalMessage = isphatcode === 1 ? item[1] : message;

      richInput.textContent = "";
      richInput.innerHTML = splitInputLines(finalMessage);
      richInput.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));

      const sendButton = document.querySelector('[data-translate-title="STR_SEND"]');
      if (sendButton) {
          const username = document.querySelector(".header-title").textContent;
          chrome.runtime.sendMessage({ 
              task: "TRANGTHAI_SEND_MESSAGE", 
              data: { 
                  status: "ok", 
                  phone, 
                  type, 
                  message: `Đã gửi tin nhắn đến: ${username}` 
              } 
          });
          sendButton.click();
      }
  });
}
function splitInputLines(inputString) {
const lines = inputString.split("\n");
let outputHTML = "";
lines.forEach((line, idx) => {
  outputHTML += `<div id="input_line_${idx}"><span class="" data-mention="${line}" id="input_part_${idx}" style="white-space: pre-wrap;">${line}</span></div>`;
});
return outputHTML;
}


function waitAndExecute(callback, timeout) {
setTimeout(callback, timeout);
}

//Hàm click nút "Nhắn Tin" sau khi đã tìm thấy số
function clickStartChat(phone, message, isCheck, item) {
  const startChatButton = document.querySelector('[data-translate-inner="STR_CHAT"]');
  
  if (startChatButton) {
      if (isCheck) {
          const username = document.querySelector(".pi-mini-info-section__name").textContent;
          chrome.runtime.sendMessage({ 
              task: "TRANGTHAI_SEND_MESSAGE", 
              data: { status: "ok", phone: { phone, username }, message: "OK" } 
          });
          
          const addButton = document.querySelector('[data-id="btn_Main_AddFrd"]');
          addButton?.click();
          return;
      }

      startChatButton.click();
      setTimeout(() => chrome.runtime.sendMessage({ task: "OPEN_CHAT_SUCCESS" }), 1000);
      setTimeout(() => findChatMessage(message, phone, "KHACH_HANG", item), 2000);
  } else {
      chrome.runtime.sendMessage({ 
          task: "TRANGTHAI_SEND_MESSAGE", 
          data: { 
              status: "error", 
              phone, 
              message: "Số điện thoại này chưa đăng ký tài khoản hoặc không cho phép tìm kiếm." 
          } 
      });
      
      const addButton = document.querySelector('[data-id="btn_Main_AddFrd"]');
      addButton?.click();
  }
}

function typeText(element, text, delay = 100) {
return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            // Append each character one by one
            element.value += text[i];

            // Trigger 'input' event after each character is typed
            const event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            element.dispatchEvent(event);

            i++;
        } else {
            clearInterval(interval);
            resolve(); // Resolve the promise when typing is done
        }
    }, delay);
});
}

async function setPhoneCountryCode(countryCode) {
return new Promise((resolve, reject) => {
  const phoneInputContainer = document.querySelector('.z-input-phone.findFriend__input.phone-input');
  
  if (!phoneInputContainer) {
    console.error('Phone input container not found');
    reject('Phone input container not found');
    return;
  }

  const countryPicker = phoneInputContainer.querySelector('.phone-iso-picker');
  if (!countryPicker) {
    console.error('Country picker not found');
    reject('Country picker not found');
    return;
  }
  countryPicker.click();

  setTimeout(async () => {
    const countryList = document.querySelector('.country-picker__list');
    if (!countryList) {
      console.error('Country list not found');
      reject('Country list not found');
      return;
    }

    const inputSearch = document.querySelector('[data-translate-placeholder="STR_SEARCH_COUNTRY"]');
    await typeText(inputSearch, countryCode, 50);

    const countryItem = Array.from(countryList.querySelectorAll('.country-picker__list__item')).find(
      item => item.querySelector('.country-picker__list__item__code').textContent === countryCode
    );

    if (!countryItem) {
      console.error(`Country with code ${countryCode} not found`);
      reject(`Country with code ${countryCode} not found`);
      return;
    }

    countryItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
      countryItem.click();
      console.log(`Country code set to ${countryCode}`);
      resolve(); // Resolve the promise when the country code is set
    }, 500);

  }, 500);
});
}

function getCountryCode(callback) {
// Default country code
var defaultCountryCode = "+86";

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

//Hàm điền số điện thoại vào modal 
function fillPhoneContact(phone, message, isCheck, isKetBan, item) {
  getCountryCode(async (countryCode) => {
      await setPhoneCountryCode(countryCode);
      const txtPhoneText = document.querySelector('[data-id="txt_Main_AddFrd_Phone"]');
      
      if (txtPhoneText) {
          txtPhoneText.removeAttribute("readonly");
          txtPhoneText.removeAttribute("disabled");
          txtPhoneText.value = phone;
          txtPhoneText.dispatchEvent(new Event("change", { bubbles: true }));
          
          clickSearchButton(phone, message, isCheck, isKetBan, item);
      } else {
          console.error("Không tìm thấy chỗ điền");
      }
  });
}


// Function to handle hover event
function handleHover(event) {
const element = event.target;

// Check if the hovered element is not the body itself
if (element !== document.body) {
  // Add/remove border and background color
  if (event.type === 'mouseover') {
    element.style.border = '1px solid #9254de';
    element.style.borderRadius = '8px';
    // element.style.padding = '4px';
   element.style.backgroundColor = '#efdbff';

    // Get XPath of the hovered element
    const xpath = getElementXPath(element);

    // Create and show tooltip
   showTooltip(element, xpath);
  } else {
    element.style.border = '';
    element.style.borderRadius = '0px';
    // element.style.padding = '0px';
    element.style.backgroundColor = '';

    // Hide tooltip
   hideTooltip();
  }
}
}

// Function to handle click event
function handleClick(event) {
const element = event.target;

// Check if the clicked element is not the body itself
if (element !== document.body) {
  // Get XPath of the clicked element
  const xpath = getElementXPath(element);
 // alert(`Clicked XPath: ${xpath}`);

  // Remove all event listeners from the clicked element
  document.body.removeEventListener('mouseover', handleHover);
  document.body.removeEventListener('mouseout', handleHover);
  document.body.removeEventListener('click', handleClick, true);

  chrome.runtime.sendMessage({task: "CHON_XONG_NOIDUNG", data: xpath})
}
}
function getElementFromXPath(xpath) {
const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
return result.singleNodeValue;
}
// Function to get XPath of an element
function getElementXPath(element) {
if (element.id !== '') {
  return `//*[@id="${element.id}"]`;
}

if (element === document.body) {
  return '/html/' + element.tagName.toLowerCase();
}

let ix = 0;
const siblings = element.parentNode.childNodes;
for (let i = 0; i < siblings.length; i++) {
  const sibling = siblings[i];
  if (sibling === element) {
    return `${getElementXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${(ix + 1)}]`;
  }
  if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
    ix++;
  }
}
}

// Function to create and show tooltip
function showTooltip(element, text) {
const tooltip = document.createElement('div');
tooltip.className = 'mytooltip';
tooltip.textContent = text;
document.body.appendChild(tooltip);

const rect = element.getBoundingClientRect();
const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
const scrollY = window.pageYOffset || document.documentElement.scrollTop;

tooltip.style.left = rect.left + scrollX + 'px';
tooltip.style.top = rect.top + scrollY + 'px';
}
// Function to hide tooltip
function hideTooltip() {
const tooltip = document.querySelector('.mytooltip');
if (tooltip) {
  tooltip.remove();
}
}

function waitForElement(selector) {
return new Promise((resolve, reject) => {
  // Check if the element already exists
  const element = document.querySelector(selector);
  if (element) {
    return resolve(element);
  }
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const nodes = Array.from(mutation.addedNodes);
      for (const node of nodes) {
        if (node.nodeType === 1 && node.matches(selector)) {
          observer.disconnect();
          return resolve(node);
        }
      }
    });
  });

  // Start observing the document for changes
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Set a timeout to reject the promise if the element is not found within a certain time
  setTimeout(() => {
    observer.disconnect();
    reject(new Error(`Element with selector "${selector}" not found within the time limit.`));
  }, 30000); // Adjust the timeout as needed
});
}

function findAndClickElementInModal(attribute, value) {
// Select the container with class 'zl-modal__container'
const container = document.querySelector('.zl-modal__container');

if (container) {
  // Create the selector for the target element within the container
  const selector = `[${attribute}="${value}"]`;
  const element = container.querySelector(selector);

  if (element) {
    element.click();
  } else {
    console.log(`Element with ${attribute}="${value}" not found within .zl-modal__container.`);
  }
} else {
  console.log(`Container with class 'zl-modal__container' not found.`);
}
}
function findAndClickElement(attribute, value) {
const selector = `[${attribute}="${value}"]`;
const element = document.querySelector(selector);

if (element) {
  element.click();
} else {
  console.log(`Element with ${attribute}="${value}" not found.`);
}
}
let shouldStop = false;
function stopSharing() {
shouldStop = true;
findAndClickElement('data-translate-inner', 'STR_CANCEL');


}
function findAndClickItemsInPopover(values) {
// Select the container with class 'popover-v3'
const container = document.querySelector('.popover-v3');

if (container) {
  values.forEach(value => {
    // Create the selector for the target element within the container
    const element = Array.from(container.querySelectorAll('.zmenu-item .truncate'))
                         .find(el => el.textContent.trim() === value);

    if (element) {
      // Click the parent element of the matched item
      element.closest('.zmenu-item').click();
    } else {
      console.log(`Element with text "${value}" not found within .popover-v3.`);
    }
  });
  container.style.display = 'none';
} else {
  console.log(`Container with class 'popover-v3' not found.`);
}
}
function findRichInput() {
const modalBodies = document.querySelectorAll('#zl-modal__dialog-body');
let richInput = null;

for (const modalBody of modalBodies) {
    const foundInput = modalBody.querySelector('#richInput');
    if (foundInput) {
        richInput = foundInput;
        break;
    }
}
return richInput;
}

async function clickSiblingWithAttribute(xpath, start, to, tags, message) {
if (shouldStop) return;
const targetElement = document.evaluate(
  xpath,
  document,
  null,
  XPathResult.FIRST_ORDERED_NODE_TYPE,
  null
).singleNodeValue;

if (!targetElement) {
  console.log('Target element not found.');
  return;
}

console.log(targetElement.textContent);

// Create a mouseover event
const mouseOverEvent = new MouseEvent('mouseover', {
  view: window,
  bubbles: true,
  cancelable: true
});

// Dispatch the mouseover event on the target element
targetElement.dispatchEvent(mouseOverEvent);

await new Promise((resolve) => setTimeout(resolve, 1500)); // wait for the mouseover effect

const messageViewContainer = document.getElementById('messageViewContainer');
const siblings = messageViewContainer.querySelectorAll('[data-translate-title="STR_FORWARD_MSG"]');

if (siblings.length > 0) {
  siblings.forEach(sibling => sibling.click());

  await new Promise((resolve) => setTimeout(resolve, 500)); // wait after clicking siblings

  const richInput = findRichInput();

  if (richInput) {
    richInput.placeholder = "";
    richInput.contentEditable = "true";
    richInput.classList.remove("empty");
    richInput.textContent = "";
    var dataText = splitInputLines(message);      
    richInput.innerHTML = dataText;
  
    const inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    richInput.dispatchEvent(inputEvent);

  } else {
      console.log('Rich input not found in any modal body');
  }

  if(tags && tags.length > 0){
    await findAndClickElementInModal('data-translate-inner', 'STR_LABEL_CLASS_2');
  await new Promise((resolve) => setTimeout(resolve, 500));
    await findAndClickItemsInPopover(tags);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await findAndClickElement('data-translate-inner', 'STR_CONTACT_FRIENDS');

  await new Promise((resolve) => setTimeout(resolve, 500)); // wait after clicking 'STR_CONTACT_FRIENDS'

  const rootDiv = await waitForElement('div[data-id="div_SpamMsg_Thread"]');
  const container = rootDiv.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
  const virtualizedScroll = rootDiv.querySelector('.ReactVirtualized__Grid');
  let checkboxes = [];
  let checkedIndex = -1;
  let checkedCount = 0;
  const maxCheckedItems = to; // Maximum number of items to check
  const stepSize = 1; // Number of items to check in each step
  const itemHeight = 48; // Height of each item in the list
  const groupHeaderHeight = 29; // Height of group headers

  function handleCheckboxClick(checkbox) {
    const parentItem = checkbox.closest('.share-msg__conv-item');
    parentItem.click(); // Trigger click event on the parent item
  }

  function updateCheckboxes() {
    const newCheckboxes = Array.from(container.querySelectorAll('.share-msg__conv-item__check-box'));
    let newItemsAdded = false;
    
    newCheckboxes.forEach((checkbox) => {
      if (!checkboxes.includes(checkbox)) {
        checkboxes.push(checkbox);
        newItemsAdded = true;
      }
    });
    
    return newItemsAdded;
  }
  

  function scrollStepByStep(targetScrollTop) {
    return new Promise((resolve) => {
      const scrollInterval = setInterval(() => {
        const distance = targetScrollTop - virtualizedScroll.scrollTop;
        const step = Math.sign(distance) * Math.min(Math.abs(distance), itemHeight / 2); // Increased step size
        virtualizedScroll.scrollTop += step;

        if (Math.abs(virtualizedScroll.scrollTop - targetScrollTop) <= Math.abs(step)) {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 2); // Faster interval delay (adjusted to 2 milliseconds)
    });
  }

  function calculateStartingIndex(start) {
    const groupHeaders = Array.from(container.querySelectorAll('.share-msg__char-item'));
    let startingIndex = 0;
    let currentPosition = 0;

    for (let i = 0; i < groupHeaders.length; i++) {
      const headerPosition = parseInt(groupHeaders[i].style.top.replace('px', ''), 10);
      const nextHeaderPosition = i === groupHeaders.length - 1 ? Infinity : parseInt(groupHeaders[i + 1].style.top.replace('px', ''), 10);

      if (headerPosition <= start * itemHeight && nextHeaderPosition > start * itemHeight) {
        startingIndex = Math.floor((start * itemHeight - headerPosition) / itemHeight);
        currentPosition = headerPosition + groupHeaderHeight;
        break;
      }
    }

    return { startingIndex: startingIndex + start, currentPosition };
  }

  async function startChecking(start) {
    const { startingIndex, currentPosition } = calculateStartingIndex(start);
    checkedIndex = startingIndex - 1;
    virtualizedScroll.scrollTop = currentPosition;

    while (checkedCount < maxCheckedItems) {
      if (shouldStop) return;
      updateCheckboxes();

      while (checkedIndex + stepSize >= checkboxes.length) {
        if (shouldStop) return;
        await scrollStepByStep(virtualizedScroll.scrollTop + itemHeight * stepSize);
        await new Promise(resolve => setTimeout(() => {
          updateCheckboxes();
          resolve();
        }, 5)); // Reduced delay to 5 milliseconds
      }

      for (let i = 0; i < stepSize; i++) {
        if (shouldStop) return;
        checkedIndex++;
        if (checkedIndex < checkboxes.length && checkedCount < maxCheckedItems) {
          const checkbox = checkboxes[checkedIndex];
          handleCheckboxClick(checkbox);
          checkedCount++;
        } else {
          break;
        }
      }
    }

        // findAndClickElement('data-translate-inner', 'STR_CANCEL'); // kích hoạt nút share
     findAndClickElement('data-translate-inner', 'STR_FORWARD');

    await new Promise((resolve) => setTimeout(resolve, 3000)); // wait after checking items
  }



  virtualizedScroll.addEventListener('scroll', () => {
    setTimeout(updateCheckboxes, 50); // Shorter delay for updating checkboxes
  });

  await startChecking(start);
} else {
  console.log('Sibling with the specified attribute not found.');
}
}
function splitIntoParts(total, partSize) {
const result = [];
let current = 0;

// Iterate until just before the total to add parts of the specified size
while (current + partSize <= total) {
  result.push(current);
  current += partSize;
}

// Add the remaining part if there's any
if (current < total) {
  result.push(current);
}
result.push(total);

return result;
}
async function startShare(data, tags, message) {
shouldStop = false;
const lastUid = localStorage.getItem('sh_zlast_uid');
const request = indexedDB.open(`zdb_${lastUid}`);

request.onsuccess = async (event) => {
  const db = event.target.result;
  const transaction = db.transaction(['friend'], 'readonly');
  const objectStore = transaction.objectStore('friend');

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = async (event) => {
    const allEntries = event.target.result;
    const allFriends = allEntries.length;
    const parts = splitIntoParts(allFriends, 100);

    for (let index = 0; index < parts.length; index++) {
      if (shouldStop) return;
      const part = parts[index];
      const start = part;

      let to = 0;
      if (index < parts.length - 1) {
        const nextPart = parts[index + 1];
        to = nextPart - start;
      }

      if (index < parts.length - 1) {
        for (const [index, item] of data.entries()) {
          if (shouldStop) return;
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1; // Months are zero-based
          const day = currentDate.getDate();
          const hours = currentDate.getHours();
          const minutes = currentDate.getMinutes();
          const seconds = currentDate.getSeconds();
          const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

          console.log(`ĐANG SHARE: ${dateTimeString} ===>`, `${start}: ${to}`);
          await clickSiblingWithAttribute(item.content, start, to, tags, message);
          console.log(`FINISHED SHARE: ${dateTimeString} ===>`, `${start}: ${to}`);
          var totalShared = start + to;
          chrome.runtime.sendMessage({task: "TRANGTHAI_SHARE", message: `Trạng thái: Đã share thành công (${totalShared}/${allFriends}), bạn ơi.`})

          await sleep(300);
        }
      }
    }

    console.log('TOTAL FRIEND', allFriends);
  };

  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};
}

function getUserInfo() {  
const navTab = document.querySelector('.nav__tabs__zalo.web');
const name = navTab.getAttribute('title');
const imgElement = navTab.querySelector('.zavatar img');
const avatarUrl = imgElement.getAttribute('src');

return {
    name: name,
    avatarUrl: avatarUrl
};
}
function closeModal() {
  const modal = document.getElementById('zl-modal__dialog-body');
  if (modal) {
      const modalContainer = modal.parentElement.parentElement.parentElement;
      if (modalContainer) {
          modalContainer.remove();
      }
  }

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if(request.task === "GET_USER_INFO"){
  var userinfo = getUserInfo();
  console.log("USER INFO", userinfo)
  chrome.runtime.sendMessage({task: "USER_INFO", data: userinfo})
   
}

if (request.task === "clickAddContact") {
  clickAddContact(request.phone, request.message, request.isCheck, request.isKetBan, request.item);
}   

if(request.task === "clickInputFriend"){
  clickInputFriend(request.name, request.message, request.uid);
}   

if(request.task === "XOA_CACHE"){
  indexedDB.databases().then(databases => {
    databases.forEach(db => {        
      indexedDB.deleteDatabase(db.name);
    });

    location.reload();
  }).catch(error => {
    console.error('Error listing databases:', error);
  });
}

if(request.task === "LOGOUT"){
}

if(request.task === "STOP_SHARE"){
  stopSharing();
}

if(request.task === "START_SHARE"){
  var jsonContent = request.data;
  var tags = request.tags;
  var message = request.message;
  closeModal();
   startShare(jsonContent, tags, message)
}

if(request.task === "HUY_CONTENT_SHARE"){
  // Add event listeners to the body element
  document.body.removeEventListener('mouseover', handleHover);
  document.body.removeEventListener('mouseout', handleHover);
  document.body.removeEventListener('click', handleClick, true);
}

if(request.task === "CHOICE_CONTENT_SHARE"){
  // Add event listeners to the body element
  document.body.addEventListener('mouseover', handleHover);
  document.body.addEventListener('mouseout', handleHover);
  document.body.addEventListener('click', handleClick, true);
}

if(request.task === "REQUEST_SHOW_MODAL"){
  var isShowModal = request.isShowModal;    
  console.log("REQUEST_SHOW_MODAL", isShowModal);
  setModalDisplay(!isShowModal)
}

if(request.task === "EXPORT_ALL_VCARD"){
  chrome.storage.local.get(['sh_zlast_uid'], function (result) {
    const lastUid = localStorage.getItem('sh_zlast_uid');
    console.log('Last UID:', lastUid);

    getExportListFriendsVCARD(lastUid)
  });
}
if(request.task === "EXPORT_ALL_FRIENDS"){
  chrome.storage.local.get(['sh_zlast_uid'], function (result) {
    const lastUid = localStorage.getItem('sh_zlast_uid');
    console.log('Last UID:', lastUid);

    getExportListFriends(lastUid)
  });
}
if(request.task === "GET_ALL_FRIENDS"){
  chrome.storage.local.get(['sh_zlast_uid'], function (result) {
    const lastUid = localStorage.getItem('sh_zlast_uid');
    var option = request.option;
    console.log('Last UID:', lastUid);
    console.log('data-option:', option);

    getListFriends(lastUid, option)

    
  });
}
if(request.task === "GET_ALL_TAG"){
  chrome.storage.local.get(['sh_zlast_uid'], function (result) {
    const lastUid = localStorage.getItem('sh_zlast_uid');   
  
    getAllTags(lastUid)
  });
}
});
async function deleteAllCookies() {
const menuSetting = document.querySelector('[data-translate-title="STR_MENU_SETTING"]')
  if(menuSetting){
    menuSetting.click()
    await sleep(300)
    const logoutButtonMenu = document.querySelector('[data-translate-inner="STR_MENU_LOGOUT"]');

    if(logoutButtonMenu){
      logoutButtonMenu.click()
      await sleep(300)
      const logoutButton = document.querySelector('[data-id="btn_Logout_Logout"]');
      if(logoutButton){
        logoutButton.click()
      }else{
        console.log("không tìm thấy nút nhấn logout")
      }
    }else{
      console.log("không tìm thấy menu logout")
    }
  }else{
    console.log("không tìm thấy menu settings")
  }
}
function getCountListFriend(uid){
const request = indexedDB.open(`zdb_${uid}`);

request.onsuccess = (event) => {
  const db = event.target.result;     
  const transaction = db.transaction(['friend'], 'readonly');
  const objectStore = transaction.objectStore('friend');

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    const allEntries = event.target.result;
    return allEntries.length;
  };

  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};

request.onerror = (event) => {
  console.error('Error opening database:', event);
};

}

function getExportListFriendsVCARD(uid){
const request = indexedDB.open(`zdb_${uid}`);

request.onsuccess = (event) => {
  const db = event.target.result;     
  const transaction = db.transaction(['friend'], 'readonly');
  const objectStore = transaction.objectStore('friend');

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    const allEntries = event.target.result;
    console.log('All Entries:', allEntries); 
    chrome.runtime.sendMessage({task: "DATA_LIST_FRIEND_VCARD_EXPORT", friends: allEntries})
   
    // allEntries.forEach(entry => {
    //   console.log(entry);
    // });
  };

  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};

request.onerror = (event) => {
  console.error('Error opening database:', event);
};



}

function getExportListFriends(uid){
const request = indexedDB.open(`zdb_${uid}`);

request.onsuccess = (event) => {
  const db = event.target.result;     
  let transaction = db.transaction(['friend'], 'readonly');
  let objectStore = transaction.objectStore('friend');

  let getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    const allEntries = event.target.result;
   // console.log('All Entries:', allEntries); 
    transaction = db.transaction(['label'], 'readonly');
    objectStore = transaction.objectStore('label');
 
    getAllRequest = objectStore.getAll();
    getAllRequest.onsuccess = (event) => { 
      let   all_label = event.target.result;
      const globalIdToUserIdMap = {};
      allEntries.forEach(friend => {
        globalIdToUserIdMap[friend.userId] = friend.userId;
      });
      // Thêm trường 'label' vào từng friend
      allEntries.forEach(friend => {
        all_label.forEach(label => {
          if (label.conversations.some(conversation => globalIdToUserIdMap[conversation] === friend.userId)) {
            friend.tag = label.text;  
          }
        });
      });
      console.log("Mapping", allEntries);
      chrome.runtime.sendMessage({task: "DATA_LIST_FRIEND_RECEIVED_EXPORT", friends: allEntries})
    }
  };

  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};

request.onerror = (event) => {
  console.error('Error opening database:', event);
};

}

function getAllNhom2(uid){
const request = indexedDB.open(`zdb_${uid}`);
request.onsuccess = (event) => {
  const db = event.target.result;     
  let transaction = db.transaction(['friend'], 'readonly');
  let objectStore = transaction.objectStore('friend');

  let getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    var allEntries = event.target.result;    
    allEntries = allEntries.filter(friend => !(friend.isValid === 0 || friend.isBlocked === 1 || friend.accountStatus !== 0 ));
    transaction = db.transaction(['label'], 'readonly');
    objectStore = transaction.objectStore('label');
 
    let getAllRequest2 = objectStore.getAll();
    getAllRequest2.onsuccess = (event) => { 
      let   all_label = event.target.result;
  
      const globalIdToUserIdMap = {};
      allEntries.forEach(friend => {
        globalIdToUserIdMap[friend.userId] = friend.userId;
      });
      allEntries.forEach(friend => {
        friend.tag = "Không có nhãn"; 
      });
      
      all_label.forEach(label => {
        allEntries.forEach(friend => {
          if (label.conversations.some(conversation => globalIdToUserIdMap[conversation] === friend.userId)) {
            friend.tag = label.text;
          }
          // No else block
        });
      });
      transaction = db.transaction(['group'], 'readonly');
      objectStore = transaction.objectStore('group');   
      getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event) => {
        const allgroup = event.target.result;
        allgroup.forEach(itemGroup => {
          itemGroup.tag = "NHÓM VÀ CỘNG ĐỒNG";
        });

        allgroup.forEach(itemGroup => {              
            allEntries.push(itemGroup);               
        });           

        chrome.runtime.sendMessage({task: "DATA_LIST_FRIEND_RECEIVED", friends: allEntries})

      }
    }
  };
  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};

request.onerror = (event) => {
  console.error('Error opening database:', event);
};


}

function getAllTags(uid){
const request = indexedDB.open(`zdb_${uid}`);
request.onsuccess = (event) => {
  const db = event.target.result;     
  let transaction = db.transaction(['friend'], 'readonly');
  let objectStore = transaction.objectStore('friend');

  let getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    var allEntries = event.target.result;    
    allEntries = allEntries.filter(friend => !(friend.isValid === 0 || friend.isBlocked === 1 || friend.accountStatus !== 0 ));
    transaction = db.transaction(['label'], 'readonly');
    objectStore = transaction.objectStore('label');
 
    let getAllRequest2 = objectStore.getAll();
    getAllRequest2.onsuccess = (event) => { 
      let   all_label = event.target.result;
      
      const globalIdToUserIdMap = {};
      allEntries.forEach(friend => {
        globalIdToUserIdMap[friend.userId] = friend.userId;
      });
      allEntries.forEach(friend => {
        friend.tag = "Không có nhãn"; 
      });
      
      all_label.forEach(label => {
        allEntries.forEach(friend => {
          if (label.conversations.some(conversation => globalIdToUserIdMap[conversation] === friend.userId)) {
            friend.tag = label.text;
          }
          // No else block
        });
      });
      chrome.runtime.sendMessage({task: "DATA_LIST_TAGS", friends: allEntries})
    }
  };
  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};
request.onerror = (event) => {
  console.error('Error opening database:', event);
};
}

function getAllNhom1(uid){
const request = indexedDB.open(`zdb_${uid}`);
request.onsuccess = (event) => {
  const db = event.target.result;     
  let transaction = db.transaction(['friend'], 'readonly');
  let objectStore = transaction.objectStore('friend');

  let getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    var allEntries = event.target.result;    
    allEntries = allEntries.filter(friend => !(friend.isValid === 0 || friend.isBlocked === 1 || friend.accountStatus !== 0 ));
    transaction = db.transaction(['label'], 'readonly');
    objectStore = transaction.objectStore('label');
 
    let getAllRequest2 = objectStore.getAll();
    getAllRequest2.onsuccess = (event) => { 
      let   all_label = event.target.result;
      
      const globalIdToUserIdMap = {};
      allEntries.forEach(friend => {
        globalIdToUserIdMap[friend.userId] = friend.userId;
      });
      allEntries.forEach(friend => {
        friend.tag = "Không có nhãn"; 
      });
      
      all_label.forEach(label => {
        allEntries.forEach(friend => {
          if (label.conversations.some(conversation => globalIdToUserIdMap[conversation] === friend.userId)) {
            friend.tag = label.text;
          }
          // No else block
        });
      });
      chrome.runtime.sendMessage({task: "DATA_LIST_FRIEND_RECEIVED", friends: allEntries})
   
    }


  };

  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};

request.onerror = (event) => {
  console.error('Error opening database:', event);
};


}

function getAllNhom3(uid){
const request = indexedDB.open(`zdb_${uid}`);
request.onsuccess = (event) => {
  const db = event.target.result;     
  let transaction = db.transaction(['friend'], 'readonly');
  let objectStore = transaction.objectStore('friend');

  let getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    var allEntries = event.target.result;    
    allEntries = allEntries.filter(friend => !(friend.isValid === 0 || friend.isBlocked === 1 || friend.accountStatus !== 0 ));
    transaction = db.transaction(['label'], 'readonly');
    objectStore = transaction.objectStore('label');
 
    let getAllRequest2 = objectStore.getAll();
    getAllRequest2.onsuccess = (event) => { 
      let   all_label = event.target.result;
  
      const globalIdToUserIdMap = {};
      allEntries.forEach(friend => {
        globalIdToUserIdMap[friend.userId] = friend.userId;
      });
      allEntries.forEach(friend => {
        friend.tag = "Không có nhãn"; 
      });
      
      all_label.forEach(label => {
        allEntries.forEach(friend => {
          if (label.conversations.some(conversation => globalIdToUserIdMap[conversation] === friend.userId)) {
            friend.tag = label.text;
          }
          // No else block
        });
      });
      allEntries.length = 0;
      transaction = db.transaction(['group'], 'readonly');
      objectStore = transaction.objectStore('group');   
      getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event) => {
        const allgroup = event.target.result;
        allgroup.forEach(itemGroup => {
          itemGroup.tag = "NHÓM VÀ CỘNG ĐỒNG";
        });

        allgroup.forEach(itemGroup => {              
            allEntries.push(itemGroup);               
        });           

        chrome.runtime.sendMessage({task: "DATA_LIST_FRIEND_RECEIVED", friends: allEntries})

      }
    }


  };

  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};

request.onerror = (event) => {
  console.error('Error opening database:', event);
};


}

function getAllNhom4(uid, option){
const request = indexedDB.open(`zdb_${uid}`);
request.onsuccess = (event) => {
  const db = event.target.result;     
  let transaction = db.transaction(['friend'], 'readonly');
  let objectStore = transaction.objectStore('friend');

  let getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = (event) => {
    var allEntries = event.target.result;    
    allEntries = allEntries.filter(friend => !(friend.isValid === 0 || friend.isBlocked === 1 || friend.accountStatus !== 0 ));
    transaction = db.transaction(['label'], 'readonly');
    objectStore = transaction.objectStore('label');
 
    let getAllRequest2 = objectStore.getAll();
    getAllRequest2.onsuccess = (event) => { 
      let   all_label = event.target.result;
  
      const globalIdToUserIdMap = {};
      allEntries.forEach(friend => {
        globalIdToUserIdMap[friend.userId] = friend.userId;
      });
      allEntries.forEach(friend => {
        friend.tag = "Không có nhãn"; 
      });
      
      all_label.forEach(label => {
        allEntries.forEach(friend => {
          if (label.conversations.some(conversation => globalIdToUserIdMap[conversation] === friend.userId)) {
            friend.tag = label.text;
          }
          // No else block
        });
      });
      allEntries.length = 0;
      transaction = db.transaction(['group'], 'readonly');
      objectStore = transaction.objectStore('group');   
      getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event) => {
        const allgroup = event.target.result;
        allgroup.forEach(itemGroup => {
          itemGroup.tag = "NHÓM VÀ CỘNG ĐỒNG";
        });

        allgroup.forEach(itemGroup => {    
          if(option == "1"){
              
            if (itemGroup.creatorId == uid) {
              allEntries.push(itemGroup);        
            }else{

              itemGroup.topMember.forEach(item => {
                if(item.id == uid){

                  if(item.isAdmin){
                    allEntries.push(itemGroup);    
                  }
                }
               
              })
            }   
          }else{
            if (itemGroup.creatorId == uid) {
              return;
            } else {
              let shouldAdd = true;
          
              itemGroup.topMember.forEach(item => {
                if (item.id == uid && item.isAdmin) {
                  shouldAdd = false;
                  return; // Equivalent to continue in forEach
                }
              });
          
              if (shouldAdd) {
                allEntries.push(itemGroup);
              }
            }
          }              
                 
        });           
        chrome.runtime.sendMessage({task: "DATA_LIST_FRIEND_RECEIVED", friends: allEntries})
      }
    }
  };
  getAllRequest.onerror = (event) => {
    console.error('Error reading all entries:', event);
  };
};

request.onerror = (event) => {
  console.error('Error opening database:', event);
};


}

function getListFriends(uid, option){
  if(option == "1"){
    getAllNhom1(uid);
  }else if(option == "2"){
    getAllNhom2(uid);
  }else if(option == "3"){
    getAllNhom3(uid);
  }else if(option == "4"){
    getAllNhom4(uid, "1");
  }else if(option == "5"){
    getAllNhom4(uid, "0");
  }
}


// Theme Dark mode

function getStyles() {
return `
  :root {
    --n2-sidebar-bg-color: #333;
    --n2-main-bg-color: #444;
    --n2-primary-color: #e4e6eb;
    --n2-neutral-color: #234;
    --primary-text: #e4e6eb;
    --NG60: #e4e6eb;
    --N300: #e4e6eb;
    --NG10: #333;
    --NG70: #e4e6eb;
    --WA100: #444;
    --n2-loading-bg-color: #333;
    --n2-sidebar-hover-bg-color: #444;
    --n2-hr-color: #222;
    --n2-white-opacity-bg-color: rgba(244, 244, 244, 0.4);
    --n2-359bed-opacity-color: rgba(53, 155, 237, 0.3);
    --n2-mention-color: #eff;
    --n2-mention-bg-color: rgba(0, 139, 139, 0.4);
    --n2-not-me-msg-background: #233;
    --n2-not-me-msg-box-shadow: #141e1e;
    --n2-me-msg-background: #277dbf;
    --n2-me-msg-box-shadow: #216aa1;
    --n2-sender-name-color: #9f8424;
    --n2-time-color: #bbb;
    --neutral-300: #e4e6eb;
    --neutral-400: #d5d8e0;
    --neutral-500: #9ba2b5;
    --black-base: var(--neutral-300);
    --black-600: var(--neutral-400);
    --neutral-base: #e4e6eb;
    --grey-base: #444;
    --grey-600: #2b2b2b;
    --item-wa-hover: #2b2b2b;
    --lst-item-hover: #2b2b2b;
    --lst-item-select: #2b2b2b;
    --text-primary: #e4e6eb;
    --layer-background-selected: #2b2b2b;
    --layer-background-hover: #2b2b2b;
    --layer-background-disabled: #444;
    --text-secondary: #c8bccb;
    --layer-background: #333;
    --layer-background-subtle: #444;
    --button-neutral-text: #e4e6eb;
    --button-neutral-normal: #234;
    --button-tertiary-neutral-focus-bg: #234;
    --button-neutral-hover: #111a22;
    --surface-background-subtle: #333;
    --blue-message: #444;
    --WA80: #333;
  }
  body,
  html {
    background-color: #444;
    color: #e4e6eb;
    text-shadow: 0 0 1px currentColor;
  }
  ::selection {
    background: #ff9100;
    color: #000;
  }
  #loading-page {
    background-color: var(--n2-loading-bg-color);
    color: var(--n2-primary-color);
  }
  aside {
    border-color: var(--n2-hr-color);
  }
  .btn,
  .subtitle {
    color: #fff;
  }
  #app #chatOnboard,
  #app #chatOnboard .chat-onboard,
  #app #chatOnboard .chat-onboard * {
    background-color: var(--n2-sidebar-bg-color);
    color: var(--n2-primary-color);
  }
  #chatViewContainer {
    color: var(--n2-primary-color);
  }
  .message-view__blur__overlay {
    background-color: #222;
  }
  #chatViewContainer #header,
  #chatViewContainer #header .title.header-title,
  #chatViewContainer #header .icon-only {
    background-color: #2b2b2b;
    color: var(--n2-primary-color);
  }
  #chatViewContainer #header .truncate {
    background-color: brown;
    padding: 0.2em 0.8em;
    border-radius: 3px;
    color: var(--n2-primary-color) !important;
  }
  .leftbar-tab {
    color: #e4e6eb;
  }
  #filter-tags-sb .filter-tag-item.--activated {
    color: #e4e6eb;
  }
  .main-title-container .lock-icon {
    background-color: rgba(0, 0, 0, 0);
  }
  .chat-message,
  .chat-message a {
    color: var(--n2-primary-color);
  }
  .card {
    border-radius: 0.3em;
  }
  .chat-message.highlighted .card:not(.card--group-photo) {
    background-color: var(--n2-not-me-msg-background);
    border: solid 2px #ff4500;
  }
  .me.chat-message.highlighted .card:not(.card--group-photo) {
    background-color: var(--n2-me-msg-background);
  }
  .chat-message .card-sender-name,
  .chat-message .card.card--text.show-sender > .card-sender-name {
    color: var(--n2-sender-name-color);
  }
  .card,
  .card[data-id="div_ReceivedMsg_Text"],
  .card[data-id="div_LastReceivedMsg_Text"],
  .card.card--oa > .oa-msg-child,
  .card.card--oa > .oa-msg-header,
  .img-msg-v2.-bg-v-1 .img-msg-v2__bub > .img-msg-v2__th,
  .img-msg-v2.-caption.-me > .img-msg-v2__bub,
  .card.card--text:not(.me) {
    background-color: var(--n2-not-me-msg-background);
    color: var(--n2-primary-color);
    box-shadow: 0 0 3px var(--n2-not-me-msg-box-shadow);
  }
  .card.me,
  .card.me[data-id="div_SentMsg_Text"],
  .card.me[data-id="div_LastSentMsg_Text"],
  .chat-message.me .img-msg-v2.-bg-v-1 .img-msg-v2__bub > .img-msg-v2__th,
  .chat-message.me .img-msg-v2.-caption.-me > .img-msg-v2__bub,
  .card.card--text.me {
    background-color: var(--n2-me-msg-background);
    box-shadow: 0 0 3px var(--n2-me-msg-box-shadow);
    color: var(--n2-primary-color);
  }
  .call-msg {
    border-style: none;
  }
  .card.card--sticker {
    background-color: rgba(0, 0, 0, 0);
    box-shadow: none;
  }
  .card-send-time {
    color: var(--neutral-500);
  }
  a.mention-name,
  .card.card--text .mention-name,
  .card.card--text a.mention-name {
    padding: 0em 0.2em;
    color: var(--n2-mention-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 600;
  }
  .card .rel.quote-banner {
    background-color: var(--n2-white-opacity-bg-color) !important;
  }
  .card .rel.quote-banner .quote-banner-content .quote-text {
    color: var(--n2-primary-color);
  }
  .card .message-reaction-container .reacts-list,
  .img-msg-v2 .reacts-list {
    background-color: var(--n2-sidebar-bg-color);
  }
  .card .message-reaction-container .msg-reaction-icon {
    background-color: var(--n2-sidebar-bg-color);
  }
  .card.card--text a,
  .card.card--link a {
    padding: 0.1em 0.5em;
    color: var(--n2-primary-color);
    text-decoration: underline;
  }
  .chat-input,
  .chat-input__content {
    background-color: var(--n2-hr-color);
    border-color: var(--n2-hr-color);
  }
  .chat-input.highlight,
  .chat-input__content.highlight {
    background-color: var(--n2-sidebar-bg-color);
    border-color: var(--n2-hr-color);
  }
  #ztoolbar.chat-input-v2,
  #ztoolbar.chat-input-v2 .z--btn.icon-only {
    background-color: #222;
    color: var(--n2-primary-color);
  }
  .chat-input-container {
    color: var(--n2-primary-color);
  }
  .doing-something {
    color: var(--n2-primary-color);
    background-color: var(--n2-hr-color);
  }
  .img-msg-v2.-caption:not(.-me) > .img-msg-v2__bub {
    background-color: var(--n2-not-me-msg-background);
  }
  .chat-date > span {
    background-color: rgba(0, 0, 0, 0);
    border: solid 1px #3a3939;
  }
  .chat-date .line {
    border-color: #3a3939;
  }
  .card-send-time {
    color: #d1d1d1;
  }
  .card--group-photo.-bg-v-1 .card--group-photo__row__item__img,
  .card--group-photo.-bg-v-1 .card--group-photo__row__item__img.undo {
    background-color: #2b2b2b;
  }
  .call-msg.--callee {
    background-color: #2b2b2b;
  }
  .chat-message .extra-btn {
    background-color: #2b2b2b;
    color: #e4e6eb;
  }
  .chat-message .extra-btn:hover {
    color: #e4e6eb;
  }
  .sticker-selector__menu__scrollbar,
  .sticker-selector__menu__scrollbar .emoji-icons.active,
  .sticker-selector__menu__scrollbar .emoji-icons,
  .sticker-selector__menu__scrollbar .sticker-recent,
  .sticker-selector__menu__scrollbar .sticker-recent-active,
  #gifSelector,
  #gifSelector .gif-content {
    background-color: #444 !important;
    color: #fff;
  }
  .ReactVirtualized__Grid__innerScrollContainer {
    background-color: #444 !important;
    color: #fff !important;
  }
  .card.card--undo > span {
    color: gray;
  }
  .chat-date {
    color: var(--n2-time-color);
  }
  .image-show__bottom__sender__info {
    color: var(--n2-primary-color);
  }
  .image-show__bottom__ctrl > .btn,
  .image-show__bottom__ctrl > a > .btn {
    color: var(--n2-primary-color);
  }
  .image-show__icon-fullscreen {
    color: var(--n2-primary-color);
  }
  .image-show__btn__inside {
    color: var(--n2-primary-color);
  }
  .timeline-slider__handle {
    background-color: var(--n2-primary-color);
  }
  .td-msg-v3 {
    background-color: var(--n2-sidebar-bg-color);
  }
  .card-send-time__sendTime.bubble-message-time {
    color: var(--n2-time-color);
  }
  .chat-content .bubble-message-status {
    color: var(--n2-time-color);
  }
  .card-send-time .card-send-time__sendTime {
    color: var(--n2-time-color);
  }
  #chatViewContainer .message-view__banner,
  #chatViewContainer .message-view__banner .message-view__banner__text,
  .chat-group-topic *,
  .group-poll-info .group-poll-info-msg-info,
  .group-poll-info .group-poll-info-more,
  .group-poll-info .group-poll-info-body,
  .group-poll-info .group-poll-info-body .group-poll-info-title {
    background-color: var(--n2-sidebar-bg-color) !important;
    color: var(--n2-primary-color) !important;
  }
  .group-poll-info-content-item {
    background-color: #565656;
  }
  .group-poll-info .group-poll-info-body .group-poll-info-content-item-progress,
  .group-poll-vote-content-item-progress {
    background-color: #008b8b;
  }
  #chatViewContainer .group-topic:before,
  #chatViewContainer .message-view__banner:before,
  #chatViewContainer .msgbannerbf {
    border-bottom: solid 1px var(--n2-main-bg-color);
  }
  #chatViewContainer .chat-group-topic__item.border-two-sided {
    border-color: var(--n2-main-bg-color);
  }
  #message-view__blur {
    display: none;
  }
  .message-view:after,
  .message-view:before {
    border-color: var(--n2-hr-color);
  }
  .message-view #ztoolbar.chat-input-v2 {
    background-color: var(--n2-main-bg-color);
  }
  .zl-dlg-paper,
  .zl-fl-dlg > .zl-fl-dlg__paper,
  .zl-modal__dialog,
  .tab-main.border-bottom,
  .zl-modal__dialog__header,
  .group-setting__disable-banner {
    background-color: var(--n2-sidebar-bg-color);
    border-color: #2b2b2b;
  }
  .zl-modal__dialog__header__title-text {
    color: #fff;
  }
  .event-message > div,
  .onboard-message > div {
    background-color: #303030;
  }
  .cloud__header {
    background-color: #444;
  }
  .snack-body {
    background-color: #222;
    border: solid 3px #999;
    box-shadow: none;
    color: #fff;
  }
  .z-tooltip {
    background-color: #444;
    color: #e4e6eb;
  }
  .friend-profile__detail__line {
    border-color: rgba(0, 0, 0, 0);
  }
  .friend-profile__footer__content {
    border-color: #201d1d;
  }
  .user-profile-footer-button:hover:not(.disabled-btn) {
    color: #e4e6eb;
    background-color: #2b2b2b;
  }
  .message-view__ecard_new_fr {
    background-color: #444;
  }
  .search-tool,
  .search-tool-list {
    background-color: #444;
    border-color: rgba(0, 0, 0, 0);
  }
  .media-dock-main {
    background-color: var(--n2-main-bg-color);
  }
  .media-dock-main .media-tabs__main {
    border-color: var(--n2-sidebar-bg-color);
  }
  .media-dock-main .media-tabs__main.active {
    background-color: var(--n2-sidebar-bg-color);
  }
  .group-board-item .gbi-question,
  .group-board-item .reminder-title,
  .view-notice-pinmsg-content .gbi-question,
  .view-notice-pinmsg-content .reminder-title,
  .view-notice-topic-content .gbi-question,
  .view-notice-topic-content .reminder-title {
    color: var(--n2-primary-color) !important;
  }
  .overlay__video__duration {
    color: var(--n2-primary-color);
  }
  .video-msg-container .outline-bubble .overlay__video .avatar-img {
    color: #fff !important;
  }
  .tipv2-content {
    color: var(--n2-primary-color);
  }
  .zavatar.zavatar-l .a-child,
  .zavatar.zavatar-xl .a-child {
    border-color: #333;
    background-color: #233;
  }
  .pi-info-layout__primary-info-container {
    background-color: var(--n2-sidebar-bg-color);
  }
  #sidebarNav,
  #sidebarNav #contact-search,
  #conversationListId,
  #conversationListId .msg-item .conv-item,
  .contact-list__add:hover {
    background-color: var(--n2-sidebar-bg-color);
    color: var(--n2-primary-color);
  }
  .share-msg__msg-content {
      background-color: #111919;
      padding: 8px 12px;
      margin: 12px 0;
      border-radius: 4px;
  }
  #conversationListId .msg-item .conv-item:hover {
    background-color: var(--n2-sidebar-hover-bg-color);
  }
  #conversationListId .msg-item .conv-item .conv-message.truncate .truncate {
    color: var(--n2-primary-color);
    filter: brightness(0.9);
    font-size: 95%;
  }
  .conv-item,
  .conv-item.selected,
  #conversationListId .msg-item .conv-item.selected,
  #contactList .conv-item.selected {
    background-color: var(--n2-main-bg-color);
  }
  .conv-item .conv-item-title .conv-item-title__name,
  #conversationListId .msg-item .conv-item-title .conv-item-title__name,
  #contactList .conv-item .conv-item-title .conv-item-title__name,
  .conv-item .conv-item-title__name,
  .conv-item .conv-item-title__name--bold {
    color: var(--n2-primary-color);
  }
  #contactList .item,
  #contactList .conv-item,
  #contactList .contact-list-item {
    background-color: rgba(0, 0, 0, 0);
  }
  .chat-box-member {
    color: #e4e6eb;
  }
  .chat-box-member__info.v2:hover {
    background-color: #303030;
  }
  #group-creator .create-group__item {
    background-color: rgba(0, 0, 0, 0);
  }
  #group-creator .create-group__item:hover:not(.i-disabled) {
    background-color: #303030;
  }
  .zl-modal__footer__button-action {
    background-color: #2b2b2b;
  }
  .zl-group-input .zl-input {
    background-color: #303030;
    color: #e4e6eb;
  }
  .zl-label {
    color: #e4e6eb;
  }
  .zl-group-input.zl-group-input__appearance--text:not(
      .zl-group-input__affix-wrapper
    )
    > .zl-input,
  .zl-group-input.zl-group-input__appearance--text
    > .zl-group-input__affix-wrapper__prefix-icon,
  .zl-group-input.zl-group-input__appearance--text
    > .zl-group-input__affix-wrapper__suffix-icon {
    padding: 0 1em;
  }
  .group-board-page > .gb-content,
  .group-board-item,
  .view-notice-pinmsg-content,
  .view-notice-topic-content,
  .group-board-item.v2 .item-title-v2,
  .v2.view-notice-pinmsg-content .item-title-v2,
  .v2.view-notice-topic-content .item-title-v2,
  .group-board-item.v2 .item-time-info,
  .v2.view-notice-pinmsg-content .item-time-info,
  .v2.view-notice-topic-content .item-time-info,
  .group-board-item .gbi-pmsg-content .pmsg-msg,
  .view-notice-pinmsg-content .gbi-pmsg-content .pmsg-msg,
  .view-notice-topic-content .gbi-pmsg-content .pmsg-msg,
  .group-board-page > .gb-tab-btn,
  .group-board-page > .gb-tabs,
  .group-board-page,
  .group-board-page .gb-tab,
  .mg-item,
  .zl-dropdown--preview,
  .z--btn--outline--tertiary,
  .sticker-selector#stickerSelector,
  .sticker-selector__content__name,
  .sticker-selector__content__selected,
  .sticker-selector__content .ReactVirtualized__Grid__innerScrollContainer .flx,
  #itemSuggestPopover:hover,
  .sticker-suggestion.chat-message.first-selected,
  .sticker-suggestion.chat-message.last-selected,
  .sticker-suggestion.selected,
  .sticker-suggestion:hover,
  .zmenu-body.content-only,
  .search-tool-list,
  .sticker-selector__content,
  .search-result-empty .search-empty-guide,
  .search-result-hint,
  .search-tool,
  .zl-group-input__search:not(.inherit-input) > .zl-input,
  .zl-compose > .rich-input,
  .zl-compose,
  .pr-action-item,
  .member-list-popup-preview,
  .chips,
  .chips-choice,
  .qrsc,
  .zl-group-input,
  .user-reacted-container,
  .user-reacted-container::before,
  .chat-message__actions,
  .chat-info-link__action,
  .cb-info-file-item__actions-container,
  .cb-info-file-item__actions-container > div {
    color: #e4e6eb;
    background: #444 !important;
    background-color: #444 !important;
  }
  .leftbar-unread.unread-red {
    color: #e4e6eb;
  }
  .conv-action__unread .conv-unread {
    color: #e4e6eb !important;
  }
  #contact-search .group-search {
    color: #e4e6eb;
  }
  #contact-search .group-search .fake-textholder {
    color: #e4e6eb;
  }
  #contact-search .group-search #contact-search-input {
    border: none;
    color: #e4e6eb;
    background: #201d1d !important;
    background-color: #201d1d !important;
  }
  .qrsc .qri {
    color: #e4e6eb;
    background: #2d2d2d !important;
    background-color: #2d2d2d !important;
  }
  .popover-v2,
  .popover-v3,
  .zmenu-body.content-only {
    border-color: #2b2b2b;
  }
  .z--btn--outline--tertiary {
    border-color: rgba(0, 0, 0, 0);
  }
  .file-actions-row__icon,
  .media-item.focusItem:not(.sel-mode) .show-on-hover,
  .media-item:hover:not(.sel-mode) .show-on-hover,
  .zmenu-item {
    color: #e4e6eb !important;
  }
  .search-title-container .search-subtitle,
  .search-title-container .search-title,
  .search-list-title,
  .search-msg-item .st-name,
  .search-msg-item .st-date,
  .search-msg-item .st-message,
  .z--btn--text--tertiary,
  .search-filter-txt,
  .sb-label__filter,
  .edit_alias-description,
  .lbl-conv-item,
  .cal-popup,
  .z-radio,
  .view-notice-topic-content-v2--group,
  .view-notice-topic-content-v2 .notice-time-section,
  .view-notice-topic-content-v2 .notice-time-section > .content > .line,
  .view-notice-topic-content-v2 .notice-time-section > .content > .line > .title,
  .file-message__content-container,
  .card-title,
  .lb-more-menu .more-pop-item,
  .lb-more-menu .more-pop-item > i,
  .cal-preview {
    color: #e4e6eb;
    background: rgba(0, 0, 0, 0) !important;
    background-color: rgba(0, 0, 0, 0) !important;
  }
  .zmenu-item:hover:not(.subtitle),
  .search-msg-item:hover,
  .sticker-zone-search.isHover,
  .sticker-zone:hover,
  #itemSuggestPopover .item-sticker:hover,
  .sticker-suggestion > .item-sticker.active,
  .sticker-suggestion > .item-sticker:hover,
  .lb-more-menu .more-pop-item:hover {
    background-color: #2b2b2b !important;
  }
  .dd-dropdown-ui:hover,
  .dd-options:hover:not(.prevent-hover) {
    background-color: #111;
  }
  .group-board-page > .gb-tab-btn,
  .group-board-page > .gb-tabs {
    border-color: #666;
  }
  .group-board-page .gb-tab.chat-message.first-selected,
  .group-board-page .gb-tab.chat-message.last-selected,
  .group-board-page .gb-tab.selected {
    border-width: 4px;
  }
  .group-board-item.v2 .item-calendar-preview,
  .v2.view-notice-pinmsg-content .item-calendar-preview,
  .v2.view-notice-topic-content .item-calendar-preview,
  .reminder-info-v2,
  .reminder-info-v2 > .content > .cal {
    background-color: #2b2b2b;
    border-color: #222;
  }
  .message-info > div {
    background-color: #2b2b2b;
  }
  .group-poll-info-content-item-progress,
  .group-poll-vote-content-item-progress {
    background-color: #369;
  }
  .media-dock-tabs {
    border-color: #444;
  }
  .search-msg-item .st-highlight,
  .edit_alias-description-name {
    color: #e4e6eb;
    font-weight: 900;
  }
  .conv-action {
    color: #b36600;
  }
  .conv-action:hover {
    color: #ff9100;
  }
  .cal-preview-v3 {
    color: #e4e6eb;
    background: #444 !important;
    background-color: #444 !important;
  }
  .cal-preview-v3:hover {
    color: #e4e6eb;
    background: #444 !important;
    background-color: #444 !important;
  }
  #calendar-v3,
  #calendar-v3 *,
  #calendar-v3 > .cal-content .cal-item {
    color: #e4e6eb;
    background: #444 !important;
    background-color: #444 !important;
  }
  .z--btn--fill--tertiary {
    background-color: #233;
    color: #e4e6eb;
    border: solid 1px #324b4b;
  }
  .z--btn--fill--tertiary:hover:not(.--disabled) {
    background-color: #324b4b;
    color: #e4e6eb;
    border-color: #233;
  }
  .group-board-item.v2,
  .v2.view-notice-pinmsg-content,
  .v2.view-notice-topic-content {
    border-color: #333;
  }
  .z--btn--chatbar--danger,
  .z--btn--chatbar--primary,
  .z--btn--chatbar--secondary,
  .z--btn--chatbar--secondary-red,
  .z--btn--chatbar--tertiary {
    color: #fff;
  }
  .chat-empty-friend-info,
  .chat-empty-card-friend {
    background-color: #444;
    color: #e4e6eb;
  }
  .btn-jump > div {
    color: #eff;
    border: solid 1px #359bed;
  }
  .chat-info {
    background-color: var(--n2-sidebar-bg-color);
  }
  .chat-info__header {
    background-color: #2b2b2b;
  }
  .chat-info__header .chat-info__header__title,
  .chat-info__header .chat-info__header__title .z--btn--text--tertiary {
    color: #fff;
  }
  aside .chat-info {
    color: #fff;
  }
  .chat-info .chat-info__header:before,
  .chat-info .chat-info-general__item:after {
    border-color: var(--n2-hr-color);
  }
  .chat-info .chat-info-general__item--title {
    color: #fff;
  }
  .chat-info .chat-info-general__section--border {
    border-color: var(--n2-sidebar-bg-color);
  }
  .chat-info .chat-info-link__title {
    color: #fff;
  }
  .chat-info .tab-bar-item {
    color: #fff;
  }
  .chat-info .cb-info-file-item__file-name,
  .chat-info .media-item-title {
    color: #fff;
  }
  .chat-info .chat-info-general__item:hover,
  .media-item.focusItem:not(.sel-mode),
  .media-item:hover:not(.sel-mode) {
    background-color: var(--n2-not-me-msg-box-shadow);
  }
  .media-empty-text,
  .chat-info-general__item--title--sub,
  .cb-info-file-item__file-size,
  .cb-info-file-item__suggest-preview-file,
  .cb-info-file-item__suggest-preview-folder,
  .tab-main .tab-item,
  .group-setting__title,
  .group-setting {
    color: #b9b2b2 !important;
  }
  .z--btn--text--tertiary:hover:not(.--disabled) {
    background-color: var(--n2-hr-color);
  }
  #group-creator .create-group__nav {
    background-color: #222;
  }
  .msg-filters-bar {
    border-top: solid 1px var(--n2-hr-color);
  }
  nav {
    border-right: solid 1px var(--n2-hr-color);
  }
  .zl-avatar {
    border-color: var(--n2-sidebar-bg-color);
    box-shadow: none;
  }
  .zl-avatar .zl-avatar__photo {
    background-color: var(--n2-sidebar-bg-color);
  }
  .chat-info-general__item--icon {
    color: var(--n2-primary-color);
  }
  main.friend-center-main {
    background-color: var(--n2-main-bg-color);
  }
  #chatViewContainer #chat-view,
  #messageViewScroll,
  #messageViewContainer {
    background-color: #222;
    color: var(--n2-primary-color);
  }
    #main-tab {
      width: 64px;
      flex: none;
      box-sizing: border-box;
      background: var(--layer-background-inverse);
      position: relative;
      margin-top: -24px;
  }
  .leftbar-tab.chat-message.first-selected, .leftbar-tab.chat-message.last-selected, .leftbar-tab.selected {
      background: #a52a2a;
  }

  .leftbar-tab:hover {
      background: #a52a2a;
  }
  .message-view__blur {
    background-color: #222;
  }
  .friend-center-main .rel > div {
    background-color: var(--n2-main-bg-color) !important;
    border-radius: 50%;
  }
  .friend-center-main .friend-center-item-v2,
  .friend-center-main .fr-center-top {
    background-color: #233 !important;
    color: #fff;
  }
  .friend-center-main .fr-center-top div {
    color: #fff !important;
  }
  .ReactVirtualized__Grid__innerScrollContainer {
    color: #fff;
  }
  .todo-view,
  .todo-tab,
  .todo-tab .td-tab.chat-message,
  .todo-tab .td-tab,
  .td-empty-container,
  .td-empty-container > .emp-txt,
  .todo-close-button,
  .todo-tab .td-sub-tab.chat-message,
  .todo-tab .td-sub-tab {
    background-color: #444;
    color: var(--n2-primary-color) !important;
  }
  .todo-view.selected,
  .todo-view.first-selected,
  .todo-view.last-selected,
  .todo-tab.selected,
  .todo-tab.first-selected,
  .todo-tab.last-selected,
  .todo-tab .td-tab.chat-message.selected,
  .todo-tab .td-tab.chat-message.first-selected,
  .todo-tab .td-tab.chat-message.last-selected,
  .todo-tab .td-tab.selected,
  .todo-tab .td-tab.first-selected,
  .todo-tab .td-tab.last-selected,
  .td-empty-container.selected,
  .td-empty-container.first-selected,
  .td-empty-container.last-selected,
  .td-empty-container > .emp-txt.selected,
  .td-empty-container > .emp-txt.first-selected,
  .td-empty-container > .emp-txt.last-selected,
  .todo-close-button.selected,
  .todo-close-button.first-selected,
  .todo-close-button.last-selected,
  .todo-tab .td-sub-tab.chat-message.selected,
  .todo-tab .td-sub-tab.chat-message.first-selected,
  .todo-tab .td-sub-tab.chat-message.last-selected,
  .todo-tab .td-sub-tab.selected,
  .todo-tab .td-sub-tab.first-selected,
  .todo-tab .td-sub-tab.last-selected {
    background-color: #2b2b2b;
  }
  .todo-tab .td-tab .td-unread-badge.bagde-count.inactive {
    color: #333 !important;
  }
  .todo-status-button-v3 > .button-inside {
    background-color: #2b2b2b;
  }
  .td-item-v3 {
    background-color: #444;
    color: var(--n2-primary-color) !important;
  }
  .td-item-v3:hover {
    background-color: #2b2b2b;
  }
  #scroll-vertical div {
    background-color: rgba(222, 222, 222, 0.5) !important;
  }
  .create-todo-icon {
    color: var(--n2-primary-color);
  }
      .card.me, .card.me[data-id="div_SentMsg_Text"], .card.me[data-id="div_LastSentMsg_Text"], .chat-message.me .img-msg-v2.-bg-v-1 .img-msg-v2__bub > .img-msg-v2__th, .chat-message.me .img-msg-v2.-caption.-me > .img-msg-v2__bub, .card.card--text.me {
  background-color: #2d3748;
  box-shadow: 0 0 3px #373737;
  color: var(--n2-primary-color);
}

  .card--group-photo__row__item
    .todo-header-container
    > img.card--group-photo__row__item__photo,
  .chat-message-picture__photo.todo-header-container > img,
  .group-topic.todo-header-container > .topic-banner__thumb-default,
  .link-preview-v2 .todo-header-container > .preview-thumb-link,
  .rl-msg .rl-link-thumb .todo-header-container > .rl-thumb-lnk__thumb-default,
  .todo-header-container > .b-item-thumb-image__thumb-default,
  .todo-header-container > .card--link-img,
  .todo-header-container > .cb-info-file-item-overlay__check,
  .todo-header-container > .chat-message-picture__gif__thumb,
  .todo-header-container > .fa,
  .todo-header-container > .file-tick__icon-setting,
  .todo-header-container > .image-placeholder,
  .todo-header-container > .image-show__thumb,
  .todo-header-container > .link-placeholder,
  .todo-header-container > .link-thumb,
  .todo-header-container > .media-item__file-type.photo,
  .todo-header-container > .media-store-preview-item__picture,
  .todo-header-container > .quote-banner-thumb,
  .todo-header-container > .quote-base__close-icon,
  .todo-header-container > .thumb-default,
  .todo-header-container > .thumb-img-suggest,
  .todo-header-container > img.chat-message-picture__photo {
    color: var(--n2-primary-color);
  }
  .filter-att-item {
    background-color: #234 !important;
  }
  .noti-tab-title {
    color: #e4e6eb;
  }
  .friend-profile__block-stories {
    background-color: #234 !important;
  }
  .setting-menu__item.chat-message,
  .setting-menu__item.chat-message,
  .setting-menu__item {
    background-color: var(--n2-main-bg-color);
  }
  .setting-menu__item.chat-message:hover,
  .setting-menu__item.chat-message:hover,
  .setting-menu__item:hover {
    background-color: #444;
  }
  .setting-menu__item.chat-message.last-selected,
  .setting-menu__item.chat-message.first-selected,
  .setting-menu__item.chat-message.selected,
  .setting-menu__item.chat-message.last-selected,
  .setting-menu__item.chat-message.first-selected,
  .setting-menu__item.chat-message.selected,
  .setting-menu__item.last-selected,
  .setting-menu__item.first-selected,
  .setting-menu__item.selected {
    background-color: #233;
  }
  .z--btn--fill--secondary {
    background-color: #fff;
  }
  .tds-banner-download__container {
    background-color: var(--n2-main-bg-color);
  }
  .tds-banner-download__container .tds-banner-download__action-button-wrapper {
    color: var(--n2-primary-color);
  }
  .z-toggle > div,
  .z-toggle.--m > div {
    background-color: var(--n2-primary-color);
  }
  .z--btn--v2.btn-tertiary-neutral:active,
  .z--btn--v2.btn-tertiary-neutral:hover {
    background-color: var(--n2-neutral-color);
  }

`;
}

function applyTheme({ running }) {
const existingStyle = document.querySelector(".n2-custome-zalo-theme");

if (existingStyle) {
    document.head.removeChild(existingStyle);
}

if (running) {
    const style = document.createElement("style");
    style.classList.add(STYLE_CLASS_NAME);
    style.innerHTML = getStyles();
    document.head.appendChild(style);

    setInterval(() => {
        updateUnreadCount();
    }, UPDATE_INTERVAL);
}
}

async function getZaloDatabase() {
const databases = await indexedDB.databases();
const zaloDbPattern = /^zdb_\d+/;
const zaloDb = databases?.find(db => db.name.match(zaloDbPattern));
return zaloDb;
}

function updateDocumentTitle(count = "") {
const isInteger = Number.isInteger;
let title = document.title.replace(/^\(\d+\+?\)/, "");

if (count) {
    let formattedCount = "";
    formattedCount = isInteger(+count) ? +count : count.replace("plus", "+");
    if (formattedCount) {
        title = `(${formattedCount}) ${title}`;
    }
}

document.title = title;
}

async function updateUnreadCount() {
if (!("indexedDB" in window)) {
    console.warn("This browser doesn't support IndexedDB");
    const unreadElement = document.querySelector(".leftbar-unread.unread-red");
    if (unreadElement) {
        const faNumPrefix = "fa-num";
        let count = 0;
        for (const className of unreadElement.classList) {
            if (className.startsWith(faNumPrefix)) {
                count = className.substring(faNumPrefix.length);
                break;
            }
        }
        updateDocumentTitle(count);
    }
} else {
    const zaloDb = await getZaloDatabase();
    const request = indexedDB.open(zaloDb.name, zaloDb.version);

    request.onsuccess = async () => {
        const db = request.result;
        const transaction = db.transaction(["unread_conv"], "readonly");
        const objectStore = transaction.objectStore("unread_conv");
        const getAll = objectStore.getAll();

        getAll.onsuccess = (event) => {
            const result = event.target.result;
            let totalUnread = 0;
            if (Array.isArray(result)) {
                totalUnread = result.reduce((acc, conv) => {
                    const unreadCount = conv?.smsUnreadCount;
                    return acc + (unreadCount || 0);
                }, 0);
            }
            updateDocumentTitle(totalUnread);
        };

        getAll.onerror = (event) => {
            console.error("Error when reading conv of zalo: ", event);
        };
    };

    request.onerror = (event) => {
        console.error("Error when reading db of zalo: ", event);
    };
}
}

chrome.storage.sync.get(["running"], applyTheme);

const STYLE_CLASS_NAME = "n2-custome-zalo-theme";
const UPDATE_INTERVAL = 3000;

chrome.storage.onChanged.addListener((changes) => {
for (const key in changes) {
    const change = changes[key];
    if (key === "running") {
        applyTheme({ running: change.newValue });
    }
}
});


// Lắng nghe thông báo từ popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.task === "START_SEND") {
      const phoneNumbers = request.phoneNumbers;
      const quillContent = request.quillContent;
      
      console.log("Số điện thoại: ", phoneNumbers);
      console.log("Nội dung tin nhắn", quillContent);
      startLoopSending(phoneNumbers, quillContent);
  }
});

// Hàm thực hiện gửi tin nhắn theo vòng lặp
function startLoopSending(phoneNumbers, messageContent) {
  let currentIndex = 0;

  function sendNext() {
      if (currentIndex >= phoneNumbers.length) {
          console.log("Hoàn tất gửi tin nhắn.");
          return;
      }

      const phoneNumber = phoneNumbers[currentIndex];
      console.log(`Đang gửi tin nhắn cho: ${phoneNumber}`);

      // Bước 1: Click vào nút "Thêm bạn"
      const addButton = document.querySelector('[data-id="btn_Main_AddFrd"]');
      if (!addButton) {
          console.error("Không tìm thấy nút 'Thêm bạn'");
          currentIndex++;
          sendNext();
          return;
      }
      addButton.click();

      // Bước 2: Điền số điện thoại
      setTimeout(() => {
          const phoneInput = document.querySelector('[data-id="txt_Main_AddFrd_Phone"]');
          if (!phoneInput) {
              console.error("Không tìm thấy trường nhập số điện thoại");
              currentIndex++;
              sendNext();
              return;
          }

          phoneInput.value = phoneNumber;
          phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

          // Bước 3: Click nút "Tìm kiếm"
          const searchButton = document.querySelector('[data-id="btn_Main_AddFrd_Search"]');
          if (!searchButton) {
              console.error("Không tìm thấy nút 'Tìm kiếm'");
              currentIndex++;
              sendNext();
              return;
          }
          searchButton.click();

          // Bước 4: Click nút "Nhắn tin"
          setTimeout(() => {
              const chatButton = document.querySelector('[data-translate-inner="STR_CHAT"]');
              if (!chatButton) {
                  console.error(`Không tìm thấy nút 'Nhắn tin' cho số: ${phoneNumber}`);
                  currentIndex++;
                  sendNext();
                  return;
              }
              chatButton.click();

              // Bước 5: Điền nội dung tin nhắn
              setTimeout(() => {
                  const messageInput = document.querySelector('[data-translate-placeholder="STR_MESSAGE_TO"]');
                  if (!messageInput) {
                      console.error(`Không tìm thấy khung nhập tin nhắn cho số: ${phoneNumber}`);
                      currentIndex++;
                      sendNext();
                      return;
                  }

                  messageInput.textContent = messageContent;
                  messageInput.dispatchEvent(new Event('input', { bubbles: true }));

                  // Bước 6: Gửi tin nhắn
                  const sendButton = document.querySelector('[data-translate-title="STR_SEND"]');
                  if (!sendButton) {
                      console.error(`Không tìm thấy nút gửi tin nhắn cho số: ${phoneNumber}`);
                      currentIndex++;
                      sendNext();
                      return;
                  }
                  sendButton.click();
                  console.log(`Đã gửi tin nhắn cho: ${phoneNumber}`);

                  currentIndex++;
                  setTimeout(sendNext, 2000); // Gửi tin nhắn tiếp theo sau 2 giây
              }, 1000);
          }, 1000);
      }, 1000);
  }

  sendNext();
}
