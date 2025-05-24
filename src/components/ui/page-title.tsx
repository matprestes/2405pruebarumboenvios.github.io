
import type { FC, ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
}

export const PageTitle: FC<PageTitleProps> = ({ children }) => {
  return (
    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
      {children}
    </h1>
  );
};
