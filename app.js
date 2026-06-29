/**
 * CYBER CRIME RESOLUTION ENGINE - ENGINE CORE
 * Quản lý dữ liệu câu hỏi và logic trò chơi giải mật mã ASCII
 */

// 1. Khai báo bộ câu hỏi liên kết chặt chẽ với logic index xáo trộn kết quả
const gameQuestions = [
    { id: 1, q: "Trong công thức giá trị hàng hóa của Mác W = c + v + m, thành phần nào là 'Tư bản bất biến' đại diện cho giá trị máy móc, nguyên vật liệu sản xuất?", ans: "c (Tư bản bất biến)", code: "255" }, // U
    { id: 2, q: "Tiền lương mà nhà tư bản trả cho cầu thủ hoặc công nhân may áo đấu được Mác gọi là gì trong cấu trúc giá trị? (4 từ)", ans: "Tư bản khả biến (v)", code: "67" }, // C
    { id: 3, q: "Lợi nhuận chịu tác động trực tiếp của yếu tố nào? (4 từ)", ans: "Giá cả thị trường", code: "4C" }, // L
    { id: 4, q: "Phạm trù nào là hình thái biến tướng của giá trị thặng dư, dễ bị nhầm lẫn là do tài kinh doanh hay do thị trường lưu thông tự đẻ ra tiền? (2 từ)", ans: "Lợi nhuận (p)", code: "73" }, // I
    { id: 5, q: "Theo C. Mác, đại lượng nào phản ánh kết quả kinh doanh trên thị trường? (2 từ)", ans: "Lợi nhuận", code: "59" }, // Y
    { id: 6, q: "Ai hay yếu tố nào là nguồn gốc duy nhất thực sự tạo ra phần giá trị dôi ra (m) cho xã hội? (2 từ)", ans: "Sức lao động", code: "4E" }, // N
    { id: 7, q: "Máy móc có tạo ra giá trị mới không?", ans: "Không", code: "254" }, // T
    { id: 8, q: "Giá trị thặng dư phản ánh bản chất gì của nền sản xuất tư bản? (2 từ)", ans: "Bóc lột", code: "1000001" }, // A
    { id: 9, q: "Khi cung lớn hơn cầu, giá cả thị trường sẽ biến động như thế nào so với giá trị thực tế của hàng hóa?", ans: "Giá cả sẽ thấp hơn giá trị (Giá cả < Giá trị)", code: "1001000" }, // H
    { id: 10, q: "Chi phí sản xuất tư bản chủ nghĩa (k) bao gồm những yếu tố nào hợp thành?", ans: "k = c + v (Tư bản bất biến + Tư bản khả biến)", code: "66" } // B
];

// Bản đồ ánh xạ mã CODE trả về ra Ký tự tương ứng trong bảng ASCII
const charMapping = {
    "255": "U",
    "67": "C",
    "4C": "L",
    "73": "I",
    "59": "Y",
    "4E": "N",
    "254": "T",
    "1000001": "A",
    "1001000": "H",
    "66": "B"
};

// 2. Render danh sách câu hỏi
function renderQuestions() {
    const questionsContainer = document.getElementById("questions-container");
    gameQuestions.forEach((item) => {
        questionsContainer.innerHTML += `
            <div class="border border-green-900 p-4 bg-black/60 rounded space-y-3 transition-all duration-300" id="block-q-${item.id}">
                <div class="flex items-start gap-2">
                    <button onclick="revealQuestion(${item.id})" id="btn-q-${item.id}" class="bg-green-950 px-2 py-0.5 rounded text-xs border border-green-800 text-white font-bold min-w-max hover:bg-green-700 transition-colors cursor-pointer">
                        MỞ CÂU ${item.id}
                    </button>
                    <span class="bg-green-950 px-2 py-0.5 rounded text-xs border border-green-800 text-white font-bold min-w-max hidden" id="label-q-${item.id}">CÂU ${item.id}</span>
                    <p class="text-sm text-green-300 leading-relaxed hidden" id="q-text-${item.id}">${item.q}</p>
                </div>
                
                <div class="flex flex-wrap gap-3 items-center pt-2">
                    <button id="btn-reveal-${item.id}" onclick="revealAnswer(${item.id})" class="bg-green-800 text-black font-bold px-4 py-1.5 rounded text-xs hover:bg-green-500 transition-colors uppercase hidden">Lấy CODE</button>
                    
                    <div class="flex flex-wrap gap-2 items-center hidden animate-fade-in" id="decryption-zone-${item.id}">
                        <span class="text-xs text-green-400 font-bold">ĐÁP ÁN: <span class="bg-green-950 px-2 py-0.5 rounded text-white border border-green-800 uppercase">${item.ans}</span></span>
                        <span class="text-xs text-yellow-500 font-bold">CODE: <span class="bg-yellow-950 px-2 py-0.5 rounded text-white border border-yellow-800 tracking-widest">${item.code}</span></span>
                        
                        <button onclick="revealChar(${item.id})" id="btn-check-${item.id}" class="bg-yellow-600 text-black font-bold px-2 py-1 rounded text-[10px] hover:bg-yellow-400 transition-colors uppercase ml-2">Hiện ký tự</button>
                        <span class="text-xl text-yellow-400 font-bold hidden border border-yellow-500 px-3 py-0.5 rounded bg-black shadow-[0_0_8px_rgba(234,179,8,0.5)]" id="char-reveal-${item.id}"></span>
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. Logic mở câu hỏi
window.revealQuestion = function (id) {
    document.getElementById(`q-text-${id}`).classList.remove("hidden");
    document.getElementById(`label-q-${id}`).classList.remove("hidden");
    document.getElementById(`btn-q-${id}`).classList.add("hidden");
    document.getElementById(`btn-reveal-${id}`).classList.remove("hidden");
};

// 4. Logic mở đáp án - Lấy CODE
window.revealAnswer = function (id) {
    document.getElementById(`decryption-zone-${id}`).classList.remove("hidden");
    document.getElementById(`btn-reveal-${id}`).classList.add("hidden");
    document.getElementById(`block-q-${id}`).classList.add("border-yellow-800", "bg-yellow-950/5");
};

// 5. Hiện ký tự
window.revealChar = function (id) {
    const targetQuestion = gameQuestions.find(q => q.id === id);
    const correctChar = charMapping[targetQuestion.code];

    const charSpan = document.getElementById(`char-reveal-${id}`);
    charSpan.innerText = correctChar;
    charSpan.classList.remove("hidden");

    document.getElementById(`btn-check-${id}`).classList.add("hidden");
};

// 6. Kiểm tra Keyword cuối cùng
window.checkFinalKeyword = function () {
    let keyword = document.getElementById("final-keyword").value.trim().toUpperCase();
    keyword = keyword.replace(/\s+/g, '');

    if (keyword === "TICHLUYTUBAN" || keyword === "TÍCHLŨYTƯBẢN") {
        document.getElementById("success-modal").classList.remove("hidden");
        document.getElementById("success-modal").classList.add("flex");
    } else {
        alert("❌ [TỪ CHỐI TRUY CẬP]: PASSWORD (KEYWORD) không chính xác! Hãy sắp xếp lại các ký tự thu được.");
    }
}

// 7. Đóng modal (mô phỏng trích xuất)
window.closeModal = function () {
    document.getElementById("success-modal").classList.add("hidden");
    document.getElementById("success-modal").classList.remove("flex");

    // Khởi chạy mô phỏng Hack Dữ Liệu
    const sim = document.getElementById("hack-simulation");
    sim.classList.remove("hidden");
    sim.classList.add("block");

    startHackSimulation();
}

function startHackSimulation() {
    const terminal = document.getElementById("hack-terminal-lines");
    const progressBar = document.getElementById("hack-progress-bar");
    const progressText = document.getElementById("hack-progress-text");
    const matrixBg = document.getElementById("hack-matrix-bg");
    const codeLines = document.getElementById("hack-code-lines");
    const chart = document.getElementById("hack-chart");
    const countdown = document.getElementById("hack-countdown");

    // Clear everything
    if (terminal) terminal.innerHTML = "";
    if (progressBar) progressBar.style.width = "0%";
    if (progressText) progressText.innerText = "0%";
    if (matrixBg) matrixBg.innerText = "";
    if (codeLines) codeLines.innerText = "";
    if (chart) chart.innerHTML = "";

    // 1. Matrix BG effect
    let matrixInterval = setInterval(() => {
        if (!matrixBg) return;
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        let str = "";
        for (let i = 0; i < 60; i++) str += chars.charAt(Math.floor(Math.random() * chars.length));
        matrixBg.innerText = str + "\n" + matrixBg.innerText;
        if (matrixBg.innerText.length > 800) matrixBg.innerText = matrixBg.innerText.substring(0, 800);
    }, 50);

    // 2. Encryptor code typing
    const jsCode = `proto = getProto( obj );
if ( !proto ) {
  return true;
}
Ctor = hasOwn.call( proto, "constructor" );
return typeof Ctor === "function";

function isEmptyObject( obj ) {
  var name;
  for ( name in obj ) {
    return false;
  }
  return true;
}`;
    let codeIdx = 0;
    let codeInterval = setInterval(() => {
        if (!codeLines) return;
        if (codeIdx < jsCode.length) {
            codeLines.innerText += jsCode.charAt(codeIdx);
            codeIdx++;
        } else {
            codeIdx = 0;
            codeLines.innerText = "";
        }
    }, 20);

    // 3. Dynamic Chart
    let chartInterval = setInterval(() => {
        if (!chart) return;
        chart.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            let h = Math.floor(Math.random() * 90 + 10);
            chart.innerHTML += `<div class="flex-1 bg-green-500 opacity-80" style="height: ${h}%"></div>`;
        }
        document.getElementById("hack-transfer-rate").innerText = Math.floor(Math.random() * 800 + 200) + "MB/s";
    }, 150);

    // 4. Countdown
    let cd = 601;
    let cdInterval = setInterval(() => {
        if (!countdown) return;
        cd -= Math.floor(Math.random() * 7);
        if (cd < 0) cd = 0;
        countdown.innerText = cd;
    }, 100);

    // 5. Terminal & Progress
    const hackLines = [
        "initConnection @Server 32.3.211.0",
        "accessRoot(-1);",
        "disable.Verif(#PassCheck);",
        "USER: admin",
        "PASS: ************",
        "allowAccess(TRUE);",
        "penetrate == $.access($.Rqst = 10)",
        "LOCATING ENCRYPTED ROOT DIRECTORY...",
        "DIRECTORY FOUND: /mnt/vault/capital_accumulation",
        "STARTING DATA EXTRACTION PROTOCOL...",
        "DOWNLOADING: transaction_logs.db [924MB]",
        "DOWNLOADING: offshore_accounts.db [1.2GB]",
        "DECRYPTING SHA-256 HASHES...",
        "WARNING: INTRUSION DETECTED. ACCELERATING...",
        "DOWNLOADING: surplus_value_rates.xls",
        "COMPILING EVIDENCE PACKET...",
        "TRANSFER COMPLETE.",
        "ERASING TRACES...",
        "DISCONNECTING..."
    ];

    let lineIdx = 0;
    let progress = 0;

    let lineInterval = setInterval(() => {
        if (!terminal || !progressBar) return;
        if (lineIdx < hackLines.length) {
            let p = document.createElement("div");
            p.innerText = "> " + hackLines[lineIdx];
            if (hackLines[lineIdx].includes("WARNING")) p.className = "text-red-500 font-bold neon-text";
            terminal.appendChild(p);
            terminal.scrollTop = terminal.scrollHeight;
            lineIdx++;
        }

        progress += Math.random() * 4 + 1.5;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + "%";
        progressText.innerText = Math.floor(progress) + "%";

        if (progress === 100 && lineIdx >= hackLines.length) {
            clearInterval(lineInterval);
            clearInterval(matrixInterval);
            clearInterval(codeInterval);
            clearInterval(chartInterval);
            clearInterval(cdInterval);

            let finalMsg = document.createElement("div");
            finalMsg.innerText = "SYSTEM: ALL DATA SECURED. DISCONNECTING...";
            finalMsg.className = "text-white font-bold text-xs md:text-sm mt-2 animate-pulse";
            terminal.appendChild(finalMsg);
            terminal.scrollTop = terminal.scrollHeight;

            setTimeout(() => {
                const sim = document.getElementById("hack-simulation");
                sim.classList.remove("block", "flex");
                sim.classList.add("hidden");

                const successModal = document.getElementById("success-modal");
                successModal.classList.remove("hidden");
                successModal.classList.add("flex");
                successModal.innerHTML = `<div class="text-center p-8 bg-green-950 border-2 border-green-500 rounded shadow-[0_0_40px_rgba(34,197,94,0.6)] w-full max-w-2xl mx-4 relative overflow-hidden">
                    <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                    <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-6 neon-text relative z-10 whitespace-nowrap">CHUYÊN ÁN THÀNH CÔNG</h1>
                    <p class="text-green-300 mb-6 leading-relaxed relative z-10">Tất cả bằng chứng về sự bóc lột và tích lũy tư bản đã được tải về trọn vẹn và gửi về máy chủ của Cục cảnh sát.</p>
                    <button onclick="location.reload()" class="bg-green-600 text-black font-bold px-8 py-3 rounded hover:bg-white transition-all uppercase tracking-widest relative z-10 shadow-[0_0_20px_rgba(34,197,94,0.6)]">Hoàn tất</button>
                </div>`;
            }, 3000);
        }
    }, 300);
}

// Khởi chạy ứng dụng
document.addEventListener("DOMContentLoaded", () => {
    renderQuestions();
});