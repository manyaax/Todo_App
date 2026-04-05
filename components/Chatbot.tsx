"use client";

import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [pendingTask, setPendingTask] = useState("");

  const sendMessage = async () => {
    if (!message) return;

    // 👉 If waiting for date
    if (pendingTask) {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          task: pendingTask,
          step: "date",
        }),
      });

      const data = await response.json();

      setChat((prev) => [...prev, "You: " + message, "Bot: " + data.reply]);
      window.location.reload();
      setPendingTask("");
      setMessage("");
      return;
    }

    // 👉 Normal message flow
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = { reply: "Server error ❌" };
    }

    // 👉 If bot asks for date
    if (data.askDate) {
      setPendingTask(data.task);
    }

    setChat((prev) => [...prev, "You: " + message, "Bot: " + data.reply]);
    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "red",
          color: "white",
          padding: "12px",
          zIndex: 9999,
        }}
      >
        CHAT
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white p-4 rounded-xl shadow-lg">
          <div className="h-60 overflow-y-auto text-sm">
            {chat.map((c, i) => (
              <p key={i}>{c}</p>
            ))}
          </div>

          <input
            className="w-full border p-2 mt-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type: Add task buy milk"
          />

          <button
            onClick={sendMessage}
            className="bg-pink-500 text-white w-full mt-2 p-2 rounded"
          >
            Send
          </button>
        </div>
      )}
    </>
  );
}