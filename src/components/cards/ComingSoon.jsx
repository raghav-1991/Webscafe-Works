import BorderBeam from '@/components/effects/BorderBeam';
import TextShimmer from '@/components/effects/TextShimmer';

/** Empty-category panel: grid glow, orbiting rings and shimmering "Coming Soon". */
export default function ComingSoon({ label }) {
  return (
    <div className="coming-soon">
      <BorderBeam duration={8} />
      <div className="coming-soon__grid" aria-hidden />
      <div className="coming-soon__orbit" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="coming-soon__content">
        <span className="coming-soon__icon" aria-hidden>
          <i className="ph-duotone ph-hourglass-medium" />
        </span>
        <h2>
          <TextShimmer>Coming Soon</TextShimmer>
        </h2>
        {label && <p className="coming-soon__label">{label}</p>}
      </div>
    </div>
  );
}
