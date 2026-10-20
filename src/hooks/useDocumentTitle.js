import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Webscafe` : 'Webscafe — Digital Agency';
  }, [title]);
}
