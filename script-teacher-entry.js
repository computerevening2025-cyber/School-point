// ⚠️ อย่าลืมเปลี่ยน URL Firebase ให้ตรงกับของคุณครูนะครับ
const FIREBASE_URL = "https://student-point2026-2027-default-rtdb.firebaseio.com/";

// ดึงข้อมูลห้องเรียนจาก Session
const teacherClass = sessionStorage.getItem("teacherClass");

// ตรวจสอบการล็อกอินเมื่อโหลดหน้าเว็บ
document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("isLoggedIn") !== "true" || !teacherClass) {
        alert("ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ!");
        window.location.href = "tc-login.html";
        return;
    }

    document.getElementById('displayClass').innerText = ຫ້ອງ `${teacherClass}`;
    loadStudents();
});

// 1. โหลดรายชื่อนักเรียนและคะแนนตามวิชาที่เลือก
function loadStudents() {
    const selectedSubject = document.getElementById('subjectSelect').value;
    document.getElementById('currentSubjectTitle').innerText = selectedSubject;

    // โครงสร้าง Firebase: /scores/{ห้องเรียน}/{ชื่อวิชา}
    fetch(`${FIREBASE_URL}/scores/${teacherClass}/${selectedSubject}.json`)
        .then(res => res.json())
        .then(data => {
            const studentList = document.getElementById('studentList');
            studentList.innerHTML = '';

            if (data) {
                Object.keys(data).forEach(id => {
                    const std = data[id];
                    studentList.innerHTML += `
                        <tr>
                            <td><b>${std.code}</b></td>
                            <td>${std.name}</td>
                            <td><b style="color: #28a745; font-size: 16px;">${std.score}</b> ຄະແນນ</td>
                            <td>
                                <button class="btn-edit" onclick="editStudent('${id}', '${std.code}', '${std.name}', '${std.score}')">ແກ້ໄຂ</button>
                                <button class="btn-delete" onclick="deleteStudent('${id}')">ລົບ</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                studentList.innerHTML = '<tr><td colspan="4" style="text-align:center;">ຍັງບໍ່ມີຂໍ້ມູນຄະແນນໃນວິຊານີ້</td></tr>';
            }
        });
}

// 2. บันทึก / แก้ไขคะแนนนักเรียน
function saveStudent() {
    const selectedSubject = document.getElementById('subjectSelect').value;
    const editId = document.getElementById('editStudentId').value;
    const code = document.getElementById('stdCode').value.trim();
    const name = document.getElementById('stdName').value.trim();
    const score = document.getElementById('stdScore').value.trim();

    if (!code || !name || score === '') {
        return alert("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ!");
    }

    // ใช้ ID เดิมเมื่อแก้ไข หรือสร้าง ID ใหม่เมื่อเพิ่ม
    const studentId = editId ? editId : "std_" + Date.now();
    const studentData = { code, name, score: Number(score) };

    // เซฟลง Database แยกตามวิชา
    fetch(`${FIREBASE_URL}/scores/${teacherClass}/${selectedSubject}/${studentId}.json`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
    }).then(() => {
        alert(editId ? "ອັບເດດຂໍ້ມູນສຳເລັດ!" : "ບັນທຶກຄະແນນສຳເລັດ!");
        resetForm();
        loadStudents();
    });
}

// 3. ดึงข้อมูลขึ้นมาแก้ไข
function editStudent(id, code, name, score) {
    document.getElementById('editStudentId').value = id;
    document.getElementById('stdCode').value = code;
    document.getElementById('stdName').value = name;
    document.getElementById('stdScore').value = score;

    const btn = document.getElementById('btnSaveStudent');
    btn.innerText = "✏️ ບັນທຶກການແກ້ໄຂ";
    btn.style.backgroundColor = "#ffc107";
    btn.style.color = "#333";
}

// 4. ลบข้อมูลคะแนน
function deleteStudent(id) {
    const selectedSubject = document.getElementById('subjectSelect').value;
    if (confirm("ທ່ານຕ້ອງການລົບຂໍ້ມູນຄະແນນຂອງນັກຮຽນຄົນນີ້ແມ່ນບໍ?")) {
        fetch(`${FIREBASE_URL}/scores/${teacherClass}/${selectedSubject}/${id}.json, { method: 'DELETE' }`)
            .then(() => {
                alert("ລົບຂໍ້ມູນສຳເລັດ!");
                loadStudents();
            });
    }
}

// 5. ล้างฟอร์ม
function resetForm() {
    document.getElementById('editStudentId').value = '';
    document.getElementById('stdCode').value = '';
    document.getElementById('stdName').value = '';
    document.getElementById('stdScore').value = '';

    const btn = document.getElementById('btnSaveStudent');
    btn.innerText = "+ ບັນທຶກຂໍ້ມູນ";
    btn.style.backgroundColor = "#28a745";
    btn.style.color = "white";
}

// 6. ออกจากระบบ
function logout() {
    sessionStorage.clear();
    window.location.href = "tc-login.html";
}