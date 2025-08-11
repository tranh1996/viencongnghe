import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="site-header" className="header">
      {/* Header Top */}
      <div className="header-top">
        <Container fluid>
          <div className="row align-items-center">
            <div className="col-lg-4 col-md-6 d-flex align-items-center">
              <h6 className="mb-0">{t('header.freeConsultation')}</h6>
              <div className="header-number ms-4">
                <i className="bi bi-telephone-fill"></i>
                <a href="tel:+842437763322">+84 243 776 3322</a>
              </div>
            </div>
            <div className="col-lg-8 col-md-6 d-flex align-items-center justify-content-end">
              <div className="topbar-link">
                <ul className="list-inline">
                  <li>
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>{t('header.mainOffice')}</span>
                  </li>
                  <li>
                    <i className="bi bi-envelope-fill"></i>
                    <a href="mailto:viencongnghe@ritm.vn">viencongnghe@ritm.vn</a>
                  </li>
                  <li>
                    <i className="bi bi-clock-fill"></i>
                    <span>{t('header.workingHours')}</span>
                  </li>
                </ul>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <div id="header-wrap" className={isScrolled ? 'fixed-header' : ''}>
        <Container fluid>
          <div className="row">
            <div className="col">
              <Navbar expand="xl" className="navbar">
                <Navbar.Brand as={Link} to="/" className="logo">
                  <img 
                    className="img-fluid" 
                    src="/images/logo.svg" 
                    alt="Viện Công nghệ" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/logo.png';
                    }}
                  />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarNav" className="ht-toggler">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"></path>
                    <path className="line line2" d="M 20,50 H 80"></path>
                    <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"></path>
                  </svg>
                </Navbar.Toggle>

                <Navbar.Collapse id="navbarNav">
                  <Nav className="navbar-nav">
                    <Nav.Link 
                      as={Link} 
                      to="/"
                      className={location.pathname === '/' ? 'active' : ''}
                    >
                      {t('nav.home')}
                    </Nav.Link>

                    <NavDropdown 
                      title={t('nav.about')} 
                      id="about-dropdown"
                      className={location.pathname === '/about' ? 'active' : ''}
                    >
                      <NavDropdown.Item as={Link} to="/about">{t('nav.about.overview')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/about#resources">{t('nav.about.resources')}</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown 
                      title={t('nav.organization')} 
                      id="organization-dropdown"
                    >
                      <NavDropdown.Item as={Link} to="/organization">{t('nav.organization.overview')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#admin">{t('nav.organization.admin')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#accounting">{t('nav.organization.accounting')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#testing">{t('nav.organization.testing')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#technology">{t('nav.organization.technology')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#quality">{t('nav.organization.quality')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#mold">{t('nav.organization.mold')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#research">{t('nav.organization.research')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organization#company">{t('nav.organization.company')}</NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link 
                      as={Link} 
                      to="/products"
                      className={location.pathname === '/products' ? 'active' : ''}
                    >
                      {t('nav.products')}
                    </Nav.Link>

                    <NavDropdown 
                      title={t('nav.news')} 
                      id="news-dropdown"
                      className={location.pathname === '/blog' ? 'active' : ''}
                    >
                      <NavDropdown.Item as={Link} to="/blog">{t('nav.news.activities')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/blog#science">{t('nav.news.science')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/blog#professional">{t('nav.news.professional')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/blog#training">{t('nav.news.training')}</NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link 
                      as={Link} 
                      to="/library"
                      className={location.pathname === '/library' ? 'active' : ''}
                    >
                      {t('nav.library')}
                    </Nav.Link>

                    <Nav.Link 
                      as={Link} 
                      to="/contact"
                      className={location.pathname === '/contact' ? 'active' : ''}
                    >
                      {t('nav.contact')}
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>

                <div className="header-right d-flex align-items-center justify-content-end">
                  <div className="search-icon">
                    <a id="search" href="javascript:void(0)">
                      <i className="bi bi-search"></i>
                    </a>
                  </div>
                  <div className="social-icons mx-4">
                    <ul className="list-inline">
                      <li>
                        <a href="#">
                          <i className="bi bi-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="bi bi-youtube"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="bi bi-linkedin"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <Link className="themeht-btn primary-btn" to="/contact">
                    {t('header.contactNow')}
                  </Link>
                </div>
              </Navbar>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header; 