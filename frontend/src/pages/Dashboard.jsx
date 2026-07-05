import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SummaryCards from '../components/dashboard/SummaryCards';
import Rankings from '../components/dashboard/Rankings';
import InteractiveActivities from '../components/dashboard/InteractiveActivities';
import Analytics from '../components/dashboard/Analytics';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated || !user) {
      navigate('/auth');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-10">Your Dashboard</h1>
        
        <SummaryCards />
        <Rankings />
        <InteractiveActivities />
        <Analytics />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
