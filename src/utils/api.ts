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

const API_BASE_URL = 'https://admin-viencn.anf-technology.com/api/v1';

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
    console.error('Error fetching departments:', error);
    throw error;
  }
};
