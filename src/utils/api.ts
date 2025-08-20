import { api } from '../config/environment';

export interface Department {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string | null;
  content: string;
  image: string | null;
  video_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  is_active: number;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface NewsCategory {
  id: number;
  name: string;
  name_en: string | null;
  slug: string;
  description: string | null;
  parent_id: number | null;
  image_url: string | null;
  banner_url: string | null;
  post_type: string | null;
  homepage_type: string | null;
  display_menu_priority: number;
  display_homepage_priority: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_active: boolean;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  description: string | null;
  image_url: string | null;
  author: string | null;
  tags: string | null;
  status: string | null;
  type: string | null;
  locale: string;
  categories: NewsCategory[];
  created_by?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string | null;
  updated_at: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: {
    items: T[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

export interface PostsApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    items: {
      current_page: number;
      data: News[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

export interface NewsApiResponse {
  highlights: News[];
  total: number;
  page: number;
  pageSize: number;
  latestNews: News[];
}

export interface AboutVideo {
  type: string;
  url: string;
  title: string;
}

export interface AboutOverview {
  title: string;
  description: string;
  images: string[];
  videos: AboutVideo[];
}

export interface AboutOverviewResponse {
  success: boolean;
  status: number;
  message: string;
  data: AboutOverview;
}

export interface AboutVision {
  content: string;
  image: string | null;
}

export interface AboutVisionResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    content: string;
    image: string | null;
  };
}

export interface OrganizationMember {
  name: string;
  position: string;
  department: string;
  description: string;
  avatar: string | null;
}

export interface OrganizationResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    members: OrganizationMember[];
  };
}

export interface HistoryMilestone {
  title: string;
  year: string;
  description: string;
  image: string | null;
}

export interface AboutHistoryResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    milestones: HistoryMilestone[];
  };
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string | null;
  content: string | null;
  primary_image: string | null;
  gallery_images: string[];
  videos: string[];
  brand: string | null;
  weight: string | null;
  dimensions: string | null;
  specifications: string | null;
  custom_fields: any[];
  attachments: any[];
  status: string;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  sort_order: number | null;
  product_category: ProductCategory;
  created_at: string;
  updated_at: string;
}

export interface ProductApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    items: {
      current_page: number;
      data: Product[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

export interface ProductCategoryApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    items: ProductCategory[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

const API_BASE_URL = api.baseUrl;

export const fetchDepartments = async (language: string, signal?: AbortSignal): Promise<Department[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data.items.data || data.data.items || [];
    } else {
      throw new Error(data.message || 'Failed to fetch departments');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching departments:', error);
    }
    throw error;
  }
};

export const fetchDepartmentBySlug = async (slug: string, language: string, signal?: AbortSignal): Promise<Department> => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/${slug}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; status: number; message: string; data: Department } = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch department details');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching department details:', error);
    }
    throw error;
  }
};

export const fetchLatestNews = async (language: string, limit: number = 10, signal?: AbortSignal): Promise<News[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/latest-news?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    console.log('API response for latest news:', data);
    return data.highlights || [];
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching latest news:', error);
    }
    throw error;
  }
};

export const fetchHighlightNews = async (language: string, signal?: AbortSignal): Promise<News[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/highlight-news`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    console.log('API response for highlight news:', data);
    return data.highlights || [];
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching highlight news:', error);
    }
    throw error;
  }
};

export const fetchAboutOverview = async (language: string, signal?: AbortSignal): Promise<AboutOverview> => {
  try {
    const response = await fetch(`${API_BASE_URL}/about/overview`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AboutOverviewResponse = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch about overview');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching about overview:', error);
    }
    throw error;
  }
};

export const fetchAboutVision = async (language: string, signal?: AbortSignal): Promise<AboutVision> => {
  try {
    const response = await fetch(`${API_BASE_URL}/about/vision`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AboutVisionResponse = await response.json();
    
    if (data.success) {
      // Return the data in the expected format
      return {
        content: data.data.content,
        image: data.data.image
      };
    } else {
      throw new Error(data.message || 'Failed to fetch vision and mission');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching vision and mission:', error);
    }
    throw error;
  }
};

export const fetchOrganization = async (language: string, signal?: AbortSignal): Promise<OrganizationMember[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/about/organization`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OrganizationResponse = await response.json();
    
    if (data.success) {
      return data.data.members;
    } else {
      throw new Error(data.message || 'Failed to fetch organization');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching organization:', error);
    }
    throw error;
  }
};

export const fetchAboutHistory = async (language: string, signal?: AbortSignal): Promise<HistoryMilestone[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/about/history`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AboutHistoryResponse = await response.json();
    
    if (data.success) {
      return data.data.milestones;
    } else {
      throw new Error(data.message || 'Failed to fetch history');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching history:', error);
    }
    throw error;
  }
};

export const fetchProducts = async (
  language: string, 
  page: number = 1, 
  limit: number = 20, 
  signal?: AbortSignal
): Promise<{ products: Product[]; pagination: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductApiResponse = await response.json();
    
    if (data.success) {
      return {
        products: data.data.items.data || data.data.items || [],
        pagination: data.data.pagination || {
          current_page: page,
          last_page: 1,
          per_page: limit,
          total: 0,
          from: 1,
          to: limit
        }
      };
    } else {
      throw new Error(data.message || 'Failed to fetch products');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching products:', error);
    }
    throw error;
  }
};

export const fetchProductBySlug = async (slug: string, language: string, signal?: AbortSignal): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; status: number; message: string; data: Product } = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch product details');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching product details:', error);
    }
    throw error;
  }
};

export const fetchProductCategories = async (
  language: string, 
  signal?: AbortSignal
): Promise<ProductCategory[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/product-categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductCategoryApiResponse = await response.json();
    
    if (data.success) {
      return data.data.items;
    } else {
      throw new Error(data.message || 'Failed to fetch product categories');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching product categories:', error);
    }
    throw error;
  }
};

export const fetchBlogCategories = async (
  language: string, 
  signal?: AbortSignal
): Promise<NewsCategory[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<NewsCategory> = await response.json();
    
    if (data.success) {
      return data.data.items;
    } else {
      throw new Error(data.message || 'Failed to fetch blog categories');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching blog categories:', error);
    }
    throw error;
  }
};

export const fetchPosts = async (
  language: string,
  page: number = 1,
  limit: number = 10,
  category?: string,
  signal?: AbortSignal
): Promise<{ posts: News[]; pagination: any }> => {
  try {
    let url = `${API_BASE_URL}/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PostsApiResponse = await response.json();
    
    if (data.success) {
      return {
        posts: data.data.items.data || [],
        pagination: data.data.pagination
      };
    } else {
      throw new Error(data.message || 'Failed to fetch posts');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching posts:', error);
    }
    throw error;
  }
};

export const fetchPostBySlug = async (
  slug: string,
  language: string,
  signal?: AbortSignal
): Promise<News> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; status: number; message: string; data: News } = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch post details');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching post details:', error);
    }
    throw error;
  }
};

export const fetchRelatedPosts = async (
  slug: string,
  language: string,
  limit: number = 5,
  signal?: AbortSignal
): Promise<News[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}/related?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': language === 'vi' ? 'vi' : 'en',
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; status: number; message: string; data: News[] } = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.message || 'Failed to fetch related posts');
    }
  } catch (error) {
    // Don't log AbortError as it's expected when requests are cancelled
    if (!(error instanceof Error && error.name === 'AbortError')) {
      console.error('Error fetching related posts:', error);
    }
    throw error;
  }
};
