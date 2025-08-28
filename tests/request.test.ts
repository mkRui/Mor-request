import { AxiosInstance, AxiosResponse } from 'axios';
import Request from '../src/request-config/request';
import { EventDispatch } from '../src/utils';

// Mock EventDispatch
jest.mock('../src/utils', () => ({
  EventDispatch: {
    emit: jest.fn(),
  },
}));

// Mock toCallback function
jest.mock('../src/utils/request-fn', () => ({
  toCallback: jest.fn((promise: any) => promise.then((data: any) => [null, data]).catch((err: any) => [err, null])),
}));

describe('Request', () => {
  let mockAxios: jest.Mocked<AxiosInstance>;
  let request: Request;

  beforeEach(() => {
    // Create mock axios instance
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      request: jest.fn(),
    } as any;

    request = new Request(mockAxios);

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with axios', () => {
      expect(request.axios).toBe(mockAxios);
    });
  });

  describe('GET request', () => {
    it('should make GET request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const params = { page: 1, limit: 10 };
      const config = { timeout: 5000 };

      await request.get('/users', params, config);

      expect(mockAxios.get).toHaveBeenCalledWith('/users', {
        ...config,
        params,
      });

      expect(EventDispatch.emit).toHaveBeenCalledWith('request', {
        method: 'GET',
        url: '/users',
        data: params,
        timestamp: expect.any(Number),
      });
    });

    it('should handle GET request without params and config', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      await request.get('/status');

      expect(mockAxios.get).toHaveBeenCalledWith('/status', {
        params: undefined,
      });
    });
  });

  describe('POST request', () => {
    it('should make POST request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'new user' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const data = { name: 'John', email: 'john@example.com' };
      const config = { headers: { 'Content-Type': 'application/json' } };

      await request.post('/users', data, config);

      expect(mockAxios.post).toHaveBeenCalledWith('/users', data, config);

      expect(EventDispatch.emit).toHaveBeenCalledWith('request', {
        method: 'POST',
        url: '/users',
        data,
        timestamp: expect.any(Number),
      });
    });
  });

  describe('PUT request', () => {
    it('should make PUT request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'updated user' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const data = { name: 'Jane' };

      await request.put('/users/1', data);

      expect(mockAxios.put).toHaveBeenCalledWith('/users/1', data, undefined);

      expect(EventDispatch.emit).toHaveBeenCalledWith('request', {
        method: 'PUT',
        url: '/users/1',
        data,
        timestamp: expect.any(Number),
      });
    });
  });

  describe('DELETE request', () => {
    it('should make DELETE request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const config = { headers: { 'Authorization': 'Bearer token' } };

      await request.delete('/users/1', config);

      expect(mockAxios.delete).toHaveBeenCalledWith('/users/1', config);

      expect(EventDispatch.emit).toHaveBeenCalledWith('request', {
        method: 'DELETE',
        url: '/users/1',
        data: null,
        timestamp: expect.any(Number),
      });
    });
  });

  describe('PATCH request', () => {
    it('should make PATCH request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, status: 'active' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.patch.mockResolvedValue(mockResponse);

      const data = { status: 'active' };

      await request.patch('/users/1', data);

      expect(mockAxios.patch).toHaveBeenCalledWith('/users/1', data, undefined);
    });
  });

  describe('HEAD request', () => {
    it('should make HEAD request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: '',
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Length': '1234' },
        config: {} as any,
        request: {},
      };

      mockAxios.head.mockResolvedValue(mockResponse);

      await request.head('/files/document.pdf');

      expect(mockAxios.head).toHaveBeenCalledWith('/files/document.pdf', undefined);
    });
  });

  describe('OPTIONS request', () => {
    it('should make OPTIONS request with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: '',
        status: 200,
        statusText: 'OK',
        headers: { 'Allow': 'GET, POST, PUT, DELETE' },
        config: {} as any,
        request: {},
      };

      mockAxios.options.mockResolvedValue(mockResponse);

      await request.options('/api/users');

      expect(mockAxios.options).toHaveBeenCalledWith('/api/users', undefined);
    });
  });

  describe('generic request', () => {
    it('should make request with full config', async () => {
      const mockResponse: AxiosResponse = {
        data: { result: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.request.mockResolvedValue(mockResponse);

      const config = {
        method: 'GET' as const,
        url: '/custom-endpoint',
        params: { filter: 'active' },
      };

      await request.request(config);

      expect(mockAxios.request).toHaveBeenCalledWith(config);

      expect(EventDispatch.emit).toHaveBeenCalledWith('request', {
        method: 'GET',
        url: '/custom-endpoint',
        data: { filter: 'active' },
        timestamp: expect.any(Number),
      });
    });
  });

  describe('upload', () => {
    it('should upload file correctly', async () => {
      const mockResponse: AxiosResponse = {
        data: { fileId: 'abc123', url: 'https://example.com/file.jpg' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      // Create a mock File
      const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
      const config = { timeout: 30000 };

      await request.upload('/upload', file, config);

      const expectedFormData = new FormData();
      expectedFormData.append('file', file);

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/upload',
        expect.any(FormData),
        expect.objectContaining({
          ...config,
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
    });

    it('should upload FormData directly', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('avatar', new File([''], 'avatar.jpg'));
      formData.append('name', 'John Doe');

      await request.upload('/upload', formData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/upload',
        formData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
    });
  });

  describe('download', () => {
    it('should download file with blob response type', async () => {
      const mockBlob = new Blob(['file content'], { type: 'application/pdf' });
      const mockResponse: AxiosResponse = {
        data: mockBlob,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {},
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const config = { timeout: 60000 };

      await request.download('/files/document.pdf', config);

      expect(mockAxios.get).toHaveBeenCalledWith('/files/document.pdf', {
        ...config,
        responseType: 'blob',
      });
    });
  });
});