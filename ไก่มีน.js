// --- 1. ใส่ Config ของคุณตามเดิม ---
const firebaseConfig = {
    apiKey: "AIzaSyAb-68LOJNRhVmZeCjCGvfg-lZdt-LCU0E",
    databaseURL: "https://smte-6550d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smte-6550d",
    appId: "1:992310898236:web:a05a1711cfdf371400dd39",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let candidates = [
    { id: 1, name: "เบอร์ 1" }, { id: 2, name: "เบอร์ 2" },
    { id: 3, name: "เบอร์ 3" }, { id: 4, name: "เบอร์ 4" },
    { id: 5, name: "เบอร์ 5" }, { id: 6, name: "เบอร์ 6" }
];

let currentScores = {};

// 2. ฟังการเปลี่ยนแปลงจาก Firebase แบบ Real-time ตลอดเวลา
db.ref('votes').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        currentScores = data;

        // ถ้าหน้า Pop-up เปิดอยู่ ให้รีเฟรชรายชื่ออันดับทันทีโดยไม่ต้องรอให้กดปุ่มใหม่
        const modal = document.getElementById('resultModal');
        if (modal.style.display === "flex") {
            updateRankingUI();
        }
    }
});

function addVote(id) {
    const voteRef = db.ref('votes/' + id);
    voteRef.transaction((currentValue) => {
        return (currentValue || 0) + 1;
    });
}

// 3. แยกฟังก์ชันวาดรายชื่ออันดับออกมาเพื่อให้เรียกใช้ซ้ำได้
function updateRankingUI() {
    const rankingList = document.getElementById('ranking-list');
    const sorted = candidates.map(c => ({
        ...c,
        votes: currentScores[c.id] || 0
    })).sort((a, b) => b.votes - a.votes);

    rankingList.innerHTML = '';
    sorted.forEach((person, index) => {
        rankingList.innerHTML += `
            <div class="ranking-item">
                <span><span class="rank-number">#${index + 1}</span> ${person.name}</span>
                <strong>${person.votes.toLocaleString()}</strong>
            </div>
        `;
    });
}

function openModal() {
    updateRankingUI(); // วาดข้อมูลล่าสุดก่อนเปิด
    document.getElementById('resultModal').style.display = "flex";
}

function closeModal() {
    document.getElementById('resultModal').style.display = "none";
}

function initGrid() {
    const grid = document.getElementById('vote-grid');
    candidates.forEach(person => {
        grid.innerHTML += `
            <div class="vote-card">
                <span style="font-size: 1.2rem; display:block; margin-bottom:15px;">${person.name}</span>
                <button class="btn-vote" onclick="addVote(${person.id})">กดโหวต!</button>
            </div>
        `;
    });
}

initGrid();