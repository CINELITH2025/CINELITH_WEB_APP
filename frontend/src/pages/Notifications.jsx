import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MessageCircle, Trophy, UserPlus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const notifications = [
  { 
    title: "New Comment", 
    text: "Sophia commented on your review of 'The Midnight Bloom'.", 
    icon: MessageCircle, 
    color: "text-blue-400" 
  },
  { 
    title: "Ranking Achievement", 
    text: "You've reached the 'Rising Star' rank in the community.", 
    icon: Trophy, 
    color: "text-primary" 
  },
  { 
    title: "New Follower", 
    text: "Ethan started following you.", 
    icon: UserPlus, 
    color: "text-green-400" 
  },
  { 
    title: "New Message", 
    text: "You have a new message from Olivia.", 
    icon: Mail, 
    color: "text-purple-400" 
  }
];

const Notifications = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[800px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">Notifications</h1>
        
        <div className="flex flex-col gap-6 mb-10">
          {notifications.map((notif, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-6 hover:border-white/20 transition-all cursor-pointer group">
              <div className={`p-4 bg-white/5 rounded-2xl ${notif.color} group-hover:scale-110 transition-transform`}>
                <notif.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="font-bold text-white mb-1">{notif.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{notif.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full py-6 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold">
          View All
        </Button>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
