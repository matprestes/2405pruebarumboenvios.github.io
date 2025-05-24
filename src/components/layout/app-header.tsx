
"use client";
import type { FC } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react'; // Using LogIn as a placeholder for User/Profile icon

export const AppHeader: FC = () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>
      <Button variant="outline" size="icon" className="rounded-full" aria-label="User Profile">
        <LogIn className="h-5 w-5" />
      </Button>
    </header>
  );
};
