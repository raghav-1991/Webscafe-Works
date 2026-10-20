import { Link } from 'react-router-dom';
import { footer, navigation, profile } from '@/data/profile';
import { useClock } from '@/hooks/useClock';
import Reveal from '@/components/effects/Reveal';
import SocialLinks from '@/components/ui/SocialLinks';

/** Agency footer: link columns, live studio clock (IST) and an oversized gradient wordmark. */
export default function Footer() {
  const now = useClock(15_000);
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: profile.timeZone });
  const toTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="footer__grid">
          <div className="footer__col">
            <h4>Navigate</h4>
            <ul>
              {navigation.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h4>Follow</h4>
            <SocialLinks />
          </div>
          <div className="footer__col">
            <h4>Studio</h4>
            <p>
              <i className="ph-duotone ph-map-pin" /> {profile.location}
            </p>
            <p className="footer__clock">
              <span className="eyebrow__dot" aria-hidden /> {time} IST
            </p>
          </div>
        </Reveal>

        <div className="footer__wordmark" aria-hidden>
          {profile.brand}
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {footer.year} All rights reserved by{' '}
            <a href={footer.credit.href} target="_blank" rel="noreferrer">
              {footer.credit.label}
            </a>
          </p>
          <a href="#top" className="footer__top" onClick={toTop}>
            Back to top <i className="ph ph-arrow-up" />
          </a>
        </div>
      </div>
    </footer>
  );
}
