export const CONFIG = {
  API_ENDPOINTS: {
    LIST_FILES: '/api/s3-list',
    DELETE_FILE: '/api/s3-delete',
    PRESIGNED_URL: '/api/s3-presigned',
  },
  STORAGE_KEYS: {
    HAS_VISITED: 'hasVisitedBefore',
    CACHED_FILES: 'cachedFiles',
  },
  FILE_TYPES: {
    PDF: 'application/pdf',
  },
  MAX_FILE_SIZE: 10485760, // 10MB
}; 