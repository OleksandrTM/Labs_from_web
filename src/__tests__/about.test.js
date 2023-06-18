import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import About from '../components/about.jsx';

describe('About component', () => {
    test('renders heading', () => {
        render(<About />);
        const headingElement = screen.getByText('Про нас');
        expect(headingElement).toBeInTheDocument();
    });

    test('renders image with alt text', () => {
        render(<About />);
        const imageElement = screen.getByAltText('Про нас');
        expect(imageElement).toBeInTheDocument();
    });
});
