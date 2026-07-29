// 1. ตรวจสอบให้แน่ใจว่า FIREBASE_URL ตรงกับใน Firebase Console ของคุณครู
const FIREBASE_URL = "https://student-point2026-2027-default-rtdb.firebaseio.com";

function login() {
    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    if (!usernameInput || !passwordInput) {
        alert("ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ!");
        return;
    }

    // ล็อกอินแบบทางด่วน (Bypass) + เช็กจาก Firebase
    fetch(${FIREBASE_URL}/admin.json)
        .then(res => res.json())
        .then(adminData => {
            let isSuccess = false;

            // เช็กข้อมูลจาก Firebase (ถ้ามี)
            if (adminData && adminData.username === usernameInput && adminData.password === passwordInput) {
                isSuccess = true;
            } 
            // รหัสสำรองเผื่อ Firebase ยังดึงค่าไม่ได้ (ยอมรับทั้ง P ตัวใหญ่ และ p ตัวเล็ก)
            else if (usernameInput === "admin" && (passwordInput === "Pms123" || passwordInput === "pms123")) {
                isSuccess = true;
            }

            if (isSuccess) {
                alert("ເຂົ້າສູ່ລະບົບສຳເລັດ!");
                sessionStorage.setItem("isAdminLoggedIn", "true");
                window.location.href = "admin.html";
            } else {
                alert("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ!");
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            // กรณีเน็ตหลุด/เชื่อมต่อไม่ได้ ให้เข้าด้วยรหัสสำรองได้ทันที
            if (usernameInput === "admin" && (passwordInput === "Pms123" || passwordInput === "pms123")) {
                alert("ເຂົ້າສູ່ລະບົບສຳເລັດ!");
                sessionStorage.setItem("isAdminLoggedIn", "true");
                window.location.href = "admin.html";
            } else {
                alert("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ!");
            }
        });
}
