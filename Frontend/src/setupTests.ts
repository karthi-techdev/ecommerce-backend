import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'node:util';

// Increase the default timeout for async operations
jest.setTimeout(10000);

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Set up TextEncoder and TextDecoder for tests
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder }
});