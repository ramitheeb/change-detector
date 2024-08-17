import { InferInsertModel } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const monitorModel = pgEnum("monitorModel", [
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-2024-05-13",
  "claude-3-haiku-20240307",
  "claude-3-5-sonnet-20240620",
]);

export const monitors = pgTable("monitor", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  name: text("name").notNull(),
  prompt: text("prompt").notNull(),
  frequencyInMinutes: integer("frequencyInMinutes").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),

  model: monitorModel("model").notNull().default("gpt-4o-mini-2024-07-18"),
});

export const monitorEventType = pgEnum("monitorEvent", ["monitor-run"]);
export const monitorEvents = pgTable("monitor-event", {
  id: uuid("id").primaryKey().defaultRandom(),
  event: monitorEventType("event").notNull(),
  monitorId: uuid("monitorId")
    .notNull()
    .references(() => monitors.id, { onDelete: "cascade" }),
  data_changed: boolean("data_changed").notNull(),
  data: jsonb("data").notNull(),
  previous_data: jsonb("previous_data"),

  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type MonitorEvent = InferInsertModel<typeof monitorEvents>;
