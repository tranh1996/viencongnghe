import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';

// Mock the GoogleAnalytics component to avoid issues in tests
jest.mock('./components/GoogleAnalytics', () => {
  return function MockGoogleAnalytics() {
    return null;
  };
});

// Create a wrapper component that provides the necessary context
const AppWrapper = () => (
  <BrowserRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </BrowserRouter>
);

test('renders app without crashing', () => {
  const { container } = render(<AppWrapper />);
  // Check if the header is rendered (which should contain the logo)
  const headerElement = container.querySelector('header');
  expect(headerElement).toBeInTheDocument();
});

test('renders navigation menu', () => {
  const { container } = render(<AppWrapper />);
  // Check if navigation elements are present
  const navElement = container.querySelector('nav');
  expect(navElement).toBeInTheDocument();
});
