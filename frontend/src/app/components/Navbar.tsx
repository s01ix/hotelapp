import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, login, logout } = useApp();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    setShowLoginDialog(false);
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white text-primary border-b border-gray-100 sticky top-0 z-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Nowe, minimalistyczne logo */}
            <Link to="/" className="flex flex-col items-start leading-none group">
              <span className="text-2xl font-serif font-bold tracking-tighter uppercase">Luks</span>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-60">Hotel & Spa</span>
            </Link>

            {/* Menu */}
            <div className="flex items-center gap-6">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-accent" />
                    <span>{user?.name}</span>
                  </div>
                  
                  {user?.role === 'admin' ? (
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="ghost"
                      className="hover:text-accent"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Panel Admina
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="ghost"
                      className="hover:text-accent"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Rezerwacje
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="rounded-none border-gray-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Wyloguj
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setShowLoginDialog(true)}
                    variant="ghost"
                    className="text-sm hover:text-accent"
                  >
                    Logowanie
                  </Button>
                  <Button
                    onClick={() => setShowLoginDialog(true)}
                    className="bg-primary text-white hover:bg-accent transition-colors px-6 rounded-none"
                  >
                    Zarezerwuj
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Okienko Dialogowe Logowania dopasowane do nowego motywu */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md rounded-none border-gray-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Zaloguj się</DialogTitle>
            <DialogDescription className="text-gray-500">
              Wprowadź swoje dane, aby uzyskać dostęp do panelu rezerwacji.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-500">
                Adres Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="zzzzzz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none border-gray-300 focus-visible:ring-accent"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-gray-500">
                Hasło
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-gray-300 focus-visible:ring-accent"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-accent text-white rounded-none h-12 transition-colors"
            >
              Zaloguj się
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};