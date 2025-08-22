'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { fetchDepartments, fetchBlogCategories, Department, NewsCategory } from '@/utils/api';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [blogCategories, setBlogCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [blogCategoriesLoading, setBlogCategoriesLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();

  // Helper function to check if a menu item should be active
  const isActiveRoute = (route: string | string[], exact = false) => {
    if (typeof route === 'string') {
      if (exact) {
        return pathname === route;
      }
      // Handle special cases for dynamic routes
      if (route === '/blog' && (pathname.startsWith('/blog') || pathname.startsWith('/news'))) {
        return true;
      }
      if (route === '/products' && pathname.match(/^\/products(\/.*)?$/)) {
        return true;
      }
      if (route === '/organization' && pathname.match(/^\/organization(\/.*)?$/)) {
        return true;
      }
      return pathname.startsWith(route);
    }
    return route.some(r => exact ? pathname === r : pathname.startsWith(r));
  };

  const handleMenuItemClick = () => {
    setExpanded(false);
  };

  const handleDropdownEnter = (dropdownId: string) => {
    // Only show on hover for desktop (screen width > 991px)
    if (window.innerWidth > 991) {
      setHoveredDropdown(dropdownId);
    }
  };

  const handleDropdownLeave = () => {
    if (window.innerWidth > 991) {
      setHoveredDropdown(null);
    }
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSearchOverlay(true);
  };

  const handleCloseSearch = () => {
    setShowSearchOverlay(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      handleCloseSearch();
    }
  };

  // Close search overlay when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseSearch();
      }
    };

    if (showSearchOverlay) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showSearchOverlay]);

  // Reset hover state on window resize to handle desktop/mobile switching
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 991) {
        setHoveredDropdown(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          {/* Single Row with Logo, Navigation, and Search */}
          <div className="row align-items-center">
            <div className="col-12">
              <Navbar expand="xl" className="navbar-menu" expanded={expanded} onToggle={setExpanded}>
                {/* Logo */}
                <Navbar.Brand as={Link} href="/" className="logo">
                  <img 
                    className="img-fluid" 
                    src="/images/logo.png"
                    alt="Viện Công nghệ" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/logo.png';
                    }}
                  />
                </Navbar.Brand>
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

                  <Nav className="navbar-nav me-auto">
                    <Nav.Link
                        as={Link}
                      href="/"
                      className={isActiveRoute('/', true) ? 'active' : ''}
                      onClick={handleMenuItemClick}
                    >
                      {t('nav.home')}
                    </Nav.Link>

                    <NavDropdown 
                      title={t('nav.about')} 
                      id="about-dropdown"
                      className={isActiveRoute('/about') ? 'active' : ''}
                      show={hoveredDropdown === 'about'}
                      onMouseEnter={() => handleDropdownEnter('about')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <NavDropdown.Item as={Link} href="/about" onClick={handleMenuItemClick}>{t('nav.about.general')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} href="/about/vision-mission" onClick={handleMenuItemClick}>{t('nav.about.visionMission')}</NavDropdown.Item>
                      <NavDropdown.Item as={Link} href="/about/history" onClick={handleMenuItemClick}>{t('nav.about.history')}</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown 
                      title={t('nav.organization')} 
                      id="organization-dropdown"
                      className={isActiveRoute('/organization') ? 'active' : ''}
                      show={hoveredDropdown === 'organization'}
                      onMouseEnter={() => handleDropdownEnter('organization')}
                      onMouseLeave={handleDropdownLeave}
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
                              onClick={handleMenuItemClick}
                            >
                              {department.name}
                            </NavDropdown.Item>
                          ))}
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>
                            {t('organization.viewAllDepartments')}
                          </NavDropdown.Item>
                        </>
                      ) : (
                        // Fallback to static menu items if API fails
                        <>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.admin')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.accounting')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.testing')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.technology')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.quality')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.mold')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.research')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>{t('nav.organization.company')}</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} href="/organization" onClick={handleMenuItemClick}>
                            {t('organization.viewAllDepartments')}
                          </NavDropdown.Item>
                        </>
                      )}
                    </NavDropdown>

                    <Nav.Link 
                      as={Link} 
                      href="/products"
                      className={isActiveRoute('/products') ? 'active' : ''}
                      onClick={handleMenuItemClick}
                    >
                      {t('nav.products')}
                    </Nav.Link>

                    <NavDropdown 
                      title={t('nav.news')} 
                      id="news-dropdown"
                      className={isActiveRoute('/blog') ? 'active' : ''}
                      show={hoveredDropdown === 'news'}
                      onMouseEnter={() => handleDropdownEnter('news')}
                      onMouseLeave={handleDropdownLeave}
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
                                onClick={handleMenuItemClick}
                              >
                                {category.name}
                              </NavDropdown.Item>
                            ))}
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} href="/blog" onClick={handleMenuItemClick}>
                            {t('nav.news.viewAll')}
                          </NavDropdown.Item>
                        </>
                      ) : (
                        // Fallback to static menu items if API fails
                        <>
                          <NavDropdown.Item as={Link} href="/blog" onClick={handleMenuItemClick}>{t('nav.news.activities')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/blog#science" onClick={handleMenuItemClick}>{t('nav.news.science')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/blog#professional" onClick={handleMenuItemClick}>{t('nav.news.professional')}</NavDropdown.Item>
                          <NavDropdown.Item as={Link} href="/blog#training" onClick={handleMenuItemClick}>{t('nav.news.training')}</NavDropdown.Item>
                        </>
                      )}
                    </NavDropdown>

                    <Nav.Link 
                      as={Link} 
                      href="/library"
                      className={isActiveRoute('/library') ? 'active' : ''}
                      onClick={handleMenuItemClick}
                    >
                      {t('nav.library')}
                    </Nav.Link>

                    <Nav.Link 
                      as={Link} 
                      href="/contact"
                      className={isActiveRoute('/contact') ? 'active' : ''}
                      onClick={handleMenuItemClick}
                    >
                      {t('nav.contact')}
                    </Nav.Link>
                  </Nav>

                  {/* Desktop Search and Social Icons */}
                  <div className="d-flex align-items-center d-none d-lg-flex">
                    {/* Search Icon */}
                    <div className="search-icon me-3">
                      <a 
                        id="search" 
                        href="#"
                        onClick={handleSearchClick}
                      >
                        <i className="bi bi-search"></i>
                      </a>
                    </div>
                    
                    {/* Social Icons */}
                    <div className="social-icons">
                      <ul className="list-inline mb-0">
                        <li>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add Facebook URL when available
                              console.log('Facebook clicked');
                            }}
                          >
                            <i className="flaticon flaticon-facebook"></i>
                          </a>
                        </li>
                        <li>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add YouTube URL when available
                              console.log('YouTube clicked');
                            }}
                          >
                            <i className="flaticon flaticon-youtube"></i>
                          </a>
                        </li>
                        <li>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add LinkedIn URL when available
                              console.log('LinkedIn clicked');
                            }}
                          >
                            <i className="flaticon flaticon-linkedin"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Mobile Social Icons */}
                  <div className="mobile-social d-lg-none">
                    <div className="social-icons">
                      <ul className="list-inline">
                        <li>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add Facebook URL when available
                              console.log('Facebook clicked');
                            }}
                          >
                            <i className="flaticon flaticon-facebook"></i>
                          </a>
                        </li>
                        <li>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add YouTube URL when available
                              console.log('YouTube clicked');
                            }}
                          >
                            <i className="flaticon flaticon-youtube"></i>
                          </a>
                        </li>
                        <li>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add LinkedIn URL when available
                              console.log('LinkedIn clicked');
                            }}
                          >
                            <i className="flaticon flaticon-linkedin"></i>
                          </a>
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

      {/* Search Overlay Modal */}
      {showSearchOverlay && (
        <div className="search-input" id="search-input-box">
          <div className="search-inner-box">
            <Container>
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <form 
                    role="search" 
                    id="search-form" 
                    className="search-form d-flex justify-content-between search-inner"
                    onSubmit={handleSearchSubmit}
                  >
                    <label className="w-100">
                      <input 
                        type="search" 
                        className="search-field form-control" 
                        placeholder={t('products.search.placeholder') || 'Search Here'} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </label>
                    <button type="submit" className="search-submit">
                      <i className="bi bi-search"></i>
                    </button>
                    <span 
                      className="bi bi-x close-search" 
                      id="close-search" 
                      title="Close Search"
                      onClick={handleCloseSearch}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  </form>
                </div>
              </div>
            </Container>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 