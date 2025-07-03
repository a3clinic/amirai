const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let messageHistory = [];

function appendMessage(content, sender) {
  const wrapper = document.createElement("div");
  wrapper.className = `chat-wrapper ${sender}`;

  const label = document.createElement("div");
  label.className = "chat-label";
  label.textContent = sender === "user" ? "You" : "Amir's AI Assistant";

  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}`;
  msg.textContent = content;

  wrapper.appendChild(label);
  wrapper.appendChild(msg);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg; // to update the typing message later
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  messageHistory.push({ role: "user", content: text });

  input.value = "";
  input.style.height = "auto";

  const typingMsg = appendMessage("Assistant is typing...", "bot");

  fetch("https://amirai.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: messageHistory }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        typingMsg.textContent = reply;
        messageHistory.push({ role: "assistant", content: reply });
      } else if (data.error) {
        typingMsg.textContent = `Error: ${data.error}`;
      } else {
        typingMsg.textContent = "Sorry, I couldn't get a response.";
      }
    })
    .catch((err) => {
      typingMsg.textContent = "⚠️ Error: " + err.message;
    });
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = input.scrollHeight + "px";
});
