export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

export interface IStorageService {
  /**
   * Upload file to storage
   */
  upload(file: Buffer, filename: string, mimetype: string): Promise<UploadResult>;

  /**
   * Delete file from storage
   */
  delete(key: string): Promise<void>;

  /**
   * Get public URL for file
   */
  getUrl(key: string): string;
}
