// HTTP plumbing shared by every feature (shared code: changed only through a contract-change).
export { API_BASE_URL, SKIP_ERROR_TOAST, apiUrl, type ApiErrorBody, type Page } from './api.config';
export { errorInterceptor, errorMessage } from './error.interceptor';
