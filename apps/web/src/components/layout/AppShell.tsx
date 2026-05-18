import { AppHeader } from './AppHeader';

import type { PropsWithChildren } from 'react';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-[#1c1c15]">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-10 md:px-16 md:pt-32 md:pb-20">
        {children}
      </main>
    </div>
  );
}
