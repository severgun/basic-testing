// Uncomment the code below and write your tests
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 300;
    doStuffByTimeout(callback, timeout);
    expect(setTimeoutSpy).toBeCalledWith(callback, timeout);
    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 300;
    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const timeout = 300;
    doStuffByInterval(callback, timeout);
    expect(setIntervalSpy).toBeCalledWith(callback, timeout);
    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 300;
    doStuffByInterval(callback, timeout);
    jest.advanceTimersByTime(timeout * 3);
    expect(callback).toBeCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const filePath = 'test';
    const joinSpy = jest.spyOn(path, 'join');
    readFileAsynchronously(filePath);
    expect(joinSpy).toBeCalledWith(__dirname, filePath);
    joinSpy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const filePath = 'test';
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(await readFileAsynchronously(filePath)).toBeNull();
    existsSyncSpy.mockRestore();
  });

  test('should return file content if file exists', async () => {
    const filePath = 'test';
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSpy = jest
      .spyOn(fsPromises, 'readFile')
      .mockReturnValue(Promise.resolve('Hello World'));
    expect(await readFileAsynchronously(filePath)).toEqual('Hello World');
    existsSyncSpy.mockRestore();
    readFileSpy.mockRestore();
  });
});
