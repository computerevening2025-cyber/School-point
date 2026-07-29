const FIREBASE_URL = "https://student-point2026-2027-default-rtdb.firebaseio.com";

function login() {
    // อ่านค่าจาก input ( id="usernameInput" และ id="passwordInput" )
    const usernameInput = document.getElementById("usernameInput").value.trim();
    const passwordInput = document.getElementById("passwordInput").value.trim();

    if (!usernameInput || !passwordInput) {
        alert("ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ!");
        return;
    }

    // ตรวจสอบกับ Firebase หรือใช้รหัสผ่านสำรอง
    fetch(${FIREBASE_URL}/admin.json)
        .then(res => res.json())
        .then(adminData => {
            let isSuccess = false;

            if (adminData && adminData.username === usernameInput && adminData.password === passwordInput) {
                isSuccess = true;
            } else if (usernameInput === "admin" && (passwordInput === "Pms123" || passwordInput === "pms123")) {
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
            console.error("Login Error:", err);
            if (usernameInput === "admin" && (passwordInput === "Pms123" || passwordInput === "pms123")) {
                alert("ເຂົ້າສູ່ລະບົບສຳເລັດ!");
                sessionStorage.setItem("isAdminLoggedIn", "true");
                window.location.href = "admin.html";
            } else {
                alert("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ!");
            }
        });
}
