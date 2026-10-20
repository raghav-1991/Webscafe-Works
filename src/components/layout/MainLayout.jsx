import { useSpotlight } from '@/hooks/useSpotlight';
import Navbar from './Navbar';
import Particles from '@/components/effects/Particles';
import CursorGlow from '@/components/effects/CursorGlow';
import ScrollProgress from '@/components/effects/ScrollProgress';

/** App shell: layered background (grid + aurora + particles), cursor light, floating nav, page. */
export default function MainLayout({ children }) {
  useSpotlight();
  return (
    <>
      <ScrollProgress />
      <div className="bg-grid" aria-hidden />
      <div className="bg-aurora" aria-hidden />
      <Particles color="0, 194, 203" quantity={70} />
      <CursorGlow />
      <Navbar />
      <main className="site-main" id="top">
        {children}
      </main>
    </>
  );
}
