import React, { useEffect, useState } from 'react';

interface MeteorShowerProps {
  isActive: boolean;
  onClose: () => void;
}

export const MeteorShower: React.FC<MeteorShowerProps> = ({ isActive, onClose }) => {
  const [meteors, setMeteors] = useState<Array<{ id: number; left: number; top: number; angle: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const count = 20;
      const newMeteors = Array.from({ length: count }, (_, i) => ({
        id: i,
        // Start from random positions above or to the left of the viewport
        left: Math.random() * 120 - 10, // -10% to 110%
        top: Math.random() * -50, // Start above viewport
        // Angle: 135deg is diagonal down-right, 225deg is diagonal down-left.
        // Let's vary between 160 (steep right) and 200 (steep left) for a "falling" feel, or purely random.
        // User asked for random angles. Let's do a broader range 120 to 240.
        // 180 is straight down.
        angle: 150 + Math.random() * 60, 
        delay: Math.random() * 4,
        duration: 1.5 + Math.random() * 2,
        size: 0.5 + Math.random() * 1
      }));
      setMeteors(newMeteors);
    } else {
      setMeteors([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="absolute origin-left"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            // Rotate the entire container to the trajectory angle
            transform: `rotate(${meteor.angle}deg)`,
          }}
        >
            {/* Inner element translates along the X axis of the rotated container */}
            <div 
                className="flex items-center"
                style={{
                    animation: `shoot ${meteor.duration}s linear infinite`,
                    animationDelay: `${meteor.delay}s`,
                    opacity: 0, // Start invisible
                }}
            >
                {/* The glowing head */}
                <div 
                    className="rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" 
                    style={{ width: `${3 * meteor.size}px`, height: `${3 * meteor.size}px` }}
                />
                {/* The trailing tail - visually behind the head due to flex-direction (row goes L->R) 
                    Wait, if we move 'right' along X, the tail should be on the left.
                    So we want [Tail][Head] ---> Direction
                */}
                <div 
                    className="h-[1px] bg-gradient-to-l from-white/60 to-transparent" 
                    style={{ width: `${100 * meteor.size}px`, marginLeft: '-2px' }}
                />
            </div>
        </div>
      ))}

      <style>{`
        @keyframes shoot {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(120vh); /* Move far enough to cross screen */
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};