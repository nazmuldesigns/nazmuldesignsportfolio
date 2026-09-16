// src/components/layout/CustomCursor.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        setCursorVariant('link');
      } else if (target.closest('[data-cursor="view"]')) {
        setCursorVariant('view');
      } else if (target.closest('[data-cursor="explore"]')) {
        setCursorVariant('explore');
      } else {
        setCursorVariant('default');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    link: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    explore: {
      width: 100,
      height: 100,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
  };

  // Hide on mobile/touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <motion.div
      className="custom-cursor fixed rounded-full pointer-events-none z-[9999]"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)',
      }}
      variants={variants}
      animate={cursorVariant}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      {cursorVariant === 'view' && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          VIEW
        </div>
      )}
      {cursorVariant === 'explore' && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          EXPLORE
        </div>
      )}
    </motion.div>
  );
}
