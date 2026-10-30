// src/Components/ChatAssistant.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatAssistant() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !image) return;
    setLoading(true);

    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result?.toString().split(",")[1] || null;
        await postMessage(base64Image);
      };
      reader.readAsDataURL(image);
    } else {
      await postMessage(null);
    }
  };

  const postMessage = async (base64Image: string | null) => {
    const userMessage = { role: "user", content: input + (image ? " [Image attached]" : "") };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImage(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, image: base64Image }),
      });

      const data = await res.json();
      const aiReply = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      const errorMsg = err?.message || "Unknown error";
      console.error("Client error:", errorMsg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Request failed. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="p-4 border rounded-xl max-w-lg mx-auto mt-6">
      <div className="h-64 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md text-sm whitespace-pre-wrap ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="p-2 border rounded-md"
          disabled={loading}
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          className="flex-grow p-2 border rounded-md"
          disabled={loading}
        />
      </div>
    </div>
  );
}
