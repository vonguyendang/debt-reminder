import { successResponse } from '../lib/response';

export function handleHealth() {
  return successResponse({
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
}
