import {type ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We use a quick fade and a slight upward slide for a premium native-app feel
    const ctx = gsap.context(() => {
      gsap.from(wrapperRef.current, {
        opacity: 0,
        y: 20, 
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}