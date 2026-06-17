import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

// czy wywoluje sie funkcja zmiany jezyka
const mockChangeLanguage = vi.fn();


vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      resolvedLanguage: 'pl', 
      changeLanguage: mockChangeLanguage,
    },
  }),
}));


vi.mock('framer-motion', () => ({
  motion: {
    
    button: ({ children, whileHover, whileTap, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje flagi wszystkich dostępnych języków', () => {
    render(<LanguageSwitcher />);
    
    // sprawdzanie czy renderuje flagi
    expect(screen.getByText('🇵🇱')).toBeInTheDocument();
    expect(screen.getByText('🇬🇧')).toBeInTheDocument();
  });

  it('zmienia język po kliknięciu na flagę', async () => {
    render(<LanguageSwitcher />);
    
    // wybranie flagi angielskiej
    const enButton = screen.getByText('🇬🇧');
    await userEvent.click(enButton);
    
    // czy zmienilo jezyk
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
  });

  it('podświetla aktywny język', () => {
    render(<LanguageSwitcher />);
    
    // czy polski aktywny
    const plButton = screen.getByText('🇵🇱');
    expect(plButton.className).toContain('bg-accent/10');
    
    // czy angielski aktywny
    const enButton = screen.getByText('🇬🇧');
    expect(enButton.className).not.toContain('bg-accent/10');
  });
});