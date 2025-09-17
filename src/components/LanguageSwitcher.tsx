'use client';

import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';

// Define supported languages to match LanguageContext
const supportedLanguages = [
  {
    code: 'vi' as const,
    name: 'Tiếng Việt',
    icon: 'bi-globe',
    direction: 'ltr'
  },
  {
    code: 'en' as const,
    name: 'English',
    icon: 'bi-globe2',
    direction: 'ltr'
  }
];

interface LanguageSwitcherProps {
  onLanguageChange?: (languageCode: string) => void;
}

export default function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (languageCode: 'vi' | 'en') => {
    setLanguage(languageCode);
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', languageCode);
    }
  };

  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <DropdownButton
      id="language-switcher"
      title={
        <span>
          <i className={currentLanguage?.icon}></i> {currentLanguage?.name}
        </span>
      }
      variant="outline-light"
      size="sm"
      className="language-switcher"
    >
      {supportedLanguages.map((lang) => (
        <Dropdown.Item
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          active={lang.code === language}
        >
          <i className={`${lang.icon} me-2`}></i>
          {lang.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
