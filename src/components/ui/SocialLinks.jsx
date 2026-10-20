import { socials } from '@/data/profile';
import { cn } from '@/utils/cn';

export default function SocialLinks({ className }) {
  return (
    <ul className={cn('socials', className)}>
      {socials.map((s) => (
        <li key={s.label}>
          <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="socials__link">
            <i className={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
