import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface BannerSlide {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
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
  const { t } = useLanguage();

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

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="swiper banner-swiper banner-slider">
      <div className="swiper-wrapper">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`swiper-slide ${index === currentSlide ? 'swiper-slide-active' : ''}`}
          >
            <div 
              className="slider-img" 
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
            <div className="banner-content">
              <div className="banner-text">
                {slide.subtitle && (
                  <h6>{slide.subtitle}</h6>
                )}
                {slide.title && (
                  <h1 
                    className="mb-5"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />
                )}
                {slide.description && (
                  <p>{slide.description}</p>
                )}
                <div className="btn-box mt-5">
                  {slide.primaryButton && (
                    <Link to={slide.primaryButton.link} className="themeht-btn primary-btn">
                      {slide.primaryButton.text}
                    </Link>
                  )}
                  {slide.secondaryButton && (
                    <Link to={slide.secondaryButton.link} className="themeht-btn dark-btn">
                      {slide.secondaryButton.text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Controls */}
      {showControls && slides.length > 1 && (
        <>
          <div 
            id="banner-swiper-button-next" 
            className="swiper-button-next"
            onClick={goToNext}
          >
            <i className="bi bi-chevron-right"></i>
          </div>
          <div 
            id="banner-swiper-button-prev" 
            className="swiper-button-prev"
            onClick={goToPrevious}
          >
            <i className="bi bi-chevron-left"></i>
          </div>
        </>
      )}

      {/* Indicators */}
      {showIndicators && slides.length > 1 && (
        <div id="banner-pagination" className="swiper-pagination">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`swiper-pagination-bullet ${index === currentSlide ? 'swiper-pagination-bullet-active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
