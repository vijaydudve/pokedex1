import { getRequest } from "./requests";


// Mock the global fetch function
global.fetch = jest.fn();

describe('request and getRequest functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make a successful GET request', async () => {
    const mockResponse = { data: 'test data' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getRequest('https://api.example.com/data');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should handle query parameters correctly', async () => {
    const mockResponse = { data: 'test data' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await getRequest('https://api.example.com/data', { param1: 'value1', param2: 2 });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/data?param1=value1&param2=2',
      expect.any(Object)
    );
  });

  it('should include custom headers', async () => {
    const mockResponse = { data: 'test data' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await getRequest('https://api.example.com/data', null, { 'X-Custom-Header': 'CustomValue' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom-Header': 'CustomValue',
        }),
      })
    );
  });

  it('should include additional options', async () => {
    const mockResponse = { data: 'test data' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await getRequest('https://api.example.com/data', null, undefined, { mode: 'cors' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        mode: 'cors',
      })
    );
  });

  it('should throw an error for non-OK responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(getRequest('https://api.example.com/data')).rejects.toThrow('HTTP error! status: 404');
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(getRequest('https://api.example.com/data')).rejects.toThrow('Network error');
  });

  

});