import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Hotel, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
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
      <nav className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Hotel className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-semibold">Hotel Luks</span>
            </Link>

            {/* Linki */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user?.name}</span>
                  </div>
                  
                  {user?.role === 'admin' ? (
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Panel Admina
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Moje rezerwacje
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-white hover:bg-white/10"
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
                    className="text-white hover:bg-white/10"
                  >
                    Zaloguj
                  </Button>
                  <Button
                    onClick={() => setShowLoginDialog(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Zarejestruj
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* logowanie/rejeska */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zaloguj sie na konto</DialogTitle>
            <DialogDescription>
              Wprowadz swoje dane, aby uzyskac dostep.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="zzzzzz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Haslo</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
              Zaloguj sie
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};