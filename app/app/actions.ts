"use server";

import { z } from "zod";
import { auth, getLoggedInUserId } from "@/lib/auth";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "@/lib/intunedClient";
import { MonitorService } from "@/lib/data-layer/monitors";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formSchema } from "./utils";

export async function testMonitor(values: z.infer<typeof formSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const result = await getIntunedClient().project.run.sync(
    INTUNED_PROJECT_NAME,
    {
      api: "check-change",
      parameters: {
        url: values.url,
        prompt: values.prompt,
        model: values.model,
      },
      retry: {
        maximumAttempts: 3,
      },
    }
  );

  const value = result.status === "completed" && result.result?.newValue;

  return {
    status: result.status,
    value,
  };
}

export async function deleteMonitor(monitorId: string) {
  const userId = await getLoggedInUserId();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  await MonitorService.delete(monitorId, userId);

  await getIntunedClient().project.jobs.pause(
    INTUNED_PROJECT_NAME,
    "monitor-" + monitorId
  );

  await revalidatePath("/app");
  await redirect("/app");
}

export async function onSubmitAction(values: z.infer<typeof formSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const monitor = await MonitorService.create({
    userId: session.user.id,
    frequencyInMinutes: values.frequency,
    name: values.name,
    prompt: values.prompt,
    url: values.url,
    model: values.model,
  });

  await getIntunedClient().project.jobs.create(INTUNED_PROJECT_NAME, {
    configuration: {
      runMode: "Order-Irrelevant",
      maxConcurrentRequests: 1,
      retry: {
        maximumAttempts: 3,
      },
    },
    id: `monitor-${monitor.id}`,
    payload: [
      {
        apiName: "check-change",
        parameters: {
          url: monitor.url,
          prompt: monitor.prompt,
          monitorId: monitor.id,
          model: monitor.model,
        },
      },
    ],
    sink: {
      type: "webhook",
      url: `${process.env.DOMAIN}/api/webhooks/change-event`,
      skipOnFail: true,
      headers: {
        Authorization: `Bearer ${process.env.WEBHOOK_SECRET}`,
      },
    },
    schedule: {
      intervals: [
        {
          every: `${values.frequency}m`,
        },
      ],
    },
  });

  await revalidatePath("/app");
}
