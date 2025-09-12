'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { language } = useLanguage();

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

  const totalSlides = isMobile ? 6 : 3;

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
            style={{ backgroundImage: `url(${firstSlide.image})` }}
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
      <div className="banner-featured-cards">
        <div className="container">
          <div className="cards-slider-wrapper position-relative">
            <div className="cards-slider" id="cardsSlider">
              <div 
                className="cards-track" 
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                  width: isMobile ? '600%' : '300%' // 6 slides for mobile, 3 for desktop
                }}
              >
                {/* Desktop Layout - 3 slides with 2 cards each */}
                {!isMobile && (
                  <>
                    <div className="card-slide desktop-slide">
                      <div className="row">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                          <div className="banner-card">
                            <div className="card-icon">
                              <i className="bi bi-gear-fill"></i>
                            </div>
                            <div className="card-category">Phòng ban</div>
                            <h3 className="card-title">Trung tâm Chế tạo Khuôn mẫu</h3>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="banner-card">
                            <div className="card-icon">
                              <i className="bi bi-building"></i>
                            </div>
                            <div className="card-category">Đơn vị trực thuộc</div>
                            <h3 className="card-title">Công ty TNHH MTV Cơ khí Mê Linh</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-slide desktop-slide">
                      <div className="row">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                          <div className="banner-card">
                            <div className="card-icon">
                              <i className="bi bi-layers-fill"></i>
                            </div>
                            <div className="card-category">Phòng ban</div>
                            <h3 className="card-title">Trung tâm Thử nghiệm Vật liệu</h3>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="banner-card">
                            <div className="card-icon">
                              <i className="bi bi-cpu"></i>
                            </div>
                            <div className="card-category">Phòng ban</div>
                            <h3 className="card-title">Trung tâm Nhiệt luyện</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-slide desktop-slide">
                      <div className="row">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                          <div className="banner-card">
                            <div className="card-icon">
                              <i className="bi bi-tools"></i>
                            </div>
                            <div className="card-category">Phòng ban</div>
                            <h3 className="card-title">Trung tâm Gia công Cơ khí</h3>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="banner-card">
                            <div className="card-icon">
                              <i className="bi bi-mortarboard"></i>
                            </div>
                            <div className="card-category">Phòng ban</div>
                            <h3 className="card-title">Trung tâm Đào tạo</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Mobile Layout - 6 slides with 1 card each */}
                {isMobile && (
                  <>
                    <div className="card-slide mobile-slide">
                      <div className="banner-card">
                        <div className="card-icon">
                          <i className="bi bi-gear-fill"></i>
                        </div>
                        <div className="card-category">Phòng ban</div>
                        <h3 className="card-title">Trung tâm Chế tạo Khuôn mẫu</h3>
                      </div>
                    </div>
                    <div className="card-slide mobile-slide">
                      <div className="banner-card">
                        <div className="card-icon">
                          <i className="bi bi-building"></i>
                        </div>
                        <div className="card-category">Đơn vị trực thuộc</div>
                        <h3 className="card-title">Công ty TNHH MTV Cơ khí Mê Linh</h3>
                      </div>
                    </div>
                    <div className="card-slide mobile-slide">
                      <div className="banner-card">
                        <div className="card-icon">
                          <i className="bi bi-layers-fill"></i>
                        </div>
                        <div className="card-category">Phòng ban</div>
                        <h3 className="card-title">Trung tâm Thử nghiệm Vật liệu</h3>
                      </div>
                    </div>
                    <div className="card-slide mobile-slide">
                      <div className="banner-card">
                        <div className="card-icon">
                          <i className="bi bi-cpu"></i>
                        </div>
                        <div className="card-category">Phòng ban</div>
                        <h3 className="card-title">Trung tâm Nhiệt luyện</h3>
                      </div>
                    </div>
                    <div className="card-slide mobile-slide">
                      <div className="banner-card">
                        <div className="card-icon">
                          <i className="bi bi-tools"></i>
                        </div>
                        <div className="card-category">Phòng ban</div>
                        <h3 className="card-title">Trung tâm Gia công Cơ khí</h3>
                      </div>
                    </div>
                    <div className="card-slide mobile-slide">
                      <div className="banner-card">
                        <div className="card-icon">
                          <i className="bi bi-mortarboard"></i>
                        </div>
                        <div className="card-category">Phòng ban</div>
                        <h3 className="card-title">Trung tâm Đào tạo</h3>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Cards Navigation Controls */}
            <div className="cards-nav-prev" onClick={goToPrevious}>
              <i className="bi bi-chevron-left"></i>
            </div>
            <div className="cards-nav-next" onClick={goToNext}>
              <i className="bi bi-chevron-right"></i>
            </div>
            
            {/* Cards Indicators */}
            <div className="cards-pagination">
              {Array.from({ length: totalSlides }, (_, index) => (
                <span
                  key={index}
                  className={`cards-pagination-bullet ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
