import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FaqFormTemplate from '../FaqFormTemplate';
import { useFaqStore } from '../../../../stores/faqStore';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('../../../../stores/faqStore', () => ({
  useFaqStore: jest.fn()
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('FaqFormTemplate', () => {
  const mockAddFaq = jest.fn();
  const mockUpdateFaq = jest.fn();
  const mockFetchFaqById = jest.fn();

  const defaultStore = {
    addFaq: mockAddFaq,
    updateFaq: mockUpdateFaq,
    fetchFaqById: mockFetchFaqById,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFaqStore as unknown as jest.Mock).mockReturnValue(defaultStore);
  });

  it('renders add form correctly', () => {
    render(
      <MemoryRouter>
        <FaqFormTemplate />
      </MemoryRouter>
    );

    expect(screen.getByTestId('faq-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Question')).toBeInTheDocument();
    expect(screen.getByLabelText('Answer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('loads FAQ data when editing', async () => {
    const mockFaq = {
      _id: '1',
      question: 'Test Question',
      answer: 'Test Answer',
      status: true,
    };

    mockFetchFaqById.mockResolvedValueOnce(mockFaq);

    render(
      <MemoryRouter initialEntries={['/faq/edit/1']}>
        <Routes>
          <Route path="/faq/edit/:id" element={<FaqFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockFetchFaqById).toHaveBeenCalledWith('1');
      expect(screen.getByDisplayValue('Test Question')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Answer')).toBeInTheDocument();
    });
  });

  it('handles form submission for new FAQ', async () => {
    mockAddFaq.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <FaqFormTemplate />
      </MemoryRouter>
    );

    const questionInput = screen.getByLabelText('Question');
    const answerInput = screen.getByLabelText('Answer');
    const submitButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(questionInput, { target: { value: 'New Question' } });
    fireEvent.change(answerInput, { target: { value: 'New Answer' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddFaq).toHaveBeenCalledWith({
        question: 'New Question',
        answer: 'New Answer',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/faq');
      expect(toast.success).toHaveBeenCalledWith('FAQ added successfully');
    });
  });

  it('handles form submission for existing FAQ', async () => {
    const mockFaq = {
      _id: '1',
      question: 'Test Question',
      answer: 'Test Answer',
      status: true,
    };

    mockFetchFaqById.mockResolvedValueOnce(mockFaq);
    mockUpdateFaq.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/faq/edit/1']}>
        <Routes>
          <Route path="/faq/edit/:id" element={<FaqFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Question')).toBeInTheDocument();
    });

    const questionInput = screen.getByLabelText('Question');
    const answerInput = screen.getByLabelText('Answer');
    const submitButton = screen.getByRole('button', { name: 'Update' });

    fireEvent.change(questionInput, { target: { value: 'Updated Question' } });
    fireEvent.change(answerInput, { target: { value: 'Updated Answer' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateFaq).toHaveBeenCalledWith('1', {
        question: 'Updated Question',
        answer: 'Updated Answer',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/faq');
      expect(toast.success).toHaveBeenCalledWith('FAQ updated successfully');
    });
  });

  it('handles empty field validation errors', async () => {
    render(
      <MemoryRouter>
        <FaqFormTemplate />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Question is required.')).toBeInTheDocument();
      expect(screen.getByText('Answer is required.')).toBeInTheDocument();
      expect(mockAddFaq).not.toHaveBeenCalled();
    });
  });

  it('handles length validation errors', async () => {
    render(
      <MemoryRouter>
        <FaqFormTemplate />
      </MemoryRouter>
    );

    const questionInput = screen.getByLabelText('Question');
    const answerInput = screen.getByLabelText('Answer');
    const submitButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(questionInput, { target: { value: 'abc' } });
    fireEvent.change(answerInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Question must be at least 5 characters long.')).toBeInTheDocument();
      expect(screen.getByText('Answer must be at least 10 characters long.')).toBeInTheDocument();
      expect(mockAddFaq).not.toHaveBeenCalled();
    });
  });

  it('handles whitespace validation errors', async () => {
    render(
      <MemoryRouter>
        <FaqFormTemplate />
      </MemoryRouter>
    );

    const questionInput = screen.getByLabelText('Question');
    const answerInput = screen.getByLabelText('Answer');
    const submitButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(questionInput, { target: { value: '' } });
    fireEvent.change(answerInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Question is required.')).toBeInTheDocument();
      expect(screen.getByText('Answer is required.')).toBeInTheDocument();
      expect(mockAddFaq).not.toHaveBeenCalled();
    });
  });

  it('handles alphanumeric validation errors', async () => {
    render(
      <MemoryRouter>
        <FaqFormTemplate />
      </MemoryRouter>
    );

    const questionInput = screen.getByLabelText('Question');
    const answerInput = screen.getByLabelText('Answer');
    const submitButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(questionInput, { target: { value: '12345' } });
    fireEvent.change(answerInput, { target: { value: '1234567890' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Question must contain at least one letter.')).toBeInTheDocument();
      expect(screen.getByText('Answer must contain at least one letter.')).toBeInTheDocument();
      expect(mockAddFaq).not.toHaveBeenCalled();
    });
  });

  it('handles API errors', async () => {
    const error = new Error('API Error');
    mockAddFaq.mockRejectedValueOnce(error);

    render(
      <MemoryRouter>
        <FaqFormTemplate />
      </MemoryRouter>
    );

    const questionInput = screen.getByLabelText('Question');
    const answerInput = screen.getByLabelText('Answer');
    const submitButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(questionInput, { target: { value: 'New Question' } });
    fireEvent.change(answerInput, { target: { value: 'New Answer' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});