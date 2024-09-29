// 버튼 요소를 가져옵니다.
const randomColorButton = document.getElementById('changeBgColorButton');
const applyHexColorButton = document.getElementById('applyHexColorButton');
const applyRgbColorButton = document.getElementById('applyRgbColorButton');
const copyHexColorButton = document.getElementById('copyHexColorButton');
const copyRgbColorButton = document.getElementById('copyRgbColorButton');
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const uploadImageButton = document.getElementById('uploadImageButton');
const imageInput = document.getElementById('imageInput');
const imageSection = document.getElementById('imageSection');
const imageCanvas = document.getElementById('imageCanvas');
const colorPalette = document.getElementById('colorPalette');
const ctx = imageCanvas.getContext('2d');

// RGB 값을 16진수로 변환하는 함수
function rgbToHex(r, g, b) {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 16진수 값을 RGB로 변환하는 함수
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
}

// 입력된 값이 유효한 색상인지 확인하는 함수
function isValidColor(color) {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
}

// 배경색 변경을 위한 함수
function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

// 랜덤한 배경색을 설정하는 함수
function setRandomBackgroundColor() {
    const randomRed = Math.floor(Math.random() * 256);
    const randomGreen = Math.floor(Math.random() * 256);
    const randomBlue = Math.floor(Math.random() * 256);
    const randomColor = rgbToHex(randomRed, randomGreen, randomBlue);
    changeBackgroundColor(randomColor);
    hexInput.value = randomColor;
    rgbInput.value = `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`;
}

// 16진수 색상값을 적용하는 함수
function applyHexColor() {
    let color = hexInput.value.trim();
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    if (isValidColor(color)) {
        changeBackgroundColor(color);
        rgbInput.value = hexToRgb(color);
    } else {
        alert('유효한 16진수 색상값을 입력해주세요 (예: #ff0000)');
    }
}

// RGB 색상값을 적용하는 함수       
function applyRgbColor() {
    let color = rgbInput.value.trim();
    if (isValidColor(color)) {
        changeBackgroundColor(color);
        const rgbValues = color.match(/\d+/g).map(Number);
        hexInput.value = rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);
    } else {
        alert('유효한 RGB 색상값을 입력해주세요 (예: rgb(255,0,0))');
    }
}

// 색상 코드를 클립보드에 복사하는 함수
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text)
        .then(() => {
            button.textContent = '완료';
            button.style.backgroundColor = 'steelblue'; // 복사를 눌렀을 때 변하는 버튼 색상
            setTimeout(() => {
                button.textContent = '복사';
                button.style.backgroundColor = ''; // pink heheeeee
            }, 1000); // 1초 후에 원래 색과 텍스트로 복구
        })
        .catch(err => {
            console.error('복사 실패:', err);
        });
}

// 랜덤 배경색 변경 버튼 클릭 이벤트 리스너
randomColorButton.addEventListener('click', setRandomBackgroundColor);

// 16진수 색상 적용 버튼 클릭 이벤트 리스너
applyHexColorButton.addEventListener('click', applyHexColor);

// RGB 색상 적용 버튼 클릭 이벤트 리스너
applyRgbColorButton.addEventListener('click', applyRgbColor);

// 16진수 색상 복사 버튼 클릭 이벤트 리스너
copyHexColorButton.addEventListener('click', () => copyToClipboard(hexInput.value, copyHexColorButton));

// RGB 색상 복사 버튼 클릭 이벤트 리스너
copyRgbColorButton.addEventListener('click', () => copyToClipboard(rgbInput.value, copyRgbColorButton));

// 입력 필드에서 #을 유지하도록 설정
hexInput.addEventListener('input', () => {
    if (!hexInput.value.startsWith('#')) {
        hexInput.value = '#' + hexInput.value.replace('#', '');
    }
});

// 이미지 업로드 버튼 클릭 이벤트 리스너
uploadImageButton.addEventListener('click', () => {
    imageInput.click();
});

// 이미지 파일 선택 시 이미지를 캔버스에 표시하는 함수
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 색상 팔레트에 색상을 추가하는 함수
function addColorToPalette(color) {
    if (colorPalette.children.length >= 5) {
        colorPalette.removeChild(colorPalette.firstChild);
    }
    const colorBox = document.createElement('div');
    colorBox.className = 'colorBox';
    colorBox.style.backgroundColor = color;
    colorBox.addEventListener('click', () => {
        getColorFromPalette(color);
    });
    colorPalette.appendChild(colorBox);
}

// 팔레트에서 색상을 클릭했을 때 해당 색상 정보를 추출하는 함수
function getColorFromPalette(color) {
    const hexColor = color;
    const rgbColor = hexToRgb(hexColor);

    changeBackgroundColor(hexColor);
    hexInput.value = hexColor;
    rgbInput.value = rgbColor;
}




// 모바일 색상 추출 안됨 해결
// 캔버스 클릭 시 색상 추출 및 팔레트에 추가하는 함수
imageCanvas.addEventListener('click', (e) => {
    if (!imageInput.files[0]) {
        return; // 이미지 파일이 없으면 함수 종료
    }

    const ctx = imageCanvas.getContext('2d');
    const rect = imageCanvas.getBoundingClientRect(); // 캔버스의 위치와 크기 정보

    // scaleX, scaleY 계산
    const scaleX = imageCanvas.width / rect.width;   // 가로 스케일링
    const scaleY = imageCanvas.height / rect.height; // 세로 스케일링

    // 스케일링을 적용한 클릭 좌표 계산
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // 해당 좌표의 색상 정보 추출
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = imageData;
    const hexColor = rgbToHex(r, g, b);
    const rgbColor = `rgb(${r}, ${g}, ${b})`;

    // 배경색 변경 및 색상 입력란 업데이트
    changeBackgroundColor(hexColor);
    hexInput.value = hexColor;
    rgbInput.value = rgbColor;

    // 팔레트에 추출한 색상 추가
    addColorToPalette(hexColor);
});

// RGB 값을 16진수로 변환하는 함수
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}