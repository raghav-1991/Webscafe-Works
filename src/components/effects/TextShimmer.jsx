import { cn } from '@/utils/cn';

/** Moving highlight across text — adapted from Motion Primitives "Text Shimmer" (21st.dev). */
export default function TextShimmer({ as: Tag = 'span', children, className, duration = 2.6 }) {
  return (
    <Tag className={cn('text-shimmer', className)} style={{ '--shimmer-duration': `${duration}s` }}>
      {children}
    </Tag>
  );
}
