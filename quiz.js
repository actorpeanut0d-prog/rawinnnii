// quiz.js
function startQuiz(onPass) {
  // ===== ใส่คำถามตรงนี้ =====
  // img     = ชื่อไฟล์รูป (ไม่ใส่ก็ได้) วางไว้โฟลเดอร์เดียวกับ index.html
  // choices = ตัวเลือกทั้งหมด (สุ่มลำดับให้เองทุกครั้ง)
  // answer  = "ข้อความของตัวเลือกที่ถูก" ต้องสะกดตรงกับใน choices
  const QUESTIONS = [
    {
      q: "บุคลในภาพชื่อว่าอะไร",
      img: "Q1.jpg",
      choices: ["ชีตาห์", "เท็ดดี้", "คอปเตอร์", "ภาคิน","แซน"],
      answer: "ชีตาห์"
    }
  ];
  // =========================

  function shuffle(arr) {
    const a = arr.slice();
    for (let k = a.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [a[k], a[j]] = [a[j], a[k]];
    }
    return a;
  }

  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,.85);display:grid;" +
    "place-items:center;padding:16px;z-index:30;font-family:inherit;overflow:auto;";
  const card = document.createElement("div");
  card.style.cssText =
    "background:#fff;border-radius:10px;padding:20px;width:360px;" +
    "max-width:100%;box-sizing:border-box;color:#222;";
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  let i = 0;

  function render(note) {
    const item = QUESTIONS[i];
    card.innerHTML = "";

    // ลำดับข้อ
    const head = document.createElement("p");
    head.style.cssText = "margin:0 0 6px;font-size:.8rem;color:#777;";
    head.textContent = "ข้อ " + (i + 1) + " / " + QUESTIONS.length;
    card.appendChild(head);

    // คำถาม (บนสุด)
    const q = document.createElement("p");
    q.style.cssText = "margin:0 0 12px;font-size:1.15rem;line-height:1.5;font-weight:bold;";
    q.textContent = item.q;
    card.appendChild(q);

    // รูปประกอบ (ใต้คำถาม)
    if (item.img) {
      const im = document.createElement("img");
      im.src = item.img;
      im.alt = "";
      im.style.cssText =
        "display:block;width:100%;max-height:40vh;object-fit:contain;" +
        "border-radius:6px;margin:0 0 14px;background:#f3f3f3;";
      card.appendChild(im);
    }

    // ข้อความแจ้งเตือน (ตอนตอบผิด)
    if (note) {
      const n = document.createElement("p");
      n.style.cssText = "margin:0 0 12px;font-size:.9rem;color:#d93025;";
      n.textContent = note;
      card.appendChild(n);
    }

    // ตัวเลือก (สุ่มลำดับใหม่ทุกครั้งที่ render)
    shuffle(item.choices).forEach(text => {
      const b = document.createElement("button");
      b.className = "btn";
      b.style.cssText += ";margin-bottom:8px;text-align:left;";
      b.textContent = text;
      b.onclick = () => check(text);
      card.appendChild(b);
    });
  }

  function check(text) {
    if (text !== QUESTIONS[i].answer) {
      i = 0;                                  // ตอบผิด = เริ่มใหม่ (ลบบรรทัดนี้ถ้าอยากลองข้อเดิม)
      render("ตอบผิด ลองใหม่อีกครั้ง");       // render ใหม่ = สุ่มตัวเลือกใหม่
      return;
    }
    i++;
    if (i >= QUESTIONS.length) {
      overlay.remove();
      onPass();
    } else {
      render();
    }
  }

  render();
}