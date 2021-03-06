// @flow
import type { RequestConfig } from '../../common/types';
import { request } from '../../utils/request';

export const getNextNodeUpdate = (
  config: RequestConfig
): Promise<any> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/internal/next-update',
    ...config,
  })
);
