// ⚠️ เปลี่ยน URL Firebase เป็นของคุณครูนะครับ
const FIREBASE_URL = "https://student-point2026-2027-default-rtdb.firebaseio.com/";

function checkAdminLogin() {
    const usernameInput = document.getElementById('adminUsername').value.trim();
    const passwordInput = document.getElementById('adminPassword').value.trim();

    if (!usernameInput || !passwordInput) {
        alert("ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ!");
        return;
    }

    // ดึงข้อมูล Admin จาก Firebase Node 'admin'
    fetch(`${FIREBASE_URL}/admin.json`)
        .then(res => res.json())
        .then(adminData => {
            if (adminData) {
                // เช็กว่า Username และ Password ตรงกับในระบบหรือไม่
                if (usernameInput === adminData.username && passwordInput === adminData.password) {
                    alert("ເຂົ້າສູ່ລະບົບສຳເລັດ!");
                    
                    // บันทึกสถานะว่าล็อกอินแล้ว (Session)
                    sessionStorage.setItem("isAdminLoggedIn", "true");
                    
                    // เด้งไปหน้าแผงควบคุม admin.html
                    window.location.href = "admin.html";
                } else {
                    alert("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ!");
                }
            } else {
                // กรณีใน Firebase ยังไม่ได้ตั้งค่า Admin ไว้ (ใช้ค่าเริ่มต้นชั่วคราว)
                if (usernameInput === "admin" && passwordInput === "Pms123") {
                    alert("ເຂົ້າສູ່ລະບົບສຳເລັດ (Default)! ");
                    sessionStorage.setItem("isAdminLoggedIn", "true");
                    window.location.href = "admin.html";
                } else {
                    alert("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ!");
                }
            }
        })
        .catch(err => {
            console.error("Login Error:", err);
            alert("ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່!");
        });
}
