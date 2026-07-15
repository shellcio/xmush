import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1350);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen-overlay white-theme ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="splash-comico-content">
        <div className="splash-svg-x-wrapper">
          <svg 
            viewBox="0 0 120 120" 
            xmlns="http://www.w3.org/2000/svg"
            className="splash-svg-x"
          >
            <defs>
              {/* Mask created by animated line strokes */}
              <mask id="x-stroke-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
                <path 
                  d="M 22 22 L 98 98" 
                  className="mask-path stroke-one" 
                />
                <path 
                  d="M 98 22 L 22 98" 
                  className="mask-path stroke-two" 
                />
              </mask>
            </defs>

            {/* Exact Comico Font Glyph X, revealed by the drawing strokes */}
            <text 
              x="60" 
              y="92" 
              textAnchor="middle" 
              className="comico-font-text"
              mask="url(#x-stroke-mask)"
            >
              X
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
