const firebaseConfig = {
    apiKey: "AIzaSyBA2GTSlUCcoXrF5KXYevyh33w32lqK1AY",
    authDomain: "secret-31961.firebaseapp.com",
    databaseURL: "https://secret-31961-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "secret-31961",
    storageBucket: "secret-31961.firebasestorage.app",
    messagingSenderId: "1088112105636",
    appId: "1:1088112105636:web:5c153258e5499ade9bee31"
};

// ตรวจสอบว่ามีการ Initialize หรือยังเพื่อป้องกัน Error
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// --- 1. ระบบควบคุม UI (Drawer) ---
function toggleDrawer() {
    const drawer = document.getElementById('feed-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
    }
}

// --- 2. ระบบจัดการ Profile ---
database.ref('config').on('value', (snapshot) => {
    const data = snapshot.val();
    if(data) {
        const nameEl = document.getElementById('teacher-name');
        const imgEl = document.getElementById('teacher-img');
        if(nameEl) nameEl.innerText = data.name || "คุณครูที่ปรึกษา";
        if(imgEl && data.imgUrl) imgEl.src = data.imgUrl;
    }
});

// --- 3. ระบบ Reaction Counter ---
function addReaction(type) {
    const ref = database.ref('reactions/' + type);
    ref.transaction((currentValue) => {
        return (currentValue || 0) + 1;
    });
}

const reactionTypes = ['love', 'haha', 'wow', 'sad', 'angry'];
reactionTypes.forEach(type => {
    database.ref('reactions/' + type).on('value', (snapshot) => {
        const val = snapshot.val();
        const countEl = document.getElementById('count-' + type);
        if (countEl) {
            countEl.innerText = val !== null ? val : 0;
        }
    });
});

// --- 4. ระบบ Feed ข้อความ ---
function sendMessage() {
    const input = document.getElementById('user-message');
    const text = input.value.trim();
    
    if(text !== "") {
        database.ref('feedbacks').push({
            content: text,
            timestamp: Date.now()
        }).then(() => {
            // เมื่อส่งเสร็จให้ล้างค่าในช่องพิมพ์
            input.value = "";
            // แจ้งเตือนเล็กน้อย หรือจะสั่งเปิด Drawer เพื่อดูโพสต์ตัวเองก็ได้
            console.log("ส่งความรู้สึกสำเร็จ");
        }).catch((error) => {
            console.error("Error sending message: ", error);
        });
    }
}

// โหลดข้อมูล Feed มาแสดงใน Drawer
database.ref('feedbacks').on('value', (snapshot) => {
    const feed = document.getElementById('posts-feed');
    const msgCount = document.getElementById('msg-count');
    
    if (!feed) return;
    
    feed.innerHTML = "";
    let count = 0;
    
    snapshot.forEach((child) => {
        const item = child.val();
        const date = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const div = document.createElement('div');
        div.className = "feed-item";
        div.innerHTML = `
            <div class="user-info" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" style="width:35px; border-radius:50%;">
                <div>
                    <b style="display:block; font-size:14px; color: #333;">นักเรียน</b>
                    <small style="color:#aaa;">${date}</small>
                </div>
            </div>
            <p style="color:#444; line-height:1.5; font-size: 15px;">${item.content}</p>
        `;
        // ใช้ prepend เพื่อให้ข้อความใหม่ล่าสุดอยู่บนสุด
        feed.prepend(div);
        count++;
    });
    
    if (msgCount) msgCount.innerText = count;
});

