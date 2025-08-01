(function() {
 const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";


  // Inject style
  const style = document.createElement("style");
  style.innerHTML = `
    #shaoulian-chat-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #1F56D8;
      color: white;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
    }
    #shaoulian-chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      max-height: 500px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      z-index: 9999;
    }
    #shaoulian-chat-header {
      background-color: #1F56D8;
      color: white;
      padding: 10px;
      font-weight: bold;
      text-align: center;
    }
    #shaoulian-chat-body {
      padding: 10px;
      overflow-y: auto;
      height: 350px;
      direction: rtl;
    }
    #shaoulian-chat-input {
      display: flex;
      border-top: 1px solid #ccc;
    }
    #shaoulian-chat-input input {
      flex: 1;
      padding: 10px;
      border: none;
    }
    #shaoulian-chat-input button {
      background-color: #1F56D8;
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Create UI
  const chatBtn = document.createElement("div");
  chatBtn.id = "shaoulian-chat-btn";
  chatBtn.innerHTML = "💬";

  const chatWindow = document.createElement("div");
  chatWindow.id = "shaoulian-chat-window";
  chatWindow.innerHTML = `
    <div id="shaoulian-chat-header">שלום! איך אפשר לעזור?</div>
    <div id="shaoulian-chat-body"></div>
    <div id="shaoulian-chat-input">
      <input type="text" placeholder="הקלד כאן...">
      <button>שלח</button>
    </div>
  `;

  document.body.appendChild(chatBtn);
  document.body.appendChild(chatWindow);

  chatBtn.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
  };

  const input = chatWindow.querySelector("input");
  const button = chatWindow.querySelector("button");
  const body = chatWindow.querySelector("#shaoulian-chat-body");

  async function sendMessage(msg) {
    body.innerHTML += `<div style='text-align:right;'>🧑‍💼: ${msg}</div>`;
    input.value = "";

    const isHebrew = /[\u0590-\u05FF]/.test(msg);
    const language = isHebrew ? "Hebrew" : "English";

    let prompt = `You're a friendly support chatbot for shaoulian.co.il. Answer in ${language}. Use this contact info: phone 09-7409835, email sherut@shaoulian.co.il. 
If asked about WhatsApp, give a link to start a chat. 
If asked about product returns, service centers, or store locations, refer to: 
• נקודות מכירה: https://shaoulian.co.il/pages/נקודות-מכירה
• מוקדי שירות: https://www.sol.co.il/service

User: ${msg}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "מצטער, לא הצלחתי להבין. תוכל לנסח שוב?";
    body.innerHTML += `<div style='text-align:left;color:#1F56D8;'>🤖: ${reply}</div>`;
    body.scrollTop = body.scrollHeight;
  }

  button.onclick = () => {
    const msg = input.value.trim();
    if (msg) sendMessage(msg);
  };
})();
