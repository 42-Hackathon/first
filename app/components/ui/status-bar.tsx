import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface StatusBarProps {
  isRightSidebarOpen?: boolean;
}

export function StatusBar({ isRightSidebarOpen = false }: StatusBarProps) {
  const [zoomLevel, setZoomLevel] = useState(0); // VS Code 스타일: 0 = 100%, 1 = 110%, -1 = 90%
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 더 작은 줌 레벨 - 10% 단위로 변경 (기존 20% → 10%)
  const getZoomPercentage = (level: number) => {
    return Math.round(100 * Math.pow(1.1, level)); // 1.2 → 1.1로 변경
  };

  // 퍼센트를 VS Code 줌 레벨로 변환
  const getZoomLevel = (percentage: number) => {
    return Math.log(percentage / 100) / Math.log(1.1); // 1.2 → 1.1로 변경
  };

  // 키보드 단축키 지원 (VS Code와 동일)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          updateZoomLevel(Math.min(3, zoomLevel + 1)); // 최대 3단계 (약 133%)
        } else if (e.key === '-') {
          e.preventDefault();
          updateZoomLevel(Math.max(-3, zoomLevel - 1)); // 최소 -3단계 (약 73%)
        } else if (e.key === '0') {
          e.preventDefault();
          updateZoomLevel(0); // 100%로 리셋
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel]);

  const updateZoomLevel = useCallback((newLevel: number) => {
    const clampedLevel = Math.max(-3, Math.min(3, newLevel)); // -3 ~ +3 범위로 축소
    setZoomLevel(clampedLevel);
    
    const percentage = getZoomPercentage(clampedLevel);
    
    // VS Code와 동일한 방식으로 줌 적용
    document.body.style.zoom = `${percentage}%`;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      
      // 슬라이더 위치를 VS Code 줌 레벨로 변환 (-3 to 3)
      const newLevel = -3 + (percentage * 6);
      updateZoomLevel(Math.round(newLevel)); // 정수 단위로 조절
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 초기 클릭 위치에서도 줌 레벨 설정
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newLevel = -3 + (percentage * 6);
      updateZoomLevel(Math.round(newLevel));
    }
  };

  // 우측 사이드바가 열려있을 때의 위치 계산
  const getPosition = () => {
    if (isRightSidebarOpen) {
      return {
        right: '324px', // 사이드바 너비(320px) + 여백(4px)
        bottom: '6px'
      };
    } else {
      return {
        right: '6px',
        bottom: '6px'
      };
    }
  };

  // VS Code 줌 레벨을 슬라이더 위치로 변환 (-3 = 0%, 3 = 100%)
  const getSliderPosition = () => {
    return ((zoomLevel + 3) / 6) * 100;
  };

  const currentPercentage = getZoomPercentage(zoomLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        ...getPosition()
      }}
      transition={{ 
        delay: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="fixed z-20 group"
      style={getPosition()}
    >
      <div className="flex items-center backdrop-blur-xl bg-white/[0.08] border border-white/20 rounded-md text-white relative overflow-hidden">
        {/* Liquid Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-md" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.02] rounded-md" />
        
        <div className="relative z-10 flex items-center px-2 py-1 gap-2">
          {/* VS Code Style Zoom Level Display - 더 작게 */}
          <div className="text-[10px] font-mono text-white/80 min-w-[32px] text-center">
            <div className="text-white leading-none">{currentPercentage}%</div>
            <div className="text-white/50 text-[8px] leading-none">
              {zoomLevel > 0 ? `+${zoomLevel}` : zoomLevel === 0 ? '0' : zoomLevel}
            </div>
          </div>
          
          {/* Zoom Slider Bar - 더 작게 */}
          <div 
            ref={sliderRef}
            className={`relative w-16 h-1.5 bg-white/20 rounded-full cursor-pointer transition-all duration-200 ${
              isDragging ? 'bg-white/30 scale-105' : 'hover:bg-white/25'
            }`}
            onMouseDown={handleMouseDown}
            title={`Window Zoom Level: ${zoomLevel} (${currentPercentage}%)`}
          >
            {/* Track Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 rounded-full" />
            
            {/* Progress Fill */}
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-sm relative overflow-hidden"
              style={{ width: `${getSliderPosition()}%` }}
              animate={{ 
                width: `${getSliderPosition()}%`,
                boxShadow: isDragging 
                  ? '0 0 8px rgba(59, 130, 246, 0.8), 0 0 16px rgba(59, 130, 246, 0.4)' 
                  : '0 1px 4px rgba(59, 130, 246, 0.3)'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Animated Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{ 
                  x: isDragging ? ['-100%', '100%'] : 0,
                  opacity: isDragging ? [0.3, 0.7, 0.3] : 0.5
                }}
                transition={{ 
                  duration: isDragging ? 1.5 : 0,
                  repeat: isDragging ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Slider Thumb - 더 작게 */}
            <motion.div 
              className="absolute top-1/2 w-2 h-2 bg-white rounded-full shadow-sm transform -translate-y-1/2 cursor-grab active:cursor-grabbing"
              style={{ left: `calc(${getSliderPosition()}% - 4px)` }}
              animate={{ 
                scale: isDragging ? 1.2 : 1,
                boxShadow: isDragging 
                  ? '0 0 8px rgba(255, 255, 255, 0.9), 0 0 16px rgba(59, 130, 246, 0.6)' 
                  : '0 1px 4px rgba(0, 0, 0, 0.3)'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Inner Glow - 더 작게 */}
              <div className="absolute inset-0.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full" />
              <div className="absolute inset-0.5 bg-gradient-to-br from-white/50 to-transparent rounded-full" />
            </motion.div>
            
            {/* Tick Marks - 더 작게 */}
            <div className="absolute inset-0 flex justify-between items-center px-0.5">
              {/* -3 (73%) */}
              <div className="flex flex-col items-center">
                <div className="w-px h-0.5 bg-white/30" />
              </div>
              {/* -1 (90%) */}
              <div className="flex flex-col items-center">
                <div className="w-px h-0.5 bg-white/40" />
              </div>
              {/* 0 (100%) - Default */}
              <div className="flex flex-col items-center">
                <div className="w-px h-1 bg-white/80" />
              </div>
              {/* +1 (110%) */}
              <div className="flex flex-col items-center">
                <div className="w-px h-0.5 bg-white/40" />
              </div>
              {/* +3 (133%) */}
              <div className="flex flex-col items-center">
                <div className="w-px h-0.5 bg-white/30" />
              </div>
            </div>
          </div>
          
          {/* 범위 라벨 - 더 작게 */}
          <div className="flex flex-col text-[7px] text-white/50 leading-tight font-mono">
            <span>-3</span>
            <span>+3</span>
          </div>
        </div>
        
        {/* VS Code Style Tooltip - 더 작게 */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/20">
          <div className="text-center">
            <div className="font-semibold">Zoom: {zoomLevel} ({currentPercentage}%)</div>
            <div className="text-white/70">Ctrl +/- 또는 드래그</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}