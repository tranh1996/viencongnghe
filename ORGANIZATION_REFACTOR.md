# Organization Page Refactor

## Overview

The Organization page has been refactored to use the API data from `fetchDepartments` and provide a comprehensive department listing and detail view functionality.

## Features

### 1. Department List View
- **Complete List**: Displays all departments from the API
- **Interactive Cards**: Clickable department cards with hover effects
- **Contact Preview**: Shows available contact information (email, phone, address)
- **Loading States**: Proper loading and error handling
- **Responsive Design**: Works on all device sizes

### 2. Department Detail View
- **Department Name**: Prominent display of department name
- **Department Introduction**: Full content from API (HTML supported)
- **Photo/Video Links**: Displays department images and videos
- **Contact Information**: Complete contact details if available
- **General Contact**: Fallback to institute's general contact info
- **Navigation**: Easy back navigation to department list

## API Integration

### Department Interface
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

### API Function
```typescript
fetchDepartments(language: string, signal?: AbortSignal): Promise<Department[]>
```

## Components

### 1. Organization.tsx
- Main page component
- Handles API data fetching
- Manages state for selected department
- Provides department list view

### 2. DepartmentDetail.tsx
- Detail view component for individual departments
- Displays full department information
- Handles media content (images/videos)
- Provides contact information sidebar

## Styling

### CSS Classes Added
- `.department-card`: Styled department cards with hover effects
- `.department-content`: Content styling for department details
- `.sticky-top`: Sticky sidebar for contact information
- `.contact-preview`: Contact information preview in cards

### Features
- Gradient icons for department cards
- Hover animations and transitions
- Responsive design for mobile devices
- Consistent theming with the rest of the application

## Internationalization

### Translation Keys Added
- `organization.title`: Page title
- `organization.description`: Page description
- `organization.loading`: Loading message
- `organization.error`: Error message
- `organization.viewDetails`: View details button
- `organization.contactInfo`: Contact information label
- `organization.backToList`: Back navigation
- `organization.departmentIntro`: Department introduction
- `organization.imagesVideos`: Media section title
- `organization.contactInformation`: Contact information title
- And many more...

### Languages Supported
- Vietnamese (vi)
- English (en)

## Usage

### Viewing Departments
1. Navigate to the Organization page
2. View the list of all departments
3. Click on any department card to see details

### Department Details
1. Department name and code (if available)
2. Full department introduction/content
3. Images and videos (if available)
4. Contact information (if available)
5. General institute contact as fallback

## Error Handling

- **API Errors**: Displays error messages when API calls fail
- **No Data**: Shows appropriate message when no departments are available
- **Loading States**: Spinner and loading messages during data fetch
- **Network Issues**: Graceful handling of network problems

## Responsive Design

- **Desktop**: Two-column layout for department cards
- **Tablet**: Responsive grid layout
- **Mobile**: Single column layout with optimized spacing
- **Touch Friendly**: Proper touch targets for mobile devices

## Performance

- **Lazy Loading**: Images load only when needed
- **Optimized Images**: Uses OptimizedImage component
- **Efficient Rendering**: Only renders visible content
- **Memory Management**: Proper cleanup of event listeners

## Future Enhancements

1. **Search/Filter**: Add search functionality for departments
2. **Pagination**: Handle large numbers of departments
3. **Caching**: Implement client-side caching for better performance
4. **Offline Support**: Add offline capability with cached data
5. **Analytics**: Track department view interactions
