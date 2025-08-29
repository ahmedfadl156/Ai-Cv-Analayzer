import { useEffect, useRef, useState } from "react";

export default function OverallScore({score}: {score: number}) {
  const [pathLength, setPathLength] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = animatedScore / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Animate score counting
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentScore = Math.round(easeOutQuart * score);
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        setIsAnimating(false);
      }
    };
    
    // Start animation after a short delay
    const timer = setTimeout(() => {
      animateScore();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color based on score using your design system
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-600";
    if (score >= 60) return "text-primary-600";
    return "text-primary-800";
  };

  const getGradientStops = (score: number) => {
    if (score >= 80) return { start: "#059669", end: "#10b981" }; // emerald gradient
    if (score >= 60) return { start: "#334155", end: "#475569" }; // slate gradient
    return { start: "#0f172a", end: "#334155" }; // navy to slate gradient
  };

  const gradientColors = getGradientStops(animatedScore);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient
              id={`gaugeGradient-${animatedScore}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Animated foreground arc */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={`url(#gaugeGradient-${animatedScore})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
          <div className={`text-2xl font-bold ${getScoreColor(animatedScore)} transition-colors duration-300`}>
            {animatedScore}
          </div>
          <div className="text-sm text-neutral-500 font-medium">
            out of 100
          </div>
        </div>
      </div>
    </div>
  );
}
