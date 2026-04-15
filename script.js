// 1. --- การตั้งค่า Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyAb-68LOJNRhVmZeCjCGvfg-lZdt-LCU0E",
    databaseURL: "https://smte-6550d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smte-6550d",
    appId: "1:992310898236:web:a05a1711cfdf371400dd39",
};

// เริ่มต้นใช้งาน Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// 2. --- ข้อมูลสมาชิกและจักรวาล ---
const studentList = [
    { fullname: "นายรัตนโกสินทร์ สาดแสง", nickname: "สิงโต", ig: "li0nnnx45", fb: "61580489709518", img: "member/std1.jpeg" },
    { fullname: "นายธัญวิน อร่ามวงศ์วิทย์", nickname: "อะฟิฟ", ig: "afifthanyawin", fb: "@afif.Thanyawin", img: "member/std2.jpeg" },
    { fullname: "นายกันตภณ เพชรพูล", nickname: "เซียมซี", ig: "siamsi0107", fb: "@kan.tphn.phechr.phul", img: "member/std3.jpeg" },
    { fullname: "นายวิชัย หลีหมัด", nickname: "รุก", ig: "wwucx_", fb: "@wichai.lheemad", img: "member/std4.jpeg" },
    { fullname: "นายกิตติพัทธ์ แช่ลิ่ม", nickname: "น็อต", ig: "not_kitti.pat", fb: "@Not.Kittipat", img: "member/std5.jpeg" },
    { fullname: "นายธีรัตม์ ทองชูช่วย", nickname: "เท็น", ig: "tenn_tn10", fb: "@ten.teerat.2024", img: "member/std6.jpeg" },
    { fullname: "นายศิระศิลป์ เบ็ญหยีหมาน", nickname: "อิลญีน", ig: "eenyeen.sirasin", fb: "@sirasin.benyeeman", img: "member/std7.jpeg" },
    { fullname: "นายแสงอรุณ ไพโรจน์", nickname: "ฟีโน่", ig: "sxxzl_p", fb: "@SAngxrun.PAirot", img: "member/std8.jpeg" },
    { fullname: "นายอธิวัชร์ เภอโส๊ะ", nickname: "ธาม", ig: "thxmgojiraaaa", fb: "@athiwat.persoh", img: "member/std9.jpeg" },
    { fullname: "นายภานุพัฒน์ หลังปูเต๊ะ", nickname: "ไก่มีน", ig: "panupat175", fb: "@pha.nu.phat.hn.hlang.pu.tea.kc.sadao.songkhla", img: "member/std10.jpeg" },
    { fullname: "นายฐาปณวัชร์ แช่วุ่น", nickname: "วัชร์", ig: "w_t1353", fb: "@thapanawatsaewun", img: "member/std11.jpeg" },
    { fullname: "นายฐาปณวิชญ์ แช่วุ่น", nickname: "วิชญ์", ig: "w_t._.panawit", fb: "@thapn.wichy.ese.wun", img: "member/std12.jpeg" },
    { fullname: "นายธีระพิชัย ศุภณัฏฐ์ปทุม", nickname: "หมิง", ig: "seetabnueng", fb: "@thira.phichai.2025", img: "member/std13.jpeg" },
    { fullname: "นายอัฟฟาน หลีเส็ม", nickname: "อัฟฟาน", ig: "qffqn_52", fb: "@affanlisem", img: "member/std14.jpeg" },
    { fullname: "นางสาวธนัสถา แช่เจ่", nickname: "เม่ย", ig: "mxzis_", fb: "@thanattha.saeje", img: "member/std15.jpeg" },
    { fullname: "นางสาวหนึ่งฤทัย รัตนอุดม", nickname: "มี่", ig: "nmiiqxx_", fb: "@mi.mee.7545", img: "member/std16.jpeg" },
    { fullname: "นางสาวธมน ชาลีเปรี่ยม", nickname: "ธมน", ig: "seetabnueng", fb: "@thamon.chaleepaen", img: "member/std17.jpeg" },
    { fullname: "นางสาวปัณณิกา มัณฑะนานนท์", nickname: "ปัน", ig: "puuuuuuuuuuuu.n", fb: "@ppun.nika2", img: "member/std18.jpeg" },
    { fullname: "นางสาวนภาศิริ อาทรวิริยกุล", nickname: "นภา", ig: "nnnnpsriii_", fb: "@napasiri.arthonwiriyakun", img: "member/std19.jpeg" },
    { fullname: "นางสาวพิมพ์นานา เกียรติเสนกุล", nickname: "นานา", ig: "pipim._.o", fb: "@pimnana.kiatisenkul", img: "member/std20.jpeg" },
    { fullname: "นางสาวธัญวรัตน์ รัตนกาญจน์", nickname: "ยิม", ig: "yyieeim", fb: "@yim.thanwarat.2024", img: "member/std21.jpeg" },
    { fullname: "นางสาวฐิติวรดา หมานหมัด", nickname: "โมจิ", ig: "mxgogi", fb: "@mxjii.mx", img: "member/std22.jpeg" },
    { fullname: "นางสาวนิจิตตา พิพัฒน์นิธิกุลชัย", nickname: "ชมพู่", ig: "somjeed_52", fb: "@nijtjta.ja", img: "member/std23.jpeg" },
    { fullname: "นางสาวอรสา กิ้มลั่น", nickname: "มิลค์", ig: "m1lkmx_", fb: "@ourasa.kimlan.5", img: "member/std24.jpeg" },
    { fullname: "นางสาวรัญชิดา หมานหนับ", nickname: "ชิดา", ig: "chi_.dx", fb: "@ranchida.mannab.2025", img: "member/std25.jpeg" },
    { fullname: "นางสาวกานต์สิรี สุขมิ่ง", nickname: "ปาน", ig: "seetabnueng", fb: "@kansiree.sukming", img: "member/std26.jpeg" },
    { fullname: "นางสาวลลนา สังข์แก้ว", nickname: "ตอง", ig: "txng._o", fb: "@lalana.sangkaew", img: "member/std27.jpeg" },
    { fullname: "นางสาวธัญญรัตน์ เส้งนนท์", nickname: "เทียน", ig: "thayyratnesngnnth", fb: "@thay.y.ratn.seng.nnth", img: "member/std28.jpeg" },
    { fullname: "นางสาวภูริชญา โสะบิลเมาะ", nickname: "นานะ", ig: "nanaann.p", fb: "@purichaya.nana.7", img: "member/std29.jpeg" },
    { fullname: "นางสาวกัญญาภัทร แสงรักษ์", nickname: "ด้า", ig: "nourida_78", fb: "@kanyaphat.sangrak", img: "member/std30.jpeg" }
];

const teacherData = { fullname: "นายจิรกฤต หมกแดง", nickname: "ครูกฤตคนหล่อ", no: "ครูที่ปรึกษา", ig: "grit.ji", img: "member/std0.jpeg" };

// 3. --- ข้อมูลผู้สมัครโหวต ---
const candidates = [
    { id: 10, name: "ไก่มีน", img: "std10.jpeg" },
    { id: 9, name: "ไก่ธาม", img: "std9.jpeg" },
    { id: 8, name: "ไก่ฟีโน่", img: "std8.jpeg" },
    { id: 6, name: "ไก่เท็น", img: "std6.jpeg" },
    { id: 4, name: "ไก่รุก", img: "std4.jpeg" },
    { id: 1, name: "ไก่สิงโต", img: "std1.jpeg" },
    { id: 0, name: "ครูกฤตคนหล่อ", img: "std0.jpeg" }
];

let currentScores = {};

// 4. --- ฟังก์ชันระบบหลัก ---

// เปลี่ยนหน้า
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

// สร้างปุ่มโหวต
// สร้างการ์ดโหวต (เวอร์ชันเน้นมือถือ)
function initVoteGrid() {
    const grid = document.getElementById('vote-grid');
    if (!grid) return;
    grid.innerHTML = '';

    candidates.forEach(person => {
        // สร้าง Card Wrapper
        const card = document.createElement('div');
        card.className = 'vote-card';

        card.innerHTML = `
            <img src="${person.img}" alt="${person.name}" onerror="this.src='std0.jpeg'">
            <span class="name-label">${person.name}</span>
            <button class="btn-vote" onclick="addVote(${person.id})">VOTE 🐔</button>
        `;

        grid.appendChild(card);
    });
}

function addVote(id) {
    if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
    }
    // ใช้ Path เป็น 'votes/user_ID' เพื่อบังคับให้เป็น Object
    db.ref('votes/user_' + id).transaction((current) => (current || 0) + 1);
}

function updateRankingUI() {
    const rankingList = document.getElementById('ranking-list');
    if (!rankingList) return;

    const sorted = candidates.map(c => {
        // ดึงคะแนนจาก ID ที่ระบุไว้ใน currentScores
        return { ...c, votes: currentScores[c.id] || 0 };
    }).sort((a, b) => b.votes - a.votes);

    rankingList.innerHTML = sorted.map((p, i) => {
        const rankColor = i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#92400e' : '#64748b';
        return `
            <div class="ranking-item" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 5px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 1.2rem; font-weight: bold; color: ${rankColor}; width: 25px;">${i + 1}</span>
                    <img src="${p.img}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid ${rankColor};" onerror="this.src='member/std0.jpeg'">
                    <span style="font-size: 1rem; color: white;">${p.name}</span>
                </div>
                <div style="text-align: right;">
                    <span style="display: block; font-weight: bold; color: #00ff88; font-size: 1.1rem;">${p.votes.toLocaleString()}</span>
                    <small style="color: #64748b; font-size: 0.7rem;">คะแนน</small>
                </div>
            </div>
        `;
    }).join('');
}

// ฟังก์ชันกลางสำหรับล็อก/ปลดล็อกจอ
function toggleBodyLock(isLocked) {
    if (isLocked) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }
}

// แก้ไขฟังก์ชันเปิด Modal สมาชิก
function openModal(data) {
    // 1. อัปเดตข้อมูลรูปภาพพร้อมระบบป้องกัน Error
    const imgEl = document.getElementById('m-img');
    imgEl.src = data.img;
    imgEl.onerror = () => { imgEl.src = 'member/std0.jpeg'; }; // ถ้าโหลดรูปไม่ขึ้น ให้ใช้รูปสำรอง

    // 2. อัปเดตชื่อและเลขที่/ฉายา
    document.getElementById('m-fullname').innerText = data.fullname;
    document.getElementById('m-nickname-no').innerText = `${data.nickname} | No.${data.no}`;

    // 3. จัดการ Instagram (ซ่อนปุ่มถ้าไม่มีข้อมูล)
    const igBtn = document.getElementById('m-ig');
    if (data.ig && data.ig !== "#" && data.ig !== "") {
        // รองรับทั้งใส่แค่ชื่อ user หรือใส่ลิงก์มาเต็มๆ
        igBtn.href = data.ig.includes('http') ? data.ig : "https://instagram.com/" + data.ig;
        igBtn.style.display = "flex";
    } else {
        igBtn.style.display = "none";
    }

    // 4. จัดการ Facebook (ซ่อนปุ่มถ้าไม่มีข้อมูล)
    const fbBtn = document.getElementById('m-fb');
    if (data.fb && data.fb !== "#" && data.fb !== "") {
        fbBtn.href = data.fb.includes('http') ? data.fb : "https://facebook.com/" + data.fb;
        fbBtn.style.display = "flex";
    } else {
        fbBtn.style.display = "none";
    }

    // 5. แสดง Modal พร้อมใส่ Class สำหรับ Animation
    const modal = document.getElementById('modalOverlay');
    modal.style.display = 'flex'; // มั่นใจว่าแสดงผลแบบ Flex

    // ใช้ setTimeout เล็กน้อยเพื่อให้ CSS Transition ทำงาน (ถ้ามี)
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);

    // สร้างอนิเมชันสำหรับปุ่ม Social เมื่อ Modal แสดง
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        btn.style.transition = 'all 0.4s ease-out';

        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 200 + index * 80);
    });

    // 6. ล็อกหน้าจอไม่ให้สกรูล
    if (typeof toggleBodyLock === "function") {
        toggleBodyLock(true);
    } else {
        document.body.style.overflow = 'hidden';
    }
}

// เพิ่มฟังก์ชันปิด Modal ให้สมบูรณ์
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('open');

    // รอให้แอนิเมชันจบก่อนค่อยซ่อน display
    setTimeout(() => {
        modal.style.display = 'none';
        if (typeof toggleBodyLock === "function") {
            toggleBodyLock(false);
        } else {
            document.body.style.overflow = 'auto';
        }
    }, 200); // เวลาต้องสัมพันธ์กับ CSS Transition
}

// แก้ไขฟังก์ชัน Leaderboard
function openVoteModal() {
    updateRankingUI();
    const voteModal = document.getElementById('voteResultModal');
    voteModal.classList.add('open'); // ใช้ class open แทนการแก้ .style.display
    toggleBodyLock(true);
}

function closeVoteModal() {
    const voteModal = document.getElementById('voteResultModal');
    voteModal.classList.remove('open');
    toggleBodyLock(false);
}

// สร้าง Universe
function initUniverse() {
    const universeContainer = document.getElementById('universe');
    if (!universeContainer) return;
    const layerConfig = [{ radius: 20, count: 7, speed: 45 }, { radius: 32, count: 10, speed: 65 }, { radius: 44, count: 13, speed: 85 }];
    let totalCount = 1;

    layerConfig.forEach(layer => {
        const orbit = document.createElement('div');
        orbit.className = 'orbit-layer';
        orbit.style.width = orbit.style.height = `${layer.radius * 2}vmin`;
        orbit.style.animation = `rotate-cw ${layer.speed}s linear infinite`;

        for (let i = 0; i < layer.count; i++) {
            if (totalCount > studentList.length) break;
            const info = studentList[totalCount - 1];
            const angle = (i / layer.count) * (2 * Math.PI);
            const student = document.createElement('div');
            student.className = 'student';
            student.style.left = `calc(50% + ${Math.cos(angle) * layer.radius}vmin - 4vmin)`;
            student.style.top = `calc(50% + ${Math.sin(angle) * layer.radius}vmin - 4vmin)`;

            const count = totalCount;
            student.innerHTML = `<div class="counter-spin" style="animation: rotate-ccw ${layer.speed}s linear infinite"><img src="${info.img}"></div>`;
            student.onclick = (e) => { e.stopPropagation(); openModal({ ...info, no: count }); };

            orbit.appendChild(student);
            totalCount++;
        }
        universeContainer.appendChild(orbit);
    });
}

// 5. --- การทำงานเมื่อโหลดหน้าเว็บ ---
document.addEventListener('DOMContentLoaded', () => {
    initUniverse();
    initVoteGrid();

    const teacherBtn = document.getElementById('teacher-btn');
    if (teacherBtn) teacherBtn.onclick = () => openModal(teacherData);

    // สร้างดาวในหน้า member-page
    const memberPage = document.getElementById('member-page');
    if (memberPage) {
        const smallStars = generateStars(200, 1, 1);
        const mediumStars = generateStars(50, 1, 2);
        const largeStars = generateStars(10, 2, 3);

        const starsLayer1 = document.createElement('div');
        starsLayer1.className = 'star-layer';
        starsLayer1.style.boxShadow = smallStars;
        starsLayer1.style.animation = 'animateStars 50s linear infinite';
        starsLayer1.style.opacity = '0.7';
        starsLayer1.style.zIndex = '1';
        memberPage.appendChild(starsLayer1);

        const starsLayer2 = document.createElement('div');
        starsLayer2.className = 'star-layer';
        starsLayer2.style.boxShadow = `${mediumStars},${largeStars}`;
        starsLayer2.style.animation = 'animateStars 80s linear infinite reverse';
        starsLayer2.style.opacity = '0.5';
        starsLayer2.style.zIndex = '2';
        memberPage.appendChild(starsLayer2);
    }

    // ส่วนที่ติดตาม Firebase
    db.ref('votes').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        currentScores = {};

        candidates.forEach(c => {
            const score = data['user_' + c.id] || 0;
            currentScores[c.id] = score;
        });

        if (document.getElementById('voteResultModal').classList.contains('open')) {
            updateRankingUI();
        }
    });
});

document.addEventListener('mousemove', (e) => {
    const aura1 = document.querySelector('.aura-1');
    const aura2 = document.querySelector('.aura-2');
    if (!aura1 || !aura2) return;

    if (document.getElementById('home-page').classList.contains('active')) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        aura1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
        aura2.style.transform = `translate(${x * -50}px, ${y * -50}px)`;
    }
});