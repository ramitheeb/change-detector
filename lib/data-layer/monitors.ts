import { db } from "@/lib/db";
import { monitorEvents, monitors } from "../db/schema";
import { and, desc, eq, InferInsertModel } from "drizzle-orm";

export type Monitor = Awaited<ReturnType<typeof getUserMonitors>>[number];

async function getUserMonitors(userId: string) {
  return await db
    .selectDistinctOn([monitors.id], {
      id: monitors.id,
      name: monitors.name,
      url: monitors.url,
      prompt: monitors.prompt,
      frequencyInMinutes: monitors.frequencyInMinutes,
      latestEventCreatedAt: monitorEvents.created_at,
      created_at: monitors.created_at,
    })
    .from(monitors)
    .leftJoin(monitorEvents, eq(monitors.id, monitorEvents.monitorId))
    .where(eq(monitors.userId, userId))
    .orderBy(monitors.id, desc(monitorEvents.created_at));
}

async function createMonitor(input: InferInsertModel<typeof monitors>) {
  const created = await db.insert(monitors).values(input).returning();

  if (!created[0]) {
    throw new Error("Failed to create monitor");
  }

  return created[0];
}

async function deleteMonitor(monitorId: string, userId: string) {
  return db
    .delete(monitors)
    .where(and(eq(monitors.id, monitorId), eq(monitors.userId, userId)));
}

async function getMonitor(monitorId: string, userId: string) {
  const monitorsRes = await db
    .select({
      id: monitors.id,
      name: monitors.name,
      url: monitors.url,
      prompt: monitors.prompt,
      frequencyInMinutes: monitors.frequencyInMinutes,
      userId: monitors.userId,
      model: monitors.model,
    })
    .from(monitors)
    .where(eq(monitors.id, monitorId));

  const [monitor] = monitorsRes;

  if (monitor.userId !== userId) {
    throw new Error("Monitor not found");
  }

  const last20Events = await db
    .select({
      id: monitorEvents.id,
      event: monitorEvents.event,
      data_changed: monitorEvents.data_changed,
      data: monitorEvents.data,
      previous_data: monitorEvents.previous_data,
      created_at: monitorEvents.created_at,
    })
    .from(monitorEvents)
    .where(eq(monitorEvents.monitorId, monitorId))
    .orderBy(desc(monitorEvents.created_at))
    .limit(20);

  const changeEvents = await db
    .select({
      id: monitorEvents.id,
      event: monitorEvents.event,
      data_changed: monitorEvents.data_changed,
      data: monitorEvents.data,
      previous_data: monitorEvents.previous_data,
      created_at: monitorEvents.created_at,
    })
    .from(monitorEvents)
    .where(
      and(
        eq(monitorEvents.monitorId, monitorId),
        eq(monitorEvents.data_changed, true)
      )
    )
    .orderBy(desc(monitorEvents.created_at));

  return {
    ...monitor,
    events: last20Events,
    changeEvents,
  };
}

export const MonitorService = {
  list: getUserMonitors,
  create: createMonitor,
  delete: deleteMonitor,
  get: getMonitor,
};
