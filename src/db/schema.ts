import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
export const roleEnum = pgEnum('role', ['STAFF', 'ADMIN']);
export const docTypeEnum = pgEnum('doc_type', ['VISA', 'KITAS', 'PASSPORT']);
export const docStatusEnum = pgEnum('doc_status', [
  'RECEIVED',
  'IN_REVIEW',
  'IN_PROCESS',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
]);

// --- TABLES ---
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('STAFF').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  resiNumber: varchar('resi_number', { length: 255 }).notNull().unique(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  type: docTypeEnum('type').notNull(),
  status: docStatusEnum('status').default('RECEIVED').notNull(),
  fileUrl: text('file_url').notNull(), // Path file PDF/JPG
  staffId: uuid('staff_id')
    .references(() => users.id)
    .notNull(), // Siapa yang upload
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trackingHistories = pgTable('tracking_histories', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id')
    .references(() => documents.id, { onDelete: 'cascade' })
    .notNull(),
  status: docStatusEnum('status').notNull(),
  description: text('description'),
  changedBy: varchar('changed_by', { length: 255 }).notNull(), // Nama Staff
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- RELATIONS ---
export const documentRelations = relations(documents, ({ one, many }) => ({
  staff: one(users, {
    fields: [documents.staffId],
    references: [users.id],
  }),
  histories: many(trackingHistories),
}));

export const historyRelations = relations(trackingHistories, ({ one }) => ({
  document: one(documents, {
    fields: [trackingHistories.documentId],
    references: [documents.id],
  }),
}));
