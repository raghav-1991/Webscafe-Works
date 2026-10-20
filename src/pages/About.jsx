import PageWrapper from '@/components/layout/PageWrapper';
import PageHero from '@/components/ui/PageHero';
import SplitText from '@/components/effects/SplitText';
import { AboutIntro, Approach, Drives } from '@/components/sections/AboutWebscafe';
import { aboutWebscafe as a } from '@/data/profile';

export default function About() {
  return (
    <PageWrapper title="About">
      <PageHero
        size="lg"
        eyebrow={a.eyebrow}
        title={<SplitText text={a.heading} delay={0.25} className="split-gradient" />}
        description={a.description}
      />
      <AboutIntro />
      <Approach />
      <Drives />
    </PageWrapper>
  );
}
