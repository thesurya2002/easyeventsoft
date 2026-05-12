import { events } from '@/data/seed';

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

export default function EventLayout({ children }) {
  return children;
}
