import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const Navbar: React.FC = () => {
const { user, isLoggedIn, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useApp();
  const navigate = useNavigate();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setShowLoginDialog(open);
    if (!open) {
      setIsLoginMode(true);
      setLoginError(null);
      setName(''); setLastName(''); setPhone(''); setEmail(''); setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      if (isLoginMode) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(name, lastName, email, password, phone);
      }
      handleOpenChange(false);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await loginWithEmail(email, password);
      setShowLoginDialog(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message);
    }
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
            <Link to="/" className="flex flex-col items-start leading-none group">
              <span className="text-2xl font-serif font-bold tracking-tighter uppercase">Luks</span>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-60">Hotel & Spa</span>
            </Link>

            <div className="flex items-center gap-6">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-accent" />
                    <span>{user?.name}</span>
                  </div>
                  
                  {user?.role === 'admin' || user?.role === 'ADMIN' ? (
                  <Button onClick={() => navigate('/admin')} variant="ghost" className="hover:text-accent">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Panel Admina
                  </Button>
                    ) : (
                  <Button onClick={() => navigate('/dashboard')} variant="ghost" className="hover:text-accent">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Rezerwacje
                  </Button>
                  )}
                  
                  <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-none border-gray-300">
                    <LogOut className="h-4 w-4 mr-2" />
                    Wyloguj
                  </Button>
                </>
              ) : (
                <>
                  {/* Kliknięcie teraz po prostu otwiera modal (okienko) */}
                  <Button onClick={() => setShowLoginDialog(true)} variant="ghost" className="text-sm hover:text-accent">
                    Logowanie
                  </Button>
                  
                  <Button 
                    onClick={() => { setIsLoginMode(false); setShowLoginDialog(true); }} 
                    variant="ghost" 
                    className="text-sm hover:text-accent"
                  >
                    Rejestracja
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* NASZE OKIENKO (MODAL) LOGOWANIA */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md rounded-none border-gray-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {isLoginMode 
                ? 'Użyj e-maila i hasła lub zaloguj się przez konto Google.' 
                : 'Utwórz nowe konto, podając poniższe dane.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {loginError && (
              <div className="text-red-500 text-sm font-medium p-2 bg-red-50 border border-red-200 text-center">
                {loginError}
              </div>
            )}
            {!isLoginMode && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs uppercase tracking-widest text-gray-500">Imię</Label>
                    <Input
                      id="firstName" type="text" placeholder="Jan"
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="rounded-none border-gray-300 focus-visible:ring-accent" required={!isLoginMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs uppercase tracking-widest text-gray-500">Nazwisko</Label>
                    <Input
                      id="lastName" type="text" placeholder="Kowalski"
                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="rounded-none border-gray-300 focus-visible:ring-accent" required={!isLoginMode}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-gray-500">Telefon</Label>
                  <Input
                    id="phone" type="tel" placeholder="123 456 789"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="rounded-none border-gray-300 focus-visible:ring-accent" required={!isLoginMode}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-500">Adres Email</Label>
              <Input
                id="email" type="email" placeholder="jan@kowalski.pl"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="rounded-none border-gray-300 focus-visible:ring-accent" required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-gray-500">Hasło</Label>
              <Input
                id="password" type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-gray-300 focus-visible:ring-accent" required
              />
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-accent text-white rounded-none h-12 transition-colors">
              {isLoginMode ? 'Zaloguj się' : 'Utwórz konto'}
            </Button>
          </form>
          
          <div className="text-center mt-2">
            <button 
              type="button" 
              onClick={() => { setIsLoginMode(!isLoginMode); setLoginError(null); }}
              className="text-sm text-gray-500 hover:text-accent underline underline-offset-4 transition-colors"
            >
              {isLoginMode ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
            </button>
          </div>

          {/* ODDZIELNIK */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-white px-2 text-gray-500">LUB</span>
            </div>
          </div>

          {/* LOGOWANIE GOOGLE */}
          <Button 
            type="button" 
            variant="outline" 
            onClick={loginWithGoogle} 
            className="w-full rounded-none h-12 border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Kontynuuj z Google
          </Button>

        </DialogContent>
      </Dialog>
    </>
  );
};