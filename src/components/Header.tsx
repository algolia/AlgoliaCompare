import { Settings, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AlgoliaLogo from '@/assets/Algolia-logo-blue.svg?react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        <AlgoliaLogo className="h-12 w-auto" aria-label="Algolia" />
        <h1 className="text-xl font-semibold text-foreground">Compare</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
