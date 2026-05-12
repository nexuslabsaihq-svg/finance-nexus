
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  const progressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      }
    });
    return () => trigger.kill();
  }, []);

  return progressRef;
};

export const animateOnScroll = (selector, fromVars, toVars) => {
  gsap.fromTo(selector, fromVars, {
    ...toVars,
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      end: 'top 20%',
      toggleActions: 'play none none reverse'
    }
  });
};
