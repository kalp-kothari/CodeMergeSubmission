import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const getBucketName = (): string => {
  const bucket = env.SUPABASE_STORAGE_BUCKET?.trim();

  if (!bucket) {
    throw new Error('SUPABASE_STORAGE_BUCKET is not configured');
  }

  return bucket;
};

const sanitizePath = (path: string): string => {
  return path
    .replace(/\\/g, '/')          // Windows slashes → /
    .replace(/^\/+|\/+$/g, '')    // remove leading/trailing /
    .split('/')
    .filter(Boolean)
    .map(segment => segment.trim())
    .filter(Boolean)
    .join('/');
};

export const uploadFile = async (
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<string> => {
  const bucket = getBucketName();
  const safePath = sanitizePath(path);

  if (!safePath) {
    throw new Error('Storage upload failed: empty or invalid file path');
  }

  if (!buffer || buffer.length === 0) {
    throw new Error('Storage upload failed: file buffer is empty');
  }

  console.log('Storage upload:', {
    bucket,
    path: safePath,
    size: buffer.length,
    contentType
  });

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(safePath, buffer, {
      contentType,
      upsert: false
    });

  if (error) {
    console.error('Supabase Storage error:', {
      message: error.message,
      name: error.name,
      bucket,
      path: safePath
    });

    throw new Error(`Storage upload failed: ${error.message}`);
  }

  if (!data?.path) {
    throw new Error('Storage upload failed: Supabase returned no file path');
  }

  return data.path;
};

export const deleteFile = async (path: string): Promise<void> => {
  const bucket = getBucketName();
  const safePath = sanitizePath(path);

  if (!safePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([safePath]);

  if (error) {
    logger.error(
      `Failed to delete file from storage: ${safePath}`,
      error
    );
  }
};

export const getSignedUrl = async (
  path: string,
  expiresIn: number = 300
): Promise<string> => {
  const bucket = getBucketName();
  const safePath = sanitizePath(path);

  if (!safePath) {
    throw new Error('Failed to generate signed URL: invalid file path');
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(safePath, expiresIn);

  if (error || !data) {
    throw new Error(
      `Failed to generate signed URL: ${error?.message ?? 'No URL returned'}`
    );
  }

  return data.signedUrl;
};