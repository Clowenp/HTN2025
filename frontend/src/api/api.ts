const API_BASE_URL = 'http://localhost:5000';

/**
 * Uploads an image file to the backend /api/upload endpoint.
 * @param file The image file to upload.
 * @returns A promise resolving to the backend response JSON.
 */
export async function uploadImage(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(API_BASE_URL + '/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
}

// Searches for images. If query is empty, returns all images.
export async function searchImages(query: string): Promise<any> {
  const response = await fetch(API_BASE_URL + '/api/search', {
    method: 'GET'
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
}
