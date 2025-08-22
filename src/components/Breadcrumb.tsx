'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export interface BreadcrumbItem {
  label: {
    vi: string;
    en: string;
  };
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  title: {
    vi: string;
    en: string;
  };
  backgroundImage?: string;
  items: BreadcrumbItem[];
  showParticles?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  title,
  backgroundImage = '/images/bg/02.jpg',
  items,
  showParticles = true
}) => {
  const { language } = useLanguage();

  return (
    <section 
      className="page-title" 
      data-bg-img={backgroundImage}
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1
      }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-6">
            <h1 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              {title[language]}
            </h1>
            <nav aria-label="breadcrumb" className="page-breadcrumb">
              <ol className="breadcrumb" style={{ backgroundColor: 'transparent' }}>
                {items.map((item, index) => (
                  <li 
                    key={index}
                    className={`breadcrumb-item ${item.active ? 'active' : ''}`}
                    {...(item.active && { 'aria-current': 'page' })}
                    style={{ 
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    {item.href && !item.active ? (
                      <Link 
                        href={item.href}
                        style={{ 
                          color: '#ffffff',
                          textDecoration: 'none',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                        }}
                        onMouseOver={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.color = '#f8f9fa';
                        }}
                        onMouseOut={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.color = '#ffffff';
                        }}
                      >
                        {index === 0 && (
                          <i className="bi bi-house-door me-1"></i>
                        )}
                        {item.label[language]}
                      </Link>
                    ) : (
                      <>
                        {index === 0 && (
                          <i className="bi bi-house-door me-1"></i>
                        )}
                        {item.label[language]}
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {showParticles && <div id="particles-js"></div>}
    </section>
  );
};

export default Breadcrumb;