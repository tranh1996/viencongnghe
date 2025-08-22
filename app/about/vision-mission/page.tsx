'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAboutVision } from '@/utils/api';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function VisionMissionPage() {
  const { t, language } = useLanguage();
  const [vision, setVision] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const visionData = await fetchAboutVision(language, controller.signal);

        if (isMounted) {
          setVision(visionData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading vision-mission data:', err);
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Parse vision content to extract sections
  const parseVisionContent = (content: string, language: string) => {
    const sections: { [key: string]: string } = {};
    
    console.log('Parsing vision content:', { content, language });
    
    // Split by double newlines to get sections
    const parts = content.split('\n\n');
    
    parts.forEach((part, index) => {
      const trimmedPart = part.trim();
      if (trimmedPart) {
        console.log(`Processing part ${index}:`, trimmedPart);
        
        // Check if this part contains section headers for both languages
        if (language === 'vi') {
          // Vietnamese parsing
          if (trimmedPart.includes('TẦM NHÌN:')) {
            const content = trimmedPart.replace(/^.*?TẦM NHÌN:\s*/, '').trim();
            sections.vision = content;
            console.log('Found Vietnamese VISION:', content);
          } else if (trimmedPart.includes('SỨ MỆNH:')) {
            const content = trimmedPart.replace(/^.*?SỨ MỆNH:\s*/, '').trim();
            sections.mission = content;
            console.log('Found Vietnamese MISSION:', content);
          } else if (trimmedPart.includes('GIÁ TRỊ CỐT LÕI:')) {
            const content = trimmedPart.replace(/^.*?GIÁ TRỊ CỐT LÕI:\s*/, '').trim();
            sections.values = content;
            console.log('Found Vietnamese VALUES:', content);
          } else if (index === 0 && !trimmedPart.includes(':')) {
            sections.mainTitle = trimmedPart;
            console.log('Found Vietnamese main title:', trimmedPart);
          }
        } else {
          // English parsing - more robust
          if (trimmedPart.includes('VISION:')) {
            const content = trimmedPart.replace(/^.*?VISION:\s*/, '').trim();
            sections.vision = content;
            console.log('Found English VISION:', content);
          } else if (trimmedPart.includes('MISSION:')) {
            const content = trimmedPart.replace(/^.*?MISSION:\s*/, '').trim();
            sections.mission = content;
            console.log('Found English MISSION:', content);
          } else if (trimmedPart.includes('CORE VALUES:')) {
            const content = trimmedPart.replace(/^.*?CORE VALUES:\s*/, '').trim();
            sections.values = content;
            console.log('Found English VALUES:', content);
          } else if (index === 0 && !trimmedPart.includes(':')) {
            sections.mainTitle = trimmedPart;
            console.log('Found English main title:', trimmedPart);
          }
        }
      }
    });
    
    // If parsing didn't work, try alternative approach for English
    if (language === 'en' && (!sections.vision || !sections.mission || !sections.values)) {
      console.log('Trying alternative parsing for English content');
      
      // Try to extract sections using regex
      const visionMatch = content.match(/VISION:\s*([^]*?)(?=\n\nMISSION:|$)/);
      const missionMatch = content.match(/MISSION:\s*([^]*?)(?=\n\nCORE VALUES:|$)/);
      const valuesMatch = content.match(/CORE VALUES:\s*([^]*?)(?=\n\n|$)/);
      const titleMatch = content.match(/^([^]*?)(?=\n\nVISION:|$)/);
      
      if (visionMatch) {
        sections.vision = visionMatch[1].trim();
        console.log('Found VISION via regex:', sections.vision);
      }
      if (missionMatch) {
        sections.mission = missionMatch[1].trim();
        console.log('Found MISSION via regex:', sections.mission);
      }
      if (valuesMatch) {
        sections.values = valuesMatch[1].trim();
        console.log('Found VALUES via regex:', sections.values);
      }
      if (titleMatch && !titleMatch[1].includes(':')) {
        sections.mainTitle = titleMatch[1].trim();
        console.log('Found main title via regex:', sections.mainTitle);
      }
    }
    
    console.log('Final parsed sections:', sections);
    return sections;
  };

  const visionSections = vision ? parseVisionContent(vision.content, language) : {};

  // Debug logging
  console.log('Vision data from API:', vision);
  console.log('Language:', language);
  console.log('Parsed vision sections:', visionSections);

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Giới thiệu', en: 'About' },
      href: '/about'
    },
    {
      label: { vi: 'Tầm nhìn - Sứ mệnh', en: 'Vision - Mission' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Tầm nhìn - Sứ mệnh', en: 'Vision - Mission' }}
        items={breadcrumbItems}
      />

      {/* Vision & Mission Section */}
      {vision && (
        <section className="light-bg">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="mb-4">{t('visionMission.title')}</h2>
                <p className="lead mb-5">{visionSections.mainTitle || t('visionMission.mainTitle')}</p>
              </Col>
            </Row>
            <Row>
              <Col lg={4} className="mb-4">
                <div className="vision-column">
                  <div className="vision-card">
                    <div className="vision-icon">
                      <i className="bi bi-eye-fill"></i>
                    </div>
                    <h3 className="vision-title">{t('visionMission.vision.title')}</h3>
                    <div className="vision-content">
                      <p>{visionSections.vision || t('visionMission.vision.contentNotAvailable')}</p>
                      {!visionSections.vision && vision && (
                        <div className="mt-3">
                          <small className="text-muted">Raw content: {vision.content}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={4} className="mb-4">
                <div className="mission-column">
                  <div className="mission-card">
                    <div className="mission-icon">
                      <i className="bi bi-bullseye"></i>
                    </div>
                    <h3 className="mission-title">{t('visionMission.mission.title')}</h3>
                    <div className="mission-content">
                      <p>{visionSections.mission || t('visionMission.mission.contentNotAvailable')}</p>
                      {!visionSections.mission && vision && (
                        <div className="mt-3">
                          <small className="text-muted">Raw content: {vision.content}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={4} className="mb-4">
                <div className="values-column">
                  <div className="values-card">
                    <div className="values-icon">
                      <i className="bi bi-heart-fill"></i>
                    </div>
                    <h3 className="values-title">{t('visionMission.values.title')}</h3>
                    <div className="values-content">
                      <p>{visionSections.values || t('visionMission.values.contentNotAvailable')}</p>
                      {!visionSections.values && vision && (
                        <div className="mt-3">
                          <small className="text-muted">Raw content: {vision.content}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Summary Section */}
      <section>
        <Container>
          <Row className="text-center">
            <Col>
              <div className="p-5">
                <h3 className="mb-4">{t('visionMission.summary.title')}</h3>
                <p className="lead">
                  {t('visionMission.summary.description')}
                </p>
                <div className="mt-4">
                  <a href="/about" className="btn btn-primary me-3">
                    {t('visionMission.summary.aboutButton')}
                  </a>
                  <a href="/about/history" className="btn btn-outline-primary">
                    {t('visionMission.summary.historyButton')}
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
