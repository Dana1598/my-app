/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Signal, Wifi, Bell, Search, Settings, Grid3X3, Columns2, X, Bluetooth, Send, BatteryMedium, MapPin, Minus, Expand, Shrink, PictureInPicture2, Cloud, Star, LogOut, Minimize2, ChevronLeft, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, animate } from 'motion/react';

const apps = {
  'מחשבון': { color: 'bg-yellow-500', icon: '/calculator.png' },
  'שעל״ח': { color: 'bg-[#09A7EB]', icon: '/icon.png' },
  'קולומבוס': { color: 'bg-[#C735C7]', icon: '/Columbus.png' },
  'צ\'אט': { color: 'bg-[#07C753]', icon: '/chat.png' },
  'סנייפר': { color: 'bg-[#B75AFF]', icon: '/Sn.png' },
  'Ztube': { color: 'bg-red-600', icon: '/Ztube.png' },
  'חפ"ק': { color: 'bg-[#8493A7]', icon: '/hapak.png' },
  'דרור': { color: 'bg-[#8493A7]', icon: '/dror.png', hideFromDock: true },
  'לאסו': { color: 'bg-[#8493A7]', icon: '/laso.png', hideFromDock: true },
  'קבצים': { color: 'bg-[#8493A7]', icon: '/files.png', hideFromDock: true },
  'AI': { color: 'bg-[#8493A7]', icon: '/ai.png', hideFromDock: true },
  'הערות': { color: 'bg-[#8493A7]', icon: '/notes.png', hideFromDock: true },
  'גלריה': { color: 'bg-[#8493A7]', icon: '/gallery.png', hideFromDock: true },
  'QR': { color: 'bg-[#8493A7]', icon: '/qr.png', hideFromDock: true },
  'Cargo': { color: 'bg-[#8493A7]', icon: '/cargo.png', hideFromDock: true },
};

const utilityApps = ['דרור', 'מחשבון', 'שעל״ח', 'קולומבוס', "צ'אט", 'סנייפר', 'Ztube', 'לאסו', 'קבצים', 'AI', 'הערות', 'גלריה', 'QR', 'Cargo'];

const hapakSubApps = [
  { name: 'מפקדה', icon: '/mifkada.png' },
  { name: 'שד״ח', icon: '/shadah.png' },
  { name: 'חפ"ק', icon: '/hapak.png' },
  { name: 'מענ״ק', icon: '/micon.png' }
];

const getAppIcon = (appName: string | null) => {
  if (!appName) return '';
  return apps[appName as keyof typeof apps]?.icon || '';
};

const getQuickSwapList = (currentApp: string | null) => {
  return utilityApps.filter(app => app !== currentApp).slice(0, 9);
};

// Helper component for Launchpad slots
const AppSlot = ({ icon, name, onClick, isActive, isPlaceholder, placeholderColor }: { 
  icon?: string; 
  name: string; 
  onClick?: (e: React.MouseEvent) => void; 
  isActive?: boolean;
  isPlaceholder?: boolean;
  placeholderColor?: string;
}) => {
  return (
    <div className={`flex flex-col items-center gap-1 ${!isPlaceholder ? 'cursor-pointer group' : ''}`} onClick={(e) => { e.stopPropagation(); onClick?.(e); }}>
      <div className="h-20 flex items-end justify-center">
        {isPlaceholder ? (
          <div className={`w-18 h-18 ${placeholderColor || 'bg-[#8493A7]'} rounded-2xl shadow-lg`} />
        ) : (
          <img 
            src={icon} 
            alt={name} 
            className={`w-20 h-20 object-contain rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-200 ${
              isActive
                ? 'border-[1.5px] border-[#0066FF] shadow-[0_0_20px_rgba(0,102,255,0.6)]' 
                : 'border-[1.5px] border-transparent'
            }`}
          />
        )}
      </div>
      <span className={`text-sm font-medium text-center ${isPlaceholder ? 'text-white/40' : 'text-white'}`}>
        {name}
      </span>
    </div>
  );
};

const QuickSwapMenu = ({ currentApp, onSelect }: { currentApp: string | null, onSelect: (appName: string) => void }) => {
  const quickApps = getQuickSwapList(currentApp);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className={`absolute top-[58px] right-0 bg-[#16191F]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl z-[2000] flex items-center justify-center ${
        currentApp === 'חפ"ק' ? 'w-fit gap-1' : 'w-[182px] grid grid-cols-3 gap-2'
      }`}
    >
      {currentApp === 'חפ"ק' ? (
        /* תצוגת חפ"ק מיוחדת - שורה אחת של 3 אפליקציות (ללא חפ"ק) */
        hapakSubApps.filter(app => app.name !== 'חפ"ק').map((app) => (
          <button
            key={app.name}
            onClick={() => onSelect(app.name)}
            className="w-[52px] h-[52px] rounded-lg flex items-center justify-center shadow-lg hover:bg-white/5 transition-colors overflow-hidden"
          >
            <img 
              src={app.icon} 
              alt={app.name} 
              className="w-12 h-12 object-contain" 
            />
          </button>
        ))
      ) : (
        /* תצוגה רגילה לשאר האפליקציות - 9 אייקונים בריבוע 3x3 */
        getQuickSwapList(currentApp).map((appName) => {
          const icon = getAppIcon(appName);
          return (
            <button
              key={appName}
              onClick={() => onSelect(appName)}
              className="w-[52px] h-[52px] rounded-lg flex items-center justify-center shadow-lg overflow-hidden"
            >
              {icon && <img src={icon} alt={appName} className="w-full h-full object-contain" />}
            </button>
          );
        })
      )}
    </motion.div>
  );
};

const GhostIcon = ({ appName, position }: { appName: string, position: { x: number, y: number } }) => {
  const icon = getAppIcon(appName);
  return (
    <div 
      className="fixed z-[5000] pointer-events-none scale-110 opacity-80"
      style={{ 
        left: position.x - 28,
        top: position.y - 28,
        width: 56,
        height: 56
      }}
    >
      {icon && <img src={icon} alt={appName} className="w-full h-full object-contain rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]" />}
    </div>
  );
};

const DropZoneOverlay = ({ isVisible, dragPosition }: { isVisible: boolean, dragPosition: { x: number, y: number } }) => {
  const x = dragPosition.x;
  const y = dragPosition.y;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  const isInDock = y > height - 120;
  
  let activeZone: 'left-third' | 'left-half' | 'right-half' | 'right-third' | null = null;
  if (isVisible && !isInDock) {
    if (x < width * 0.2) activeZone = 'left-third';
    else if (x < width * 0.5) activeZone = 'left-half';
    else if (x < width * 0.8) activeZone = 'right-half';
    else activeZone = 'right-third';
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[1002] flex gap-2 p-2 pointer-events-none"
        >
          {/* Left Side */}
          <motion.div layout className="flex-1 flex gap-2">
            <motion.div 
              layout
              className={`h-full transition-all duration-200 rounded-xl border-2 backdrop-blur-sm ${
                activeZone === 'left-third' 
                  ? 'bg-[#186EFF]/40 border-[#186EFF] flex-[0.66]' 
                  : (activeZone === 'left-half' 
                      ? 'flex-1 bg-[#186EFF]/40 border-[#186EFF]' 
                      : 'flex-1 bg-black/60 border-dashed border-white/10')
              }`} 
            />
            {activeZone === 'left-third' && (
              <motion.div layout className="flex-[0.34] bg-black/60 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/10" />
            )}
          </motion.div>

          {/* Right Side */}
          <motion.div layout className="flex-1 flex gap-2">
            {activeZone === 'right-third' && (
              <motion.div layout className="flex-[0.34] bg-black/60 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/10" />
            )}
            <motion.div 
              layout
              className={`h-full transition-all duration-200 rounded-xl border-2 backdrop-blur-sm ${
                activeZone === 'right-third' 
                  ? 'bg-[#186EFF]/40 border-[#186EFF] flex-[0.66]' 
                  : (activeZone === 'right-half' 
                      ? 'flex-1 bg-[#186EFF]/40 border-[#186EFF]' 
                      : 'flex-1 bg-black/60 border-dashed border-white/10')
              }`} 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface AppHeaderTabProps {
  appName: string | null;
  activeApp: string | null;
  secondaryApp: string | null;
  setActiveApp: (appName: string | null) => void;
  setSecondaryApp: (appName: string | null) => void;
  setOpenApps: React.Dispatch<React.SetStateAction<string[]>>;
  activeQuickMenu: string | null;
  setActiveQuickMenu: (appName: string | null) => void;
}

const AppHeaderTab = ({ 
  appName, 
  activeApp, 
  secondaryApp, 
  setActiveApp, 
  setSecondaryApp, 
  setOpenApps, 
  activeQuickMenu, 
  setActiveQuickMenu 
}: AppHeaderTabProps) => {
  if (!appName) return null;
  const icon = getAppIcon(appName);

  const handleQuickSelect = (newAppName: string) => {
    if (appName === activeApp) {
      setActiveApp(newAppName);
    } else if (appName === secondaryApp) {
      setSecondaryApp(newAppName);
    }
    
    setOpenApps(prev => {
      const filtered = prev.filter(a => a !== appName);
      if (!filtered.includes(newAppName)) {
        return [...filtered, newAppName];
      }
      return filtered;
    });
    
    setActiveQuickMenu(null);
  };

  return (
    <div className={`flex flex-row-reverse items-center h-[52px] mt-2 flex-shrink-0 relative rounded-lg transition-all duration-300 ${activeQuickMenu === appName ? 'border-[0.9px] border-[#74ABFF]' : 'border-transparent'}`}>
      <div className={`w-[52px] h-[52px] ${activeQuickMenu === appName ? 'bg-[#0045BA]/60' : 'bg-[#5D6372]'} rounded-r-lg flex items-center justify-center shadow-lg transition-all duration-300`}>
        {icon && <img src={icon} alt={appName} className="w-[52px] h-[51px] object-contain" />}
      </div>
      <button 
        onClick={() => setActiveQuickMenu(activeQuickMenu === appName ? null : appName)}
        className={`w-[34px] h-[52px] ${activeQuickMenu === appName ? 'bg-[#0045BA]/60' : 'bg-[#5D6372]'} rounded-l-lg flex items-center justify-center shadow-lg border-r border-white/5 hover:bg-[#6D7382] transition-all duration-300 active:scale-90`}
      >
        {activeQuickMenu === appName ? <ChevronUp size={24} color="white" /> : <ChevronLeft size={24} color="white" />}
      </button>

      <AnimatePresence>
        {activeQuickMenu === appName && (
          <QuickSwapMenu 
            currentApp={appName} 
            onSelect={handleQuickSelect} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [secondaryApp, setSecondaryApp] = useState<string | null>(null);
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isHapakMenuOpen, setIsHapakMenuOpen] = useState(false);
  const [launchpadTrigger, setLaunchpadTrigger] = useState<'swipe' | 'tap'>('tap');
  const [entrySide, setEntrySide] = useState('100%');
  const [exitSide, setExitSide] = useState('-100%');
  const [contextMenuApp, setContextMenuApp] = useState<string | null>(null);
  const [appLayout, setAppLayout] = useState({ side: 'left', width: '33.33%' });
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'none' | 'horizontal' | 'vertical'>('none');
  const [isSwiping, setIsSwiping] = useState(false);
  const [floatingApp, setFloatingApp] = useState<string | null>(null);
  const [draggingSplitApp, setDraggingSplitApp] = useState<string | null>(null);
  const [swapTarget, setSwapTarget] = useState<'top' | 'bottom' | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragDimensions, setDragDimensions] = useState({ width: 0, height: 0 });
  const [activeQuickMenu, setActiveQuickMenu] = useState<string | null>(null);
  const [draggedDockApp, setDraggedDockApp] = useState<string | null>(null);
  const [isDraggingFromDock, setIsDraggingFromDock] = useState(false);
  const [dragReady, setDragReady] = useState(false);
  
  const touchStartRef = useRef<{ d?: number, x?: number, y?: number, count: number } | null>(null);
  const startPos = useRef<{ x: number, y: number } | null>(null);
  const dragReadyTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const splitLongPressTimer = useRef<NodeJS.Timeout | null>(null);
  const hapakClickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLongPressStart = (appName: string) => {
    longPressTimer.current = setTimeout(() => {
      setContextMenuApp(appName);
    }, 600); // 600ms for long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleSplitLongPressStart = (appName: string, e: React.PointerEvent) => {
    if (splitLongPressTimer.current) clearTimeout(splitLongPressTimer.current);
    
    const panelRect = e.currentTarget.closest('.side-panel-container')?.getBoundingClientRect();
    const appRect = e.currentTarget.getBoundingClientRect();
    
    if (panelRect && appRect) {
      const relativeX = e.clientX - panelRect.left;
      const relativeY = e.clientY - panelRect.top;
      
      const offsetX = e.clientX - appRect.left;
      const offsetY = e.clientY - appRect.top;
      
      setDragPosition({ x: relativeX, y: relativeY });
      setDragOffset({ x: offsetX, y: offsetY });
      setDragDimensions({ width: appRect.width, height: appRect.height });
    }
    
    splitLongPressTimer.current = setTimeout(() => {
      setDraggingSplitApp(appName);
      setIsSwapping(true);
    }, 500);
  };

  const handleSplitLongPressEnd = () => {
    if (splitLongPressTimer.current) {
      clearTimeout(splitLongPressTimer.current);
      splitLongPressTimer.current = null;
    }
  };

  const handleSplitPointerUp = () => {
    handleSplitLongPressEnd();
    
    // Swap logic
    if (isSwapping && draggingSplitApp && swapTarget) {
      if (draggingSplitApp === secondaryApp && swapTarget === 'bottom') {
        // Swap top to bottom
        const currentActive = activeApp;
        setActiveApp(secondaryApp);
        setSecondaryApp(currentActive);
      } else if (draggingSplitApp === activeApp && swapTarget === 'top') {
        // Swap bottom to top
        const currentSecondary = secondaryApp;
        setSecondaryApp(activeApp);
        setActiveApp(currentSecondary);
      }
    }

    setDraggingSplitApp(null);
    setSwapTarget(null);
    setIsSwapping(false);
    setDragPosition({ x: 0, y: 0 });
  };

  const currentIndex = activeApp ? openApps.indexOf(activeApp) : -1;
  const prevApp = currentIndex !== -1 ? openApps[(currentIndex - 1 + openApps.length) % openApps.length] : null;
  const nextApp = currentIndex !== -1 ? openApps[(currentIndex + 1) % openApps.length] : null;

  const openApp = (name: string, layout = { side: 'left', width: '33.33%' }) => {
    setAppLayout(layout);
    if (!openApps.includes(name)) {
      setOpenApps(prev => [...prev, name]);
    }
    
    if (activeApp && activeApp !== name) {
      setSecondaryApp(activeApp);
    }
    
    setActiveApp(name);
    setIsAppSwitcherOpen(false);
    setIsLaunchpadOpen(false);
  };

  const closeApp = (name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newOpenApps = openApps.filter(app => app !== name);
    setOpenApps(newOpenApps);
    
    if (activeApp === name) {
      setActiveApp(secondaryApp);
      setSecondaryApp(null);
    } else if (secondaryApp === name) {
      setSecondaryApp(null);
    }

    if (floatingApp === name) {
      setFloatingApp(null);
    }

    if (newOpenApps.length === 0) {
      setIsAppSwitcherOpen(false);
      setActiveApp(null);
      setSecondaryApp(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragReady && startPos.current) {
      const deltaX = Math.abs(e.clientX - startPos.current.x);
      const deltaY = Math.abs(e.clientY - startPos.current.y);
      
      if (deltaX > 10 || deltaY > 10) {
        handleLongPressEnd(); // Cancel the 600ms menu timer
        setIsDraggingFromDock(true);
        setDragPosition({ x: e.clientX, y: e.clientY });
      }
    } else if (isDraggingFromDock) {
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = () => {
    if (isDraggingFromDock && draggedDockApp) {
      const x = dragPosition.x;
      const y = dragPosition.y;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Check if dropped in the active zone (above map area)
      if (y < height - 120) {
        let side: 'left' | 'right' = 'left';
        let layoutWidth = '50%';

        // Identify side and layout (half/third)
        if (x < width * 0.2) {
          side = 'left';
          layoutWidth = '33.33%';
        } else if (x < width * 0.5) {
          side = 'left';
          layoutWidth = '50%';
        } else if (x < width * 0.8) {
          side = 'right';
          layoutWidth = '50%';
        } else {
          side = 'right';
          layoutWidth = '33.33%';
        }

        // Open the dragged app and "חפ"ק"
        const appsToOpen = [draggedDockApp, 'חפ"ק'];
        setOpenApps(prev => {
          const next = [...prev];
          appsToOpen.forEach(app => {
            if (!next.includes(app)) next.push(app);
          });
          return next;
        });

        if (side === 'left') {
          setActiveApp(draggedDockApp);
          setSecondaryApp('חפ"ק');
        } else {
          setActiveApp('חפ"ק');
          setSecondaryApp(draggedDockApp);
        }

        setAppLayout({ side, width: layoutWidth });
        setIsDockOpen(false);
        setIsLaunchpadOpen(false);
      }
    }

    setIsDraggingFromDock(false);
    setDragReady(false);
    setDraggedDockApp(null);
    startPos.current = null;
    if (dragReadyTimer.current) clearTimeout(dragReadyTimer.current);
    handleLongPressEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 3) {
      const touches = Array.from(e.touches) as React.Touch[];
      let sumX = 0; let sumY = 0;
      for (let i = 0; i < touches.length; i++) {
        sumX += touches[i].clientX;
        sumY += touches[i].clientY;
      }
      touchStartRef.current = { x: sumX / 3, y: sumY / 3, count: 3 };
    } else if (e.touches.length >= 4) {
      const touches = Array.from(e.touches) as React.Touch[];
      const count = touches.length;
      let sumX = 0;
      let sumY = 0;
      for (let i = 0; i < touches.length; i++) {
        sumX += touches[i].clientX;
        sumY += touches[i].clientY;
      }
      const center = {
        x: sumX / count,
        y: sumY / count,
      };
      let sumDist = 0;
      for (let i = 0; i < touches.length; i++) {
        sumDist += Math.sqrt(Math.pow(touches[i].clientX - center.x, 2) + Math.pow(touches[i].clientY - center.y, 2));
      }
      const dist = sumDist / count;
      
      touchStartRef.current = { d: dist, count: e.touches.length };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    if (e.touches.length === 3 && touchStartRef.current.count === 3 && touchStartRef.current.x !== undefined && touchStartRef.current.y !== undefined) {
      const touches = Array.from(e.touches) as React.Touch[];
      let sumX = 0;
      let sumY = 0;
      for (let i = 0; i < touches.length; i++) {
        sumX += touches[i].clientX;
        sumY += touches[i].clientY;
      }
      const avgX = sumX / 3;
      const avgY = sumY / 3;
      const deltaX = avgX - touchStartRef.current.x;
      const deltaY = avgY - touchStartRef.current.y;

      // Determine swipe direction if not set
      if (swipeDirection === 'none' && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          setSwipeDirection('vertical');
        } else {
          setSwipeDirection('horizontal');
        }
      }

      if (swipeDirection === 'vertical' && deltaY < 0) {
        setSwipeOffset(deltaY);
        setIsSwiping(true);
      } else if (swipeDirection === 'horizontal') {
        setSwipeOffset(deltaX);
        setIsSwiping(true);
      }
    } else if (e.touches.length >= 4 && touchStartRef.current.count >= 4 && touchStartRef.current.d !== undefined) {
      const touches = Array.from(e.touches) as React.Touch[];
      const count = touches.length;
      let sumX = 0;
      let sumY = 0;
      for (let i = 0; i < touches.length; i++) {
        sumX += touches[i].clientX;
        sumY += touches[i].clientY;
      }
      const center = {
        x: sumX / count,
        y: sumY / count,
      };
      let sumDist = 0;
      for (let i = 0; i < touches.length; i++) {
        sumDist += Math.sqrt(Math.pow(touches[i].clientX - center.x, 2) + Math.pow(touches[i].clientY - center.y, 2));
      }
      const dist = sumDist / count;

      // If distance decreased significantly (pinch in)
      if (touchStartRef.current.d - dist > 30) {
        setIsAppSwitcherOpen(true);
        setIsDockOpen(false);
        touchStartRef.current = null;
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current?.count === 3 && isSwiping) {
      if (swipeDirection === 'vertical' && activeApp) {
        if (swipeOffset < -150) {
          // Close app
          animate(swipeOffset, -window.innerHeight, {
            type: 'spring',
            bounce: 0,
            duration: 0.3,
            onUpdate: (v) => setSwipeOffset(v),
            onComplete: () => {
              setActiveApp(null);
              setSecondaryApp(null);
              setIsDockOpen(false);
              setIsLaunchpadOpen(false);
              setSwipeOffset(0);
              setIsSwiping(false);
              setSwipeDirection('none');
            }
          });
        } else {
          // Return to position
          animate(swipeOffset, 0, {
            type: 'spring',
            bounce: 0,
            duration: 0.3,
            onUpdate: (v) => setSwipeOffset(v),
            onComplete: () => {
              setIsSwiping(false);
              setSwipeDirection('none');
            }
          });
        }
      } else if (swipeDirection === 'horizontal') {
        if (Math.abs(swipeOffset) > 60) {
          if (!isLaunchpadOpen) {
            // פתיחה: המסך נכנס מהצד שהיד "משכה" ממנו
            setEntrySide(swipeOffset < 0 ? '100%' : '-100%');
            // הכנה ליציאה באותו כיוון של התנועה
            setExitSide(swipeOffset < 0 ? '-100%' : '100%');
          } else {
            // סגירה: המסך ממשיך לאותו כיוון שהיד דוחפת אליו
            setExitSide(swipeOffset < 0 ? '-100%' : '100%');
          }
          setLaunchpadTrigger('swipe');
          setIsLaunchpadOpen(prev => !prev);
        }
        setSwipeOffset(0);
        setIsSwiping(false);
        setSwipeDirection('none');
        setIsDockOpen(false);
      }
    } else {
      setSwipeDirection('none');
      setSwipeOffset(0);
      setIsSwiping(false);
    }
    touchStartRef.current = null;
  };

  return (
    <div 
      className={`h-screen w-screen overflow-hidden relative bg-black touch-none ${activeApp && !isAppSwitcherOpen ? 'border-[5px] border-black rounded-xl' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Top Panel */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ 
          y: 0,
          width: activeApp ? '66.66%' : '98%',
          left: !activeApp ? '50%' : (appLayout.side === 'left' ? '33.33%' : '0%'),
          right: 'auto',
          x: !activeApp ? '-50%' : '0%'
        }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 200,
          width: { duration: 0 },
          left: { duration: 0 },
          right: { duration: 0 },
          x: { duration: 0 }
        }}
        className="absolute top-1 z-[1000] bg-zinc-900/70 backdrop-blur-md text-white px-6 py-2 flex items-center justify-between border border-white/10 rounded-2xl shadow-2xl max-w-7xl pointer-events-none"
      >
        {/* Left Side: Status Icons and Time (RTL order within left block) */}
        <div className="flex items-center gap-6 flex-row">
          <span className="text-sm font-semibold tracking-tight text-[#E6F5FF]">08:15</span>
          <Signal size={18} strokeWidth={2.5} className="text-[#E6F5FF]" />
          <Wifi size={18} strokeWidth={2.5} className="text-[#E6F5FF]" />
          <Send size={18} strokeWidth={2} className="text-[#E6F5FF] fill-[#E6F5FF]" />
          <BatteryMedium size={20} strokeWidth={2.5} className="text-[#E6F5FF]" />
        </div>

        {/* Center: Search Bar and Location */}
        <div className="flex items-center gap-2 mx-auto">
          <div className="bg-[#21232b] rounded-full p-2 flex items-center justify-center">
            <MapPin size={18} strokeWidth={2} className="text-[#C1C7D6] fill-[#C1C7D6] [&>circle]:fill-[#21232b]" />
          </div>
          <div className="flex-1 max-w-[280px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4 scale-x-[-1]" />
              <input 
                type="text" 
                placeholder="חיפוש..." 
                className="w-full bg-[#21232b] border-none rounded-2xl py-1.5 pr-10 pl-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:bg-white/15 transition-all text-right pointer-events-auto"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Notifications */}
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-5 text-[#E6F5FF]">
            {/* 3x3 Grid of 9 small, filled squares */}
            {/* Row 1 */}
            <rect x="1.5" y="1.5" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="9.5" y="1.5" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="17.5" y="1.5" width="6" height="6" rx="2" fill="currentColor"/>
            {/* Row 2 */}
            <rect x="1.5" y="9.5" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="9.5" y="9.5" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="17.5" y="9.5" width="6" height="6" rx="2" fill="currentColor"/>
            {/* Row 3 */}
            <rect x="1.5" y="17.5" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="9.5" y="17.5" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="17.5" y="17.5" width="6" height="6" rx="2" fill="currentColor"/>
          </svg>
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer pointer-events-auto">
            <Bell size={20} strokeWidth={2} className="text-[#E6F5FF] fill-[#E6F5FF]" />
          </button>
        </div>
      </motion.div>

      {/* AppControlBar */}
      <AnimatePresence>
        {isDockOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              width: activeApp ? '66.66%' : '98%',
              left: !activeApp ? '50%' : (appLayout.side === 'left' ? '33.33%' : '0%'),
              right: 'auto',
              x: !activeApp ? '-50%' : '0%'
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              opacity: { duration: 0.2 },
              y: { type: 'spring', damping: 25, stiffness: 200 },
              width: { duration: 0 },
              left: { duration: 0 },
              right: { duration: 0 },
              x: { duration: 0 }
            }}
            className="absolute top-0 z-[1001] bg-[#16191F]/50 px-1 py-2 flex items-center justify-between shadow-2xl h-[52px] max-w-7xl pointer-events-none w-full pr-2"
          >
            <div className="flex items-center gap-2 pl-1 pointer-events-auto">
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-sm hover:bg-[#6e7586] transition-colors"
              >
                <X size={26} color="white" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveApp(null); }}
                className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-sm hover:bg-[#6e7586] transition-colors"
              >
                <Minus size={26} color="white" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newWidth = appLayout.width === '100%' ? '33.33%' : '100%';
                  setAppLayout(prev => ({ ...prev, width: newWidth }));
                }}
                className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-sm hover:bg-[#6e7586] transition-colors"
              >
                {appLayout.width === '100%' ? <Shrink size={26} color="white" /> : <Expand size={26} color="white" />}
              </button>
              <button className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-sm hover:bg-[#6e7586] transition-colors">
                <PictureInPicture2 size={26} color="white" />
              </button>
            </div>
            <div className="pointer-events-auto">
              <AppHeaderTab 
                appName={(appLayout.width === '100%' && activeApp) ? activeApp : 'חפ"ק'} 
                activeApp={activeApp}
                secondaryApp={secondaryApp}
                setActiveApp={setActiveApp}
                setSecondaryApp={setSecondaryApp}
                setOpenApps={setOpenApps}
                activeQuickMenu={activeQuickMenu}
                setActiveQuickMenu={setActiveQuickMenu}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for closing and blurring */}
      <AnimatePresence>
        {isDockOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDockOpen(false)}
            className="absolute inset-0 z-[900] bg-transparent"
          />
        )}
      </AnimatePresence>

      {/* Bottom Dock */}
      <motion.div 
        initial={{ y: 400 }}
        animate={{ y: isDockOpen ? 0 : 400 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 50) setIsDockOpen(false);
        }}
        className="absolute bottom-4 left-0 right-0 z-[1100] flex justify-center items-end gap-3 px-6 pointer-events-none"
      >
        <div className="flex items-end gap-3 pointer-events-auto">
          {/* New Far Left Panel */}
          <div className="h-22 w-fit bg-zinc-900/70 backdrop-blur-md rounded-2xl border border-white/5 px-4 py-2 shadow-2xl flex items-center gap-6 relative overflow-hidden">
            <div className="flex flex-col gap-4 pl-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white text-sm font-bold">08:15</span>
                <span className="text-white/50 text-sm">01/01/26</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <Search size={16} className="text-white" />
                <div className="relative">
                  <Bell size={16} className="text-white" />
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border-[0.5px] border-zinc-900" />
                </div>
                <Settings size={16} className="text-white" />
              </div>
            </div>

            {/* Darker Container for future icons */}
            <div className="h-16 w-fit min-w-[100px] bg-black/30 rounded-xl border border-white/5 px-4 flex gap-4 items-center justify-center">
              <div className="flex flex-col gap-5 items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D6FFFE]">
                  <rect x="2" y="6" width="16" height="12" rx="2" />
                  <path d="M21 10v4" />
                  <rect x="5" y="9" width="2.5" height="6" rx="0.5" fill="currentColor" stroke="none" />
                  <rect x="9" y="9" width="2.5" height="6" rx="0.5" fill="currentColor" stroke="none" />
                  <rect x="13" y="9" width="2.5" height="6" rx="0.5" fill="currentColor" stroke="none" />
                </svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6FFFE] -rotate-[15deg] translate-x-0.1">
                  <path d="M3 11L22 2L13 21L11 13L3 11Z" />
                </svg>
              </div>
              <div className="flex flex-col gap-5 items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="15" width="4" height="7" rx="1.5" fill="#FFCC33" />
                  <rect x="7" y="11" width="4" height="11" rx="1.5" fill="#FFCC33" />
                  <rect x="13" y="7" width="4" height="15" rx="1.5" fill="#FFE89E" />
                  <rect x="19" y="3" width="4" height="19" rx="1.5" fill="#FFE89E" />
                </svg>
                <Bluetooth size={14} className="text-[#D6FFFE]" />
              </div>
              <div className="flex flex-col gap-5 items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 18.5l-3-3a4.2 4.2 0 0 1 6 0l-3 3z" fill="#FFCC33" />
                  <path d="M12 12.5c-2.2 0-4.3.9-5.8 2.3l1.4 1.4c1.1-1.1 2.7-1.7 4.4-1.7s3.3.6 4.4 1.7l1.4-1.4c-1.5-1.4-3.6-2.3-5.8-2.3z" fill="#FFE89E" />
                  <path d="M12 8.5c-3.6 0-6.8 1.4-9.2 3.8l1.4 1.4c2-2 4.8-3.2 7.8-3.2s5.8 1.2 7.8 3.2l1.4-1.4C18.8 9.9 15.6 8.5 12 8.5z" fill="#FFE89E" />
                  <path d="M12 4.5c-5 0-9.5 2-12.8 5.2l1.4 1.4C3.6 8.1 7.6 6.5 12 6.5s8.4 1.6 11.4 4.6l1.4-1.4C21.5 6.5 17 4.5 12 4.5z" fill="#FFE89E" />
                </svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D6FFFE]">
                  <path d="M3 12h3.5l2.5 6 4-12 4 6h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Middle Panel (formerly Left) */}
          <div className="h-22 w-fit bg-zinc-900/70 backdrop-blur-md rounded-2xl border border-white/5 px-4 py-2 shadow-2xl flex items-center justify-center gap-1">
            <div className="flex flex-col items-center gap-0 min-w-[60px] mt-[2px]">
              {/* האייקון החדש של חלוקת מסך - ללא רקע אפור */}
              <img 
                src="/layouts.png" 
                alt="חלוקת מסך" 
                className="w-14 h-14 object-contain border-[2px] border-transparent" 
              />
              <span className="text-[10px] text-white font-medium">חלוקת מסך</span>
            </div>
            <div 
              className="flex flex-col items-center gap-0 min-w-[60px] cursor-pointer group mt-[2px]"
              onClick={() => { 
                setLaunchpadTrigger('tap');
                setIsLaunchpadOpen(true); 
                setIsDockOpen(false); 
              }}
            >
              {/* האייקון החדש - גודל זהה, ללא רקע אפור */}
              <img 
                src="/everything.png" 
                alt="הכל" 
                className="w-14 h-14 object-contain border-[2px] border-transparent transition-transform duration-200 group-active:scale-90" 
              />
              <span className="text-[10px] text-white font-medium">הכל</span>
            </div>
          </div>

          {/* Right Panel - Wider */}
          <div className="h-22 w-fit bg-zinc-900/70 backdrop-blur-md rounded-2xl border border-white/5 px-4 py-2 shadow-2xl flex items-center justify-end gap-[2px]">
            {isHapakMenuOpen ? (
              /* תצוגת תפריט חפ"ק - 4 אייקונים */
              hapakSubApps.map((app) => (
                <div key={app.name} className="flex flex-col items-center gap-0 min-w-[60px] mt-[2px]">
                  <img 
                    src={app.icon} 
                    alt={app.name}
                    className={`w-14 h-14 object-contain rounded-xl transition-all duration-200 ${
                      app.name === 'חפ"ק' 
                        ? 'border-[2px] border-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.2)]' 
                        : 'border-[2px] border-transparent shadow-sm'
                    }`} 
                  />
                  <span className="text-[10px] text-white font-medium leading-none">{app.name}</span>
                </div>
              ))
            ) : (
              /* תצוגת אפליקציות רגילה - הלוגיקה המקורית (ללא חפ"ק) */
              Object.keys(apps).filter(appName => appName !== 'חפ"ק' && !(apps[appName as keyof typeof apps] as any).hideFromDock).map((appName) => (
                <React.Fragment key={appName}>
                  <div className="relative">
                    <AnimatePresence>
                      {contextMenuApp === appName && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-38 bg-[#ECF5FF] rounded-2xl shadow-2xl py-1 flex flex-col z-[1100]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Options Menu Content */}
                          {['הגדרות', 'עדכונים', 'הסר מהסרגל', 'התנתקות'].map((option, index, array) => {
                            const Icon = option === 'הגדרות' ? Settings : 
                                         option === 'עדכונים' ? Cloud : 
                                         option === 'הסר מהסרגל' ? Star : 
                                         option === 'התנתקות' ? LogOut : null;
                            return (
                              <React.Fragment key={option}>
                                <button
                                  className="w-full px-4 py-1.5 flex flex-row-reverse items-center justify-start gap-3 text-[#16191F] hover:bg-[#16191F]/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                                  onClick={() => setContextMenuApp(null)}
                                >
                                  {Icon && <Icon size={18} className="text-[#16191F]" />}
                                  <span className="text-right text-[16px] flex-1">{option}</span>
                                </button>
                                {index < array.length - 1 && (
                                  <div className="h-[1.5px] w-[85%] bg-[#14151A]/10 mx-auto" />
                                )}
                              </React.Fragment>
                            );
                          })}

                          {/* Split Menu: Positioned to the left of Options Menu */}
                          <div className="absolute right-full mr-1.5 bottom-0 w-59 bg-[#ECF5FF] rounded-2xl shadow-2xl flex items-center justify-center h-full p-3">
                            <div className="grid grid-cols-4 grid-rows-2 gap-x-7 gap-y-12">
                              {/* Icon 1: Full */}
                              <div className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden">
                                <div className="bg-[#3E4350] absolute inset-0" />
                              </div>
                              
                              {/* Icon 2: Half Left */}
                              <div className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden">
                                <div className="bg-[#3E4350] absolute left-0 w-1/2 h-full" />
                              </div>

                              {/* Icon 3: Third Left */}
                              <div className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden">
                                <div className="bg-[#3E4350] absolute left-0 w-1/3 h-full" />
                              </div>

                              {/* Icon 4: Quarter Left */}
                              <div className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden">
                                <div className="bg-[#3E4350] absolute left-0 w-1/4 h-full" />
                              </div>

                              {/* Icon 5: PiP Top Right */}
                              <div className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden">
                                <div className="bg-[#3E4350] absolute top-0.5 right-0.5 w-3 h-2.5 rounded-[1px]" />
                              </div>

                              {/* Icon 6: Half Right */}
                              <div className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden">
                                <div className="bg-[#3E4350] absolute right-0 w-1/2 h-full" />
                              </div>

                              {/* Icon 7: Third Right */}
                              <div 
                                className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (contextMenuApp) {
                                    const newLayout = { side: 'right', width: '33.33%' };
                                    openApp(contextMenuApp, newLayout);
                                    setContextMenuApp(null);
                                  }
                                }}
                              >
                                <div className="bg-[#3E4350] absolute right-0 w-1/3 h-full" />
                              </div>

                              {/* Icon 8: Quarter Right */}
                              <div className="w-7 h-5 bg-white/40 border-[1px] border-[#929AB3] rounded-sm relative overflow-hidden">
                                <div className="bg-[#3E4350] absolute right-0 w-1/4 h-full" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div 
                      className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer"
                      onClick={(e) => {
                        if (contextMenuApp) {
                          setContextMenuApp(null);
                        } else {
                          openApp(appName);
                        }
                      }}
                      onPointerDown={(e) => {
                        handleLongPressStart(appName);
                        setDraggedDockApp(appName);
                        startPos.current = { x: e.clientX, y: e.clientY };
                        dragReadyTimer.current = setTimeout(() => {
                          setDragReady(true);
                        }, 200);
                      }}
                      onPointerUp={() => {
                        handleLongPressEnd();
                        if (dragReadyTimer.current) clearTimeout(dragReadyTimer.current);
                        setDragReady(false);
                        setDraggedDockApp(null);
                      }}
                      onPointerLeave={() => {
                        handleLongPressEnd();
                        if (dragReadyTimer.current) clearTimeout(dragReadyTimer.current);
                        setDragReady(false);
                      }}
                    >
                      {['צ\'אט', 'קולומבוס', 'Ztube', 'מחשבון', 'שעל״ח', 'סנייפר'].includes(appName) ? (
                        <img 
                          src={appName === 'צ\'אט' ? "/chat.png" : 
                               appName === 'קולומבוס' ? "/Columbus.png" : 
                               appName === 'Ztube' ? "/Ztube.png" : 
                               appName === 'מחשבון' ? "/calculator.png" :
                               appName === 'שעל״ח' ? "/icon.png" :
                               "/Sn.png"} 
                          alt={appName} 
                          className={`w-14 h-14 object-contain rounded-xl transition-all duration-200 
                            ${(contextMenuApp === appName || openApps.includes(appName)) 
                              ? 'border-[2px] border-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.5)]' 
                              : 'border-[2px] border-transparent shadow-sm'}`} 
                        />
                      ) : (
                        <div className={`w-12 h-12 ${apps[appName as keyof typeof apps].color} rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 ${(contextMenuApp === appName || openApps.includes(appName)) ? 'border-[2px] border-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.5)]' : 'border-[2px] border-transparent'}`}>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-0.5 relative">
                        <span className="text-[10px] text-white font-medium leading-none">{appName}</span>
                        
                        {/* מצב 1: אפליקציה פתוחה וגלויה על המסך - חיווי קו */}
                        {(appName === activeApp || appName === secondaryApp || appName === floatingApp) && (
                          <div className="w-3 h-[2.5px] bg-[#8493A7] rounded-full absolute top-full left-1/2 -translate-x-1/2 mt-[3px]" />
                        )}

                        {/* מצב 2: אפליקציה פתוחה אך ממוזערת (ברקע) - חיווי נקודה */}
                        {(openApps.includes(appName) && appName !== activeApp && appName !== secondaryApp && appName !== floatingApp) && (
                          <div className="w-[4px] h-[4px] bg-[#8493A7] rounded-full absolute top-full left-1/2 -translate-x-1/2 mt-[2px]" />
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            )}

            {/* כפתור חפ"ק קבוע והקו המפריד */}
            <div className="h-14 w-[1.5px] bg-[#181C1F] mx-1" />
            <div className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer">
              {/* המלבן החיצוני */}
              <div 
                onClick={(e) => {
                  // ביטול טיימר קיים אם יש כזה (כדי למנוע מהלחיצה הראשונה לרוץ)
                  if (hapakClickTimer.current) {
                    clearTimeout(hapakClickTimer.current);
                    hapakClickTimer.current = null;
                  }

                  if (e.detail === 2) {
                    // --- לחיצה כפולה: ניקוי מוחלט וחזרה למפה ---
                    setActiveApp(null);
                    setSecondaryApp(null);
                    setFloatingApp(null);
                    setIsDockOpen(false);
                    setIsLaunchpadOpen(false);
                    setIsHapakMenuOpen(false);
                  } else {
                    // --- לחיצה בודדת: מחכים רגע לראות אם תבוא עוד לחיצה ---
                    hapakClickTimer.current = setTimeout(() => {
                      setIsHapakMenuOpen(!isHapakMenuOpen);
                      hapakClickTimer.current = null;
                    }, 200); // המתנה של 200 מילישניות
                  }
                }}
                className={`w-12 h-[63px] rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 border-[2px] ${isHapakMenuOpen ? 'border-[#4574C6]' : 'border-[#4A5568]'}`}
                style={{ backgroundColor: isHapakMenuOpen ? '#073B93' : '#8493A7' }}
              >
                <div className="flex flex-col items-center w-full h-full p-[3px] pointer-events-none">
                  {/* המלבן הפנימי עם הסמל */}
                  <div 
                    className="w-full h-[72%] rounded-lg border border-white/20 shadow-sm flex items-center justify-center relative overflow-hidden transition-all duration-300"
                    style={{ backgroundColor: isHapakMenuOpen ? '#4574C6' : '#9FAFC4' }}
                  >
                    {/* סמל הקסדה */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] z-10">
                      <path d="M12 3C7.5 3 4 6.5 4 11v1c0 0.5 0.5 1 1 1h1.5v-4c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5v4H17c0.5 0 1-0.5 1-1v-1c0-4.5-3.5-8-8-8z" />
                      <rect x="7" y="10" width="10" height="4" rx="1.5" fill="none" stroke="white" strokeWidth="1.5" />
                      <path d="M8 11.5h8" stroke="white" strokeWidth="1" opacity="0.5" />
                      <path d="M5 13c0 2 1.5 3.5 3.5 3.5H11c0.5 0 0.8-0.3 0.8-0.8s-0.3-0.8-0.8-0.8H8.5c-1 0-1.8-0.8-1.8-1.8v-0.1" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* אזור הטקסט למטה */}
                  <div className="flex-1 flex items-center justify-center w-full">
                    <span className="text-[11px] text-white font-normal tracking-widest">חפ"ק</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Swipe Up Trigger Area */}
      {!isDockOpen && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-12 z-[1010] cursor-n-resize"
          onPan={(_, info) => {
            if (info.offset.y < -20) setIsDockOpen(true);
          }}
        />
      )}

      {/* Demo Screens */}
      <AnimatePresence>
        {activeApp && !isAppSwitcherOpen && (
          <>
            <motion.div 
              onClick={() => isDockOpen && setIsDockOpen(false)}
              className={`absolute top-0 bottom-0 ${isSwapping ? 'z-[3000] overflow-visible' : 'z-[1005] overflow-hidden'} rounded-lg shadow-2xl flex flex-col gap-[6px] bg-black border border-white/10 select-none touch-none side-panel-container`}
              style={{ 
                left: appLayout.side === 'left' ? 0 : 'auto',
                right: appLayout.side === 'right' ? 0 : 'auto',
                width: appLayout.width === '33.33%' ? '33.33%' : '100%'
              }}
              onPointerUp={handleSplitPointerUp}
              onPointerMove={(e) => {
                if (!isSwapping) return;
                // Prevent scrolling during drag
                if (e.cancelable) e.preventDefault();
                
                const rect = e.currentTarget.getBoundingClientRect();
                const relativeX = e.clientX - rect.left;
                const relativeY = e.clientY - rect.top;
                
                setDragPosition({ x: relativeX, y: relativeY });
                
                const midpoint = rect.height / 2;
                setSwapTarget(relativeY < midpoint ? 'top' : 'bottom');
              }}
            >
              {/* SideAppControlBar */}
            <AnimatePresence>
              {isDockOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0 }}
                  className="absolute top-0 left-0 w-full z-[1100] bg-[#16191F]/50 overflow-visible h-[52px] px-1 py-2 flex items-center justify-between shadow-2xl pointer-events-auto pr-2"
                >
                  <div className="flex items-center gap-2 pl-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (secondaryApp) closeApp(secondaryApp); }}
                      className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                    >
                      <X size={24} color="white" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSecondaryApp(null); }}
                      className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                    >
                      <Minus size={24} color="white" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newWidth = appLayout.width === '100%' ? '33.33%' : '100%';
                        setAppLayout(prev => ({ ...prev, width: newWidth }));
                      }}
                      className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                    >
                      {appLayout.width === '100%' ? <Shrink size={24} color="white" /> : <Expand size={24} color="white" />}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFloatingApp(secondaryApp);
                        setSecondaryApp(null);
                      }}
                      className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                    >
                      <PictureInPicture2 size={24} color="white" />
                    </button>
                  </div>
                  <AppHeaderTab 
                    appName={secondaryApp} 
                    activeApp={activeApp}
                    secondaryApp={secondaryApp}
                    setActiveApp={setActiveApp}
                    setSecondaryApp={setSecondaryApp}
                    setOpenApps={setOpenApps}
                    activeQuickMenu={activeQuickMenu}
                    setActiveQuickMenu={setActiveQuickMenu}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Secondary App (Top Half) */}
            {secondaryApp && appLayout.width !== '100%' && (
              <div 
                className="h-1/2 w-full relative rounded-xl overflow-hidden transition-all duration-200"
                onPointerDown={(e) => { e.preventDefault(); handleSplitLongPressStart(secondaryApp, e); }}
              >
                {/* Blue Overlay for Quick Swap */}
                <AnimatePresence>
                  {activeQuickMenu === secondaryApp && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#186EFF]/50 z-[5] pointer-events-none border-2 border-[#186EFF] rounded-xl"
                    />
                  )}
                </AnimatePresence>

                {/* Placeholder Background */}
                <AnimatePresence>
                  {draggingSplitApp === secondaryApp && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#646A77]/50 z-[1]"
                    />
                  )}
                </AnimatePresence>

                <div className={`absolute inset-0 flex items-center justify-center ${apps[secondaryApp as keyof typeof apps].color} ${draggingSplitApp === secondaryApp ? 'opacity-0' : 'opacity-100'}`}>
                  <h1 className="text-white text-xl font-bold">{secondaryApp}</h1>
                </div>

                {/* Dragging/Target Overlay */}
                <AnimatePresence>
                  {isSwapping && swapTarget === 'top' && draggingSplitApp !== secondaryApp && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#186EFF]/50 z-[2] transition-colors duration-200"
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Horizontal Handle */}
            {secondaryApp && appLayout.width !== '100%' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[4px] bg-[#9FAFC4] rounded-full z-[1002] opacity-80" />
            )}

            {/* Active App (Bottom Half or Full) */}
            <div 
              className={`relative w-full rounded-xl overflow-hidden transition-all duration-200 ${secondaryApp && appLayout.width !== '100%' ? 'h-1/2' : 'h-full'}`}
              onPointerDown={(e) => { if (activeApp) { e.preventDefault(); handleSplitLongPressStart(activeApp, e); } }}
            >
              {/* Blue Overlay for Quick Swap */}
              <AnimatePresence>
                {activeQuickMenu === activeApp && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#186EFF]/50 z-[5] pointer-events-none border-2 border-[#186EFF] rounded-xl"
                  />
                )}
              </AnimatePresence>

              {/* Placeholder Background */}
              <AnimatePresence>
                {activeApp && draggingSplitApp === activeApp && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#646A77]/50 z-[1]"
                  />
                )}
              </AnimatePresence>

              {/* Dragging/Target Overlay (Below Control Bar) */}
              <AnimatePresence>
                {activeApp && isSwapping && swapTarget === 'bottom' && draggingSplitApp !== activeApp && secondaryApp && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#186EFF]/50 z-[1099] transition-colors duration-200"
                  />
                )}
              </AnimatePresence>

              {/* SideAppControlBar for Active App */}
              <AnimatePresence>
                {isDockOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0 }}
                    className="absolute top-0 left-0 w-full z-[1100] bg-[#16191F]/50 overflow-visible h-[52px] px-1 py-2 flex items-center justify-between shadow-2xl pointer-events-auto pr-2"
                  >
                    <div className="flex items-center gap-2 pl-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); if (activeApp) closeApp(activeApp); }}
                        className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                      >
                        <X size={24} color="white" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (secondaryApp) { 
                            setActiveApp(secondaryApp); 
                            setSecondaryApp(null); 
                          } else { 
                            setActiveApp(null); 
                          } 
                        }}
                        className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                      >
                        <Minus size={24} color="white" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const newWidth = appLayout.width === '100%' ? '33.33%' : '100%';
                          setAppLayout(prev => ({ ...prev, width: newWidth }));
                        }}
                        className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                      >
                        {appLayout.width === '100%' ? <Shrink size={24} color="white" /> : <Expand size={24} color="white" />}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFloatingApp(activeApp);
                          if (secondaryApp) {
                            setActiveApp(secondaryApp);
                            setSecondaryApp(null);
                          } else {
                            setActiveApp(null);
                          }
                        }}
                        className="w-[52px] h-[52px] mt-2 flex items-center justify-center rounded-lg bg-[#5D6372] shadow-lg hover:bg-[#6e7586] transition-colors flex-shrink-0"
                      >
                        <PictureInPicture2 size={24} color="white" />
                      </button>
                    </div>
                    <AppHeaderTab 
                      appName={activeApp} 
                      activeApp={activeApp}
                      secondaryApp={secondaryApp}
                      setActiveApp={setActiveApp}
                      setSecondaryApp={setSecondaryApp}
                      setOpenApps={setOpenApps}
                      activeQuickMenu={activeQuickMenu}
                      setActiveQuickMenu={setActiveQuickMenu}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current App */}
              <motion.div
                style={{ 
                  x: 0,
                  y: swipeDirection === 'vertical' ? swipeOffset : 0,
                  opacity: draggingSplitApp === activeApp ? 0 : (swipeDirection === 'vertical' ? Math.max(0, 1 + swipeOffset / 400) : 1)
                }}
                className={`absolute inset-0 flex items-center justify-center ${apps[activeApp as keyof typeof apps].color}`}
              >
                <h1 className="text-white text-2xl font-bold">{activeApp}</h1>
              </motion.div>
            </div>

            {/* Floating Drag Overlay */}
            <AnimatePresence>
              {isSwapping && draggingSplitApp && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute pointer-events-none z-[3000] rounded-xl border-2 border-[#0066FF]/90 shadow-2xl overflow-hidden flex items-center justify-center ${apps[draggingSplitApp as keyof typeof apps].color}`}
                  style={{ 
                    width: dragDimensions.width,
                    height: dragDimensions.height,
                    left: 0,
                    top: 0,
                    x: dragPosition.x - dragOffset.x,
                    y: dragPosition.y - dragOffset.y,
                  }}
                >
                  {/* App Name */}
                  <h1 className="text-white text-xl font-bold">{draggingSplitApp}</h1>
                  
                  {/* Blue Filter Overlay */}
                  <div className="absolute inset-0 bg-[#186EFF]/50" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* Drag Handle */}
          <div 
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-12 bg-[#9FAFC4] rounded-full z-[999] opacity-80" 
            style={{ [appLayout.side === 'left' ? 'left' : 'right']: appLayout.width }}
          />
        </>
      )}
    </AnimatePresence>

      {/* App Switcher Screen */}
      <AnimatePresence>
        {isAppSwitcherOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[900] bg-zinc-950/90 backdrop-blur-xl p-12 pt-24"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {openApps.map((appName) => (
                <motion.div
                  key={appName}
                  layoutId={`app-card-${appName}`}
                  className={`relative aspect-[9/16] rounded-3xl shadow-2xl overflow-hidden cursor-pointer border border-white/10 ${apps[appName as keyof typeof apps].color} flex flex-col items-center justify-center`}
                  onClick={() => {
                    setActiveApp(appName);
                    setIsAppSwitcherOpen(false);
                  }}
                >
                  <h2 className="text-white text-2xl font-bold">{appName}</h2>
                  
                  <button
                    onClick={(e) => closeApp(appName, e)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
            
            {openApps.length === 0 && (
              <div className="h-full flex items-center justify-center text-white/40">
                <p className="text-xl">אין אפליקציות פתוחות</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launchpad Screen */}
      <AnimatePresence>
        {isLaunchpadOpen && (
          <motion.div
            initial={{ 
              x: launchpadTrigger === 'swipe' ? entrySide : 0, 
              opacity: 0 
            }}
            animate={{ 
              x: isLaunchpadOpen ? 0 : (launchpadTrigger === 'swipe' ? exitSide : 0), 
              opacity: isLaunchpadOpen ? 1 : 0 
            }}
            exit={{ 
              x: launchpadTrigger === 'swipe' ? exitSide : 0, 
              opacity: 0 
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 150, mass: 0.8 }}
            className="fixed inset-0 w-screen h-screen z-[2000] flex items-center justify-center p-12"
            style={{ 
              backgroundImage: 'url("/everythingStatusBar.png")',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#16191F'
            }}
            onClick={() => { setLaunchpadTrigger('tap'); setIsLaunchpadOpen(false); }}
          >
            <div 
              className="flex flex-col items-center gap-4 w-full max-w-5xl -mt-10"
            >
              {/* Top Section - Apps + Placeholders */}
              <div className="grid grid-cols-7 gap-8 w-fit">
                <AppSlot 
                  icon="/micon.png"
                  name='מענ״ק'
                  onClick={() => openApp('מענ״ק')}
                  isActive={activeApp === 'מענ״ק' || secondaryApp === 'מענ״ק' || floatingApp === 'מענ״ק'}
                />
                <AppSlot 
                  icon="/hapak.png"
                  name='חפ"ק'
                  onClick={(e) => {
                    if (e.detail === 2) {
                      setIsLaunchpadOpen(false);
                    } else {
                      openApp('חפ"ק');
                    }
                  }}
                  isActive={activeApp === 'חפ"ק' || secondaryApp === 'חפ"ק' || floatingApp === 'חפ"ק'}
                />
                <AppSlot 
                  icon="/mifkada.png"
                  name='מפקדה'
                  onClick={() => openApp('מפקדה')}
                  isActive={activeApp === 'מפקדה' || secondaryApp === 'מפקדה' || floatingApp === 'מפקדה'}
                />
                <AppSlot 
                  icon="/shadah.png"
                  name='שד״ח'
                  onClick={() => openApp('שד״ח')}
                  isActive={activeApp === 'שד״ח' || secondaryApp === 'שד״ח' || floatingApp === 'שד״ח'}
                />
                <AppSlot name="שם" isPlaceholder />
                <AppSlot name="שם" isPlaceholder />
                <AppSlot name="שם" isPlaceholder />
              </div>

              {/* Divider */}
              <div className="w-4/5 h-[1.5px] bg-white/10 my-4 shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />

              {/* Bottom Section - Other Apps Grid */}
              <div className="grid grid-cols-7 gap-8 w-fit">
                <AppSlot 
                  icon="/dror.png" 
                  name="דרור" 
                  onClick={() => openApp('דרור')} 
                  isActive={activeApp === 'דרור' || secondaryApp === 'דרור' || floatingApp === 'דרור'}
                />
                <AppSlot 
                  icon="/calculator.png" 
                  name="מחשבון" 
                  onClick={() => openApp('מחשבון')} 
                  isActive={activeApp === 'מחשבון' || secondaryApp === 'מחשבון' || floatingApp === 'מחשבון'}
                />
                <AppSlot 
                  icon="/icon.png" 
                  name="שעל״ח" 
                  onClick={() => openApp('שעל״ח')} 
                  isActive={activeApp === 'שעל״ח' || secondaryApp === 'שעל״ח' || floatingApp === 'שעל״ח'}
                />
                <AppSlot 
                  icon="/Columbus.png" 
                  name="קולומבוס" 
                  onClick={() => openApp('קולומבוס')} 
                  isActive={activeApp === 'קולומבוס' || secondaryApp === 'קולומבוס' || floatingApp === 'קולומבוס'}
                />
                <AppSlot 
                  icon="/chat.png" 
                  name="צ'אט" 
                  onClick={() => openApp("צ'אט")} 
                  isActive={activeApp === "צ'אט" || secondaryApp === "צ'אט" || floatingApp === "צ'אט"}
                />
                <AppSlot 
                  icon="/Sn.png" 
                  name="סנייפר" 
                  onClick={() => openApp('סנייפר')} 
                  isActive={activeApp === 'סנייפר' || secondaryApp === 'סנייפר' || floatingApp === 'סנייפר'}
                />
                <AppSlot 
                  icon="/Ztube.png" 
                  name="Ztube" 
                  onClick={() => openApp('Ztube')} 
                  isActive={activeApp === 'Ztube' || secondaryApp === 'Ztube' || floatingApp === 'Ztube'}
                />
                <AppSlot 
                  icon="/laso.png" 
                  name="לאסו" 
                  onClick={() => openApp('לאסו')} 
                  isActive={activeApp === 'לאסו' || secondaryApp === 'לאסו' || floatingApp === 'לאסו'}
                />
                <AppSlot 
                  icon="/files.png" 
                  name="קבצים" 
                  onClick={() => openApp('קבצים')} 
                  isActive={activeApp === 'קבצים' || secondaryApp === 'קבצים' || floatingApp === 'קבצים'}
                />
                <AppSlot 
                  icon="/ai.png" 
                  name="AI" 
                  onClick={() => openApp('AI')} 
                  isActive={activeApp === 'AI' || secondaryApp === 'AI' || floatingApp === 'AI'}
                />
                <AppSlot 
                  icon="/notes.png" 
                  name="הערות" 
                  onClick={() => openApp('הערות')} 
                  isActive={activeApp === 'הערות' || secondaryApp === 'הערות' || floatingApp === 'הערות'}
                />
                <AppSlot 
                  icon="/gallery.png" 
                  name="גלריה" 
                  onClick={() => openApp('גלריה')} 
                  isActive={activeApp === 'גלריה' || secondaryApp === 'גלריה' || floatingApp === 'גלריה'}
                />
                <AppSlot 
                  icon="/qr.png" 
                  name="QR" 
                  onClick={() => openApp('QR')} 
                  isActive={activeApp === 'QR' || secondaryApp === 'QR' || floatingApp === 'QR'}
                />
                <AppSlot 
                  icon="/cargo.png" 
                  name="Cargo" 
                  onClick={() => openApp('Cargo')} 
                  isActive={activeApp === 'Cargo' || secondaryApp === 'Cargo' || floatingApp === 'Cargo'}
                />
                <AppSlot name="שם" isPlaceholder placeholderColor="bg-[#5D6372]" />
                <AppSlot name="שם" isPlaceholder placeholderColor="bg-[#5D6372]" />
                <AppSlot name="שם" isPlaceholder placeholderColor="bg-[#5D6372]" />
                <AppSlot name="שם" isPlaceholder placeholderColor="bg-[#5D6372]" />
                <AppSlot name="שם" isPlaceholder placeholderColor="bg-[#5D6372]" />
                <AppSlot name="שם" isPlaceholder placeholderColor="bg-[#5D6372]" />
                <AppSlot name="שם" isPlaceholder placeholderColor="bg-[#5D6372]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container with Blur effect */}
      <motion.div 
        animate={{ 
          filter: 'none',
          width: activeApp && !isAppSwitcherOpen ? '66.66%' : '100%'
        }}
        transition={{ duration: 0.3 }}
        className={`h-full absolute top-0 ${activeApp && !isAppSwitcherOpen ? `rounded-xl overflow-hidden w-2/3 ${appLayout.side === 'left' ? 'right-0' : 'left-0'}` : 'w-full'}`}
      >
        <img 
          src="/new.png" 
          className="w-full h-full object-cover pointer-events-none select-none" 
          alt="Background"
          referrerPolicy="no-referrer"
        />
        
        {/* Drop Zone Overlay */}
        <DropZoneOverlay isVisible={isDraggingFromDock} dragPosition={dragPosition} />
      </motion.div>

      {/* Ghost Icon */}
      {isDraggingFromDock && draggedDockApp && (
        <GhostIcon appName={draggedDockApp} position={dragPosition} />
      )}

      {/* Floating Window */}
      <AnimatePresence>
        {floatingApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute top-24 right-8 w-[450px] h-[300px] z-[2000] bg-[#1A1C23]/90 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFloatingApp(null)}
                  className="w-10 h-10 rounded-xl bg-[#2A2D37] flex items-center justify-center hover:bg-[#3A3D47] transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
                <button 
                  onClick={() => {
                    openApp(floatingApp);
                    setFloatingApp(null);
                  }}
                  className="w-10 h-10 rounded-xl bg-[#2A2D37] flex items-center justify-center hover:bg-[#3A3D47] transition-colors"
                >
                  <Minimize2 size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-white/30 text-2xl font-black tracking-[0.4em] uppercase mb-6">{floatingApp}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
