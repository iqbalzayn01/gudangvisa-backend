import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { documents, trackingHistories } from '../../db/schema.js';
import { AppError } from '../../utils/AppError.js';

export class DocumentRepository {
  async createDocumentWithHistory(data: typeof documents.$inferInsert) {
    return await db.transaction(async (tx) => {
      // Insert the document
      const [newDoc] = await tx.insert(documents).values(data).returning();

      if (!newDoc) {
        throw new AppError(
          500,
          'Database failed to return the newly created document.',
        );
      }

      // Insert the first tracking history
      await tx.insert(trackingHistories).values({
        documentId: newDoc.id,
        status: 'RECEIVED',
        notes: 'Dokumen diterima dan didaftarkan ke dalam sistem.',
        changedBy: data.createdBy!,
      });

      return newDoc;
    });
  }

  async findByTrackingCode(trackingCode: string) {
    return await db.query.documents.findFirst({
      where: eq(documents.trackingCode, trackingCode),
      with: {
        histories: {
          with: { user: { columns: { name: true } } },
          orderBy: (histories, { desc }) => [desc(histories.createdAt)],
        },
      },
    });
  }

  async updateStatusWithHistory(
    documentId: string,
    status: any,
    notes: string,
    userId: string,
  ) {
    return await db.transaction(async (tx) => {
      const [updatedDoc] = await tx
        .update(documents)
        .set({ status, updatedAt: new Date() })
        .where(eq(documents.id, documentId))
        .returning();

      if (!updatedDoc) {
        throw new AppError(
          404,
          'Document not found or database failed to update.',
        );
      }

      await tx.insert(trackingHistories).values({
        documentId: updatedDoc.id,
        status,
        notes,
        changedBy: userId,
      });

      return updatedDoc;
    });
  }
}
