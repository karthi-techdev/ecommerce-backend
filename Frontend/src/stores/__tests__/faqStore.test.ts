import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';
import { useFaqStore } from '../faqStore';
import ImportedURL from '../../common/urls';

const { API } = ImportedURL;

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('faqStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the store state
    useFaqStore.setState({
      faqs: [],
      stats: { total: 0, active: 0, inactive: 0 },
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
    });
  });

  describe('fetchFaqs', () => {
    it('handles network errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({ message: 'Network error' });

      await useFaqStore.getState().fetchFaqs();

      expect(useFaqStore.getState().error).toBe('Network error');
      expect(useFaqStore.getState().faqs).toEqual([]);
      expect(useFaqStore.getState().loading).toBe(false);
    });

    it('handles missing metadata gracefully', async () => {
      const mockResponse = {
        data: {
          data: []
          // meta is missing
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await useFaqStore.getState().fetchFaqs();

      expect(useFaqStore.getState().stats).toEqual({
        total: 0,
        active: 0,
        inactive: 0
      });
      expect(useFaqStore.getState().totalPages).toBe(1);
    });

    it('should fetch FAQs successfully', async () => {
      const mockFaqs = [
        { _id: '1', question: 'Test Q1', answer: 'Test A1', status: true },
        { _id: '2', question: 'Test Q2', answer: 'Test A2', status: false },
      ];

      const mockResponse = {
        data: {
          data: mockFaqs,
          meta: {
            total: 2,
            active: 1,
            inactive: 1,
            totalPages: 1,
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await useFaqStore.getState().fetchFaqs();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API.listfaq}?page=1&limit=20`
      );
      expect(useFaqStore.getState().faqs).toEqual(mockFaqs);
      expect(useFaqStore.getState().stats).toEqual({
        total: 2,
        active: 1,
        inactive: 1,
      });
      expect(useFaqStore.getState().error).toBeNull();
    });

    it('should handle fetch FAQs error', async () => {
      const error = new Error('Failed to fetch FAQs');
      mockedAxios.get.mockRejectedValueOnce(error);

      await useFaqStore.getState().fetchFaqs();

      expect(useFaqStore.getState().faqs).toEqual([]);
      expect(useFaqStore.getState().error).toBe('Failed to fetch FAQs');
    });
  });

  describe('fetchFaqById', () => {
    it('should fetch FAQ by ID successfully', async () => {
      const mockFaq = {
        _id: '1',
        question: 'Test Q1',
        answer: 'Test A1',
        status: true,
      };

      mockedAxios.get.mockResolvedValueOnce({ data: { data: mockFaq } });

      const result = await useFaqStore.getState().fetchFaqById('1');

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API.getFaq}1`);
      expect(result).toEqual(mockFaq);
      expect(useFaqStore.getState().error).toBeNull();
    });

    it('should handle fetch FAQ by ID error', async () => {
      const error = new Error('Failed to fetch FAQ');
      mockedAxios.get.mockRejectedValueOnce(error);

      const result = await useFaqStore.getState().fetchFaqById('1');

      expect(result).toBeNull();
      expect(useFaqStore.getState().error).toBe('Failed to fetch FAQ');
    });
  });

  describe('addFaq', () => {
    it('should add FAQ successfully', async () => {
      const newFaq = {
        question: 'New Q',
        answer: 'New A',
      };

      // Mock checkDuplicateFaq to return false (no duplicate)
      mockedAxios.post.mockImplementation((url) => {
        if (url === API.checkDuplicateFaq) {
          return Promise.resolve({ data: { exists: false } }) as Promise<any>;
        }
        return Promise.resolve({
          data: { data: { ...newFaq, _id: '3', status: true } },
        }) as Promise<any>;
      });

      await useFaqStore.getState().addFaq(newFaq);

      expect(mockedAxios.post).toHaveBeenCalledWith(API.addfaq, newFaq);
      expect(useFaqStore.getState().error).toBeNull();
    });

    it('should handle duplicate FAQ error', async () => {
      const newFaq = {
        question: 'Duplicate Q',
        answer: 'New A',
      };

      // Mock checkDuplicateFaq to return true (duplicate exists)
      mockedAxios.post.mockResolvedValueOnce({ data: { exists: true } });

      try {
        await useFaqStore.getState().addFaq(newFaq);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBe('A FAQ with this question already exists');
      }
    });
  });

  describe('updateFaq', () => {
    it('should update FAQ successfully', async () => {
      const updatedFaq = {
        _id: '1',
        question: 'Updated Q',
        answer: 'Updated A',
      };

      // Mock checkDuplicateFaq to return false (no duplicate)
      mockedAxios.post.mockResolvedValueOnce({ data: { exists: false } });
      mockedAxios.put.mockResolvedValueOnce({ data: { data: updatedFaq } });

      await useFaqStore.getState().updateFaq('1', updatedFaq);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API.updatefaq}1`,
        updatedFaq
      );
      expect(useFaqStore.getState().error).toBeNull();
    });

    it('handles network error during update', async () => {
      const updatedFaq = {
        _id: '1',
        question: 'Updated Q',
        answer: 'Updated A',
      };

      // Mock checkDuplicateFaq to return false (no duplicate)
      mockedAxios.post.mockResolvedValueOnce({ data: { exists: false } });
      mockedAxios.put.mockRejectedValueOnce({ message: 'Network error' });

      try {
        await useFaqStore.getState().updateFaq('1', updatedFaq);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(useFaqStore.getState().error).toBe('Network error');
      }
    });

    it('handles server error during update', async () => {
      const updatedFaq = {
        _id: '1',
        question: 'Updated Q',
        answer: 'Updated A',
      };

      // Mock checkDuplicateFaq to return false (no duplicate)
      mockedAxios.post.mockResolvedValueOnce({ data: { exists: false } });
      mockedAxios.put.mockRejectedValueOnce({ 
        response: { 
          data: { 
            message: 'Server error' 
          } 
        } 
      });

      try {
        await useFaqStore.getState().updateFaq('1', updatedFaq);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(useFaqStore.getState().error).toBe('Server error');
      }
    });
  });

  describe('deleteFaq', () => {
    it('should delete FAQ successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await useFaqStore.getState().deleteFaq('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API.deletefaq}1`);
      expect(useFaqStore.getState().error).toBeNull();
    });
  });

  describe('toggleStatusFaq', () => {
    it('should toggle FAQ status successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            _id: '1',
            status: true,
          },
        },
      };

      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      // Setup initial state with a FAQ
      useFaqStore.setState({
        faqs: [{
          _id: '1',
          question: 'Test Q',
          answer: 'Test A',
          status: false
        }]
      });

      await useFaqStore.getState().toggleStatusFaq('1');

      expect(mockedAxios.patch).toHaveBeenCalledWith(`${API.toggleStatusfaq}1`);
      expect(useFaqStore.getState().error).toBeNull();
      
      // Verify the FAQ status was updated in the store
      const updatedFaq = useFaqStore.getState().faqs.find(f => f._id === '1');
      expect(updatedFaq?.status).toBe('inactive');
    });

    it('handles network error during toggle', async () => {
      mockedAxios.patch.mockRejectedValueOnce({ message: 'Network error' });
      
      await useFaqStore.getState().toggleStatusFaq('1');
      
      expect(useFaqStore.getState().error).toBe('Network error');
    });

    it('handles server error during toggle', async () => {
      mockedAxios.patch.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Server error'
          }
        }
      });
      
      await useFaqStore.getState().toggleStatusFaq('1');
      
      expect(useFaqStore.getState().error).toBe('Server error');
    });

    it('correctly toggles between active and inactive states', async () => {
      // Test true -> inactive
      mockedAxios.patch.mockResolvedValueOnce({
        data: {
          data: {
            _id: '1',
            status: true
          }
        }
      });

      useFaqStore.setState({
        faqs: [{
          _id: '1',
          question: 'Test Q',
          answer: 'Test A',
          status: true
        }]
      });

      await useFaqStore.getState().toggleStatusFaq('1');
      expect(useFaqStore.getState().faqs[0].status).toBe('inactive');

      // Test false -> active
      mockedAxios.patch.mockResolvedValueOnce({
        data: {
          data: {
            _id: '1',
            status: false
          }
        }
      });

      await useFaqStore.getState().toggleStatusFaq('1');
      expect(useFaqStore.getState().faqs[0].status).toBe('active');
    });
  });
});