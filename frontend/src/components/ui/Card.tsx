import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

type CardHeaderProps = {
  title: string;
  description?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <section
      className={[
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </section>
  );
}

export function CardHeader({ title, description }: CardHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}