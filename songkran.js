const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyAb-68LOJNRhVmZeCjCGvfg-lZdt-LCU0E",
    authDomain: "smte-6550d.firebaseapp.com",
    databaseURL: "https://smte-6550d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smte-6550d",
    storageBucket: "smte-6550d.firebasestorage.app",
    messagingSenderId: "992310898236",
    appId: "1:992310898236:web:a05a1711cfdf371400dd39",
    measurementId: "G-4HLEX2SFC4"
};

// Initialize Firebase
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

// ปรับขนาด Canvas ให้เต็มจอเสมอ
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let isShooting = false;
let selectedWeapon = 'gun';
let mouseX = 0, mouseY = 0;

const keys = { a: false, d: false, w: false, space: false };

// รายชื่อนักเรียน (คงเดิมไว้)
const studentList = [
    { fullname: "ครูกฤตคนหล่อ", nickname: "ครูกฤต", img: "std0.jpeg" },
    { fullname: "นายรัตนโกสินทร์ สาดแสง", nickname: "สิงโต", img: "std1.jpeg" },
    { fullname: "นายธัญวิน อร่ามวงศ์วิทย์", nickname: "อะฟิฟ", img: "std2.jpeg" },
    { fullname: "นายกันตภณ เพชรพูล", nickname: "เซียมซี", img: "std3.jpeg" },
    { fullname: "นายวิชัย หลีหมัด", nickname: "รุก", img: "std4.jpeg" },
    { fullname: "นายกิตติพัทธ์ แช่ลิ่ม", nickname: "น็อต", img: "std5.jpeg" },
    { fullname: "นายธีรัตม์ ทองชูช่วย", nickname: "เท็น", img: "std6.jpeg" },
    { fullname: "นายศิระศิลป์ เบ็ญหยีหมาน", nickname: "อิลญีน", img: "std7.jpeg" },
    { fullname: "นายแสงอรุณ ไพโรจน์", nickname: "ฟีโน่", img: "std8.jpeg" },
    { fullname: "นายอธิวัชร์ เภอโส๊ะ", nickname: "ธาม", img: "std9.jpeg" },
    { fullname: "นายภานุพัฒน์ หลังปูเต๊ะ", nickname: "ไก่มีน", img: "std10.jpeg" },
    { fullname: "นายฐาปณวัชร์ แช่วุ่น", nickname: "วัชร์", img: "std11.jpeg" },
    { fullname: "นายฐาปณวิชญ์ แช่วุ่น", nickname: "วิชญ์", img: "std12.jpeg" },
    { fullname: "นายธีระพิชัย ศุภณัฏฐ์ปทุม", nickname: "หมิง", img: "std13.jpeg" },
    { fullname: "นายอัฟฟาน หลีเส็ม", nickname: "อัฟฟาน", img: "std14.jpeg" },
    { fullname: "นางสาวธนัสถา แช่เจ่", nickname: "เม่ย", img: "std15.jpeg" },
    { fullname: "นางสาวหนึ่งฤทัย รัตนอุดม", nickname: "มี่", img: "std16.jpeg" },
    { fullname: "นางสาวธมน ชาลีเปรี่ยม", nickname: "ธมน", img: "std17.jpeg" },
    { fullname: "นางสาวปัณณิกา มัณฑะนานนท์", nickname: "ปัน", img: "std18.jpeg" },
    { fullname: "นางสาวนภาศิริ อาทรวิริยกุล", nickname: "นภา", img: "std19.jpeg" },
    { fullname: "นางสาวพิมพ์นานา เกียรติเสนกุล", nickname: "นานา", img: "std20.jpeg" },
    { fullname: "นางสาวธัญวรัตน์ รัตนกาญจน์", nickname: "ยิม", img: "std21.jpeg" },
    { fullname: "นางสาวฐิติวรดา หมานหมัด", nickname: "โมจิ", img: "std22.jpeg" },
    { fullname: "นางสาวนิจิตตา พิพัฒน์นิธิกุลชัย", nickname: "ชมพู่", img: "std23.jpeg" },
    { fullname: "นางสาวอรสา กิ้มลั่น", nickname: "มิลค์", img: "std24.jpeg" },
    { fullname: "นางสาวรัญชิดา หมานหนับ", nickname: "ชิดา", img: "std25.jpeg" },
    { fullname: "นางสาวกานต์สิรี สุขมิ่ง", nickname: "ปาน", img: "std26.jpeg" },
    { fullname: "นางสาวลลนา สังข์แก้ว", nickname: "ตอง", img: "std27.jpeg" },
    { fullname: "นางสาวธัญญรัตน์ เส้งนนท์", nickname: "เทียน", img: "std28.jpeg" },
    { fullname: "นางสาวภูริชญา โสะบิลเมาะ", nickname: "นานะ", img: "std29.jpeg" },
    { fullname: "นางสาวกัญญาภัทร แสงรักษ์", nickname: "ด้า", img: "std30.jpeg" }
];

let selectedStudents = [];
const loadedImages = {};
const targets = [];
const droplets = [];
const splashes = [];
const clouds = [];
const leaves = [];
const mists = [];
const powderBalls = [];

class PowderBall {
    constructor(x, y, tx, ty) {
        this.x = x; this.y = y;
        const angle = Math.atan2(ty - y, tx - x) + (Math.random() - 0.5) * 0.1;
        const force = 18;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
        this.life = 1.0;
        this.size = 12 + Math.random() * 6;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // แรงโน้มถ่วงสำหรับก้อนแป้ง
        this.life -= 0.015;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.groundY = canvas.height - 100;
        this.y = this.groundY;
        this.vy = 0;
        this.vx = 0;
        this.gravity = 0.8;
        this.jumpForce = -15;
        this.accel = 1.2;
        this.friction = 0.85;
        this.size = 50;
        this.walkCycle = 0;
        this.isJumping = false;
        this.recoil = 0;
        this.shootTimer = 0; // เก็บเวลาที่ฉีดน้ำต่อเนื่อง
    }
    update() {
        if (keys.a) this.vx -= this.accel;
        if (keys.d) this.vx += this.accel;
        this.vx *= this.friction;
        this.x += this.vx;

        if ((keys.w || keys.space) && !this.isJumping) {
            this.vy = this.jumpForce;
            this.isJumping = true;
        }

        this.y += this.vy;
        if (this.y < this.groundY) {
            this.vy += this.gravity;
        } else {
            this.y = this.groundY;
            this.vy = 0;
            this.isJumping = false;
        }

        if (Math.abs(this.vx) > 0.1) this.walkCycle += 0.2;
        this.x = Math.max(30, Math.min(canvas.width - 30, this.x));

        if (isShooting) {
            this.shootTimer++;
            // ถ้าฉีดค้างไว้นานกว่า 1 วินาที (60 frames) แรงดีดจะเพิ่มขึ้น
            this.recoil = Math.min(this.recoil + 4, this.shootTimer > 60 ? 22 : 12);
        } else {
            this.shootTimer = 0;
            this.recoil *= 0.8;
        }
    }
    draw() {
        const bob = this.isJumping ? 0 : Math.sin(this.walkCycle) * 3;
        ctx.save();
        ctx.translate(this.x, this.y + bob);
        ctx.filter = 'none'; // รีเซ็ตฟิลเตอร์ทุกครั้งที่วาด

        // 1. เงาแบบ Soft Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 28, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. ขา (เพิ่มให้ดูสมจริงขึ้น)
        ctx.fillStyle = "#333";
        const walkFactor = Math.sin(this.walkCycle);
        const legW = 10;
        const legH = 15;
        // ขาซ้าย
        ctx.save();
        ctx.translate(-8, -5);
        ctx.fillRect(-legW/2, 0, legW, legH + (this.isJumping ? 0 : walkFactor * 5));
        ctx.restore();
        // ขาขวา
        ctx.save();
        ctx.translate(8, -5);
        ctx.fillRect(-legW/2, 0, legW, legH - (this.isJumping ? 0 : walkFactor * 5));
        ctx.restore();

        // 3. ลำตัว (ใช้ Gradient ให้ดูมีมิติ)
        const bodyGrad = ctx.createLinearGradient(-15, -40, 15, 0);
        bodyGrad.addColorStop(0, "#ff5722");
        bodyGrad.addColorStop(1, "#bf360c");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.roundRect(-15, -40, 30, 40, 5);
        ctx.fill();

        // 4. หัว
        const headGrad = ctx.createRadialGradient(-5, -60, 2, 0, -55, 15);
        headGrad.addColorStop(0, "#fff3e0");
        headGrad.addColorStop(1, "#ffe0b2");
        ctx.beginPath();
        ctx.arc(0, -55, 15, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();

        // 5. แขน (วาดแขนข้างที่ไม่ได้ถือปืน)
        ctx.fillStyle = "#ff5722";
        ctx.save();
        ctx.translate(-15, -35);
        ctx.rotate(walkFactor * 0.5);
        ctx.roundRect(-4, 0, 8, 20, 4);
        ctx.fill();
        ctx.restore();

        // 6. อาวุธ (Weapon Rendering)
        ctx.save();
        ctx.translate(0, -35); // ย้ายจุดหมุนมาอยู่ที่ไหล่/ลำตัว
        const angle = Math.atan2(mouseY - (this.y + bob - 35), mouseX - this.x);
        ctx.rotate(angle);
        
        if (mouseX < this.x) ctx.scale(1, -1);
        ctx.translate(-this.recoil, 0);
        
        if (selectedWeapon === 'gun') {
            ctx.fillStyle = "#0288d1"; // Barrel
            ctx.fillRect(0, -5, 40, 10);
            ctx.fillStyle = "#ffeb3b"; // Tank
            ctx.fillRect(10, -17, 25, 12);
            ctx.fillStyle = "#212121"; // Grip
            ctx.fillRect(-5, -2, 10, 18);
        } else if (selectedWeapon === 'powder') {
            // มือถือแป้ง
            ctx.fillStyle = "#ffe0b2";
            ctx.beginPath();
            ctx.arc(10, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(14, -2, 8, 0, Math.PI * 2);
            ctx.fill();
        } else if (selectedWeapon === 'bowl') {
            // ขันน้ำ
            ctx.fillStyle = "#e0e0e0";
            ctx.beginPath();
            ctx.arc(15, 0, 18, 0, Math.PI, false);
            ctx.fill();
            ctx.strokeStyle = "#bdbdbd";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#81d4fa";
            ctx.beginPath();
            ctx.arc(15, 0, 14, 0, Math.PI, false);
            ctx.fill();
        }
        
        ctx.restore();

        ctx.restore(); // จบการวาดผู้เล่นทั้งหมด
    }
}

let player = new Player();

class Target {
    constructor(student) {
        this.student = student;
        this.init();
    }
    init() {
        this.scale = 1.6 + Math.random() * 0.4;
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.x = this.direction === 1 ? -100 : canvas.width + 100;
        this.y = canvas.height - 100 - (Math.random() * 25);
        this.vx = (1.5 + Math.random() * 2) * this.direction;
        this.baseSpeed = this.vx;
        this.isWet = false;
        this.hitCooldown = 0; // ป้องกันการส่งข้อมูลถี่เกินไป
        this.wetStrength = 0;
        this.wetTimer = 0;
        this.powderPatches = []; // เก็บตำแหน่งรอยแป้งที่โดนจริง
        this.stumbleAngle = 0;
        
        this.headSize = 50 * this.scale;
        this.bodyHeight = 70 * this.scale;
        this.bodyWidth = 40 * this.scale;
        this.shirtColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.walkCycle = Math.random() * Math.PI;
    }
    update() {
        this.x += this.vx;
        this.walkCycle += Math.abs(this.vx) * 0.05;

        if (this.hitCooldown > 0) this.hitCooldown--;

        if (this.wetTimer > 0) {
            this.wetTimer--;
            this.vx *= 0.9; // หน่วงความเร็วเมื่อโดนน้ำ
            this.wetStrength = Math.min(this.wetStrength + 1.2, 10);
        } else {
            this.isWet = false;
            this.vx += (this.baseSpeed - this.vx) * 0.05; // ค่อยๆ กลับไปเดินความเร็วปกติ
            this.wetStrength *= 0.8; // หยุดสั่นทันทีที่หยุดโดนฉีด
            this.stumbleAngle *= 0.9; // คืนตัวจากการเซ
        }

        if ((this.direction === 1 && this.x > canvas.width + 200) || 
            (this.direction === -1 && this.x < -200)) {
            this.init();
        }
    }
    draw() {
        if (!loadedImages[this.student.img]) return;
        ctx.save();
        ctx.filter = 'none'; // รีเซ็ตฟิลเตอร์ป้องกันสีเพี้ยนจากตัวละครก่อนหน้า
        
        const shakeX = (Math.random() - 0.5) * this.wetStrength * 2;
        const tilt = this.stumbleAngle + (Math.sin(Date.now()*0.01) * (this.wetStrength * 0.01));
        const bob = Math.sin(this.walkCycle) * 4;

        ctx.translate(this.x + shakeX, this.y + bob);
        ctx.rotate(tilt);

        // เงา
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.beginPath();
        ctx.ellipse(0, -bob, 20 * this.scale, 8 * this.scale, 0, 0, Math.PI * 2);
        ctx.fill();

        if (this.isWet) ctx.filter = 'brightness(80%) saturate(150%)';

        const walkFactor = Math.sin(this.walkCycle);

        // --- วาดส่วนขา ---
        ctx.fillStyle = "#333";
        ctx.save();
        ctx.translate(-8 * this.scale, -10 * this.scale);
        ctx.rotate(walkFactor * 0.4);
        ctx.roundRect(-4 * this.scale, 0, 9 * this.scale, 20 * this.scale, 5);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.translate(8 * this.scale, -10 * this.scale);
        ctx.rotate(-walkFactor * 0.4);
        ctx.roundRect(-4 * this.scale, 0, 9 * this.scale, 20 * this.scale, 5);
        ctx.fill();
        ctx.restore();

        // --- วาดส่วนลำตัว (เสื้อ) ---
        ctx.save();
        const bodyY = -this.bodyHeight - 5;
        ctx.beginPath();
        ctx.roundRect(-this.bodyWidth/2, bodyY, this.bodyWidth, this.bodyHeight, [15, 15, 5, 5]);
        ctx.clip(); // Clip ให้รอยแป้งอยู่แค่บนเสื้อ
        
        ctx.fillStyle = this.shirtColor;
        ctx.fill();

        // วาดรอยแป้งที่สะสมบนลำตัว
        this.powderPatches.forEach(p => {
            if (p.area === 'body') {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.lx, p.ly, p.size, 0, Math.PI*2);
                ctx.fill();
            }
        });
        ctx.restore();

        // --- วาดส่วนแขน ---
        ctx.save();
        ctx.translate(-this.bodyWidth/2, -this.bodyHeight + 5);
        ctx.rotate(-walkFactor * 0.5 + (this.wetStrength * 0.1));
        ctx.fillStyle = this.shirtColor;
        ctx.roundRect(-6 * this.scale, 0, 8 * this.scale, 25 * this.scale, 4);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.bodyWidth/2, -this.bodyHeight + 5);
        ctx.rotate(walkFactor * 0.5 - (this.wetStrength * 0.1));
        ctx.roundRect(-2 * this.scale, 0, 8 * this.scale, 25 * this.scale, 4);
        ctx.fill();
        ctx.restore();

        // --- วาดส่วนหัว ---
        const headCenterY = -this.bodyHeight - 10 - this.headSize/2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, headCenterY, this.headSize/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(loadedImages[this.student.img], -this.headSize/2, headCenterY - this.headSize/2, this.headSize, this.headSize);

        // วาดรอยแป้งที่สะสมบนใบหน้า
        this.powderPatches.forEach(p => {
            if (p.area === 'head') {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.lx, p.ly, p.size, 0, Math.PI*2);
                ctx.fill();
            }
        });
        ctx.restore();
        ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();

        // ชื่อพร้อมขอบนุ่มนวล
        ctx.filter = 'none';
        ctx.fillStyle = "white";
        ctx.font = `bold ${11 * this.scale}px Kanit`;
        ctx.textAlign = "center";
        ctx.shadowBlur = 8; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillText(this.student.nickname, 0, headCenterY - this.headSize/2 - 5);
        ctx.restore();
    }
    hit(sourceX, type = 'gun', hitX = null, hitY = null) {
        this.isWet = true;

        // บันทึกสถิติลง Firebase (หน่วงเวลาไว้เล็กน้อยเพื่อความเสถียร)
        if (this.hitCooldown <= 0) {
            const safeNick = this.student.nickname.replace(/[.#$[\]]/g, "_");
            db.ref(`songkran_stats/${safeNick}/${type}`).transaction(c => (c || 0) + 1);
            db.ref(`songkran_stats/${safeNick}/total`).transaction(c => (c || 0) + 1);
            this.hitCooldown = 20; 
        }

        if (type === 'powder' && hitX !== null && hitY !== null && Math.random() > 0.1) {
            // คำนวณแรงสั่นและจังหวะเดิน ณ เวลาที่โดน เพื่อให้แป้งติดถูกตำแหน่ง
            const shakeX = (Math.random() - 0.5) * this.wetStrength * 2;
            const bob = Math.sin(this.walkCycle) * 4;
            const headCenterY = -this.bodyHeight - 10 - this.headSize/2;

            // คำนวณพิกัดสัมพัทธ์ (Relative Position) จากจุดที่เมาส์โดนตัวละครจริง ๆ
            const lx = hitX - (this.x + shakeX);
            const ly = hitY - (this.y + bob);

            const area = (ly < -this.bodyHeight - 5) ? 'head' : 'body';
            
            this.powderPatches.push({
                area: area,
                lx: lx,
                ly: ly,
                size: 8 + Math.random() * 12, // ปรับขนาดรอยแป้งให้ใหญ่ขึ้นเล็กน้อย
                opacity: 0.7 + Math.random() * 0.3
            });
            
            // เพิ่มขีดจำกัดรอยแป้งเป็น 100 เพื่อความสะใจ
            if (this.powderPatches.length > 100) this.powderPatches.shift();
        }
        this.wetTimer = 15; // รีเซ็ตสั้นๆ เพื่อให้หายสั่นไวเมื่อหยุดยิง
        
        // ปรับแรงผลักให้พอดี ไม่ให้ตัวละครบินหายไป
        const pushDir = this.x > sourceX ? 1 : -1;
        this.vx += pushDir * 0.05; // แรงผลักนุ่มนวลขึ้น
        this.stumbleAngle = pushDir * 0.2; // อาการเซ
    }
}

class Droplet {
    constructor(x, y, tx, ty) {
        this.x = x; this.y = y;
        const angle = Math.atan2(ty - y, tx - x) + (Math.random()-0.5)*0.08;
        const force = 20;
        this.vx = Math.cos(angle) * force + (Math.random()-0.5)*2;
        this.vy = Math.sin(angle) * force - 2; // วิถีโค้งเล็กน้อย
        this.life = 1.0; this.size = 3 + Math.random() * 3;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.5; // Gravity
        this.life -= 0.02;
    }
    draw() {
        ctx.fillStyle = `rgba(200, 240, 255, ${this.life * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Splash {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1.0;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.life -= 0.05;
    }
    draw() {
        ctx.fillStyle = `rgba(179, 229, 252, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Cloud {
    constructor() { this.reset(true); }
    reset(init = false) {
        this.x = init ? Math.random() * canvas.width : -300;
        this.y = Math.random() * canvas.height * 0.3;
        this.speed = 0.2 + Math.random() * 0.4;
        this.size = 60 + Math.random() * 80;
    }
    update() {
        this.x += this.speed;
        if (this.x > canvas.width + 300) this.reset();
    }
    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.arc(this.x+this.size*0.5, this.y-this.size*0.2, this.size*0.7, 0, Math.PI*2);
        ctx.arc(this.x-this.size*0.5, this.y-this.size*0.2, this.size*0.7, 0, Math.PI*2);
        ctx.fill();
    }
}

class Leaf {
    constructor() { this.reset(true); }
    reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : -50;
        this.vx = (Math.random() - 0.2) * 1.5;
        this.vy = 1 + Math.random() * 1.5;
        this.rot = Math.random() * Math.PI*2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
    }
    update() {
        this.x += this.vx + Math.sin(Date.now() * 0.002) * 2;
        this.y += this.vy;
        this.rot += this.rotSpeed;
        if (this.y > canvas.height + 50) this.reset();
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = "#43a047";
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
}

class Mist {
    constructor(x, y, vx, vy, isPowder = false) {
        this.x = x; this.y = y;
        this.vx = vx * 0.3 + (Math.random()-0.5)*2;
        this.vy = vy * 0.3 + (Math.random()-0.5)*2;
        this.size = 5 + Math.random() * 10;
        this.life = 1.0;
        this.isPowder = isPowder;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.life -= 0.04;
    }
    draw() {
        const color = this.isPowder ? `255, 255, 255` : `220, 240, 255`;
        const opacity = this.isPowder ? 0.6 : 0.2;
        ctx.fillStyle = `rgba(${color}, ${this.life * opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

// Init environment
for(let i=0; i<6; i++) clouds.push(new Cloud());
for(let i=0; i<20; i++) leaves.push(new Leaf());

// --- Logic ส่วนการจัดการ Game Screen (Selection) ---
const grid = document.getElementById('student-grid');
const startBtn = document.getElementById('start-game-btn');
const searchInput = document.getElementById('search-input');
const weaponBtns = document.querySelectorAll('.weapon-btn');

weaponBtns.forEach(btn => {
    btn.onclick = () => {
        weaponBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedWeapon = btn.dataset.weapon;
    };
});

function renderGrid(filter = "") {
    grid.innerHTML = "";
    studentList.filter(s => s.nickname.includes(filter) || s.fullname.includes(filter)).forEach(std => {
        const card = document.createElement('div');
        card.className = `student-card ${selectedStudents.includes(std) ? 'selected' : ''}`;
        card.innerHTML = `<img src="${std.img}"><p><strong>${std.nickname}</strong></p>`;
        card.onclick = () => {
            const idx = selectedStudents.indexOf(std);
            if (idx > -1) selectedStudents.splice(idx, 1);
            else selectedStudents.push(std);
            renderGrid(searchInput.value);
            startBtn.disabled = selectedStudents.length === 0;
            document.getElementById('selected-count').innerText = selectedStudents.length;
        };
        grid.appendChild(card);
    });
}

searchInput.oninput = (e) => renderGrid(e.target.value);
document.getElementById('btn-select-all').onclick = () => { selectedStudents = [...studentList]; renderGrid(); startBtn.disabled = false; };
document.getElementById('btn-clear').onclick = () => { selectedStudents = []; renderGrid(); startBtn.disabled = true; };
document.getElementById('btn-random').onclick = () => {
    const count = Math.min(studentList.length, 6); // สุ่มมา 6 คน
    const shuffled = [...studentList].sort(() => 0.5 - Math.random());
    selectedStudents = shuffled.slice(0, count);
    renderGrid(searchInput.value);
    
    const selectedCountSpan = document.getElementById('selected-count');
    if (selectedCountSpan) selectedCountSpan.innerText = selectedStudents.length;
    startBtn.disabled = selectedStudents.length === 0;
};

// ระบบดึงข้อมูลอันดับจาก Firebase
document.getElementById('btn-leaderboard').onclick = () => {
    const modal = document.getElementById('leaderboard-modal');
    const list = document.getElementById('leaderboard-list');
    modal.style.display = 'flex';
    list.innerHTML = '<p style="color:#0288d1">กำลังโหลดข้อมูลอันดับแบบเรียลไทม์...</p>';
    
    // เปลี่ยนจาก .once เป็น .on เพื่อให้แสดงผลแบบเรียลไทม์
    db.ref('songkran_stats').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) { list.innerHTML = "ยังไม่มีใครโดนสาดในตอนนี้!"; return; }
        
        // เรียงลำดับตาม Total (จากมากไปน้อย)
        const sorted = Object.entries(data).sort((a, b) => (b[1].total || 0) - (a[1].total || 0));
        let html = `<table class="leaderboard-table"><tr><th>ชื่อ</th><th>🔫</th><th>⚪</th><th>🥣</th><th>รวม</th></tr>`;
        sorted.forEach(([name, stats]) => {
            html += `<tr><td>${name}</td><td>${stats.gun || 0}</td><td>${stats.powder || 0}</td><td>${stats.bowl || 0}</td><td><strong>${stats.total || 0}</strong></td></tr>`;
        });
        html += "</table>";
        list.innerHTML = html;
    });
};

// ฟังก์ชันสำหรับปิด Leaderboard และหยุดการดึงข้อมูลเพื่อประหยัดทรัพยากร
window.closeLeaderboardModal = () => {
    document.getElementById('leaderboard-modal').style.display = 'none';
    db.ref('songkran_stats').off(); // หยุดการฟังข้อมูล
};

startBtn.onclick = () => {
    // ล้างข้อมูลในเกมเดิมก่อนเริ่มใหม่ เพื่อป้องกันคะแนนเด้งเอง
    targets.length = 0;
    droplets.length = 0;
    splashes.length = 0;
    mists.length = 0;
    powderBalls.length = 0;
    player = new Player(); // รีเซ็ตตำแหน่งผู้เล่น

    let loaded = 0;
    selectedStudents.forEach(std => {
        const img = new Image();
        img.src = std.img;
        img.onload = () => {
            loadedImages[std.img] = img;
            loaded++;
            if (loaded === selectedStudents.length) {
                document.getElementById('selection-screen').style.display = 'none';
                gameLoop();

                // ระบบทยอยปล่อยตัวละคร (Gradual Spawning)
                let spawnIndex = 0;
                const spawnInterval = setInterval(() => {
                    if (spawnIndex < selectedStudents.length) {
                        targets.push(new Target(selectedStudents[spawnIndex]));
                        spawnIndex++;
                    } else {
                        clearInterval(spawnInterval); // เมื่อครบแล้วให้หยุดตัวนับ
                    }
                }, 1500); // ปล่อยตัวละครทุกๆ 1.5 วินาที
            }
        };
    });
};

function handleInput(x, y) {
    mouseX = x; mouseY = y;
}

// ปรับปรุงระบบ Input ให้รองรับทั้ง Mouse และ Touch
window.addEventListener('mousemove', (e) => handleInput(e.clientX, e.clientY));
window.addEventListener('mousedown', () => isShooting = true);
window.addEventListener('mouseup', () => isShooting = false);

// รองรับการเล่นบนมือถือ/ไอแพด (Touch Events)
canvas.addEventListener('touchstart', (e) => {
    isShooting = true;
    handleInput(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    handleInput(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault(); // ป้องกันการลากหน้าจอไปมาขณะเล่น
}, { passive: false });

canvas.addEventListener('touchend', () => {
    isShooting = false;
});

// Keyboard Events
window.addEventListener('keydown', (e) => { 
    const k = e.key.toLowerCase(); // ใช้ตัวแปร k เพื่อไม่ให้ชนกับ scope อื่น
    if(k === 'a' || k === 'arrowleft') keys.a = true; 
    if(k === 'd' || k === 'arrowright') keys.d = true; 
    if(k === 'w' || k === 'arrowup' || k === ' ' || k === 'spacebar') keys.space = true; 
});
window.addEventListener('keyup', (e) => { 
    const k = e.key.toLowerCase();
    if(k === 'a' || k === 'arrowleft') keys.a = false; 
    if(k === 'd' || k === 'arrowright') keys.d = false; 
    if(k === 'w' || k === 'arrowup' || k === ' ' || k === 'spacebar') keys.space = false; 
});

// เชื่อมต่อปุ่มควบคุมบนหน้าจอ (Mobile Controls)
const setupControlBtn = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    
    const start = (e) => { e.preventDefault(); keys[key] = true; };
    const end = (e) => { e.preventDefault(); keys[key] = false; };
    
    // ระบบ Touch
    btn.addEventListener('touchstart', start, { passive: false });
    btn.addEventListener('touchend', end, { passive: false });
    
    // ระบบ Mouse สำหรับคอม
    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', end);
    btn.addEventListener('mouseleave', end);
};

setupControlBtn('btn-left', 'a');
setupControlBtn('btn-right', 'd');
setupControlBtn('btn-jump', 'space');

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // วาดฉากพื้นหลัง
    drawEnvironment();

    // เรียงลำดับการวาด (Layering)
    // 1. วาดคนเดิน (อยู่ด้านหลังผู้เล่น)
    targets.forEach(t => {
        t.update();
        t.draw();
    });

    // 2. วาดผู้เล่น
    player.update();
    player.draw();

    if (isShooting) {
        const playerBob = player.isJumping ? 0 : Math.sin(player.walkCycle) * 3;
        const startX = player.x;
        const startY = player.y + playerBob - 35;

        if (selectedWeapon === 'gun') {
            // เอฟเฟกต์ลำแสงน้ำ (Water Beam) เมื่อฉีดค้างไว้นาน
            if (player.shootTimer > 60) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(mouseX, mouseY);
                const beamGrad = ctx.createLinearGradient(startX, startY, mouseX, mouseY);
                beamGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
                beamGrad.addColorStop(0.2, "rgba(0, 184, 212, 0.6)");
                beamGrad.addColorStop(1, "rgba(200, 240, 255, 0)");
                ctx.strokeStyle = beamGrad;
                ctx.lineWidth = 15 + Math.sin(Date.now() * 0.05) * 5;
                ctx.lineCap = "round";
                ctx.globalAlpha = 0.6;
                ctx.shadowBlur = 20; ctx.shadowColor = "#00e5ff";
                ctx.stroke();
                ctx.restore();
                for(let m=0; m<2; m++) mists.push(new Mist(mouseX, mouseY, (Math.random()-0.5)*10, (Math.random()-0.5)*10));
            }
            const sprayCount = player.shootTimer > 60 ? 6 : 3;
            for(let j=0; j<sprayCount; j++) {
                const d = new Droplet(startX, startY, mouseX, mouseY);
                if (player.shootTimer > 60) { d.vx *= 1.4; d.vy *= 1.4; }
                droplets.push(d);
                mists.push(new Mist(startX, startY, d.vx, d.vy));
            }
        } else if (selectedWeapon === 'powder') {
            // ปาแป้งเป็นก้อน (Lump) - ปรับจังหวะการปา
            if (player.shootTimer % 10 === 1) {
                powderBalls.push(new PowderBall(startX, startY, mouseX, mouseY));
            }
        } else if (selectedWeapon === 'bowl') {
            // สาดขันน้ำ (Burst)
            if (player.shootTimer % 40 === 1) {
                for(let j=0; j<20; j++) {
                    const d = new Droplet(startX, startY, mouseX, mouseY);
                    d.size = 6 + Math.random() * 8;
                    d.vx *= 0.8; d.vy -= 2;
                    droplets.push(d);
                }
                player.recoil = 30;
            }
        }
    }

    clouds.forEach(c => { c.update(); c.draw(); });
    leaves.forEach(l => { l.update(); l.draw(); });

    // จัดการหยดน้ำ
    for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.update();
        d.draw();

        targets.forEach(t => {
            const dx = d.x - t.x;
            const dy = d.y - (t.y - t.bodyHeight/2 - 20);
            if (Math.sqrt(dx*dx + dy*dy) < 35 * t.scale) {
                t.hit(player.x, selectedWeapon, d.x, d.y);
                // ถ้าโดนลำแสง จะสั่นแรงและกระเด็นแรงขึ้น
                if (selectedWeapon === 'gun' && player.shootTimer > 60) {
                    t.wetStrength = Math.min(t.wetStrength + 2, 25);
                    t.vx += (t.x > player.x ? 1 : -1) * 0.6;
                }
                for(let s=0; s<3; s++) splashes.push(new Splash(d.x, d.y));
                droplets.splice(i, 1);
            }
        });
        if (d.life <= 0) droplets.splice(i, 1);
    }

    // Mist
    for (let i = mists.length - 1; i >= 0; i--) {
        mists[i].update();
        mists[i].draw();
        if (mists[i].life <= 0) mists.splice(i, 1);
    }

    // Powder Balls (ก้อนแป้ง)
    for (let i = powderBalls.length - 1; i >= 0; i--) {
        const pb = powderBalls[i];
        pb.update();
        pb.draw();
        targets.forEach(t => {
            const dx = pb.x - t.x;
            const dy = pb.y - (t.y - t.bodyHeight/2 - 20);
            if (Math.sqrt(dx*dx + dy*dy) < 35 * t.scale) {
                t.hit(player.x, 'powder', pb.x, pb.y);
                // สร้างเอฟเฟกต์แป้งกระจายเมื่อโดนตัว
                for(let m=0; m<10; m++) mists.push(new Mist(pb.x, pb.y, (Math.random()-0.5)*5, (Math.random()-0.5)*5, true));
                powderBalls.splice(i, 1);
            }
        });
        if (powderBalls[i] && powderBalls[i].life <= 0) powderBalls.splice(i, 1);
    }

    // จัดการเอฟเฟกต์กระจาย
    for (let i = splashes.length - 1; i >= 0; i--) {
        splashes[i].update();
        splashes[i].draw();
        if (splashes[i].life <= 0) splashes.splice(i, 1);
    }

    requestAnimationFrame(gameLoop);
}

function drawEnvironment() {
    ctx.filter = 'none'; // ล้างค่า Filter ก่อนวาดฉากหลังเพื่อป้องกันบัคตัวดำ/ฉากมืด
    // ท้องฟ้าไล่เฉดลึก
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
    skyGrad.addColorStop(0, '#01579b');
    skyGrad.addColorStop(0.3, '#0288d1');
    skyGrad.addColorStop(0.6, '#81d4fa');
    skyGrad.addColorStop(1, '#e1f5fe');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ภูเขาเลเยอร์ที่ 1 (ไกลมาก)
    ctx.fillStyle = '#bbdefb';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 120);
    ctx.bezierCurveTo(canvas.width*0.2, canvas.height-300, canvas.width*0.5, canvas.height-200, canvas.width*0.8, canvas.height-350);
    ctx.lineTo(canvas.width, canvas.height - 120);
    ctx.fill();

    // ภูเขาเลเยอร์ที่ 2
    ctx.fillStyle = '#90caf9';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 150);
    ctx.lineTo(canvas.width * 0.3, canvas.height - 260);
    ctx.lineTo(canvas.width * 0.6, canvas.height - 150);
    ctx.lineTo(canvas.width * 0.8, canvas.height - 240);
    ctx.lineTo(canvas.width, canvas.height - 150);
    ctx.fill();

    // พื้นหญ้า (Gradient)
    const grassGrad = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
    grassGrad.addColorStop(0, '#43a047');
    grassGrad.addColorStop(1, '#2e7d32');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

    // ทางเดินในสวน (Path)
    const pathGrad = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
    pathGrad.addColorStop(0, '#8d6e63');
    pathGrad.addColorStop(1, '#5d4037');
    ctx.fillStyle = pathGrad;
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // รายละเอียดทางเดิน (Texture เล็กน้อย)
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for(let i=0; i<canvas.width; i+=40) {
        ctx.fillRect(i, canvas.height-100, 2, 100);
    }
}

renderGrid();