import { cn } from '@/utils/cn';

/** Small glass pill with a pulsing brand dot — the label that opens every section. */
export default function Eyebrow({ children, className, as: Tag = 'span' }) {
  return (
    <Tag className={cn('eyebrow', className)}>
      <span className="eyebrow__dot" aria-hidden />
      {children}
    </Tag>
  );
}
