import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  badge?: ReactNode;
};

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <header className="space-y-3">
      {badge != null ? <div>{badge}</div> : null}
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
    </header>
  );
}
