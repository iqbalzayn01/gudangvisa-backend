import { supabase, BUCKET_NAME } from '../config/supabase.js';
import { AppError } from './AppError.js';
import { randomUUID } from 'crypto';

/** Maximum file size in bytes (2 MB) */
const MAX_FILE_SIZE = 2 * 1024 * 1024;

/** Allowed MIME types for document uploads */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

/** Signed download URL expiry in seconds (1 hour) */
const SIGNED_URL_EXPIRY = 3600;

/**
 * Validate file metadata before generating a signed upload URL.
 * Checks MIME type and optional file size.
 */
export function validateFileMetadata(
  fileName: string,
  contentType: string,
  fileSize?: number,
) {
  if (!fileName || !contentType) {
    throw new AppError(400, 'fileName and contentType are required.');
  }

  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    throw new AppError(
      400,
      'Invalid file type. Only JPG, PNG, and PDF are allowed.',
    );
  }

  if (fileSize !== undefined && fileSize > MAX_FILE_SIZE) {
    throw new AppError(400, 'File size exceeds the maximum limit of 2 MB.');
  }
}

/**
 * Generate a unique storage path for a document file.
 * Format: documents/{uuid}/{sanitized-filename}
 */
export function generateStoragePath(fileName: string): string {
  const uuid = randomUUID();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `documents/${uuid}/${sanitized}`;
}

/**
 * Create a signed upload URL for direct client-to-Supabase uploads.
 * The returned URL allows a single PUT request to upload the file.
 */
export async function createSignedUploadUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(storagePath);

  if (error) {
    throw new AppError(500, `Storage error: ${error.message}`);
  }

  return {
    signedUrl: data.signedUrl,
    path: data.path,
    token: data.token,
  };
}

/**
 * Verify that a file exists in Supabase Storage after upload.
 * Also performs a server-side file size check as a safety net.
 */
export async function verifyFileExists(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .info(storagePath);

  if (error || !data) {
    throw new AppError(
      400,
      'File not found in storage. Please upload the file first.',
    );
  }

  if (data.size !== undefined && data.size > MAX_FILE_SIZE) {
    throw new AppError(400, 'Uploaded file exceeds the 2 MB limit.');
  }

  return data;
}

/**
 * Generate a temporary signed download URL for a stored file.
 * URL expires after SIGNED_URL_EXPIRY seconds (default: 1 hour).
 * Returns null if no storage path is provided.
 */
export async function createSignedDownloadUrl(
  storagePath: string | null,
): Promise<string | null> {
  if (!storagePath) return null;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY);

  if (error) {
    throw new AppError(
      500,
      `Failed to generate download URL: ${error.message}`,
    );
  }

  return data.signedUrl;
}
