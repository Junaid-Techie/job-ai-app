"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  // Use MotionValues to bypass React state re-rendering entirely (zero lag)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inner dot: extremely fast spring (almost instant)
  const dotSpringX = useSpring(mouseX, { stiffness: 2000, damping: 40, mass: 0.05 });
  const dotSpringY = useSpring(mouseY, { stiffness: 2000, damping: 40, mass: 0.05 });

  // Outer ring: softer spring for a smooth trailing effect
  const ringSpringX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.1 });
  const ringSpringY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.1 });

  useEffect(() => {
    // Inject global cursor styles to hide the default arrow
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none;
      }
      a, button, select, [role="button"] {
        cursor: pointer !important;
      }
      input, textarea {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);

    const updateMousePosition = (e: MouseEvent) => {
      // Set the exact client coordinates
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    // Use passive listener for absolute maximum performance
    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.head.removeChild(style);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Solid Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_15px_rgba(52,211,153,1)]"
        style={{ 
          x: dotSpringX, 
          y: dotSpringY,
          translateX: "-50%",
          translateY: "-50%" 
        }}
      />
      {/* Outer Glow Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-emerald-500/50 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{ 
          x: ringSpringX, 
          y: ringSpringY,
          translateX: "-50%",
          translateY: "-50%" 
        }}
      />
    </>
  );
}
