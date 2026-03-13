import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/pages/Home';
import '@testing-library/jest-dom';

test('renders Home component with levels', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  // Check if title exists
  const titleElement = screen.getByText(/Kimtt/i);
  expect(titleElement).toBeInTheDocument();

  // Check if at least one level title is rendered
  const levelTitles = screen.getAllByText(/Level/i);
  expect(levelTitles.length).toBeGreaterThan(0);
});
