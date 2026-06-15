import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import PageTransition from '../pages/PageTransition';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className="pt-16">
        {/* The 'key' tells React: "If the URL changes, destroy the old 
          PageTransition and build a new one." This triggers the GSAP animation! 
        */}
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}