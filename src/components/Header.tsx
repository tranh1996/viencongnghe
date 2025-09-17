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
    if (typeof window !== 'undefined' && window.innerWidth > 991) {
      setHoveredDropdown(dropdownId);
    }
  };

  const handleDropdownLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 991) {
      setHoveredDropdown(null);
    }
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
      if (typeof window !== 'undefined' && window.innerWidth <= 991) {
        setHoveredDropdown(null);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
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
      {/* Top Row - Logo, Search, Language Switcher */}
      <div className="header-top-row py-3">
        <Container>
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* Logo */}
              <Link href="/" className="logo">
                <img
                  className="img-fluid"
                  src="/images/logo.svg"
                  alt="Viện Công nghệ"
                  style={{ maxHeight: '60px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/logo.png';
                  }}
                />
              </Link>
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-end gap-3">
              {/* Search Bar */}
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm từ khóa"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }
                  }}
                />
                <button 
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
              
              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>
        </Container>
      </div>

      {/* HR Divider */}
      <Container fluid>
        <hr className="m-0" style={{ borderColor: '#6c757d' }} />
      </Container>

      {/* Bottom Row - Navigation Menu and Contact Icons */}
      <div id="header-wrap" className={`header-nav-row ${isScrolled ? 'fixed-header' : ''}`}>
        <Container>
          <div className="row align-items-center">
            <div className="col-12">
              <Navbar expand="xl" className="navbar-menu" expanded={expanded} onToggle={setExpanded}>
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
                  <div className="mobile-search d-lg-none mb-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button 
                        className="btn btn-primary" 
                        type="button"
                        onClick={() => {
                          if (searchQuery.trim()) {
                            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                            setExpanded(false);
                          }
                        }}
                      >
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
                      show={typeof window !== 'undefined' && window.innerWidth <= 991 ? undefined : hoveredDropdown === 'about'}
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
                      show={typeof window !== 'undefined' && window.innerWidth <= 991 ? undefined : hoveredDropdown === 'organization'}
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
                      show={typeof window !== 'undefined' && window.innerWidth <= 991 ? undefined : hoveredDropdown === 'news'}
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

                  {/* Mobile Language Switcher and Contact Icons */}
                  <div className="mobile-footer d-lg-none mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <LanguageSwitcher />
                      <div className="contact-icons">
                        <a href="tel:+842437763322" className="me-3">
                          <i className="bi bi-telephone-fill"></i>
                        </a>
                        <a href="mailto:viencongnghe@ritm.vn">
                          <i className="bi bi-envelope-fill"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </Navbar.Collapse>

                {/* Desktop Contact Icons */}
                <div className="header-contact d-flex align-items-center">
                  <a href="mailto:viencongnghe@ritm.vn" className="contact-icon me-3">
                    <i className="bi bi-envelope-fill"></i>
                  </a>
                  <a href="tel:+842437763322" className="contact-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </a>
                </div>
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