import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { aboutWebscafe as a } from '@/data/profile';
import { img } from '@/utils/asset';
import Reveal, { Stagger, StaggerItem } from '@/components/effects/Reveal';
import TiltCard from '@/components/effects/TiltCard';
import BorderBeam from '@/components/effects/BorderBeam';
import Eyebrow from '@/components/ui/Eyebrow';

/** Story copy beside a tilting, beam-framed team photo. */
export function AboutIntro() {
  return (
    <section className="section about-intro">
      <div className="container about-intro__row">
        <Reveal className="about-intro__copy">
          <Eyebrow>Who we are</Eyebrow>
          {a.paragraphs.map((p, i) => (
            <p key={p.slice(0, 24)} className={i === 0 ? 'about-intro__lead' : undefined}>
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal className="about-intro__media" delay={0.1} scale={0.97}>
          <TiltCard className="about-intro__frame" max={5}>
            <BorderBeam duration={10} />
            <img src={img(a.image)} alt="The Webscafe team reviewing a project together" loading="lazy" />
            <span className="about-intro__shade" aria-hidden />
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

/** Four-step process; the connecting line fills as the section scrolls through (Aceternity "Timeline"). */
export function Approach() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="section approach" ref={ref}>
      <div className="container">
        <Reveal className="section-head">
          <Eyebrow>{a.stepsTitle}</Eyebrow>
          <h2 className="section-title">
            Listen. Understand. <span className="text-gradient">Create. Optimise.</span>
          </h2>
        </Reveal>

        <div className="approach__track">
          <div className="approach__line" aria-hidden>
            <motion.span style={{ width: fill }} />
          </div>
          <Stagger as="ol" className="approach__steps" stagger={0.12}>
            {a.steps.map((s, i) => (
              <StaggerItem as="li" key={s.title} className="approach__step spotlight">
                <span className="approach__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="approach__icon" aria-hidden>
                  <i className={s.icon} />
                </span>
                <h3>{s.title}</h3>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/** Values as glowing bento cards (Aceternity "Glowing Effect" / "Bento Grid", 21st.dev). */
export function Drives() {
  return (
    <section className="section drives">
      <div className="container">
        <Reveal className="section-head">
          <Eyebrow>{a.drivesTitle}</Eyebrow>
          <h2 className="section-title">
            What <span className="text-gradient">drives</span> us
          </h2>
        </Reveal>
        <Stagger as="ul" className="drives__grid" stagger={0.12}>
          {a.drives.map((d, i) => (
            <StaggerItem as="li" key={d.icon} className="drives__card spotlight">
              <span className="drives__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="drives__icon" aria-hidden>
                <i className={d.icon} />
              </span>
              <p>{d.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
