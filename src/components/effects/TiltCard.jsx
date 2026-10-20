import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';

/** 3D perspective tilt with glare — inspired by the "Tilt Card" components on 21st.dev. */
export default function TiltCard({ as = 'div', max = 8, className, children, glare = true, ...rest }) {
  const fine = useFinePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const Tag = motion[as];

  const onMove = (e) => {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <Tag
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900, '--gx': glareX, '--gy': glareY }}
      {...rest}
    >
      {children}
      {glare && fine && <span className="tilt-glare" aria-hidden />}
    </Tag>
  );
}
