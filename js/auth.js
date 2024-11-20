function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;


    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
    } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
    }

  //  console.log('Login successful');
}

function checkSavedLogin() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedEmail && savedPassword) {
        document.getElementById('loginEmail').value = savedEmail;
        document.getElementById('loginPassword').value = savedPassword;
        document.getElementById('rememberMe').checked = true;
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const showLoginLink = document.getElementById('showLogin');
    const showRegisterLink = document.getElementById('showRegister');
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
    const email = document.getElementById('loginEmail');
    email.focus();
    checkSavedLogin();

    
    function checkAutoLogin() {
        chrome.storage.local.get(['userEmail',  'loginExpiration'], function(result) {
            console.log("AUTOCHECK LOGIN", result);

            if (result.userEmail && result.loginExpiration) {
                const now = new Date().getTime();
                if (now < result.loginExpiration) {
                    // Auto-login
                    console.log('Auto-login successful');
                    //window.location.href = 'popup.html';
                    chrome.storage.local.get(['tabZalo'], function (result) {
                        const activeTab = result.tabZalo.id;
                        chrome.tabs.sendMessage(activeTab, {task: "CHANGE_PAGE", page: "../page/popup.html" });

                       
                
                      });

                    
                } else {
                    // Login expired, clear stored data
                    chrome.storage.local.remove(['userEmail',  'loginExpiration']);
                    chrome.storage.local.get(['tabZalo'], function (result) {
                        const activeTab = result.tabZalo.id;
                        chrome.tabs.sendMessage(activeTab, {task: "CHANGE_PAGE", page: "../page/login.html" });
                
                      });
                   // console.log('Auto-login successful');
                }
            }
        });
    }

     setTimeout(() => {
        checkAutoLogin();   

     }, 2000);   
   
    function showError(input, message) {
        input.classList.add('border-red-500');
        const errorElement = document.createElement('p');
        errorElement.textContent = message;
        errorElement.className = 'text-red-500 text-xs mt-1';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    function clearErrors() {
        document.querySelectorAll('.text-red-500').forEach(el => el.remove());
        document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
    }

    function switchForm(showForm, hideForm) {
        showForm.classList.remove('hidden');
        hideForm.classList.add('hidden');
    }

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchForm(loginForm, registerForm);
        $("#loginEmail").focus();
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchForm(registerForm, loginForm);
        $("#regEmail").focus();
    });

    function validateEmail(email) {
        // Regular expression for validating an email address
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    function resetForm() {
        // Get the form container by ID
        var formContainer = document.getElementById('registerForm');
        
        // Reset all input fields within the form
        var inputs = formContainer.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            switch (inputs[i].type) {
                case 'text':
                case 'password':
                case 'email':
                case 'number':
                case 'date':
                case 'tel':
                    inputs[i].value = '';
                    break;
                case 'checkbox':
                case 'radio':
                    inputs[i].checked = false;
                    break;
            }
        }
    
        // Reset all select fields within the form
        var selects = formContainer.getElementsByTagName('select');
        for (var i = 0; i < selects.length; i++) {
            selects[i].selectedIndex = 0;
        }
    
        // Reset all textarea fields within the form
        var textareas = formContainer.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            textareas[i].value = '';
        }
    }

    registerButton.addEventListener('click', function() {
        clearErrors();

        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const phone = document.getElementById('regPhone').value;
        const address = document.getElementById('regAddress').value;
        const plan = document.getElementById('regPlan').value;
        const fullname = document.getElementById('regFullname').value;


        if(email.length == 0){
            $("#regEmail").notify("Điền email của bạn.", "error")
            return;
        }
        if(validateEmail(email) == false){
            $("#regEmail").notify("Email không hợp lệ.", "error")
            return;
        }

       

        if(password.length < 5){
            $("#regPassword").notify("Mật khẩu ít nhất phải 5 ký tự.", "error")
            return;
        }

         
        if(fullname.length == 0){
            $("#regFullname").notify("Điền tên của bạn.", "error")
            return;
        }
        if(phone.length == 0){
            $("#regPhone").notify("Điền số điện thoại của bạn.", "error")
            return;
        }
        if(address.length == 0){
            $("#regAddress").notify("Điền địa chỉ của bạn.", "error")
            return;
        }

        if (plan === '-1') {
            $("#regPlan").notify("Bạn chưa chọn gói đăng ký.", "error")
            return;
        }

        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('plan', plan);
        formData.append('fullname', fullname);
        formData.append('app_id', 1);

        fetch('https://key.laptrinhvb.net/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                $.notify(data.message, "success");
                switchForm(loginForm, registerForm);
                $("#loginEmail").focus();
                $("#loginEmail").val(email);
                $("#loginPassword").val(password);
                resetForm();
            } else {
                $.notify('Đăng ký thất bại: ' + data.message, "error");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            $.notify('Có lỗi xảy ra khi đăng ký', "error");
        });
    });
    const password = document.getElementById('loginPassword');
    password.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission
            loginButton.click(); // Trigger the login button click
        }
    });
    $(document).on('keypress', function(e) {
        if (e.which == 13) { // 13 is the Enter key
            event.preventDefault(); // Prevent the default form submission
            loginButton.click(); // Trigger the login button click
        }
       
    });

    loginButton.addEventListener('click', function() {
        clearErrors();
    
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const appId = 1;
        let isValid = true;
    
        if (!email.value) {
            showError(email, 'Email is required');
            isValid = false;
        }
        if (!password.value) {
            showError(password, 'Password is required');
            isValid = false;
        }
    
        if (isValid) {
            // Encode the data as application/x-www-form-urlencoded
            const params = new URLSearchParams();
            params.append('email', email.value);
            params.append('password', password.value);
            params.append('app_id', appId);
    
            fetch('https://key.laptrinhvb.net/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString(),
                redirect: 'manual' // Prevents automatic following of redirects
            })
            .then(response => {
                if (response.type === 'opaqueredirect') {
                    throw new Error('Redirect detected');
                }
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'An error occurred');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.status) {
                    console.log('Login successful');

                    handleLogin();
                 
    
                    // Save login info
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 1); // Set expiration to 1 day from now
    
                    chrome.storage.local.set({
                        'userEmail': email.value,                       
                        'loginExpiration': expirationDate.getTime()
                    }, function() {
                        console.log('Login info saved');
                        chrome.storage.local.get(['tabZalo'], function (result) {
                            const activeTab = result.tabZalo.id;
                            chrome.tabs.sendMessage(activeTab, {task: "CHANGE_PAGE", page: "../page/popup.html" });

                          
                    
                          });
                     
                        // window.location.href = 'popup.html';
                    });
                } else {
                    console.log('Login failed');
                    showError(email, data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                showError(email, 'An error occurred. Please try again.');
            });
        }
    });
    
    
    
});



