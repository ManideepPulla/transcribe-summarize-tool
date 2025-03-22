
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Mic, Headphones, Settings } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="animate-slide-down">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Headphones className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">NoteTaker AI</h1>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-3">
            <div className="glass-panel px-3 py-1.5 text-sm flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Real-time transcription</span>
            </div>
            <div className="glass-button p-2 cursor-pointer">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
      <Separator className="my-2" />
    </header>
  );
};

export default Header;
