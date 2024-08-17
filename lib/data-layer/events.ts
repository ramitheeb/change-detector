import { monitorEvents, MonitorEvent } from "lib/db/schema";
import { db } from "lib/db";

async function createNewMonitorEvent(event: MonitorEvent) {
  const created = await db.insert(monitorEvents).values(event).returning();

  if (!created[0]) {
    throw new Error("Failed to create monitor event");
  }

  return created[0];
}

export const MonitorEventsService = {
  create: createNewMonitorEvent,
};
