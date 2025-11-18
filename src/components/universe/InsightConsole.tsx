"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function InsightConsole() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "안녕하세요! I’m the Bear Universe analyst. Ask for KPI breakdowns, incident root cause, or partner-ready talking points.",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newMessage.content }),
      });
      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? "No answer received.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Insight console request failed", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I could not reach the ChatGPT API. Double-check your OPENAI_API_KEY and try again.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#080c1f] via-[#0c162c] to-[#05070f] p-6 text-white">
      <header className="flex items-center gap-3">
        <Sparkles className="size-6 text-amber-200" />
        <div>
          <h2 className="text-xl font-semibold">Insight Console</h2>
          <p className="text-sm text-white/60">
            Powered by ChatGPT until the Bear models take over
          </p>
        </div>
      </header>
      <div className="mt-4 h-64 space-y-3 overflow-y-auto pr-2 text-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl border border-white/10 p-3 ${
              message.role === "assistant"
                ? "bg-white/[0.07] text-white/90"
                : "bg-slate-900/60 text-white"
            }`}
          >
            <p className="text-xs uppercase text-white/50">{message.role}</p>
            <p className="mt-1 whitespace-pre-line">{message.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask for KPI deltas, training cadence, or GTM copy..."
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
        />
        <button
          onClick={handleSend}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-70"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Send
        </button>
      </div>
    </div>
  );
}
