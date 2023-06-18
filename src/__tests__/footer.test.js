import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../components/footer.jsx';
import '@testing-library/jest-dom';

describe('Footer component', () => {
    it('renders the current year in the copyright text', () => {
        const currentYear = 2023;
        jest.spyOn(global, 'Date').mockImplementation(() => ({
            getFullYear: () => currentYear,
        }));

        const { getByText } = render(<Footer />);
        const copyrightText = getByText(
            `Copyright © ${currentYear} Всі права захищено.`
        );
        expect(copyrightText).toBeInTheDocument();

        global.Date.mockRestore();
    });
});
