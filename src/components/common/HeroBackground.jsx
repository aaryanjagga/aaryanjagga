import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function HeroBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { isDark } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Mesh Grid */}
      <div className={`absolute inset-0 bg-grid-pattern ${isDark ? 'opacity-40' : 'opacity-35'}`} />

      {/* Mouse Tracking Ambient Radial Glow */}
      <div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isDark ? 'opacity-20' : 'opacity-[0.08]'
        }`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: isDark
            ? 'radial-gradient(circle, #6366f1 0%, #3b82f6 40%, transparent 70%)'
            : 'radial-gradient(circle, #818cf8 0%, #93c5fd 40%, transparent 70%)',
        }}
      />

      {/* Static Atmospheric Depth Gradients */}
      {isDark ? (
        <>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[100px]" />
          <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px]" />
        </>
      ) : (
        <>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-indigo-200/30 via-purple-100/20 to-transparent blur-[120px]" />
          <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-200/15 blur-[100px]" />
          <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] rounded-full bg-blue-200/15 blur-[120px]" />
        </>
      )}
    </div>
  );
}
