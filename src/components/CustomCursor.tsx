import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);

  const springConfig = { damping: 30, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, .interactive");
      if (interactive) {
        setIsHovering(true);
        setHoverType(interactive.getAttribute('data-cursor') || 'default');
      } else {
        setIsHovering(false);
        setHoverType(null);
      }
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-saffron rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-saffron/50 rounded-full pointer-events-none z-[9998]"
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.2 : 0.5,
          borderWidth: isHovering ? '1px' : '2px',
        }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Floating Icon/Text on Hover */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -40 }}
            exit={{ opacity: 0, scale: 0, y: 10 }}
            className="fixed top-0 left-0 pointer-events-none z-[9999] flex flex-col items-center"
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <div className="bg-espresso text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-2xl">
              {hoverType === 'view' ? 'View Details' : hoverType === 'shop' ? 'Add to Cart' : 'Explore'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spice Particles Trail */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-1 h-1 bg-turmeric/20 rounded-full pointer-events-none z-[9997]"
          style={{
            x: useSpring(mouseX, { damping: 40 + i * 10, stiffness: 150 - i * 20 }),
            y: useSpring(mouseY, { damping: 40 + i * 10, stiffness: 150 - i * 20 }),
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      ))}
    </>
  );
}
