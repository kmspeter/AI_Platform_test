import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  const [user, setUser] = useState({
    id: '1',
    name: '김개발',
    email: 'dev@example.com',
    wallet: { connected: false, address: null, network: null }
  });

  const handleWalletConnect = () => {
    if (user.wallet.connected) {
      setUser(prev => ({
        ...prev,
        wallet: { connected: false, address: null, network: null }
      }));
    } else {
      // Simulate wallet connection
      setUser(prev => ({
        ...prev,
        wallet: { 
          connected: true, 
          address: '0x1234...5678', 
          network: 'Ethereum' 
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onWalletConnect={handleWalletConnect} />
      <Sidebar />
      
      <div className="lg:pl-64">
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};