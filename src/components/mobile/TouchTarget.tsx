'use client';

interface TouchTargetProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  minWidth?: number;
  minHeight?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Wrapper component that ensures minimum touch target size (44x44px)
 * while maintaining visual appearance
 */
export function TouchTarget({ 
  children, 
  onClick, 
  className = '', 
  minWidth = 44,
  minHeight = 44,
  disabled = false,
  style = {}
}: TouchTargetProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
