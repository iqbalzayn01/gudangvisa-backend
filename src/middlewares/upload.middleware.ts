/**
 * @deprecated — This middleware has been removed.
 *
 * File uploads now use Supabase Storage with Signed URLs.
 * See: src/utils/storage.ts
 *
 * The upload workflow is:
 * 1. Client requests a signed upload URL from POST /api/v1/documents/upload-url
 * 2. Client uploads the file directly to Supabase Storage
 * 3. Client sends the storage path to POST /api/v1/documents
 */
export {};
