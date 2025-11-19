"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Conversation, ChatMessage } from "@/lib/chatContext";
import dayjs from "dayjs";

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  canNavigate: boolean; // AI can only navigate when chat is open (not minimized)
  createConversation: (model?: "ursa-minor" | "ursa-major" | "aurora-lore") => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string) => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  addNotification: (message: string) => void; // For background research notifications
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Start closed (minimized icon only)
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [hasHydrated, setHasHydrated] = useState(false);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bear-conversations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed.conversations || []);
        setCurrentConversationId(parsed.currentId || null);
        // IMPORTANT: Restore the chat state (open/minimized) across navigation
        // This prevents the chat from minimizing when AI navigates to a new page
        setIsOpen(parsed.isOpen ?? false);
        setIsMinimized(parsed.isMinimized ?? false);
        setPosition(parsed.position || { x: 20, y: 20 });
      } catch (e) {
        console.error("Failed to load conversations:", e);
      }
    } else {
      // Create first conversation automatically
      const firstConv: Conversation = {
        id: crypto.randomUUID(),
        title: "Chat with Ursa Minor",
        messages: [],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        model: "ursa-minor",
      };
      setConversations([firstConv]);
      setCurrentConversationId(firstConv.id);
    }
    setHasHydrated(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(
        "bear-conversations",
        JSON.stringify({
          conversations,
          currentId: currentConversationId,
          isOpen,
          isMinimized,
          position,
        })
      );
    }
  }, [conversations, currentConversationId, isOpen, isMinimized, position]);

  const createConversation = useCallback((model: "ursa-minor" | "ursa-major" | "aurora-lore" = "ursa-minor") => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: `Chat with ${model === "ursa-minor" ? "Ursa Minor" : model === "ursa-major" ? "Ursa Major" : "Grizzly"}`,
      messages: [],
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
      model,
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    return newConv.id; // Return the ID for immediate use
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (currentConversationId === id && filtered.length > 0) {
        setCurrentConversationId(filtered[0].id);
      } else if (filtered.length === 0) {
        setCurrentConversationId(null);
      }
      return filtered;
    });
  }, [currentConversationId]);

  const setCurrentConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    if (!currentConversationId) return;

    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: dayjs().toISOString(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          const updatedMessages = [...conv.messages, newMessage];
          
          // Auto-generate title from first user message
          let title = conv.title;
          if (updatedMessages.filter(m => m.role === "user").length === 1 && message.role === "user") {
            title = message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "");
          }

          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: dayjs().toISOString(),
          };
        }
        return conv;
      })
    );
  }, [currentConversationId]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (isMinimized) setIsMinimized(false);
  }, [isMinimized]);

  const minimizeChat = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const maximizeChat = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const addNotification = useCallback((message: string) => {
    // Add a notification message when chat is minimized
    // This allows background research to communicate without navigation
    if (!currentConversationId) return;

    const notificationMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `🔔 **Background Research Complete**\n\n${message}`,
      timestamp: dayjs().toISOString(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, notificationMessage],
            updatedAt: dayjs().toISOString(),
          };
        }
        return conv;
      })
    );

    // Show browser notification if supported and chat is minimized
    if (isMinimized && "Notification" in window && Notification.permission === "granted") {
      new Notification("Ursa Minor", {
        body: message,
        icon: "/bear-icon.png",
      });
    }
  }, [currentConversationId, isMinimized]);

  // Calculate if AI can navigate - only when chat is open and NOT minimized
  const canNavigate = isOpen && !isMinimized;

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}

