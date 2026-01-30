import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import FaqListTemplate from '../FaqListTemplate';
import { useFaqStore } from '../../../../stores/faqStore';
import Swal from 'sweetalert2';
// We can use types directly from faqStore if needed

// Mock the required dependencies
jest.mock('sweetalert2');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
jest.mock('../../../../stores/faqStore', () => ({
  useFaqStore: jest.fn()
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockFaqs = [
  {
    _id: '1',
    question: 'Test Question 1',
    answer: 'Test Answer 1',
    status: true,
  },
  {
    _id: '2',
    question: 'Test Question 2',
    answer: 'Test Answer 2',
    status: false,
  },
];

describe('FaqListTemplate', () => {
  const defaultStore = {
    faqs: mockFaqs,
    fetchFaqs: jest.fn().mockResolvedValue(undefined),
    deleteFaq: jest.fn().mockResolvedValue(undefined),
    toggleStatusFaq: jest.fn().mockResolvedValue(undefined),
    totalPages: 1,
    loading: false,
    error: null,
    stats: {
      total: 2,
      active: 1,
      inactive: 1,
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the Zustand store
    (useFaqStore as unknown as jest.Mock).mockReturnValue(defaultStore);
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Question 1')).toBeInTheDocument();
    expect(screen.getByText('Test Question 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      loading: true,
    });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('handles search functionality', () => {
    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Question 1' } });

    expect(screen.getByText('Test Question 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Question 2')).not.toBeInTheDocument();
  });

  it('handles filter change', async () => {
    const mockFetchFaqs = jest.fn();
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      fetchFaqs: mockFetchFaqs,
    });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    // Find and click the active filter
    const activeFilter = screen.getByText('Active FAQs');
    fireEvent.click(activeFilter);

    await waitFor(() => {
      expect(mockFetchFaqs).toHaveBeenCalledWith(1, 10, 'active');
    });
  });

  it('handles delete FAQ', async () => {
    const mockDeleteFaq = jest.fn();
    const mockFetchFaqs = jest.fn();
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      deleteFaq: mockDeleteFaq,
      fetchFaqs: mockFetchFaqs,
    });

    // Mock SweetAlert
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    // Find and click delete button for first FAQ
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Are you sure?',
          icon: 'warning',
        })
      );
    });

    await waitFor(() => {
      expect(mockDeleteFaq).toHaveBeenCalledWith('1');
      expect(mockFetchFaqs).toHaveBeenCalled();
    });
  });

  it('handles toggle status', async () => {
    const mockToggleStatusFaq = jest.fn();
    const mockFetchFaqs = jest.fn();
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      toggleStatusFaq: mockToggleStatusFaq,
      fetchFaqs: mockFetchFaqs,
    });

    // Mock SweetAlert
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    // Find and click toggle button for first FAQ
    const toggleButtons = screen.getAllByTitle('Toggle Status');
    fireEvent.click(toggleButtons[0]);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Are you sure?',
          icon: 'warning',
        })
      );
    });

    await waitFor(() => {
      expect(mockToggleStatusFaq).toHaveBeenCalledWith('1');
      expect(mockFetchFaqs).toHaveBeenCalled();
    });
  });

  it('shows error message when API call fails', async () => {
    const error = 'Failed to load FAQs';
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      error,
    });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith(error);
    });
  });

  it('handles failed delete operation', async () => {
    const mockDeleteFaq = jest.fn().mockRejectedValue(new Error('Delete failed'));
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      deleteFaq: mockDeleteFaq,
    });

    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    const deleteButton = screen.getAllByTitle('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteFaq).toHaveBeenCalled();
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Failed to delete FAQ. Please try again.');
    });
  });

  it('handles pagination with last item deletion', async () => {
    const mockDeleteFaq = jest.fn().mockResolvedValue(undefined);
    const mockFetchFaqs = jest.fn().mockResolvedValue(undefined);
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      faqs: [mockFaqs[0]], // Only one FAQ left
      deleteFaq: mockDeleteFaq,
      fetchFaqs: mockFetchFaqs,
      totalPages: 2,
    });

    (Swal.fire as jest.Mock)
      .mockResolvedValueOnce({ isConfirmed: true })
      .mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteFaq).toHaveBeenCalled();
      expect(mockFetchFaqs).toHaveBeenCalledWith(1, 10, 'total');
    });
  });

  it('handles failed status toggle', async () => {
    const mockToggleStatusFaq = jest.fn().mockRejectedValue(new Error('Toggle failed'));
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      toggleStatusFaq: mockToggleStatusFaq,
    });

    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    const toggleButton = screen.getAllByTitle('Toggle Status')[0];
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockToggleStatusFaq).toHaveBeenCalled();
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Failed to update status. Please try again.');
    });
  });

  it('displays no data message when filtered FAQs is empty', () => {
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      ...defaultStore,
      faqs: [],
    });

    render(
      <MemoryRouter>
        <FaqListTemplate />
      </MemoryRouter>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});