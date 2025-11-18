"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  decimals = 0,
  suffix = "",
  prefix = "",
  separator = false,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Parse the value
  const numericValue = typeof value === "string" 
    ? parseFloat(value.replace(/[^0-9.-]+/g, "")) 
    : value;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || isNaN(numericValue)) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = numericValue * easeProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, numericValue, duration]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    if (separator) {
      return parseFloat(fixed).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return fixed;
  };

  return (
    <span ref={ref}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

