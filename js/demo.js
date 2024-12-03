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