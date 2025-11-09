import React, { useEffect, useRef } from 'react';

const useTilt = (maxRotate: number = 6) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardEl = ref.current;
    if (!cardEl) return;
    
    // This variable tracks if the mouse is currently over the element.
    let isMouseOver = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseOver) return; // Only run logic if mouse is over the element
      const rect = cardEl.getBoundingClientRect();
      // Calculate mouse position relative to the element center (from -0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Apply the 3D transform.
      // rotateX is based on `y` position, rotateY is based on `x`.
      cardEl.style.transform = `perspective(1000px) rotateX(${(-y * maxRotate).toFixed(2)}deg) rotateY(${(x * maxRotate).toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseEnter = () => {
      isMouseOver = true;
      cardEl.style.transition = 'transform 0.1s linear'; // Quick transition when moving
    };
    
    const handleMouseLeave = () => {
      isMouseOver = false;
      cardEl.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'; // Smooth spring-back
      // Reset transform when the mouse leaves
      cardEl.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    cardEl.addEventListener('mousemove', handleMouseMove);
    cardEl.addEventListener('mouseenter', handleMouseEnter);
    cardEl.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      cardEl.removeEventListener('mousemove', handleMouseMove);
      cardEl.removeEventListener('mouseenter', handleMouseEnter);
      cardEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxRotate]);

  return ref;
};

export default useTilt;
