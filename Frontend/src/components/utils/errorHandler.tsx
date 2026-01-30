export const handleError = (error: any): string[] => {
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((err: any) => err.message || 'Validation error');
  }
  if (error?.response?.data?.message) {
    return [error.response.data.message];
  }
  if (error?.message) {
    return [error.message];
  }
  return ['An unexpected error occurred'];
};