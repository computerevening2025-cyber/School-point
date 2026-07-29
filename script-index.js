// ⚠️ อย่าลืมเปลี่ยน URL Firebase ให้ตรงกับของคุณครูนะครับ
const FIREBASE_URL = "https://student-point2026-2027-default-rtdb.firebaseio.com/";

const SUBJECT_LIST = [
    "ພາສາລາວ", "ວັນນະຄະດີ", "ຄະນິດສາດ", "ສຶກສາພົນລະເມືອງ",
    "ວິທະຍາສາດທຳມະຊາດ", "ພູມສາດ", "ປະຫວັດສາດ", "ເຕັກໂນໂລຊີ (ຄອມ)",
    "ພື້ນຖານວິຊາຊີບ", "ສິລະປະກຳ", "ສິລະປະດົນຕີ", "ພາສາອັງກິດ", "ພະລະສຶກສາ"
];

document.addEventListener("DOMContentLoaded", () => {
    loadClassOptions();
});

function loadClassOptions() {
    fetch(`${FIREBASE_URL}/classes.json`)
        .then(res => res.json())
        .then(data => {
            const classSelect = document.getElementById('classSelect');
            classSelect.innerHTML = '<option value="">-- ເລືອກຫ້ອງຮຽນ --</option>';

            if (data) {
                Object.keys(data).forEach(key => {
                    const cls = data[key];
                    classSelect.innerHTML += <option value="${cls}">ຫ້ອງ ${cls}</option>;
                });
            } else {
                classSelect.innerHTML = '<option value="">ບໍ່ມີຂໍ້ມູນຫ້ອງຮຽນ</option>';
            }
        })
        .catch(err => {
            console.error("Error loading classes:", err);
            document.getElementById('classSelect').innerHTML = '<option value="">ໂຫຼດຂໍ້ມູນຜິດພາດ</option>';
        });
}

async function searchStudentScores() {
    const selectedClass = document.getElementById('classSelect').value;
    const selectedMonth = document.getElementById('monthSelect').value;
    const stdCode = document.getElementById('studentCodeInput').value.trim();

    if (!selectedClass) return alert("ກະລຸນາເລືອກຫ້ອງຮຽນ!");
    if (!selectedMonth) return alert("ກະລຸນາເລືອກເດືອນ!");
    if (!stdCode) return alert("ກະລຸນາປ້ອນລະຫັດນັກຮຽນ!");

    try {
        const res = await fetch(`${FIREBASE_URL}/scores/${selectedClass}/m_${selectedMonth}.json`);
        const monthScores = await res.json();

        const scoreTableBody = document.getElementById('scoreTableBody');
        const studentInfo = document.getElementById('studentInfo');
        const resultCard = document.getElementById('resultCard');

        scoreTableBody.innerHTML = '';
        
        if (!monthScores) {
            alert(ບໍ່ພົບຂໍ້ມູນຄະແນນໃນເດືອນ `${selectedMonth}!`);
            resultCard.style.display = "none";
            return;
        }

        // 1. คำนวณคะแนนรวมของทุกคนในห้อง เพื่อนำมาหา "ลำดับที่ (Rank)"
        let studentTotals = {}; // เก็บ { code: totalScore, name: studentName }
        let currentStudentScores = {};
        let targetStudentName = "";

        // วนลูปอ่านข้อมูลทุกวิชา
        SUBJECT_LIST.forEach(subject => {
            const subjectData = monthScores[subject];
            if (subjectData) {
                Object.keys(subjectData).forEach(id => {
                    const std = subjectData[id];
                    const numScore = parseFloat(std.score) || 0;

                    if (!studentTotals[std.code]) {
                        studentTotals[std.code] = { total: 0, count: 0, name: std.name };
                    }
                    studentTotals[std.code].total += numScore;
                    studentTotals[std.code].count += 1;

                    if (std.code === stdCode) {
                        currentStudentScores[subject] = std.score;
                        targetStudentName = std.name;
                    }
                });
            }
        });

        // 2. ตรวจสอบว่าพบนักเรียนรหัสนี้หรือไม่
        if (!studentTotals[stdCode]) {
            alert(ບໍ່ພົບຂໍ້ມູນນັກຮຽນລະຫັດ `${stdCode} ໃນເດືອນນີ້!`);
            resultCard.style.display = "none";
            return;
        }

        // 3. จัดลำดับ (Ranking) คะแนนรวมของทั้งห้องจากมากไปน้อย
        const rankedList = Object.keys(studentTotals)
            .map(code => ({ code, total: studentTotals[code].total }))
            .sort((a, b) => b.total - a.total);

        const myRank = rankedList.findIndex(item => item.code === stdCode) + 1;
        const myTotal = studentTotals[stdCode].total;
        const mySubjectCount = Object.keys(currentStudentScores).length || 1;
        const myAvg = (myTotal / mySubjectCount).toFixed(2); // คำนวณเฉลี่ย ทศนิยม 2 ตำแหน่ง

        // 4. แสดงผลคะแนนในตาราง
        SUBJECT_LIST.forEach(subject => {
            const scoreVal = currentStudentScores[subject] !== undefined ? currentStudentScores[subject] : "-";
            scoreTableBody.innerHTML += `
                <tr>
                    <td><b>${subject}</b></td>
                    <td style="text-align: right;"><b style="color: #28a745;">${scoreVal}</b></td>
                </tr>
            `;
        });

        // 5. แสดงผลการ์ดสรุปและข้อมูลนักเรียน
        studentInfo.style.display = "block";
        studentInfo.innerHTML = `
            <b>ຊື່ ແລະ ນາມສະກຸນ:</b> ${targetStudentName} <br>
            <b>ລະຫັດ:</b> ${stdCode} | <b>ຫ້ອງ:</b> ${selectedClass} | <b>ເດືອນ:</b> ${selectedMonth}
        `;

        document.getElementById('totalScoreVal').innerText = myTotal;
        document.getElementById('avgScoreVal').innerText = myAvg;
        document.getElementById('rankVal').innerText = `${myRank} / ${rankedList.length}`;

        resultCard.style.display = "block";

    } catch (err) {
        console.error("Search Error:", err);
        alert("ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາ!");
    }
}