import { MotionConfig } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppRoutes />
    </MotionConfig>
  );
}
