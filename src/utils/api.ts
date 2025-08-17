import { api } from '../config/environment';

export interface Department {
  id: number;
  name: string;
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
  locale: number;
  categories: NewsCategory[];
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

export interface NewsApiResponse {
  highlights: News[];
  total: number;
  page: number;
  pageSize: number;
  latestNews: News[];
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

    const data: ApiResponse<Department> = await response.json();
    
    if (data.success) {
      return data.data.items;
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

export const fetchDepartmentById = async (id: number, language: string, signal?: AbortSignal): Promise<Department> => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
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
