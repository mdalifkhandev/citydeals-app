import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export interface UploadResponse {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
}

export const uploadApi = {
  uploadBase64: async (base64Data: string, folder: string = 'general'): Promise<UploadResponse> => {
    const res = await apiClient.post(ENDPOINTS.UPLOAD.BASE64, {
      data: base64Data,
      folder,
    });
    return res.data?.data || res.data;
  },

  uploadImageUri: async (uri: string, folder: string = 'general'): Promise<UploadResponse> => {
    const filename = uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);
    formData.append('folder', folder);

    const res = await apiClient.post(ENDPOINTS.UPLOAD.FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data?.data || res.data;
  },
};
