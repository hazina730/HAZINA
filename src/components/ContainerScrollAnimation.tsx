import { ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type ContainerScrollAnimationProps = {
  titleComponent: ReactNode;
  children: ReactNode;
};

function ContainerScrollAnimation({ titleComponent, children }: ContainerScrollAnimationProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0.08, 0.45], reduceMotion ? [0, 0] : [13, 0]);
  const rotateZ = useTransform(scrollYProgress, [0.08, 0.45], reduceMotion ? [0, 0] : [-2.4, 0]);
  const scale = useTransform(scrollYProgress, [0.08, 0.45], reduceMotion ? [1, 1] : [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 0.42], reduceMotion ? [0, 0] : [30, -8]);
  const titleY = useTransform(scrollYProgress, [0, 0.38], reduceMotion ? [0, 0] : [18, -10]);

  return (
    <section ref={sectionRef} className="container-scroll-section">
      <div className="container-scroll-inner">
        <motion.div className="container-scroll-title" style={{ y: titleY }}>
          {titleComponent}
        </motion.div>
        <div className="container-scroll-perspective">
          <motion.div
            className="container-scroll-card"
            style={{
              rotateX,
              rotateZ,
              scale,
              y,
            }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContainerScrollAnimation;
