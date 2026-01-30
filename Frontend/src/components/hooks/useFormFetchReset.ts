import { useEffect } from 'react';

export function useFormFetchReset({ fetchFn, resetFn, existingData, deps = [] }: {
  fetchFn: () => void;
  resetFn: (data?: any) => void;
  existingData?: any;
  deps?: any[];
}) {
  useEffect(() => {
    if (existingData) {
      resetFn(existingData);
    }
    fetchFn();
  }, [existingData, resetFn, fetchFn, ...deps]);
}
