'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { supportedLanguages, getCurrentLanguage, setLanguage } from '../config/languages';

interface LanguageSwitcherProps {
  onLanguageChange?: (languageCode: string) => void;
}

export default function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState<string>('vi');

  useEffect(() => {
    const lang = getCurrentLanguage();
    setCurrentLang(lang);
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLang(languageCode);
    setLanguage(languageCode);
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    // Reload the page to apply language changes
    window.location.reload();
  };

  const currentLanguage = supportedLanguages.find(lang => lang.code === currentLang);

  return (
    <DropdownButton
      id="language-switcher"
      title={
        <span>
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
      }
      variant="outline-light"
      size="sm"
      className="language-switcher"
    >
      {supportedLanguages.map((language) => (
        <Dropdown.Item
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          active={language.code === currentLang}
        >
          <span className="me-2">{language.flag}</span>
          {language.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
