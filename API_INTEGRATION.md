# API Integration for Departments

## Overview
The header component now integrates with the departments API to dynamically load organization structure data. The API call respects the current language setting and updates automatically when the language is switched.

## API Endpoint
- **URL**: `https://admin-viencn.anf-technology.com/api/v1/departments`
- **Method**: GET
- **Headers**: 
  - `Accept: application/json`
  - `Accept-Language: vi` (Vietnamese) or `en` (English)
  - `Content-Type: application/json`

## Implementation Details

### 1. API Service (`src/utils/api.ts`)
- Created TypeScript interfaces for API response structure
- Implemented `fetchDepartments()` function with language support
- Handles error cases gracefully with fallback to static menu items

### 2. Header Component Updates (`src/components/Header.tsx`)
- Added state management for departments data and loading state
- Integrated with language context to fetch departments when language changes
- Dynamic rendering of organization dropdown menu items
- Fallback to static menu items if API fails

### 3. Features
- **Language-aware**: API calls include `Accept-Language` header based on current language
- **Real-time updates**: Departments list updates when language is switched
- **Error handling**: Graceful fallback to static menu items if API is unavailable
- **Loading states**: Shows "Loading..." while fetching data
- **Type safety**: Full TypeScript support with proper interfaces
- **Request cancellation**: Automatically cancels previous requests when language changes
- **Memory leak prevention**: Proper cleanup of async operations and component unmounting

## API Response Structure
```typescript
interface Department {
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
```

## Usage
The departments are automatically loaded when the Header component mounts and whenever the language changes. The organization dropdown menu will display:

1. **Loading state**: "Loading..." while fetching data
2. **Dynamic departments**: Department names from API when successful
3. **Fallback menu**: Static menu items if API fails

## Navigation
Each department links to `/organization#${department.id}` for anchor-based navigation to specific sections on the organization page.

## Error Handling
- Network errors are logged to console
- API failures fall back to static menu items
- Loading states prevent user confusion during API calls
- Aborted requests are properly handled without error logging
- Component unmounting prevents state updates on unmounted components
