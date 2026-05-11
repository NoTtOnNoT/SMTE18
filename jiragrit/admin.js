// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBA2GTSlUCcoXrF5KXYevyh33w32lqK1AY",
    authDomain: "secret-31961.firebaseapp.com",
    databaseURL: "https://secret-31961-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "secret-31961",
    storageBucket: "secret-31961.firebasestorage.app",
    messagingSenderId: "1088112105636",
    appId: "1:1088112105636:web:5c153258e5499ade9bee31"
};

// --- [ ย้ายกลุ่มนี้ขึ้นมาไว้ข้างบน ] ---
// เริ่มต้น Firebase ก่อน
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
// ประกาศตัวแปร database ให้เรียบร้อยก่อนเรียกใช้
const database = firebase.database();

// --- [ ส่วนป้องกันการเข้าถึง - Login Guard ] ---
document.body.style.display = "none";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.replace("login.html");
} else {
    document.body.style.display = "block";
    // เรียกใช้ฟังก์ชันหลังจาก database พร้อมใช้งานแล้ว
    initAdminPanel();
}

// --- [ ฟังก์ชันการทำงานหลัก ] ---
function initAdminPanel() {
    
    // ดึงข้อมูลโปรไฟล์คุณครู
    database.ref('config').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('edit-name').value = data.name || "";
            document.getElementById('edit-img').value = data.imgUrl || "";
        }
    });

    // ดึงยอดความรู้สึก (reactions)
    const reactionKeys = ['love', 'haha', 'wow', 'sad', 'angry'];
    reactionKeys.forEach(key => {
        database.ref('reactions/' + key).on('value', (snapshot) => {
            const adminLabel = document.getElementById('admin-' + key);
            if (adminLabel) adminLabel.innerText = snapshot.val() || 0;
        });
    });

    // จัดการข้อความนักเรียน (feedbacks)
    database.ref('feedbacks').on('value', (snapshot) => {
        const list = document.getElementById('admin-feed-list');
        const totalMsgLabel = document.getElementById('total-msgs');
        if (!list) return;

        list.innerHTML = "";
        let count = 0;

        snapshot.forEach((child) => {
            const item = child.val();
            const key = child.key;
            const date = new Date(item.timestamp).toLocaleString('th-TH', { 
                dateStyle: 'short', timeStyle: 'short' 
            });
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${date}</td>
                <td>${item.content}</td>
                <td>
                    <button class="btn-delete" onclick="deleteMsg('${key}')">
                        <i class="fas fa-trash-alt"></i> ลบ
                    </button>
                </td>
            `;
            list.prepend(tr);
            count++;
        });
        if (totalMsgLabel) totalMsgLabel.innerText = count;
    });
}

// --- [ ฟังก์ชัน Action ของปุ่มต่างๆ ] ---
function updateProfile() {
    const name = document.getElementById('edit-name').value;
    const img = document.getElementById('edit-img').value;
    database.ref('config').set({ name: name, imgUrl: img })
        .then(() => alert("อัปเดตเรียบร้อย!"));
}

function resetReactions() {
    if (confirm("รีเซ็ตยอดทั้งหมด?")) {
        database.ref('reactions').set({ love: 0, haha: 0, wow: 0, sad: 0, angry: 0 });
    }
}

function deleteMsg(key) {
    if (confirm("ลบข้อความนี้?")) {
        database.ref('feedbacks').child(key).remove();
    }
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.replace("login.html");
}