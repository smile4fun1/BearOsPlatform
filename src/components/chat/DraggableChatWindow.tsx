"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  X,
  Minus,
  Maximize2,
  Send,
  Loader2,
  MessageSquarePlus,
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useChat } from "./ChatProvider";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function DraggableChatWindow() {
  const {
    conversations,
    currentConversationId,
    isOpen,
    isMinimized,
    position,
    createConversation,
    deleteConversation,
    setCurrentConversation,
    addMessage,
    toggleChat,
    minimizeChat,
    maximizeChat,
    setPosition,
  } = useChat();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [pendingToolCall, setPendingToolCall] = useState<any>(null);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".chat-content")) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, setPosition]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentConversationId) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    addMessage({ role: "user", content: userMessage });
    setIsLoading(true);

    try {
      // Call chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...(currentConversation?.messages || []).map(m => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: userMessage },
          ],
          model: currentConversation?.model || "ursa-minor",
        }),
      });

      const data = await response.json();

      // Handle navigation commands
      if (data.response.includes("[NAVIGATE:")) {
        const match = data.response.match(/\[NAVIGATE:([^\]]+)\]/);
        if (match) {
          const target = match[1];
          router.push(target);
          addMessage({
            role: "assistant",
            content: data.response.replace(/\[NAVIGATE:[^\]]+\]/, ""),
          });
          setIsLoading(false);
          return;
        }
      }

      // Handle tool calls that need permission
      if (data.needsPermission && data.toolCalls && data.toolCalls.length > 0) {
        setPendingToolCall(data.toolCalls[0]);
        addMessage({
          role: "assistant",
          content: data.response,
          needsPermission: true,
          toolCalls: data.toolCalls,
        });
      } else {
        addMessage({
          role: "assistant",
          content: data.response,
          toolCalls: data.toolCalls,
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage({
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
      });
    }

    setIsLoading(false);
  };

  const handleApproveToolCall = async () => {
    if (!pendingToolCall) return;

    addMessage({
      role: "assistant",
      content: `✅ Command approved and executed: ${pendingToolCall.name}`,
    });
    setPendingToolCall(null);
  };

  const handleDenyToolCall = () => {
    if (!pendingToolCall) return;

    addMessage({
      role: "assistant",
      content: "Command cancelled. Let me know if you'd like to do something else.",
    });
    setPendingToolCall(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-indigo-500/70 hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
      }}
      className={`${
        isMinimized ? "w-80" : "w-96"
      } transition-all ${isDragging ? "cursor-move" : ""}`}
    >
      <div className="rounded-2xl border border-white/20 bg-[#020511]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-500/20 to-sky-500/20 p-4 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Ursa Minor</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConversations(!showConversations)}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="History"
            >
              <History className="h-4 w-4" />
            </button>
            <button
              onClick={minimizeChat}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Minimize"
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleChat}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Conversations Sidebar */}
            {showConversations && (
              <div className="border-b border-white/10 bg-black/20 p-3 max-h-48 overflow-y-auto">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-white/80">Conversations</div>
                  <button
                    onClick={() => {
                      createConversation();
                      setShowConversations(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-2 py-1 text-xs text-indigo-300 transition-colors hover:bg-indigo-500/30"
                  >
                    <MessageSquarePlus className="h-3 w-3" />
                    <span>New</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`group flex items-center justify-between rounded-lg p-2 text-sm transition-colors ${
                        conv.id === currentConversationId
                          ? "bg-indigo-500/20 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setCurrentConversation(conv.id);
                          setShowConversations(false);
                        }}
                        className="flex-1 truncate text-left"
                      >
                        {conv.title}
                      </button>
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="opacity-0 p-1 text-white/40 transition-opacity hover:text-rose-400 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="chat-content h-96 overflow-y-auto p-4 space-y-4">
              {currentConversation?.messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center text-white/40">
                  <Bot className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">Hi! I'm Ursa Minor, your Bear Universe assistant.</p>
                  <p className="text-xs mt-1">Ask me anything or say "help" to see what I can do.</p>
                </div>
              )}
              
              {currentConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white"
                        : "bg-white/10 text-white/90"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    {message.needsPermission && pendingToolCall && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleApproveToolCall}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/30"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={handleDenyToolCall}
                          className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs text-rose-300 transition-colors hover:bg-rose-500/30"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Deny</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white/90">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-white/10 p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Ursa Minor anything..."
                  className="flex-1 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:bg-white/15"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 p-2.5 text-white transition-all hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

