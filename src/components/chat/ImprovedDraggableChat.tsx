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
    canNavigate,
    createConversation,
    deleteConversation,
    setCurrentConversation,
    addMessage,
    toggleChat,
    minimizeChat,
    maximizeChat,
    setPosition,
    addNotification,
  } = useChat();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState<"tl" | "tr" | "bl" | "br" | "t" | "r" | "b" | "l" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 400, height: 600, x: 0, y: 0, posX: 0, posY: 0 });
  const [chatSize, setChatSize] = useState({ width: 400, height: 600 });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "thinking" | "error">("connected");
  const [showConversations, setShowConversations] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingToolCall, setPendingToolCall] = useState<any>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const [latestAIMessage, setLatestAIMessage] = useState<string>("");
  const [showNotificationBubble, setShowNotificationBubble] = useState(false);
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(() => {
    // Load last read message ID from localStorage to persist across refreshes
    if (typeof window === "undefined") return null;
    return localStorage.getItem("bear-last-read-message-id") || null;
  });
  const [iconPosition, setIconPosition] = useState(() => {
    // Load position from localStorage or use defaults
    if (typeof window === "undefined") return { x: 160, y: 16 };
    
    const savedPosition = localStorage.getItem("bear-icon-position");
    if (savedPosition) {
      return JSON.parse(savedPosition);
    }
    
    // Default positions: desktop = closer to logo, mobile = centered top
    const isMobileDevice = window.innerWidth < 1024;
    return {
      x: isMobileDevice ? (window.innerWidth / 2) - 28 : 160, // Center on mobile, close to logo on desktop
      y: 16, // Top of header for both
    };
  });
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [iconDragStart, setIconDragStart] = useState({ x: 0, y: 0 });
  const [hasIconMoved, setHasIconMoved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
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
  const [deepResearchMode, setDeepResearchMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("bear-deep-research");
    return stored === "true";
  });
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window === "undefined") return 14;
    const stored = localStorage.getItem("bear-font-size");
    return stored ? parseInt(stored) : 14; // Default 14px
  });
  
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  // Hydration and mobile detection
  useEffect(() => {
    setHasHydrated(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keep chat and icon in bounds when window resizes
  useEffect(() => {
    const handleResize = () => {
      // Constrain icon position
      const iconSize = 56; // h-14 = 56px
      setIconPosition(prev => ({
        x: Math.max(0, Math.min(window.innerWidth - iconSize, prev.x)),
        y: Math.max(0, Math.min(window.innerHeight - iconSize, prev.y)),
      }));

      // Constrain chat position
      const chatWidth = isMinimized ? 280 : chatSize.width;
      const chatHeight = isMinimized ? 60 : chatSize.height;
      setPosition(prev => ({
        x: Math.max(0, Math.min(window.innerWidth - chatWidth, prev.x)),
        y: Math.max(0, Math.min(window.innerHeight - chatHeight, prev.y)),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMinimized, chatSize, setPosition]);

  // Show welcome popup after 5 seconds (only once per session)
  useEffect(() => {
    if (!hasHydrated) return;
    
    const hasSeenWelcome = sessionStorage.getItem("bear-welcome-shown");
    if (hasSeenWelcome) return;
    
    const timer = setTimeout(() => {
      // Only show if chat is still closed
      if (!isOpen) {
        setShowWelcomePopup(true);
        sessionStorage.setItem("bear-welcome-shown", "true");
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowWelcomePopup(false);
        }, 5000);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [hasHydrated, isOpen]);

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation?.messages]);

  // Auto-scroll to bottom when chat opens or maximizes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Use timeout to ensure DOM is ready
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        }
      }, 50);
    }
  }, [isOpen, isMinimized]);

  // Handle focus/blur for transparency - improved detection (DESKTOP ONLY)
  useEffect(() => {
    // Disable transparency feature on mobile
    if (isMobile) {
      setIsFocused(true);
      return;
    }

    const handleGlobalClick = (e: MouseEvent) => {
      if (chatRef.current) {
        if (chatRef.current.contains(e.target as Node)) {
          // Click inside chat - set focused
          setIsFocused(true);
          setHasUnreadMessage(false);
          setShowNotificationBubble(false);
        } else {
          // Click outside chat - set unfocused
          setIsFocused(false);
        }
      }
    };

    // Use capture phase to ensure we catch all clicks
    document.addEventListener("mousedown", handleGlobalClick, true);

    return () => {
      document.removeEventListener("mousedown", handleGlobalClick, true);
    };
  }, [isMobile]);

  // Ensure chat is focused when opened or maximized
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setIsFocused(true);
    }
  }, [isOpen, isMinimized]);

  // Track AI responses for notifications when minimized or closed - only show NEW messages
  useEffect(() => {
    if (!currentConversation) return;
    
    const messages = currentConversation.messages;
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    
    // Only show notification if:
    // 1. Chat is minimized OR closed (not open)
    // 2. Last message is from AI
    // 3. This message hasn't been read yet (different from lastReadMessageId)
    if ((isMinimized || !isOpen) && 
        lastMessage.role === "assistant" && 
        lastMessage.id !== lastReadMessageId) {
      
      setHasUnreadMessage(true);
      setLatestAIMessage(lastMessage.content.substring(0, 100)); // First 100 chars
      setShowNotificationBubble(true);
      
      console.log("🔔 NEW notification shown:", lastMessage.id, lastMessage.content.substring(0, 50));
      
      // Auto-hide bubble after 8 seconds
      setTimeout(() => {
        setShowNotificationBubble(false);
      }, 8000);
    }
  }, [currentConversation?.messages, isMinimized, isOpen, lastReadMessageId]);

  // Mark messages as read when chat is opened or maximized
  useEffect(() => {
    if (isOpen && !isMinimized && currentConversation) {
      const messages = currentConversation.messages;
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === "assistant") {
          setLastReadMessageId(lastMessage.id);
          // Persist to localStorage to survive page refreshes
          localStorage.setItem("bear-last-read-message-id", lastMessage.id);
          console.log("✅ Message marked as read:", lastMessage.id);
        }
      }
      setHasUnreadMessage(false);
      setShowNotificationBubble(false);
    }
  }, [isOpen, isMinimized, currentConversation]);

  // Handle icon dragging with movement detection (supports both mouse and touch)
  useEffect(() => {
    if (!isDraggingIcon) return;

    const handleMove = (clientX: number, clientY: number) => {
      let newX = clientX - iconDragStart.x;
      let newY = clientY - iconDragStart.y;

      // Constrain to viewport
      newX = Math.max(0, Math.min(window.innerWidth - 56, newX));
      newY = Math.max(0, Math.min(window.innerHeight - 56, newY));

      // Track if icon has actually moved
      const moved = Math.abs(newX - iconPosition.x) > 3 || Math.abs(newY - iconPosition.y) > 3;
      if (moved) {
        setHasIconMoved(true);
      }

      setIconPosition({ x: newX, y: newY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDraggingIcon(false);
      // Save position to localStorage when drag ends
      localStorage.setItem("bear-icon-position", JSON.stringify(iconPosition));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDraggingIcon, iconDragStart, iconPosition]);

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

  // Smooth pixel-perfect dragging (DESKTOP ONLY)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Disable dragging on mobile
    if (isMobile) return;
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

  // Handle resizing from all corners
  useEffect(() => {
    if (!isResizing || !resizeCorner) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      // Handle different corners and edges
      switch (resizeCorner) {
        case "br": // Bottom-right (default behavior)
          newWidth = resizeStart.width + deltaX;
          newHeight = resizeStart.height + deltaY;
          break;
        case "bl": // Bottom-left
          newWidth = resizeStart.width - deltaX;
          newHeight = resizeStart.height + deltaY;
          newX = resizeStart.posX + deltaX;
          break;
        case "tr": // Top-right
          newWidth = resizeStart.width + deltaX;
          newHeight = resizeStart.height - deltaY;
          newY = resizeStart.posY + deltaY;
          break;
        case "tl": // Top-left
          newWidth = resizeStart.width - deltaX;
          newHeight = resizeStart.height - deltaY;
          newX = resizeStart.posX + deltaX;
          newY = resizeStart.posY + deltaY;
          break;
        case "t": // Top edge
          newHeight = resizeStart.height - deltaY;
          newY = resizeStart.posY + deltaY;
          break;
        case "r": // Right edge
          newWidth = resizeStart.width + deltaX;
          break;
        case "b": // Bottom edge
          newHeight = resizeStart.height + deltaY;
          break;
        case "l": // Left edge
          newWidth = resizeStart.width - deltaX;
          newX = resizeStart.posX + deltaX;
          break;
      }

      // Constrain dimensions
      newWidth = Math.max(320, Math.min(800, newWidth));
      newHeight = Math.max(400, Math.min(window.innerHeight - 100, newHeight));

      // Update position if resizing from left or top
      if (resizeCorner === "bl" || resizeCorner === "tl") {
        const widthDiff = resizeStart.width - newWidth;
        newX = resizeStart.posX + widthDiff;
      }
      if (resizeCorner === "tr" || resizeCorner === "tl") {
        const heightDiff = resizeStart.height - newHeight;
        newY = resizeStart.posY + heightDiff;
      }

      setChatSize({ width: newWidth, height: newHeight });
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeCorner(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Prevent text selection while resizing
    document.body.style.userSelect = "none";
    const cursorMap: Record<string, string> = {
      br: "nwse-resize",
      tl: "nwse-resize",
      bl: "nesw-resize",
      tr: "nesw-resize",
      t: "ns-resize",
      r: "ew-resize",
      b: "ns-resize",
      l: "ew-resize",
    };
    document.body.style.cursor = cursorMap[resizeCorner || ""];

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, resizeStart, resizeCorner, position, setPosition]);

  const handleResizeStart = (corner: "tl" | "tr" | "bl" | "br" | "t" | "r" | "b" | "l") => (e: React.MouseEvent) => {
    // Disable resizing on mobile
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeCorner(corner);
    setResizeStart({
      width: chatSize.width,
      height: chatSize.height,
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    });
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setConnectionStatus("thinking");
    
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

      // Detect if deep research mode should be enabled
      const deepResearchKeywords = [
        "deep research", "detailed analysis", "comprehensive", "investigate thoroughly",
        "analyze in depth", "research mode", "full analysis", "deep dive",
        "detailed investigation", "thorough review"
      ];
      const shouldUseDeepResearch = deepResearchMode || 
        deepResearchKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
      
      if (shouldUseDeepResearch && !deepResearchMode) {
        console.log("🔬 Deep Research Mode auto-detected!");
      }

      // Call chat API with timeout (longer for deep research)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), shouldUseDeepResearch ? 60000 : 30000);

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
          deepResearch: shouldUseDeepResearch,
          isMinimized: isMinimized, // Pass minimized state to AI for smart behavior
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

      // ═══════════════════════════════════════════════════════════════
      // SMART NAVIGATION HANDLER - Respects chat state (open/minimized)
      // ═══════════════════════════════════════════════════════════════
      if (data.response && typeof data.response === 'string' && data.response.includes("[NAVIGATE:")) {
        const match = data.response.match(/\[NAVIGATE:([^\]]+)\]/);
        console.log("🐻 [NAV] Navigation command detected");
        console.log("🐻 [NAV] Match result:", match);
        console.log("🐻 [NAV] Can navigate?", canNavigate, "(isOpen:", isOpen, ", isMinimized:", isMinimized, ")");
        
        if (match) {
          const target = match[1];
          const cleanResponse = data.response.replace(/\[NAVIGATE:[^\]]+\]/g, "").trim();
          
          // ═══════════════════════════════════════════════════════════════
          // CRITICAL CHECK: Prevent navigation when chat is minimized
          // ═══════════════════════════════════════════════════════════════
          if (!canNavigate) {
            console.log("🐻 [NAV] ⛔ NAVIGATION BLOCKED - Chat is minimized");
            console.log("🐻 [NAV] User doesn't want interruption, showing notification instead");
            
            addMessage({
              role: "assistant",
              content: `🔔 **Background Research Complete**\n\n${cleanResponse || `I found what you're looking for at: **${target}**`}\n\n💡 Since you minimized me, I didn't navigate automatically. Maximize when ready, and I'll take you there!`,
            });
            setIsLoading(false);
            setConnectionStatus("connected");
            return; // STOP HERE - do not execute navigation
          }
          
          // ═══════════════════════════════════════════════════════════════
          // EXECUTE NAVIGATION - Chat is open, user wants to see this
          // ═══════════════════════════════════════════════════════════════
          console.log("🐻 [NAV] ✅ EXECUTING NAVIGATION");
          console.log("🐻 [NAV] Target:", target);
          console.log("🐻 [NAV] Current:", pathname);
          console.log("🐻 [NAV] Full URL:", window.location.origin + target);
          
          // Show transition message with clean response
          addMessage({
            role: "assistant",
            content: cleanResponse || `✨ Navigating to ${target}`,
          });
          
          setIsLoading(false);
          setConnectionStatus("connected");
          
          // Hard navigation to ensure reliability across all pages
          // Chat state (open/minimized/position) preserved via localStorage
          const fullUrl = window.location.origin + target;
          console.log("🐻 [NAV] Scheduling navigation in 300ms...");
          setTimeout(() => {
            console.log("🐻 [NAV] 🚀 NAVIGATING NOW to:", fullUrl);
            window.location.href = fullUrl;
          }, 300);
          return;
        } else {
          console.error("🐻 [NAV] ⚠️ NAVIGATE tag found but regex didn't match - malformed tag?");
          console.error("🐻 [NAV] Raw response:", data.response);
        }
      } else {
        console.log("🐻 [NAV] No navigation command in response (expected behavior)");
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
      
      setConnectionStatus("connected");
    } catch (error: any) {
      console.error("🐻 Chat error:", error);
      setConnectionStatus("error");
      
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
      
      // Reset to connected after 3 seconds
      setTimeout(() => setConnectionStatus("connected"), 3000);
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

  // Don't render until hydrated to prevent flash
  if (!hasHydrated) return null;

  if (!isOpen) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            left: `${iconPosition.x}px`,
            top: `${iconPosition.y}px`,
            zIndex: 9999,
          }}
          className="relative"
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingIcon(true);
              setHasIconMoved(false); // Reset movement flag
              setIconDragStart({
                x: e.clientX - iconPosition.x,
                y: e.clientY - iconPosition.y,
              });
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              setIsDraggingIcon(true);
              setHasIconMoved(false); // Reset movement flag
              setIconDragStart({
                x: touch.clientX - iconPosition.x,
                y: touch.clientY - iconPosition.y,
              });
            }}
            onClick={(e) => {
              e.preventDefault();
              // Only open if icon wasn't dragged
              if (!hasIconMoved) {
                toggleChat();
                setHasUnreadMessage(false);
                setShowNotificationBubble(false);
                setShowWelcomePopup(false); // Hide welcome popup when chat opens
                // Mark current message as read
                if (currentConversation && currentConversation.messages.length > 0) {
                  const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
                  if (lastMessage.role === "assistant") {
                    setLastReadMessageId(lastMessage.id);
                    localStorage.setItem("bear-last-read-message-id", lastMessage.id);
                  }
                }
              }
              setHasIconMoved(false); // Reset for next interaction
            }}
            className={`flex h-14 w-14 items-center justify-center transition-all hover:scale-110 z-50 ${
              isDraggingIcon ? "cursor-grabbing" : "cursor-grab"
            } ${hasUnreadMessage ? "animate-pulse" : ""}`}
            aria-label="Open Ursa Minor"
          >
            <div className="text-4xl">🐻</div>
            {hasUnreadMessage && (
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-[#020511] animate-pulse" />
            )}
          </button>

          {/* Notification Bubble */}
          {showNotificationBubble && latestAIMessage && (
            <div 
              onClick={() => {
                toggleChat();
                setHasUnreadMessage(false);
                setShowNotificationBubble(false);
                // Mark current message as read
                if (currentConversation && currentConversation.messages.length > 0) {
                  const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
                  if (lastMessage.role === "assistant") {
                    setLastReadMessageId(lastMessage.id);
                    localStorage.setItem("bear-last-read-message-id", lastMessage.id);
                  }
                }
              }}
              className="absolute left-16 w-64 bg-[#020511]/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl animate-in slide-in-from-left-2 fade-in duration-300 cursor-pointer hover:border-indigo-400/50 transition-all hover:scale-105"
              style={{ 
                zIndex: 10000,
                // Smart positioning: show above icon if icon is in bottom half, below if in top half
                ...(iconPosition.y > (typeof window !== "undefined" ? window.innerHeight / 2 : 400)
                  ? { bottom: "100%", marginBottom: "8px" } // Icon in bottom half - show above
                  : { top: 0 } // Icon in top half - show below
                )
              }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 text-lg">🐻</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-indigo-300 mb-1">Ursa Minor</div>
                  <div className="text-sm text-white/90 line-clamp-3">
                    {latestAIMessage}...
                  </div>
                  <div className="text-xs text-indigo-400 mt-2 font-medium">Click to open →</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotificationBubble(false);
                  }}
                  className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Welcome Popup - Shows after 5 seconds */}
          {showWelcomePopup && !showNotificationBubble && (
            <div 
              onClick={() => {
                toggleChat();
                setShowWelcomePopup(false);
              }}
              className="absolute left-16 w-56 bg-gradient-to-r from-indigo-500/20 to-sky-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-xl p-3 shadow-2xl animate-in slide-in-from-left-2 fade-in duration-300 cursor-pointer hover:border-indigo-400/50 transition-all hover:scale-105"
              style={{ 
                zIndex: 10000,
                // Smart positioning: show above icon if icon is in bottom half, below if in top half
                ...(iconPosition.y > (typeof window !== "undefined" ? window.innerHeight / 2 : 400)
                  ? { bottom: "100%", marginBottom: "8px" } // Icon in bottom half - show above
                  : { top: 0 } // Icon in top half - show below
                )
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 text-xl">👋</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white mb-0.5">I'm here to help!</div>
                  <div className="text-xs text-white/70">
                    Click to chat with Ursa Minor
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcomePopup(false);
                  }}
                  className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div
      ref={chatRef}
      style={{
        position: "fixed",
        // Mobile: fullscreen, Desktop: positioned
        ...(isMobile ? {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        } : {
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? "320px" : `${chatSize.width}px`,
        }),
        zIndex: 9999,
        transition: isDragging || isResizing ? "none" : "all 0.3s ease-in-out",
        // Mobile: always opaque, Desktop: responsive opacity
        opacity: isMobile ? 1 : (isFocused ? 1 : 0.3),
      }}
      className={`${isDragging ? "cursor-grabbing" : ""} ${isResizing ? "cursor-nwse-resize" : ""} ${isMobile ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : "animate-in slide-in-from-bottom-5 fade-in duration-300"}`}
    >
      <div className={`relative ${isMobile ? "h-full flex flex-col" : "rounded-2xl"} border shadow-2xl overflow-hidden transition-all duration-300 ${
        isFocused 
          ? "border-white/20 bg-[#020511]/95 backdrop-blur-xl" 
          : "border-white/10 bg-[#020511]/40 backdrop-blur-sm"
      }`}>
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-500/20 to-sky-500/20 p-4 ${
            !isMobile && isDragging ? "cursor-grabbing" : ""
          } ${!isMobile && !isDragging ? "cursor-grab" : ""} ${isMinimized && hasUnreadMessage ? "animate-pulse" : ""} ${isMobile ? "flex-shrink-0" : ""}`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center relative ${
              isMinimized && !isMobile ? "h-12 w-12 text-5xl" : "h-10 w-10 text-3xl"
            }`}>
              🐻
              {isMinimized && hasUnreadMessage && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-[#020511] animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Ursa Minor</div>
              <div className="flex items-center gap-1.5 text-xs">
                {/* Real-time connection status */}
                {connectionStatus === "connected" && (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400">Online & Ready</span>
                  </>
                )}
                {connectionStatus === "thinking" && (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-400">Thinking...</span>
                  </>
                )}
                {connectionStatus === "error" && (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-red-400">Connection Error</span>
                  </>
                )}
                {deepResearchMode && (
                  <span className="ml-2 bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-[10px]">🔬 Research</span>
                )}
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
                // Add shrink animation before minimizing
                if (chatRef.current) {
                  chatRef.current.style.transition = 'all 0.3s ease-in-out';
                  chatRef.current.style.transform = 'scale(0.8)';
                  chatRef.current.style.opacity = '0';
                }
                setTimeout(() => {
                  toggleChat(); // This will minimize to icon
                  if (chatRef.current) {
                    chatRef.current.style.transform = '';
                    chatRef.current.style.opacity = '';
                  }
                }, 300);
              }}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Minimize to icon"
              title="Minimize"
            >
              <Minus className="h-4 w-4" />
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
                  
                  <label className="flex items-start gap-3 cursor-pointer selectable">
                    <input
                      type="checkbox"
                      checked={deepResearchMode}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setDeepResearchMode(checked);
                        localStorage.setItem("bear-deep-research", String(checked));
                      }}
                      className="mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-white flex items-center gap-2">
                        🔬 Deep Research Mode
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Beta</span>
                      </div>
                      <div className="text-xs text-white/50 mt-0.5">
                        Enhanced analysis with detailed investigations, cross-referencing, and comprehensive answers. Auto-detects when deep research is needed.
                      </div>
                    </div>
                  </label>
                  
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-sm text-white mb-2">Font Size</div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const newSize = Math.max(12, fontSize - 1);
                          setFontSize(newSize);
                          localStorage.setItem("bear-font-size", String(newSize));
                        }}
                        disabled={fontSize <= 12}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Decrease font size"
                      >
                        <span className="text-lg font-bold">−</span>
                      </button>
                      
                      <div className="flex-1 text-center">
                        <div className="text-sm text-white/90">{fontSize}px</div>
                        <div className="text-xs text-white/40">Range: 12-18px</div>
                      </div>
                      
                      <button
                        onClick={() => {
                          const newSize = Math.min(18, fontSize + 1);
                          setFontSize(newSize);
                          localStorage.setItem("bear-font-size", String(newSize));
                        }}
                        disabled={fontSize >= 18}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Increase font size"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setFontSize(14);
                          localStorage.setItem("bear-font-size", "14");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs transition-colors"
                        title="Reset to default"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div 
              className={`chat-content overflow-y-auto p-4 space-y-4 ${isMobile ? "flex-1" : ""}`}
              style={isMobile ? {} : { height: `${chatSize.height - 200}px` }}
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
                    style={{ fontSize: `${fontSize}px` }}
                    className={`selectable max-w-[85%] rounded-2xl px-4 py-2.5 ${
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
                  <div 
                    style={{ fontSize: `${fontSize}px` }}
                    className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-white/90"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className={`chat-input chat-input-form border-t border-white/10 p-4 ${isMobile ? "flex-shrink-0" : ""}`}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Ursa Minor anything..."
                  style={{ fontSize: isMobile ? "16px" : `${fontSize}px` }}
                  className="flex-1 rounded-lg bg-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-indigo-500/50"
                  disabled={isLoading}
                  autoFocus={!isMobile}
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
        
        {/* Invisible Resize Handles - Corners and Edges (DESKTOP ONLY) */}
        {!isMinimized && !isMobile && (
          <>
            {/* Corner Handles */}
            <div
              onMouseDown={handleResizeStart("tl")}
              className="absolute top-0 left-0 h-4 w-4 cursor-nwse-resize z-10"
              style={{ touchAction: 'none' }}
              title="Resize from top-left corner"
            />
            <div
              onMouseDown={handleResizeStart("tr")}
              className="absolute top-0 right-0 h-4 w-4 cursor-nesw-resize z-10"
              style={{ touchAction: 'none' }}
              title="Resize from top-right corner"
            />
            <div
              onMouseDown={handleResizeStart("bl")}
              className="absolute bottom-0 left-0 h-4 w-4 cursor-nesw-resize z-10"
              style={{ touchAction: 'none' }}
              title="Resize from bottom-left corner"
            />
            <div
              onMouseDown={handleResizeStart("br")}
              className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize z-10"
              style={{ touchAction: 'none' }}
              title="Resize from bottom-right corner"
            />
            
            {/* Edge Handles */}
            <div
              onMouseDown={handleResizeStart("t")}
              className="absolute top-0 left-4 right-4 h-2 cursor-ns-resize"
              style={{ touchAction: 'none' }}
              title="Resize from top edge"
            />
            <div
              onMouseDown={handleResizeStart("r")}
              className="absolute right-0 top-4 bottom-4 w-2 cursor-ew-resize"
              style={{ touchAction: 'none' }}
              title="Resize from right edge"
            />
            <div
              onMouseDown={handleResizeStart("b")}
              className="absolute bottom-0 left-4 right-4 h-2 cursor-ns-resize"
              style={{ touchAction: 'none' }}
              title="Resize from bottom edge"
            />
            <div
              onMouseDown={handleResizeStart("l")}
              className="absolute left-0 top-4 bottom-4 w-2 cursor-ew-resize"
              style={{ touchAction: 'none' }}
              title="Resize from left edge"
            />
          </>
        )}
      </div>
    </div>
  );
}

