'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAboutOverview, fetchAboutVision, fetchOrganization } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function VisionMissionPage() {
  const { t, language } = useLanguage();
  const [overview, setOverview] = useState<any>(null);
  const [vision, setVision] = useState<any>(null);
  const [organization, setOrganization] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewData, visionData, organizationData] = await Promise.all([
          fetchAboutOverview(language, controller.signal),
          fetchAboutVision(language, controller.signal),
          fetchOrganization(language, controller.signal)
        ]);

        if (isMounted) {
          setOverview(overviewData);
          setVision(visionData);
          setOrganization(organizationData);
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

  return (
    <>
      {/* Page Title */}
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>{t('visionMission.pageTitle')}</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">{t('visionMission.breadcrumb.home')}</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/about">{t('visionMission.breadcrumb.about')}</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {t('visionMission.breadcrumb.visionMission')}
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Overview Section */}
      {overview && (
        <section>
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                {overview.images && overview.images.length > 0 && (
                  <div className="overview-image-slider">
                    <div id="overviewCarousel" className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-indicators">
                        {overview.images.map((_: string, index: number) => (
                          <button
                            key={index}
                            type="button"
                            data-bs-target="#overviewCarousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : "false"}
                            aria-label={`Slide ${index + 1}`}
                          ></button>
                        ))}
                      </div>
                      <div className="carousel-inner">
                        {overview.images.map((image: string, index: number) => (
                          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <OptimizedImage 
                              src={image} 
                              alt={`${overview.title} - Image ${index + 1}`}
                              context="Vision Mission page - Overview slider"
                              className="about-img-shape"
                              style={{ backgroundImage: `url(${image})` }}
                            />
                          </div>
                        ))}
                      </div>
                      {overview.images.length > 1 && (
                        <>
                          <button className="carousel-control-prev" type="button" data-bs-target="#overviewCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button className="carousel-control-next" type="button" data-bs-target="#overviewCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Col>
              <Col lg={6}>
                <div className="ps-lg-5">
                  <h6 className="text-theme mb-3">{t('visionMission.overview.title')}</h6>
                  <h2 className="mb-4">{overview.title}</h2>
                  <p className="mb-4">{overview.description}</p>
                  
                  {/* Video Section */}
                  {overview.videos && overview.videos.length > 0 && (
                    <div className="mt-4">
                      <h5 className="mb-3">{t('home.about.videos')}</h5>
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={overview.videos[0].url}
                          title={overview.videos[0].title}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

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



      {/* Organization Section */}
      {organization && organization.length > 0 && (
        <section className="light-bg">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="mb-4">{t('visionMission.organization.title')}</h2>
              </Col>
            </Row>
            <Row>
              {organization.map((member, index) => (
                <Col lg={6} md={6} className="mb-4" key={index}>
                  <Card className="h-100">
                    <Card.Body className="text-center">
                      {member.avatar && (
                        <div className="mb-3">
                          <OptimizedImage 
                            src={member.avatar} 
                            alt={member.name}
                            context="Organization member"
                            className="rounded-circle"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <Card.Title>{member.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{member.position}</Card.Subtitle>
                      <Card.Text className="small text-muted mb-2">{member.department}</Card.Text>
                      <Card.Text>{member.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}


    </>
  );
}
