import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { MessageCircle, UserPlus, Mail, Bell } from 'lucide-react';
import useUserStore from '../store/useUserStore';

const iconFor = (type) => {
  if (type === "message") return Mail;
  if (type === "follow" || type === "friend_request") return UserPlus;
  if (type === "connect") return UserPlus;
  return MessageCircle;
};

const Notifications = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const fetchNotifications = useUserStore((state) => state.fetchNotifications);
  const [items, setItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated) return;
    fetchNotifications()
      .then(setItems)
      .catch(() => setItems([]));
  }, [isAuthenticated, fetchNotifications]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[800px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">Notifications</h1>

        {!isAuthenticated && (
          <p className="text-sm text-gray-400">Sign in to see connection requests, follows, and messages.</p>
        )}

        {isAuthenticated && items.length === 0 && (
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center">
            <Bell className="w-8 h-8 text-[#F5BF26] mx-auto mb-3" />
            <p className="text-sm text-gray-400">No notifications yet.</p>
          </div>
        )}

        <div className="flex flex-col gap-6 mb-10">
          {items.map((notif) => {
            const Icon = iconFor(notif.type);
            return (
              <div key={notif._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-[#F5BF26]">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="font-bold text-white mb-1">{notif.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{notif.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
