import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const languages = [
  { code: 'pl', flag: '🇵🇱', full: 'Polski' },
  { code: 'en', flag: '🇬🇧', full: 'English' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || i18n.language;

  return (
    <div className="flex items-center gap-1.5">
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        
        return (
          <motion.button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center
                       text-xl transition-all duration-200 ${
              isActive 
                ? 'bg-accent/10 ring-2 ring-accent/50 shadow-lg' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 opacity-60 hover:opacity-100'
            }`}
            title={lang.full}
          >
            {lang.flag}
          </motion.button>
        );
      })}
    </div>
  );
};