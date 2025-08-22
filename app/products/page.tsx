'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { fetchProducts, fetchProductCategories, searchProducts, Product, ProductCategory } from '../../src/utils/api';
import { useLanguage } from '../../src/contexts/LanguageContext';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortOption, setSortOption] = useState<string>('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    from: 0,
    to: 0,
    itemsPerPage: 20
  });
  
  // Search functionality states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Group suggestions by category
  const groupedSuggestions = searchSuggestions.reduce((acc, product) => {
    const categoryName = product.product_category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Flatten suggestions for keyboard navigation
  const flattenedSuggestions = searchSuggestions;
  
  // Popular search terms
  const popularSearchTerms = React.useMemo(() => [
    t('products.popular.juicer'),
    t('products.popular.tea'),
    t('products.popular.household'),
    t('products.popular.medical'),
    t('products.popular.technology'),
    t('products.popular.research')
  ], [t]);

  useEffect(() => {
    // Get URL parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || null;
    const sort = searchParams.get('sort') || 'default';
    const search = searchParams.get('search') || '';

    setSelectedCategory(category);
    setSortOrder(sort);
    setSearchQuery(search);
    setPagination(prev => ({ ...prev, currentPage: page, itemsPerPage: limit }));

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesData] = await Promise.all([
          fetchProducts(language, page, limit, category),
          fetchProductCategories(language)
        ]);
        
        setProducts(productsResponse.products);
        setCategories(categoriesData);
        
        // Update pagination info from API response
        if (productsResponse.pagination) {
          setPagination({
            currentPage: productsResponse.pagination.current_page,
            totalPages: productsResponse.pagination.last_page,
            total: productsResponse.pagination.total,
            from: productsResponse.pagination.from,
            to: productsResponse.pagination.to,
            itemsPerPage: productsResponse.pagination.per_page
          });
        }
        
        // If there's a search parameter, perform the search
        if (search.trim()) {
          try {
            const searchResults = await searchProducts(search, language);
            setSearchResults(searchResults);
            setIsSearchSubmitted(true);
          } catch (error) {
            console.error('Error performing initial search:', error);
            setSearchResults([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('products.results.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, language, t]);

  // Function to update URL parameters
  const updateURL = (params: { page?: number; category?: string | null; sort?: string }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    if (params.page !== undefined) {
      newSearchParams.set('page', params.page.toString());
    }
    if (params.category !== undefined) {
      if (params.category) {
        newSearchParams.set('category', params.category);
      } else {
        newSearchParams.delete('category');
      }
    }
    if (params.sort !== undefined) {
      newSearchParams.set('sort', params.sort);
    }
    
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // Handle category selection
  const handleCategorySelect = (categorySlug: string | null) => {
    updateURL({ category: categorySlug, page: 1 }); // Reset to page 1 when changing category
  };

  // Handle sorting
  const handleSortChange = (sort: string) => {
    updateURL({ sort, page: 1 }); // Reset to page 1 when changing sort
  };

  // Search functionality
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedSuggestionIndex(-1); // Reset selection when typing
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim().length >= 2) {
      // Debounce search requests
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          const suggestions = await searchProducts(query, language);
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
          setSearchSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [language]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setIsSearching(true);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        setIsSearchSubmitted(true);
        
        // Perform the actual search
        const results = await searchProducts(searchQuery, language);
        setSearchResults(results);
        
        // Update URL with search parameter
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('search', searchQuery);
        newSearchParams.set('page', '1');
        router.push(`${pathname}?${newSearchParams.toString()}`);
        
      } catch (error) {
        console.error('Error performing search:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSuggestionClick = async (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    try {
      setIsSearching(true);
      setIsSearchSubmitted(true);
      
                             // Perform search with the selected product name
         const results = await searchProducts(product.name, language);
      setSearchResults(results);
      
      // Update URL with search parameter
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('search', product.name);
      newSearchParams.set('page', '1');
      router.push(`${pathname}?${newSearchParams.toString()}`);
      
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) {
          handleSuggestionClick(searchSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearchSubmit(e as any);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchInputRef.current && 
      !searchInputRef.current.contains(event.target as Node) &&
      suggestionsRef.current && 
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchSubmitted(false);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    // Remove search parameter from URL
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('search');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Determine which products to display
  let displayProducts: Product[] = [];
  
  if (isSearchSubmitted && searchResults.length > 0) {
    // Show search results
    displayProducts = searchResults;
  } else {
    // Show products from API (already filtered by category if selected)
    displayProducts = products;
  }

  // Apply sorting
  const sortedProducts = [...displayProducts].sort((a, b) => {
    switch (sortOrder) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-theme" role="status">
          <span className="visually-hidden">{t('products.results.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">{error}</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Sản phẩm', en: 'Products' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Sản phẩm', en: 'Products' }}
        items={breadcrumbItems}
      />
      
      <section>
        <Container>
          {/* Filter/Sort Toolbar */}
          <Row className="mb-5">
            <Col>
              <div className="border border-light rounded p-3">
                <Row className="align-items-center">
                  <Col md={5} className="mb-3 mb-md-0">
                    <span>
                      {t('products.results.showing')} {pagination.from} {t('products.results.to')} {pagination.to} {t('products.results.of')} {pagination.total} {t('products.results.total')}
                    </span>
                  </Col>
                  <Col md={7} className="d-flex align-items-center justify-content-md-end">
                    <div className="view-filter me-3">
                      <button 
                        className={`align-middle me-2 ${viewMode === 'grid' ? 'text-theme' : 'text-black'}`}
                        onClick={() => setViewMode('grid')}
                        style={{ background: 'none', border: 'none' }}
                      >
                        <i className="fs-3 bi bi-grid-3x2"></i>
                      </button>
                      <button 
                        className={`align-middle ${viewMode === 'list' ? 'text-theme' : 'text-black'}`}
                        onClick={() => setViewMode('list')}
                        style={{ background: 'none', border: 'none' }}
                      >
                        <i className="fs-3 bi bi-card-list"></i>
                      </button>
                    </div>
                    <div className="sort-filter ms-3 d-flex align-items-center">
                      <select 
                        className="form-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="">{t('products.sort.sortBy')}</option>
                        <option value="newest">{t('products.sort.newest')}</option>
                        <option value="popular">{t('products.sort.popular')}</option>
                        <option value="name">{t('products.sort.name')}</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col lg={9} md={12} className="order-lg-1">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="spinner-border text-theme" role="status">
                    <span className="visually-hidden">{t('products.results.loading')}</span>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="text-center">
                    <i className="bi bi-search display-1 text-muted mb-3"></i>
                    <h4 className="text-muted">{t('products.results.noProducts')}</h4>
                    <p className="text-muted">{t('products.results.tryDifferentSearch')}</p>
                  </div>
                </div>
              ) : (
                <>
                  {viewMode === 'list' ? (
                    // List View - Template Style
                    products.map((product) => (
                      <div key={product.id} className="product-item mb-5">
                        <Row className="align-items-center">
                          <Col lg={4} md={5}>
                            <div className="product-img">
                              <OptimizedImage 
                                className="img-fluid" 
                                src={product.primary_image || '/images/product/01.jpg'} 
                                alt={product.name}
                                context="product-list-view"
                                width={300}
                                height={250}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  objectFit: 'cover'
                                }}
                                sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
                                priority={false}
                              />
                            </div>
                          </Col>
                          <Col lg={8} md={7}>
                            <div className="product-desc">
                              <Link href={`/products/${product.slug}`} className="product-name">
                                {product.name}
                              </Link>
                              {product.brand && (
                                <span className="product-price d-block mt-2">
                                  {t('products.brand')}: {product.brand}
                                </span>
                              )}
                              <p className="my-3">
                                {product.description && product.description.length > 200 
                                  ? `${product.description.substring(0, 200)}...` 
                                  : product.description || t('products.noDescription')}
                              </p>
                              <div className="product-link mt-3">
                                <Link href={`/products/${product.slug}`} className="add-cart">
                                  <i className="bi bi-eye me-2"></i>{t('products.viewDetails')}
                                </Link>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))
                  ) : (
                    // Grid View - Existing Style
                    <Row>
                      {products.map((product) => (
                        <Col key={product.id} lg={4} md={6} className="mb-4">
                          <div className="card product-card h-100">
                            <div className="position-relative overflow-hidden">
                              <OptimizedImage 
                                src={product.primary_image || '/images/product/01.jpg'} 
                                className="card-img-top product-image" 
                                alt={product.name}
                                context="product-grid-view"
                                width={300}
                                height={200}
                                style={{
                                  width: '100%',
                                  height: '200px',
                                  objectFit: 'cover'
                                }}
                                sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
                                priority={false}
                              />
                            </div>
                            <div className="card-body d-flex flex-column">
                              <h6 className="card-title product-title mb-2">{product.name}</h6>
                              {product.brand && (
                                <p className="text-muted small mb-2">{t('products.brand')}: {product.brand}</p>
                              )}
                              <p className="card-text text-muted small flex-grow-1">
                                {product.description && product.description.length > 100 
                                  ? `${product.description.substring(0, 100)}...` 
                                  : product.description || t('products.noDescription')}
                              </p>
                              <div className="mt-auto">
                                <Link 
                                  href={`/products/${product.slug}`}
                                  className="btn btn-sm btn-outline-primary w-100"
                                >
                                  {t('products.viewDetails')}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <nav aria-label="Page navigation" className="mt-8 text-center">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => updateURL({ page: pagination.currentPage - 1 })}
                            disabled={pagination.currentPage === 1}
                          >
                            <i className="bi bi-arrow-left"></i>
                          </button>
                        </li>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <li key={page} className={`page-item ${page === pagination.currentPage ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => updateURL({ page })}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => updateURL({ page: pagination.currentPage + 1 })}
                            disabled={pagination.currentPage === pagination.totalPages}
                          >
                            <i className="bi bi-arrow-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </Col>
            
            {/* Sidebar */}
            <Col lg={3} md={12} className="mt-8 mt-lg-0">
              <div className="themeht-sidebar">
                {/* Categories Filter */}
                <div className="widget widget-categories">
                  <h4 className="widget-title">{t('products.categories.title')}</h4>
                  <ul className="widget-categories list-unstyled">
                    <li>
                      <button 
                        onClick={() => handleCategorySelect(null)}
                        className={`category-filter-btn ${!selectedCategory ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', padding: '0.5rem 0' }}
                      >
                        <i className="bi bi-chevron-right me-1"></i>
                        {t('products.categories.all')}
                      </button>
                    </li>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <button 
                          onClick={() => handleCategorySelect(category.slug)}
                          className={`category-filter-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                          style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', padding: '0.5rem 0' }}
                        >
                          <i className="bi bi-chevron-right me-1"></i>
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Search Widget */}
                <div className="widget widget-search">
                  <h4 className="widget-title">{t('products.search.title')}</h4>
                  <form onSubmit={handleSearchSubmit} className="d-flex">
                    <input
                      ref={searchInputRef}
                      type="search"
                      className="form-control"
                      placeholder={t('products.search.placeholder')}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary ms-2"
                    >
                      <i className="bi bi-search"></i>
                    </button>
                  </form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </>
  );
}
