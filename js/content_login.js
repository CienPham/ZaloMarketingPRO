const header = document.createElement('div');
header.innerHTML = "Chào bạn, đến với ứng dụng <strong><span style='color: #fadb14'>Zalo Marketing Pro</span></strong>, vui lòng đăng nhập tài khoản Zalo của bạn trước khi sử dụng | Hỗ trợ: <a style='color: orange; text-decoration: underline; font-weight: bold;' href='https://zalo.me/0933913122' target='_blank'>0933.913.122</a>";

header.style.position = 'fixed';
header.style.top = '0';
header.style.width = '100%';
header.style.backgroundColor = '#3F51B5';
header.style.color = 'white';
header.style.textAlign = 'center';
header.style.padding = '10px 0';
header.style.zIndex = '1000';
header.style.boxSizing = 'border-box';

document.body.appendChild(header);

const style = document.createElement('style');
style.innerHTML = `
    body {
        margin: 0;
        font-family: Arial, sans-serif;
    }
    #content {
        padding-top: 60px; 
    }
`;

document.head.appendChild(style);

const content = document.createElement('div');
content.id = 'content';
content.innerHTML = `
    <p>Some content on the page...</p>
    <p>More content...</p>
`;

document.body.appendChild(content);
const appElement = document.getElementById('app');

if (appElement) {
    appElement.style.marginTop = '40px';
} else {
    console.error('Element with ID "app" not found.');
}

