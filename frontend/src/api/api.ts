import { Photo, Tag } from "../types/types";

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
export async function searchImages(query: string): Promise<Photo[]> {
  const params = new URLSearchParams({
    query
  })
  const response = await fetch(API_BASE_URL + `/api/search${query ? `?${params.toString()}` : ``}`, {
    method: 'GET'
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to upload image');
  }

  const res: Photo[] = await response.json();
  return res.map((photo: Photo) => {
    return {
      ...photo,
      dateModified: new Date(parseFloat(photo.dateModified) * 1000).toLocaleDateString(),
    }
  })
}

export async function deepSearch(query: string): Promise<{ tag: string, confidence: string }[]> {
  const params = new URLSearchParams({
    query
  })
  const response = await fetch(API_BASE_URL + `/api/deepsearch${query ? `?${params.toString()}` : ``}`, {
    method: 'GET'
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to upload image');
  }

  const res: any = await response.json();
  console.log("deep search result: ", res)

  return JSON.parse(res.results);
}

export interface Tab {
  user_id: string;
  tab_id: string;
  tab_name: string;
}

export async function getTabs(): Promise<Tab[]> {
  const response = await fetch(API_BASE_URL + '/api/tabs', {
    method: 'GET'
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch tabs');
  }

  const res = await response.json();
  return res.tabs;
}

export async function addTab(tabName: string): Promise<Tab> {
  const response = await fetch(API_BASE_URL + '/api/tabs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tab_name: tabName }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to add tab');
  }

  const res = await response.json();
  return res.tab;
}
