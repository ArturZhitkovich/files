import axios, { AxiosRequestConfig } from 'axios';

const makeRequest = async ({
  url = '/',
  method = 'get',
  headers,
  params,
  data,
}: AxiosRequestConfig) => {
  try {
    return await axios({ url, method, headers, params, data }).then(
      (responce) => responce.data,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default makeRequest;
