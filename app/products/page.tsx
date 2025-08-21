'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { fetchProducts, fetchProductCategories, searchProducts, Product, ProductCategory } from '../../src/utils/api';
import { useLanguage } from '../../src/contexts/LanguageContext';

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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
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
  const popularSearchTerms = [
    t('products.popular.juicer'),
    t('products.popular.tea'),
    t('products.popular.household'),
    t('products.popular.medical'),
    t('products.popular.technology'),
    t('products.popular.research')
  ];

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
          fetchProducts(language, page, limit),
          fetchProductCategories(language)
        ]);
        
        setProducts(productsResponse.products);
        setCategories(categoriesData);
        
        // Update pagination info from API response
        if (productsResponse.pagination) {
          setPagination({
            currentPage: productsResponse.pagination.current_page,
            totalPages: productsResponse.pagination.last_page,
            totalItems: productsResponse.pagination.total,
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
  }, [searchParams, language]);

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
  } else if (selectedCategory) {
    // Show filtered products by category
    displayProducts = products.filter(product => product.product_category.slug === selectedCategory);
  } else {
    // Show all products
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

  return (
    <>
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>{t('products.pageTitle')}</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">{t('products.breadcrumb.home')}</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {t('products.breadcrumb.products')}
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          {/* Search Bar */}
          <Row className="mb-5">
            <Col lg={8} md={10} className="mx-auto">
              <div className="position-relative">
                <form onSubmit={handleSearchSubmit} className="d-flex">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder={t('products.search.placeholder')}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      // Delay hiding suggestions to allow for clicks
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                    style={{ 
                      borderTopRightRadius: 0, 
                      borderBottomRightRadius: 0,
                      borderRight: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-theme btn-lg"
                    style={{ 
                      borderTopLeftRadius: 0, 
                      borderBottomLeftRadius: 0 
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </form>
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div 
                    ref={suggestionsRef}
                    className="position-absolute w-100 bg-white rounded-bottom search-suggestions-dropdown"
                    style={{ 
                      top: '100%', 
                      zIndex: 1000,
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}
                  >
                    {isSearching ? (
                      <div className="p-3 text-center">
                        <div className="spinner-border spinner-border-sm text-theme" role="status">
                          <span className="visually-hidden">{t('products.search.searching')}</span>
                        </div>
                        <span className="ms-2">{t('products.search.searching')}</span>
                      </div>
                    ) : searchSuggestions.length > 0 ? (
                      <>
                        {Object.entries(groupedSuggestions).map(([categoryName, products]) => (
                          <div key={categoryName}>
                            {/* Category Header */}
                            <div className="p-2 bg-light border-bottom">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-tag-fill text-success me-2"></i>
                                <span className="fw-medium text-dark">{categoryName}</span>
                                <span className="ms-auto text-muted small">{t('products.search.viewMore')}</span>
                              </div>
                            </div>
                            
                            {/* Products in this category */}
                            {products.slice(0, 3).map((product, productIndex) => {
                              const globalIndex = flattenedSuggestions.findIndex(p => p.id === product.id);
                              const isSelected = globalIndex === selectedSuggestionIndex;
                              
                              return (
                                <div
                                  key={product.id}
                                  className={`suggestion-item p-3 border-bottom ${isSelected ? 'selected' : ''}`}
                                  onClick={() => handleSuggestionClick(product)}
                                  style={{ 
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#e3f2fd' : 'white'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    }
                                    setSelectedSuggestionIndex(globalIndex);
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = 'white';
                                    }
                                  }}
                                >
                                <div className="d-flex align-items-center">
                                  <div className="flex-shrink-0 me-3">
                                    <img
                                      src={product.primary_image || product.product_category.image_url || '/images/product/01.jpg'}
                                      alt={product.name}
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                      }}
                                    />
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="fw-medium text-dark">{product.name}</div>
                                    <div className="text-muted small">
                                      {product.brand && `${product.brand} • `}{product.product_category.name}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <i className="bi bi-chevron-right text-muted"></i>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                            
                            {/* Show "View more" if there are more products in this category */}
                            {products.length > 3 && (
                              <div className="p-2 text-center border-bottom">
                                <small className="text-primary" style={{ cursor: 'pointer' }}>
                                  {t('products.search.viewMoreInCategory', { count: products.length - 3, category: categoryName })}
                                </small>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <div className="p-3 text-center border-top">
                          <small className="text-muted">
                            {t('products.search.enterToSearch', { query: searchQuery })}
                          </small>
                        </div>
                      </>
                    ) : searchQuery.trim().length >= 2 ? (
                      <div className="p-3 text-center text-muted">
                        <i className="bi bi-search me-2"></i>
                        {t('products.search.results.notFound', { query: searchQuery })}
                      </div>
                    ) : isSearchFocused && searchQuery.trim().length === 0 ? (
                      <div>
                        <div className="p-3 text-center text-muted border-bottom">
                          <i className="bi bi-lightbulb me-2"></i>
                          {t('products.search.popular.title')}
                        </div>
                        <div className="p-3">
                          <div className="d-flex flex-wrap gap-2">
                            {popularSearchTerms.map((term, index) => (
                              <button
                                key={index}
                                className="btn btn-outline-secondary btn-sm popular-search-term"
                                onClick={() => {
                                  setSearchQuery(term);
                                  setShowSuggestions(false);
                                }}
                                style={{ fontSize: '0.875rem' }}
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Category Filter Cards */}
          {categories.length > 0 && (
            <Row className="mb-5">
              <Col>
                <h2 className="text-center mb-4">{t('products.categories.title')}</h2>
                <Row>
                  {/* Category Cards */}
                  {categories.slice(0, 4).map((category) => (
                    <Col lg={3} md={6} className="mb-4" key={category.id}>
                      <div 
                        className={`card category-card h-100 ${selectedCategory === category.slug ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(category.slug === selectedCategory ? null : category.slug)}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      >
                        <div className="card-img-top position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                          <img 
                            src={category.image_url || '/images/product/01.jpg'} 
                            className="w-100 h-100" 
                            alt={category.name}
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.7 }}></div>
                        </div>
                        <div className="card-body text-center">
                          <h5 className="card-title position-relative" style={{ zIndex: 2, color: 'var(--themeht-primary-color)', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                            {category.name}
                          </h5>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          )}

          {/* Results Counter and Sorting */}
          <Row className="mb-4 align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center gap-3">
                {isSearchSubmitted && searchResults.length > 0 ? (
                  <>
                    <p className="mb-0">
                      {t('products.search.results.found', { count: searchResults.length, query: searchQuery })}
                    </p>
                    <button 
                      className="btn btn-outline-theme btn-sm"
                      onClick={clearSearch}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      {t('products.search.clear')}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-0">
                      {t('products.results.showing', { 
                        from: pagination.currentPage === 1 ? 1 : ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1,
                        to: Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems),
                        total: pagination.totalItems
                      })}
                    </p>
                    {selectedCategory && (
                      <button 
                        className="btn btn-outline-theme btn-sm"
                        onClick={() => handleCategorySelect(null)}
                      >
                        {t('products.categories.showAll')}
                      </button>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <select 
                className="form-select d-inline-block w-auto"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="default">{t('products.sort.default')}</option>
                <option value="name-asc">{t('products.sort.nameAsc')}</option>
                <option value="name-desc">{t('products.sort.nameDesc')}</option>
                <option value="newest">{t('products.sort.newest')}</option>
                <option value="oldest">{t('products.sort.oldest')}</option>
              </select>
            </Col>
          </Row>

          {/* Products Grid */}
          <Row>
            {sortedProducts.map((product) => (
              <Col lg={3} md={6} className="mb-4" key={product.id}>
                <div className="card product-card h-100">
                  <div className="position-relative">
                    <img 
                      src={product.primary_image || product.product_category.image_url || '/images/product/01.jpg'} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge" style={{ backgroundColor: 'var(--themeht-primary-color)', color: 'white', fontWeight: 'bold' }}>
                        {product.product_category.name}
                      </span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.name}</h6>
                    <p className="card-text flex-grow-1">
                      {product.description || product.content?.substring(0, 100) + '...' || 'Sản phẩm của Viện Công Nghệ'}
                    </p>
                    <a href={`/products/${product.slug}`} className="btn btn-outline-theme btn-sm">
                      {t('products.viewDetails')}
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* No Products Message */}
          {sortedProducts.length === 0 && (
            <Row>
              <Col className="text-center py-5">
                <i className="bi bi-box text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3">
                  {isSearchSubmitted ? t('products.search.results.notFound', { query: '' }).replace(' ""', '') : t('products.results.noProducts')}
                </h4>
                <p className="text-muted">
                  {isSearchSubmitted 
                    ? t('products.search.results.notFoundMessage', { query: searchQuery })
                    : t('products.results.noProductsMessage')
                  }
                </p>
                {isSearchSubmitted && (
                  <button 
                    className="btn btn-theme"
                    onClick={clearSearch}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    {t('products.search.backToAll')}
                  </button>
                )}
              </Col>
            </Row>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <Row className="mt-5">
              <Col className="text-center">
                <nav aria-label="Product pagination">
                  <ul className="pagination justify-content-center">
                    {/* Previous Page */}
                    <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => updateURL({ page: pagination.currentPage - 1 })}
                        disabled={pagination.currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <li key={pageNum} className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => updateURL({ page: pageNum })}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    
                    {/* Next Page */}
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => updateURL({ page: pagination.currentPage + 1 })}
                        disabled={pagination.currentPage === pagination.totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </Col>
            </Row>
          )}
        </Container>
      </section>

                   <style jsx>{`
        .category-card {
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .category-card.active {
          border-color: var(--themeht-primary-color);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .product-card {
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }
        
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .card-img-top {
          transition: transform 0.3s ease;
        }
        
        .product-card:hover .card-img-top {
          transform: scale(1.05);
        }

        /* Search suggestions styling */
        .suggestion-item {
          transition: background-color 0.2s ease;
        }
        
        .suggestion-item:hover {
          background-color: #f8f9fa !important;
        }
        
        .suggestion-item.selected {
          background-color: #e3f2fd !important;
          border-left: 3px solid var(--themeht-primary-color);
        }
        
        .suggestion-item:last-child {
          border-bottom: none !important;
        }
        
        /* Search dropdown styling */
        .search-suggestions-dropdown {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #dee2e6;
          border-top: none;
        }
        
        /* Popular search terms styling */
        .popular-search-term {
          transition: all 0.2s ease;
        }
        
        .popular-search-term:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Search input focus styling */
        // .form-control:focus {
        //   border-color: var(--themeht-primary-color);
        //   box-shadow: 0 0 0 0.2rem rgba(var(--themeht-primary-color-rgb), 0.25);
        // }
        
        /* Search button styling */
        .btn-theme {
          background-color: var(--themeht-primary-color);
          border-color: var(--themeht-primary-color);
          color: white;
        }
        
        // .btn-theme:hover {
        //   background-color: var(--themeht-primary-color-dark);
        //   border-color: var(--themeht-primary-color-dark);
        //   color: white;
        // }
        

      `}</style>
    </>
  );
}
