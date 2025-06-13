import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Habits from './Habits';
import Notes from './Notes';
import Todos from './Todos';
import Profile from './Profile';
import ShoppingLists from './ShoppingLists';
import StudyPlan from './StudyPlan';
import Settings from './Settings';
import Links from './Links';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'habits':
        return <Habits />;
      case 'notes':
        return <Notes />;
      case 'todos':
        return <Todos />;
      case 'shopping':
        return <ShoppingLists />;
      case 'study':
        return <StudyPlan />;
      case 'items':
        return <Links />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className={cn(
        "flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full",
        isMobile ? "py-4 pb-20" : "py-8"
      )}>
        {renderContent()}
      </main>
      {!isMobile && <Footer />}
    </div>
  );
};

export default Layout;
