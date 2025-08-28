import { to, toCallback, isPromise } from '../src/utils/request-fn';
import { EventDispatch } from '../src/utils';
import { BaseRequest } from '../src/types/base';

// Mock EventDispatch
jest.mock('../src/utils', () => ({
  EventDispatch: {
    emit: jest.fn(),
  },
}));

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isPromise', () => {
    it('should return true for Promise', () => {
      const promise = new Promise(resolve => resolve(true));
      expect(isPromise(promise)).toBe(true);
    });

    it('should return false for non-Promise values', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
      expect(isPromise('string')).toBe(false);
      expect(isPromise(123)).toBe(false);
      expect(isPromise([])).toBe(false);
    });
  });

  describe('to', () => {
    it('should return [null, data] for resolved promise', async () => {
      const promise = Promise.resolve('success');
      const result = await to(promise);
      
      expect(result).toEqual([null, 'success']);
    });

    it('should return [error, undefined] for rejected promise', async () => {
      const error = new Error('Test error');
      const promise = Promise.reject(error);
      const result = await to(promise);
      
      expect(result).toEqual([error, undefined]);
    });

    it('should merge errorExt with error object', async () => {
      const error = new Error('Test error');
      const errorExt = { code: 500, details: 'Server error' };
      const promise = Promise.reject(error);
      const result = await to(promise, errorExt);
      
      expect(result[0]).toMatchObject({
        ...error,
        ...errorExt,
      });
      expect(result[1]).toBeUndefined();
    });
  });

  describe('toCallback', () => {
    const mockUrl = 'https://api.example.com/users';

    it('should return [null, data] for successful response with code 0', async () => {
      const mockResponse: BaseRequest.Success<string> = {
        code: 0,
        count: 1,
        msg: 'Success',
        data: 'test data',
      };
      
      const promise = Promise.resolve(mockResponse);
      const result = await toCallback(promise, mockUrl);
      
      expect(result).toEqual([null, 'test data']);
      expect(EventDispatch.emit).toHaveBeenCalledWith('request:success', 'test data', mockUrl);
    });

    it('should return [error, null] for response with non-zero code', async () => {
      const mockResponse = {
        code: 400,
        count: 0,
        msg: 'Bad Request',
        data: null,
      };
      
      const promise = Promise.resolve(mockResponse);
      const result = await toCallback(promise, mockUrl);
      
      expect(result).toEqual([mockResponse, null]);
      expect(EventDispatch.emit).toHaveBeenCalledWith('request:error', mockResponse, mockUrl);
    });

    it('should return [error, null] for rejected promise', async () => {
      const error = new Error('Network error');
      const promise = Promise.reject(error);
      const result = await toCallback(promise, mockUrl);
      
      expect(result).toEqual([error, null]);
      expect(EventDispatch.emit).toHaveBeenCalledWith('request:error', error, mockUrl);
    });

    it('should handle promise that rejects with another promise', async () => {
      const innerError = new Error('Inner error');
      const rejectedPromise = Promise.reject(innerError);
      const promise = Promise.reject(rejectedPromise);
      
      const result = await toCallback(promise, mockUrl);
      
      expect(result).toEqual([innerError, null]);
    });

    it('should use empty string as default URL', async () => {
      const mockResponse: BaseRequest.Success<string> = {
        code: 0,
        count: 1,
        msg: 'Success',
        data: 'test data',
      };
      
      const promise = Promise.resolve(mockResponse);
      await toCallback(promise);
      
      expect(EventDispatch.emit).toHaveBeenCalledWith('request:success', 'test data', '');
    });

    it('should handle edge case where res is undefined', async () => {
      const promise = Promise.resolve(undefined);
      const result = await toCallback(promise, mockUrl);
      
      // This tests the edge case in the original code where response is undefined
      // In this case, the function should return an error since the response doesn't have a code property
      expect(result[0]).toBeDefined(); // Should be some error
      expect(result[1]).toBeNull(); // Data should be null
    });

    it('should handle response without data property', async () => {
      const mockResponse = {
        code: 0,
        count: 1,
        msg: 'Success',
        // no data property
      };
      
      const promise = Promise.resolve(mockResponse as any);
      const result = await toCallback(promise, mockUrl);
      
      expect(result).toEqual([null, undefined]);
      expect(EventDispatch.emit).toHaveBeenCalledWith('request:success', undefined, mockUrl);
    });
  });
});