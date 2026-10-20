import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import PerspectiveTunnelHero from '@/components/ui/PerspectiveTunnelHero';
import MurmurationWordmark from '@/components/ui/MurmurationWordmark';
import Eyebrow from '@/components/ui/Eyebrow';
import AnimatedTabs from '@/components/ui/AnimatedTabs';
import Reveal from '@/components/effects/Reveal';
import WordRotate from '@/components/effects/WordRotate';
import ProjectCard from '@/components/cards/ProjectCard';
import ComingSoon from '@/components/cards/ComingSoon';
import { categories, projects } from '@/data/projects';
import { ourWorks } from '@/data/profile';

const ease = [0.21, 0.47, 0.32, 0.98];
const categoryNames = categories.map((c) => c.name);

/** Tunnel cards: one project from each tab in turn, skipping repeated screenshots. */
const TUNNEL_CARD_COUNT = 12;
const tunnelCards = (() => {
  const seen = new Set();
  const queues = categoryNames.map((name) => projects.filter((p) => p.category === name && p.href !== '#'));
  const picked = [];
  for (let round = 0; picked.length < TUNNEL_CARD_COUNT && queues.some((q) => q.length); round += 1) {
    for (const q of queues) {
      while (q.length && seen.has(q[0].image)) q.shift();
      const p = q.shift();
      if (!p || picked.length >= TUNNEL_CARD_COUNT) continue;
      seen.add(p.image);
      picked.push({ src: p.image, title: p.title, href: p.href });
    }
  }
  return picked;
})();

/** Our Works: 3D tunnel hero, then category tabs over an animated 2-column grid. */
export default function Projects() {
  const [active, setActive] = useState(categoryNames[0]);
  const list = useMemo(() => projects.filter((p) => p.category === active), [active]);

  const tabs = categories.map((c) => ({
    id: c.name,
    label: c.name,
    badge: c.comingSoon ? 'Soon' : projects.filter((p) => p.category === c.name).length,
  }));

  return (
    <PageWrapper title="Our Works">
      <PerspectiveTunnelHero items={tunnelCards}>
        <Eyebrow>{ourWorks.eyebrow}</Eyebrow>
        <h1 className="page-hero__title page-hero__title--flock">
          <span className="visually-hidden">{ourWorks.title.join('')}</span>
          <MurmurationWordmark word={ourWorks.title.join('')} accentFrom={ourWorks.title[0].length} />
        </h1>
        <span className="hero-rotate">
          <i className="ph-duotone ph-stack" aria-hidden />
          <WordRotate words={categoryNames} />
        </span>
      </PerspectiveTunnelHero>

      <section className="section works">
        <div className="container">
          <Reveal className="works__tabs">
            <AnimatedTabs tabs={tabs} active={active} onChange={setActive} label="Filter works by category" />
          </Reveal>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className="works__panel"
              role="tabpanel"
              aria-label={active}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.2 } }}
              transition={{ duration: 0.45, ease }}
            >
              {list.length ? (
                <motion.div
                  className="works__grid"
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                >
                  {list.map((p) => (
                    <motion.div
                      key={p.slug}
                      variants={{ hidden: { opacity: 0, y: 24, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } } }}
                    >
                      <ProjectCard {...p} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <ComingSoon label={active} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  );
}
