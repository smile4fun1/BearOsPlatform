"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb, Laugh } from "lucide-react";

const ROBOT_JOKES = [
  "Why did the robot go to therapy? It had too many bits of emotional baggage! 🤖",
  "What's a robot's favorite type of music? Heavy metal! 🎵",
  "Why don't robots ever get hungry? They're always byte-ing on something! 😄",
  "How do robots eat their data? One byte at a time! 🍔",
  "Why was the robot couple happy? They were a perfect match! ⚙️❤️",
  "What do you call a robot that takes the long way around? R2-Detour! 🤖",
  "Why did the robot break up with the internet? Too many connections! 💔",
];

const ROBOTICS_FACTS = [
  "Did you know? The first industrial robot, Unimate, was installed in 1961 at a General Motors plant! 🏭",
  "Fun fact: Modern robotic arms can position objects with precision down to 0.05mm! 🎯",
  "Servi robots can navigate autonomously and avoid obstacles in real-time using advanced LiDAR sensors! 🚀",
  "Robots never get tired! While humans need breaks, robots can work 24/7 with just periodic maintenance! ⚡",
  "The hospitality robotics market is projected to reach $2.4 billion by 2028! 📈",
  "Collaborative robots (cobots) can work safely alongside humans without safety cages! 🤝",
  "Restaurant robots like Servi can reduce wait times by up to 40% during peak hours! ⏱️",
];

export function BearFunPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState({ text: "", type: "joke" as "joke" | "fact" });
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  useEffect(() => {
    // Track user activity
    const handleActivity = () => {
      setLastInteractionTime(Date.now());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, []);

  useEffect(() => {
    // Smart popup system with random idle intervals
    const checkIdleAndShowPopup = () => {
      const idleTime = Date.now() - lastInteractionTime;
      const randomInterval = Math.random() * (10 * 60 * 1000) + (3 * 60 * 1000); // 3-13 minutes
      
      // Only show if user has been idle for at least 2 minutes and popup not already visible
      if (idleTime > 2 * 60 * 1000 && !isVisible) {
        // Random chance to show (30% probability on each check)
        if (Math.random() > 0.7) {
          showRandomContent();
        }
      }
    };

    const interval = setInterval(checkIdleAndShowPopup, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [lastInteractionTime, isVisible]);

  const showRandomContent = () => {
    const isJoke = Math.random() > 0.5;
    const items = isJoke ? ROBOT_JOKES : ROBOTICS_FACTS;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    setContent({ text: randomItem, type: isJoke ? "joke" : "fact" });
    setIsVisible(true);

    // Auto-dismiss after 15 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 15000);
  };

  const handleClose = () => {
    setIsVisible(false);
    setLastInteractionTime(Date.now()); // Reset idle time on manual close
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-[9998] animate-in slide-in-from-bottom-5 fade-in duration-500"
      style={{ maxWidth: "380px" }}
    >
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl p-5">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${
            content.type === "joke" 
              ? "bg-gradient-to-br from-amber-500 to-orange-500" 
              : "bg-gradient-to-br from-sky-500 to-indigo-500"
          }`}>
            {content.type === "joke" ? (
              <Laugh className="h-5 w-5 text-white" />
            ) : (
              <Lightbulb className="h-5 w-5 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white/60 mb-2">
              {content.type === "joke" ? "🐻 Bear's Robot Joke" : "🤖 Bear's Robotics Fact"}
            </div>
            <p className="text-sm text-white leading-relaxed">
              {content.text}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cute bear footer */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/40">From your friendly Bear AI 🐻</span>
          <button
            onClick={handleClose}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

