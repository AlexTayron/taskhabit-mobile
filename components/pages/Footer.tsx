import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-4 border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground text-center sm:text-left">
        <div>
          © 2025 <strong>TaskHabit</strong> — Construa sua melhor versão, um hábito por vez.
        </div>
        <div className="flex items-center gap-1">
          Desenvolvido por{" "}
          <a
            href="https://www.linkedin.com/in/alextayron/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            Alex Tayron
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
