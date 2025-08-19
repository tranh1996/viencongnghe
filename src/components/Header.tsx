'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { fetchDepartments, fetchBlogCategories, Department, NewsCategory } from '../utils/api';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [blogCategories, setBlogCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [blogCategoriesLoading, setBlogCategoriesLoading] = useState(false);
  const pathname = usePathname();
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch departments when language changes
  useEffect(() => {
    let isMounted = true;
    const currentController = new AbortController();
    
    const loadDepartments = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        const departmentsData = await fetchDepartments(language, currentController.signal);
        if (isMounted) {
          setDepartments(departmentsData);
        }
      } catch (error) {
        // Don't log AbortError as it's expected when component unmounts or language changes
        if (error instanceof Error && error.name === 'AbortError') {
          // This is expected behavior, no need to log or handle as error
          return;
        }
        
        if (isMounted) {
          console.error('Failed to load departments:', error);
          // Fallback to empty array if API fails
          setDepartments([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDepartments();

    return () => {
      isMounted = false;
      currentController.abort();
    };
  }, [language]);

  // Fetch blog categories when language changes
  useEffect(() => {
    let isMounted = true;
    const currentController = new AbortController();
    
    const loadBlogCategories = async () => {
      if (!isMounted) return;
      
      setBlogCategoriesLoading(true);
      try {
        const categoriesData = await fetchBlogCategories(language, currentController.signal);
        if (isMounted) {
          setBlogCategories(categoriesData);
        }
      } catch (error) {
        // Don't log AbortError as it's expected when component unmounts or language changes
        if (error instanceof Error && error.name === 'AbortError') {
          // This is expected behavior, no need to log or handle as error
          return;
        }
        
        if (isMounted) {
          console.error('Failed to load blog categories:', error);
          // Fallback to empty array if API fails
          setBlogCategories([]);
        }
      } finally {
        if (isMounted) {
          setBlogCategoriesLoading(false);
        }
      }
    };

    loadBlogCategories();

    return () => {
      isMounted = false;
      currentController.abort();
    };
  }, [language]);

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
          {/* Logo and Header Elements Row */}
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-6">
              <Navbar.Brand as={Link} href="/" className="logo">
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
            </div>
            <div className="col-lg-9 col-md-6">
              <div className="header-right d-flex align-items-center justify-content-end">
                {/* Desktop Search Icon */}
                <div className="search-icon d-none d-lg-block">
                  <button 
                    id="search" 
                    className="btn btn-link p-0 border-0 bg-transparent"
                    onClick={() => {
                      // TODO: Implement search functionality
                      console.log('Search clicked');
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>
                <div className="social-icons mx-4 d-none d-lg-flex">
                  <ul className="list-inline">
                    <li>
                      <button 
                        className="btn btn-link p-0 border-0 bg-transparent social-icon-btn"
                        onClick={() => {
                          // TODO: Add Facebook URL when available
                          console.log('Facebook clicked');
                        }}
                      >
                        <i className="bi bi-facebook"></i>
                      </button>
                    </li>
                    <li>
                      <button 
                        className="btn btn-link p-0 border-0 bg-transparent social-icon-btn"
                        onClick={() => {
                          // TODO: Add YouTube URL when available
                          console.log('YouTube clicked');
                        }}
                      >
                        <i className="bi bi-youtube"></i>
                      </button>
                    </li>
                    <li>
                      <button 
                        className="btn btn-link p-0 border-0 bg-transparent social-icon-btn"
                        onClick={() => {
                          // TODO: Add LinkedIn URL when available
                          console.log('LinkedIn clicked');
                        }}
                      >
                        <i className="bi bi-linkedin"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu Row */}
          <div className="row">
            <div className="col-12">
              <Navbar expand="xl" className="navbar-menu">
                <Navbar.Toggle aria-controls="navbarNav" className="ht-toggler">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <path className="line line1"
                          d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"></path>
                    <path className="line line2" d="M 20,50 H 80"></path>
                    <path className="line line3"
                          d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"></path>
                  </svg>
                </Navbar.Toggle>

                <Navbar.Collapse id="navbarNav">
                  {/* Mobile Search Bar */}
                  <div className="mobile-search d-lg-none">
                    <div className="search-container">
                      <input
                          type="text"
                          placeholder="Tìm kiếm..."
                          className="search-input"
                      />
                      <button className="search-btn">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>

                  <Nav className="navbar-nav">
                    <Nav.Link
                        as={Link}
                      href="/"
                      className={pathname === '/' ? 'active' : ''}
                    >
                      {t('nav.home')}
                    </Nav.Link>

                    <NavDropdown 
                      title={t('nav.about')} 
                      id="about-dropdown"
                      className={pathname === '/about' ? 'active' : ''}
                    >
                      <NavDropdown.Item as={Link} href="/about">{t('nav.about.general')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} href="/about/vision-mission">{t('nav.about.visionMission')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} href="/about/history">{t('nav.about.history')}</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown 
                      title={t('nav.organization')} 
                      id="organization-dropdown"
                    >
                      {loading ? (
                        <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                      ) : departments.length > 0 ? (
                        <>
                          {departments.map((department) => (
                            <NavDropdown.Item 
                              key={department.id} 
                              as={Link} 
                              href={`/organization/${department.slug}`}
                            >
                              {department.name}
                            </NavDropdown.Item>
                          ))}
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} href="/organization">
                            {t('organization.viewAllDepartments')}
                          </NavDropdown.Item>
                        </>
                      ) : (
                        // Fallback to static menu items if API fails
                        <>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.admin')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.accounting')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.testing')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.technology')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.quality')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.mold')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.research')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization">{t('nav.organization.company')}</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} href="/organization">
                            {t('organization.viewAllDepartments')}
                          </NavDropdown.Item>
                        </>
                      )}
                    </NavDropdown>

                    <Nav.Link 
                      as={Link} 
                      href="/products"
                      className={pathname === '/products' ? 'active' : ''}
                    >
                      {t('nav.products')}
                    </Nav.Link>

                    <NavDropdown 
                      title={t('nav.news')} 
                      id="news-dropdown"
                      className={pathname === '/blog' ? 'active' : ''}
                    >
                      {blogCategoriesLoading ? (
                        <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                      ) : blogCategories.length > 0 ? (
                        <>
                          {blogCategories
                            .filter(category => category.is_active)
                            .sort((a, b) => a.display_menu_priority - b.display_menu_priority)
                            .map((category) => (
                              <NavDropdown.Item 
                                key={category.id} 
                                as={Link} 
                                href={`/blog?category=${category.slug}`}
                              >
                                {category.name}
                              </NavDropdown.Item>
                            ))}
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} href="/blog">
                            {t('nav.news.viewAll')}
                          </NavDropdown.Item>
                        </>
                      ) : (
                        // Fallback to static menu items if API fails
                        <>
                          <NavDropdown.Item as={Link} href="/blog">{t('nav.news.activities')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/blog#science">{t('nav.news.science')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/blog#professional">{t('nav.news.professional')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/blog#training">{t('nav.news.training')}</NavDropdown.Item>
                        </>
                      )}
                    </NavDropdown>

                    <Nav.Link 
                      as={Link} 
                      href="/library"
                      className={pathname === '/library' ? 'active' : ''}
                    >
                      {t('nav.library')}
                    </Nav.Link>

                    <Nav.Link 
                      as={Link} 
                      href="/contact"
                      className={pathname === '/contact' ? 'active' : ''}
                    >
                      {t('nav.contact')}
                    </Nav.Link>
                  </Nav>

                  {/* Mobile Social Icons */}
                  <div className="mobile-social d-lg-none">
                    <div className="social-icons">
                      <ul className="list-inline">
                        <li>
                          <button 
                            className="btn btn-link p-0 border-0 bg-transparent social-icon-btn"
                            onClick={() => {
                              // TODO: Add Facebook URL when available
                              console.log('Facebook clicked');
                            }}
                          >
                            <i className="bi bi-facebook"></i>
                          </button>
                        </li>
                        <li>
                          <button 
                            className="btn btn-link p-0 border-0 bg-transparent social-icon-btn"
                            onClick={() => {
                              // TODO: Add YouTube URL when available
                              console.log('YouTube clicked');
                            }}
                          >
                            <i className="bi bi-youtube"></i>
                          </button>
                        </li>
                        <li>
                          <button 
                            className="btn btn-link p-0 border-0 bg-transparent social-icon-btn"
                            onClick={() => {
                              // TODO: Add LinkedIn URL when available
                              console.log('LinkedIn clicked');
                            }}
                          >
                            <i className="bi bi-linkedin"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Navbar.Collapse>
              </Navbar>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header; 