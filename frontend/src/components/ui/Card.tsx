import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

type CardHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <section
      className={[
        'rounded-2xl border border-slate-200 bg-white shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </section>
  );
}

export function CardHeader({ title, description, eyebrow }: CardHeaderProps) {
  return (
    <div className="space-y-1">
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>

      {description ? (
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}