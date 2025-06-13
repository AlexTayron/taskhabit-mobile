import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface UserDropdownProps {
  setActiveSection?: (section: string) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ setActiveSection }) => {
  const { user, profile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    if (setActiveSection) {
      setActiveSection('profile');
    }
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    if (setActiveSection) {
      setActiveSection('settings');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-accent transition-colors duration-200"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="h-6 w-6 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg border border-border shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-border">
            <div className="font-medium text-sm">{profile?.name || user?.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>

          <button
            onClick={handleProfileClick}
            className="w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors duration-200"
          >
            Perfil
          </button>

          <div className="border-t border-border">
            <button
              onClick={handleSettingsClick}
              className="w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors duration-200 flex items-center"
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              Configurações
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors duration-200 flex items-center"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  <span>Tema Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  <span>Tema Escuro</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 inline-block mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
