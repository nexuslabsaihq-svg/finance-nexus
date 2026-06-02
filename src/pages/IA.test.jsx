import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IA from './IA';
import { useAppData } from '../context/AppDataContext';

vi.mock('../context/AppDataContext', () => ({
  useAppData: vi.fn(),
}));

describe('IA Component', () => {
  it('renders chat messages securely without XSS vulnerabilities', () => {
    // Mock scrollIntoView for jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    useAppData.mockReturnValue({
      chatsIA: [
        { id: 1, role: 'assistant', content: 'Here is some *bold* text and a <script>alert("XSS")</script> attack.', time: '10:00' }
      ],
      setChatsIA: vi.fn(),
      authUser: { displayName: 'Test User' },
    });

    render(<IA />);

    // Check if the bold text is rendered correctly
    const boldText = screen.getByText('bold');
    expect(boldText.tagName).toBe('B');

    // Check if the XSS payload is rendered as plain string, not executed
    const scriptText = screen.getByText(/<script>alert\("XSS"\)<\/script>/);
    expect(scriptText).toBeInTheDocument();
  });
});
