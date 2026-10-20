import { cn } from '@/utils/cn';

/**
 * Work card: framed image that zooms under a teal wash with a "View Project" chip, cursor-tracked
 * border glow (Magic UI "Magic Card" / Aceternity "Glowing Effect", 21st.dev) and a rotating arrow.
 * Live sites (http/https) open in a new tab; `href` defaults to "#" until a project has a link.
 */
export default function ProjectCard({ href = '#', image, title, category, className, lazy = true }) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn('work-card spotlight', className)}
      aria-label={`View project: ${title} — ${category}${external ? ' (opens in a new tab)' : ''}`}
    >
      <div className="work-card__media">
        <img src={image} alt="" loading={lazy ? 'lazy' : undefined} />
        <span className="work-card__wash" aria-hidden />
        <span className="work-card__chip" aria-hidden>
          View Project <i className="ph ph-arrow-up-right" />
        </span>
      </div>
      <div className="work-card__body">
        <div>
          <span className="work-card__tag">{category}</span>
          <h3 className="work-card__title">{title}</h3>
        </div>
        <span className="work-card__arrow" aria-hidden>
          <i className="ph ph-arrow-up-right" />
        </span>
      </div>
    </a>
  );
}
