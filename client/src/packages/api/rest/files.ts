import { AxiosRequestConfig } from 'axios';
import makeRequest from '..';
import { FileType } from '../../../types/File';

const getFiles = async (): Promise<FileType[]> => {
  return await makeRequest({ url: '/api/files' });
};

const uploadFiles = async (config: AxiosRequestConfig) => {
  return await makeRequest({
    ...config,
    url: '/api/files/upload',
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data' },
  });
};

const downloadFiles = async (config: AxiosRequestConfig) => {
  return await makeRequest({
    ...config,
    url: '/api/generate-zip',
    method: 'POST',
  });
};

export { getFiles, uploadFiles, downloadFiles };
