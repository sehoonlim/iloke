const multer = require('multer');
const path = require('path');

// Multer 저장소 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../routes/uploads'); // uploads가 routes 안에 있으므로
        cb(null, uploadPath);
      
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // 확장자 추출
        const fName = path.basename(file.originalname, ext) + '-' + Date.now() + ext;

        // 한글 파일 이름 인코딩 처리
        const newFName = Buffer.from(fName, 'latin1').toString('utf8');
        cb(null, newFName); // 고유 파일 이름 생성
    },
});

// Multer 객체 생성 및 파일 크기 제한 설정
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// 모듈 내보내기
module.exports = upload;










// const numbers = [1, 2, 3];

// // 구조분해 할당
// const [first, second, third] = numbers;

// console.log(first);  // 1
// console.log(second); // 2
// console.log(third);  // 3
// 설명
// 배열 numbers의 첫 번째 값(1), 두 번째 값(2), 세 번째 값(3)을 각각 first, second, third 변수에 저장합니다.
// const first = numbers[0];, const second = numbers[1]; 같은 반복 작업을 줄일 수 있습니다.