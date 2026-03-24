import { Request, Response } from 'express';
import { db } from '../db';
import { documents } from '../db/schema';
import { eq } from 'drizzle-orm';

// STAFF: Upload Dokumen Baru
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const { trackingNumber, clientName, docType, status, notes } = req.body;
    const staffId = (req as any).user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File dokumen wajib diunggah.' });
    }

    await db.insert(documents).values({
      trackingNumber,
      clientName,
      docType,
      status: status || 'RECEIVED',
      notes,
      fileUrl: file.path,
      uploadedBy: staffId,
    });

    res
      .status(201)
      .json({ message: 'Dokumen berhasil diunggah dan disimpan.' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Gagal mengunggah dokumen.', details: error });
  }
};

// PUBLIC/CLIENT: Track Dokumen tanpa Login
export const trackDocument = async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;

    const result = await db
      .select({
        trackingNumber: documents.trackingNumber,
        clientName: documents.clientName,
        docType: documents.docType,
        status: documents.status,
        updatedAt: documents.updatedAt,
        // KITA TIDAK MERETURN fileUrl AGAR CLIENT TIDAK BISA DOWNLOAD TANPA IZIN
      })
      .from(documents)
      .where(eq(documents.trackingNumber, trackingNumber))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({
        error: 'Dokumen tidak ditemukan. Periksa kembali Nomor Resi Anda.',
      });
    }

    res.json({ data: result[0] });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};
