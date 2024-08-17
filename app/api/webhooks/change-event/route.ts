import { MonitorEventsService } from "@/lib/data-layer/events";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");

    if (authorization !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const parsedBody = intunedWebhookSchema.safeParse(await req.json());
    if (!parsedBody.success) {
      return new Response("Bad Request", { status: 400 });
    }

    const monitorId = parsedBody.data.apiInfo.parameters.monitorId;
    const result = parsedBody.data.apiInfo.result.result;

    await MonitorEventsService.create({
      event: "monitor-run",
      monitorId,
      data_changed: result.changed,
      data: result.newValue,
      previous_data: result.oldValue ?? null,
    });
    return Response.json({ delivered: true });
  } catch (e) {
    console.error(e);
    return Response.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

const intunedWebhookSchema = z.object({
  apiInfo: z.object({
    name: z.literal("check-change"),
    parameters: z.object({
      url: z.string(),
      prompt: z.string(),
      monitorId: z.string(),
    }),
    runId: z.string(),
    result: z.object({
      status: z.string(),
      result: z.object({
        newValue: z.any(),
        changed: z.boolean(),
        oldValue: z.any().optional().nullable(),
      }),
      statusCode: z.number(),
    }),
  }),
  workspaceId: z.string(),
  project: z.object({ name: z.string(), id: z.string() }),
  projectJob: z.object({ id: z.string() }),
  projectJobRun: z.object({ id: z.string() }),
});
