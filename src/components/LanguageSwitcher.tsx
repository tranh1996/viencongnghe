'use client';

import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: 'vi' | 'en') => {
    setLanguage(newLanguage);
  };

  return (
    <Dropdown className="language-switcher">
      <Dropdown.Toggle variant="outline-light" size="sm">
        <i className="bi bi-globe me-1"></i>
        {language === 'vi' ? 'VI' : 'EN'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item 
          onClick={() => handleLanguageChange('vi')}
          active={language === 'vi'}
        >
          <i className="bi bi-flag me-2"></i>
          {t('language.vi')}
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => handleLanguageChange('en')}
          active={language === 'en'}
        >
          <i className="bi bi-flag me-2"></i>
          {t('language.en')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
