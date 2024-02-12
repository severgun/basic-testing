// Uncomment the code below and write your tests

import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  jest.mock('axios');
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('/');
    expect(axiosCreateSpy).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    axiosCreateSpy.mockRestore();
  });

  test('should perform request to correct provided url', async () => {
    const mockedGet = jest.spyOn(mockedAxios, 'get');
    await throttledGetDataFromApi('/');
    jest.runAllTimers();
    expect(mockedGet).toBeCalled();
    mockedGet.mockRestore();
  });

  test('should return response data', async () => {
    const testData = { uid: 1, text: 'Hello World' };
    mockedAxios.get.mockResolvedValue(testData);
    const data = await throttledGetDataFromApi('/test');
    jest.runAllTimers();
    expect(data).toBe(testData);
  });
});
