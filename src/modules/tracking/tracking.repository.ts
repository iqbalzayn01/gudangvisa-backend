import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { documents, trackingHistories } from '../../db/schema';

export class TrackingRepository {
  async findByTrackingCode(trackingCode: string) {
    return await db.query.documents.findFirst({
      where: eq(documents.trackingCode, trackingCode),
      with: {
        histories: {
          with: { user: { columns: { name: true, role: true } } },
          orderBy: (histories, { desc }) => [desc(histories.createdAt)],
        },
      },
    });
  }

  async updateStatusWithLog(
    documentId: string,
    status: any,
    notes: string,
    staffId: string,
  ) {
    return await db.transaction(async (tx) => {
      const [updatedDoc] = await tx
        .update(documents)
        .set({ status, updatedAt: new Date() })
        .where(eq(documents.id, documentId))
        .returning();

      await tx.insert(trackingHistories).values({
        documentId,
        status,
        notes,
        changedBy: staffId,
      });

      return updatedDoc;
    });
  }
}
