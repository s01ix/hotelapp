import React from 'react';
import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 
import { Button } from '../components/ui/button';

export const NotFound: React.FC = () => {
  const { t } = useTranslation(); 
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#1e3a8a] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-4">{t('notFound.title')}</h2>
        <p className="text-muted-foreground mb-8">
          {t('notFound.description')}
        </p>
        <Button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600"
        >
          <Home className="h-4 w-4 mr-2" />
          {t('notFound.backBtn')}
        </Button>
      </div>
    </div>
  );
};