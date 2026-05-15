import type { PropsWithChildren, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SectionFrameProps = PropsWithChildren<{
  title: string;
  description?: string;
  actions?: ReactNode;
}>;

export function SectionFrame({ title, description, actions, children }: SectionFrameProps) {
  return (
    <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description != null ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {actions != null ? <div>{actions}</div> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
