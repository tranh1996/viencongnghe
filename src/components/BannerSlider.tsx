'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchDepartments, Department } from '../utils/api';

interface BannerSlide {
  id: number;
  image: string;
  title?: {
    vi: string;
    en: string;
  };
  subtitle?: {
    vi: string;
    en: string;
  };
  description?: {
    vi: string;
    en: string;
  };
  primaryButton?: {
    text: {
      vi: string;
      en: string;
    };
    link: string;
  };
  secondaryButton?: {
    text: {
      vi: string;
      en: string;
    };
    link: string;
  };
}

interface BannerSliderProps {
  slides: BannerSlide[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  slides,
  autoPlay = false,
  interval = 5000,
  showControls = true,
  showIndicators = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  // Auto-play is disabled by default
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Fetch departments
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const loadDepartments = async () => {
      try {
        const departmentsData = await fetchDepartments(language, controller.signal);
        if (isMounted) {
          // Show all departments from API
          setDepartments(departmentsData);
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        if (isMounted) {
          console.error('Failed to load departments:', error);
          setDepartments([]);
          setLoading(false);
        }
      }
    };

    loadDepartments();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language]);

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalSlides = isMobile ? departments.length : Math.ceil(departments.length / 2);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };


  if (!slides || slides.length === 0) {
    return null;
  }

  // Only show first slide
  const firstSlide = slides[0];


  const DepartmentCard = ({ department }: { department: Department }) => (
    <div className={`banner-card ${department.image_url ? 'banner-card-with-bg' : ''}`}>
      {department.image_url && (
        <Image
          src={department.image_url}
          alt={department.name}
          fill
          className="card-bg-image"
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <div className="card-overlay">
        <div className="card-icon">
          <i className="bi bi-building"></i>
        </div>
        <div className="card-category">{language === 'vi' ? 'Phòng ban' : 'Department'}</div>
        <h3 className="card-title">{department.name}</h3>
      </div>
    </div>
  );

  return (
    <div className="swiper banner-swiper banner-slider">
      {/* Geometric Patterns */}
      <div className="geometric-pattern pattern-1"></div>
      <div className="geometric-pattern pattern-2"></div>
      <div className="geometric-pattern pattern-3"></div>
      
      <div className="swiper-wrapper">
        <div className="swiper-slide swiper-slide-active">
          <div
            className="slider-img"
            style={{ '--bg-image': `url(${firstSlide.image})` } as React.CSSProperties}
          ></div>
          <div className="banner-content">
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <div className="banner-text">
                    {firstSlide.subtitle && firstSlide.subtitle[language] && (
                      <h6>{firstSlide.subtitle[language]}</h6>
                    )}
                    {firstSlide.title && (
                      <h1 
                        className="mb-4"
                        dangerouslySetInnerHTML={{ __html: firstSlide.title[language] }}
                      />
                    )}
                    {firstSlide.description && (
                      <p dangerouslySetInnerHTML={{ __html: firstSlide.description[language] }} />
                    )}
                    <div className="btn-box mt-4">
                      {firstSlide.primaryButton && (
                        <Link href={firstSlide.primaryButton.link} className="themeht-btn primary-btn">
                          {firstSlide.primaryButton.text[language]}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cards Slider */}
      {!loading && departments.length > 0 && (
        <div className="banner-featured-cards">
          <div className="container">
            <div className="cards-slider-wrapper position-relative">
              <div className="cards-slider" id="cardsSlider">
                <div
                  className="cards-track"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  
                  } as React.CSSProperties}
                >
                  {/* Desktop Layout - slides with 2 cards each */}
                  {!isMobile && (
                    <>
                      {Array.from({ length: Math.ceil(departments.length / 2) }, (_, slideIndex) => {
                        const startIndex = slideIndex * 2;
                        let cardsForSlide = departments.slice(startIndex, startIndex + 2);

                        // If this is the last slide and it has only 1 card, add the first card
                        if (cardsForSlide.length === 1 && departments.length > 1) {
                          cardsForSlide.push(departments[0]);
                        }

                        return (
                          <div key={slideIndex} className="card-slide desktop-slide">
                            <div className="row">
                              {cardsForSlide.map((department, cardIndex) => (
                                <div key={`${department.id}-${slideIndex}-${cardIndex}`} className={`col-lg-6 ${cardIndex === 0 ? 'mb-4 mb-lg-0' : ''}`}>
                                  <Link href={`/organization/${department.slug}`} className="banner-card-link">
                                    <DepartmentCard department={department} />
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* Mobile Layout - 1 card per slide */}
                  {isMobile && (
                    <>
                      {departments.map((department) => (
                        <div key={department.id} className="card-slide mobile-slide">
                          <Link href={`/organization/${department.slug}`} className="banner-card-link">
                            <DepartmentCard department={department} />
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            
              {/* Cards Navigation Controls */}
              {totalSlides > 1 && (
                <>
                  <div className="cards-nav-prev" onClick={goToPrevious}>
                    <i className="bi bi-chevron-left"></i>
                  </div>
                  <div className="cards-nav-next" onClick={goToNext}>
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </>
              )}
              
              {/* Cards Indicators */}
              {totalSlides > 1 && (
                <div className="cards-pagination">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <span
                      key={index}
                      className={`cards-pagination-bullet ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
