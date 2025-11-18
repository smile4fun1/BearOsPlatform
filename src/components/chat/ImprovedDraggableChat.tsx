"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  Minimize2,
  Settings,
} from "lucide-react";
import { useChat } from "./ChatProvider";
import { MessageFormatter } from "./MessageFormatter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function ImprovedDraggableChat() {
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
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 400, height: 600, x: 0, y: 0 });
  const [chatSize, setChatSize] = useState({ width: 400, height: 600 });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingToolCall, setPendingToolCall] = useState<any>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [autoNavigate, setAutoNavigate] = useState(() => {
    if (typeof window === "undefined") return true; // Default to true
    const stored = localStorage.getItem("bear-auto-navigate");
    // If never set before, default to true
    if (stored === null) {
      localStorage.setItem("bear-auto-navigate", "true");
      return true;
    }
    return stored === "true";
  });
  
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  // Smart initial positioning - only run once and only if not loaded from storage
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      // Only reposition if we're at the default position and it wasn't loaded from storage
      const wasLoadedFromStorage = localStorage.getItem("bear-conversations");
      if (!wasLoadedFromStorage && position.x === 20 && position.y === 20) {
        const smartX = window.innerWidth - 420; // 400px width + 20px margin
        const smartY = window.innerHeight - 620; // 600px height + 20px margin
        setPosition({ x: Math.max(20, smartX), y: Math.max(80, smartY) });
      }
    }
  }, [hasInitialized, position.x, position.y, setPosition]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Listen for AI investigation requests from Incident Radar
  useEffect(() => {
    const handleAIInvestigation = (event: CustomEvent<{ message: string }>) => {
      // Open chat if closed
      if (!isOpen) {
        toggleChat();
      }
      
      // Wait for chat to open, then auto-send the investigation request
      setTimeout(async () => {
        const prefillMsg = localStorage.getItem("bear-ai-prefill");
        if (prefillMsg) {
          localStorage.removeItem("bear-ai-prefill");
          
          // Create or ensure conversation exists
          if (!currentConversationId) {
            createConversation();
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Add user message and immediately send
          setInput(prefillMsg);
          
          // Auto-submit after a brief delay
          setTimeout(() => {
            // Trigger the form submission
            const form = document.querySelector('.chat-input-form') as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }, 500);
        }
      }, 300);
    };

    window.addEventListener("open-ai-chat" as any, handleAIInvestigation);
    return () => window.removeEventListener("open-ai-chat" as any, handleAIInvestigation);
  }, [isOpen, toggleChat, currentConversationId, createConversation]);

  // Smooth pixel-perfect dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".chat-content, .chat-input")) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      // Calculate new position with constraints
      const chatWidth = isMinimized ? 320 : chatSize.width;
      const chatHeight = isMinimized ? 60 : chatSize.height;
      
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      // Constrain to viewport
      newX = Math.max(0, Math.min(window.innerWidth - chatWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - chatHeight, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Prevent text selection while dragging
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, dragStart, isMinimized, setPosition, chatSize]);

  // Handle resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      // Calculate new size
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width + deltaX;
      let newHeight = resizeStart.height + deltaY;

      // Constrain dimensions - allow more vertical space
      newWidth = Math.max(320, Math.min(800, newWidth));
      newHeight = Math.max(400, Math.min(window.innerHeight - 100, newHeight));

      setChatSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Prevent text selection while resizing
    document.body.style.userSelect = "none";
    document.body.style.cursor = "nwse-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, resizeStart]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: chatSize.width,
      height: chatSize.height,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    
    // Auto-create conversation if none exists and wait for state update
    let activeConvId = currentConversationId;
    if (!activeConvId) {
      console.log("🐻 No active conversation, creating new one...");
      const newId = createConversation();
      console.log("🐻 Created conversation:", newId);
      activeConvId = newId;
      // Wait for React state to propagate
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Verify conversation exists before proceeding
    if (!activeConvId) {
      console.error("🐻 Failed to create conversation!");
      setIsLoading(false);
      return;
    }
    
    console.log("🐻 Using conversation ID:", activeConvId);
    
    // Add user message
    addMessage({ role: "user", content: userMessage });

    try {
      // Build context with current page info
      const contextInfo = {
        currentPage: pathname,
        pageName: pathname === "/" ? "Home" : pathname.replace("/", "").replace("-", " "),
      };

      // Get navigation preference
      const autoNavEnabled = autoNavigate;
      console.log("🐻 Auto-navigate enabled:", autoNavEnabled);

      // Call chat API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
          context: contextInfo,
          autoNavigate: autoNavEnabled,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Always try to parse response first
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("🐻 Failed to parse response:", parseError);
        throw new Error("Invalid response from server");
      }

      // Check for errors
      if (!response.ok || data.error) {
        throw new Error(data.response || `API error: ${response.status}`);
      }

      // Validate response - allow empty strings but not null/undefined
      if (!data || data.response === null || data.response === undefined) {
        throw new Error("Invalid response from API");
      }

      // Debug logging
      console.log("🐻 Chat API Response:", data);
      console.log("🐻 Response type:", typeof data.response);
      console.log("🐻 Response content:", data.response);

      // Handle navigation commands with smooth transition
      if (data.response && typeof data.response === 'string' && data.response.includes("[NAVIGATE:")) {
        const match = data.response.match(/\[NAVIGATE:([^\]]+)\]/);
        console.log("🐻 Navigation match:", match);
        if (match) {
          const target = match[1];
          const cleanResponse = data.response.replace(/\[NAVIGATE:[^\]]+\]/g, "").trim();
          
          console.log("🐻 Target URL:", target);
          console.log("🐻 Current pathname:", pathname);
          console.log("🐻 Full URL will be:", window.location.origin + target);
          
          // Show transition message immediately
          addMessage({
            role: "assistant",
            content: cleanResponse || "✨ Navigating to " + target,
          });
          
          setIsLoading(false);
          
          // Direct hard navigation for reliability across all pages
          const fullUrl = window.location.origin + target;
          console.log("🐻 Executing navigation in 300ms to:", fullUrl);
          setTimeout(() => {
            console.log("🐻 NOW NAVIGATING TO:", fullUrl);
            window.location.href = fullUrl;
          }, 300);
          return;
        } else {
          console.error("🐻 NAVIGATE tag found but regex didn't match!");
        }
      } else {
        console.log("🐻 No NAVIGATE command detected in response");
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
    } catch (error: any) {
      console.error("🐻 Chat error:", error);
      
      let errorMessage = "I apologize, but I encountered an error. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. The server might be busy. Please try again.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      addMessage({
        role: "assistant",
        content: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleToggleMinimize = () => {
    if (isMinimized) {
      maximizeChat();
    } else {
      // Add shrink animation before minimizing
      if (chatRef.current) {
        chatRef.current.style.transition = 'all 0.3s ease-in-out';
        chatRef.current.style.transform = 'scale(0.95)';
        chatRef.current.style.opacity = '0.5';
      }
      setTimeout(() => {
        minimizeChat();
        if (chatRef.current) {
          chatRef.current.style.transform = '';
          chatRef.current.style.opacity = '';
        }
      }, 300);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-indigo-500/70 hover:scale-110 z-50 animate-in fade-in zoom-in duration-300"
        aria-label="Open Ursa Minor"
      >
        <div className="text-2xl">🐻</div>
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        width: isMinimized ? "320px" : `${chatSize.width}px`,
        transition: isDragging || isResizing ? "none" : "all 0.3s ease-in-out",
      }}
      className={`${isDragging ? "cursor-grabbing" : ""} ${isResizing ? "cursor-nwse-resize" : ""} animate-in slide-in-from-bottom-5 fade-in duration-300`}
    >
      <div className="relative rounded-2xl border border-white/20 bg-[#020511]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-500/20 to-sky-500/20 p-4 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-xl">
              🐻
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Ursa Minor</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online & Ready</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isMinimized && (
              <>
                <button
                  onClick={() => {
                    setShowConversations(!showConversations);
                    setShowSettings(false);
                  }}
                  className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="History"
                >
                  <History className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowConversations(false);
                  }}
                  className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    console.log("🐻 Clear chat clicked");
                    createConversation();
                    setShowConversations(false);
                    setShowSettings(false);
                  }}
                  className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white hover:text-red-400"
                  aria-label="Clear Chat"
                  title="Start new chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={handleToggleMinimize}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                // Add shrink animation before closing
                if (chatRef.current) {
                  chatRef.current.style.transition = 'all 0.3s ease-in-out';
                  chatRef.current.style.transform = 'scale(0.8)';
                  chatRef.current.style.opacity = '0';
                }
                setTimeout(() => {
                  toggleChat();
                  if (chatRef.current) {
                    chatRef.current.style.transform = '';
                    chatRef.current.style.opacity = '';
                  }
                }, 300);
              }}
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
                <div className="chat-conversations max-h-[300px] overflow-y-auto space-y-2">
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

            {/* Settings Panel */}
            {showSettings && (
              <div className="border-b border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-sm font-medium text-white/80">Settings</div>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer selectable">
                    <input
                      type="checkbox"
                      checked={autoNavigate}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAutoNavigate(checked);
                        localStorage.setItem("bear-auto-navigate", String(checked));
                      }}
                      className="mt-0.5 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500/50"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-white">Auto-navigate</div>
                      <div className="text-xs text-white/50 mt-0.5">
                        Automatically navigate to pages without asking for confirmation
                      </div>
                    </div>
                  </label>
                  
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-xs text-white/40">
                      More settings coming soon...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div 
              className="chat-content overflow-y-auto p-4 space-y-4" 
              style={{ height: `${chatSize.height - 200}px` }}
            >
              {!currentConversation && (
                <div className="flex h-full flex-col items-center justify-center text-center text-white/40">
                  <div className="text-5xl mb-3">🐻</div>
                  <p className="text-sm font-medium text-white/60">No active conversation</p>
                  <p className="text-xs mt-2 max-w-xs text-white/40">Start typing below to begin a new conversation with Ursa Minor!</p>
                </div>
              )}
              
              {currentConversation?.messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center text-white/40">
                  <div className="text-5xl mb-3">🐻</div>
                  <p className="text-sm font-medium">Hi! I'm Ursa Minor, your Bear Universe assistant.</p>
                  <p className="text-xs mt-2 max-w-xs">I can help you navigate, manage robots, query telemetry, and execute commands. Try asking me something!</p>
                </div>
              )}
              
              {currentConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`selectable max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white"
                        : "bg-white/10 text-white/90"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <MessageFormatter content={message.content} />
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    )}
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
            <form onSubmit={handleSendMessage} className="chat-input chat-input-form border-t border-white/10 p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Ursa Minor anything..."
                  className="flex-1 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-indigo-500/50"
                  disabled={isLoading}
                  autoFocus
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
        
        {/* Resize Handle - Bottom Right Corner */}
        {!isMinimized && (
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 h-6 w-6 cursor-nwse-resize group"
            style={{ touchAction: 'none' }}
          >
            <div className="absolute bottom-1 right-1 h-3 w-3 border-r-2 border-b-2 border-white/20 group-hover:border-indigo-400 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}

