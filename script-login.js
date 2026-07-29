// ⚠️ อย่าลืมเปลี่ยน URL Firebase ให้ตรงกับของคุณครูนะครับ
const FIREBASE_URL = "https://student-point2026-2027-default-rtdb.firebaseio.com/";

async function handleUnifiedLogin() {
    const userInput = document.getElementById('usernameInput').value.trim();
    const passInput = document.getElementById('passwordInput').value.trim();

    if (!userInput || !passInput) {
        alert("ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານໃຫ້ຄົບຖ້ວນ!");
        return;
    }

    try {
        // 1. ตรวจสอบสิทธิ์ Admin ก่อน
        const adminRes = await fetch(`${FIREBASE_URL}/admin.json`);
        const adminData = await adminRes.json();

        if (adminData && userInput === adminData.username && passInput === adminData.password) {
            alert("ເຂົ້າສູ່ລະບົບສຳເລັດ! (ສິດ Admin)");
            
            // บันทึก Session Admin
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userRole", "admin");
            
            // ส่งไปหน้า Admin
            window.location.href = "admin.html";
            return;
        }

        // กรณีที่ยังไม่ได้ตั้งค่า Admin ใน Firebase (ใช้ค่า Default ชั่วคราว)
        if (userInput === "admin" && passInput === "pms123") {
            alert("ເຂົ້າສູ່ລະບົບສຳເລັດ! (ສິດ Admin Default)");
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userRole", "admin");
            window.location.href = "admin.html";
            return;
        }

        // 2. ถ้าไม่ใช่ Admin ให้ค้นหาต่อในรายชื่อ Teacher
        const teacherRes = await fetch(`${FIREBASE_URL}/teachers.json`);
        const teachersData = await teacherRes.json();
        let foundTeacher = null;

        if (teachersData) {
            Object.keys(teachersData).forEach(id => {
                const tc = teachersData[id];
                if (tc.name === userInput && tc.passcode === passInput) {
                    foundTeacher = tc;
                }
            });
        }

        if (foundTeacher) {
            alert(ຍິນດີຕ້ອນຮັບຄູ `${foundTeacher.name} (ຫ້ອງ ${foundTeacher.assignedClass})`);
            
            // บันทึก Session ครูประจำชั้น
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userRole", "teacher");
            sessionStorage.setItem("teacherClass", foundTeacher.assignedClass);
            sessionStorage.setItem("teacherName", foundTeacher.name);

            // ส่งไปหน้าป้อนคะแนน/จัดการนักเรียน
            window.location.href = "teacher-entry.html";
            return;
        }

        // 3. ถ้าไม่พบทั้งคู่
        alert("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ!");

    } catch (err) {
        console.error("Login Error:", err);
        alert("ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ຖານຂໍ້ມູນ!");
    }
}