import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('STAFF').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  trackingCode: varchar('tracking_code', { length: 50 }).notNull().unique(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  docType: docTypeEnum('doc_type').notNull(),
  status: docStatusEnum('status').default('RECEIVED').notNull(),
  fileUrl: text('file_url'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const trackingHistories = pgTable('tracking_histories', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id')
    .references(() => documents.id)
    .notNull(),
  status: docStatusEnum('status').notNull(),
  notes: text('notes'),
  changedBy: uuid('changed_by')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documentRelations = relations(documents, ({ many }) => ({
  histories: many(trackingHistories),
}));

export const historyRelations = relations(trackingHistories, ({ one }) => ({
  document: one(documents, {
    fields: [trackingHistories.documentId],
    references: [documents.id],
  }),
  user: one(users, {
    fields: [trackingHistories.changedBy],
    references: [users.id],
  }),
}));
