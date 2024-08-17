import { getLoggedInUserId } from "@/lib/auth";
import { MonitorService } from "@/lib/data-layer/monitors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableDemo } from "./components/events-table";
import { DeleteButton } from "./components/delete-button";
import { Bot, Clock } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { monitorId: string };
}) {
  const userId = await getLoggedInUserId();
  const monitor = await MonitorService.get(params.monitorId, userId);
  return (
    <div className="mt-10">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold capitalize ">
            {monitor.name} Monitor
          </h1>
          <h2>
            <a href={monitor.url} target="_blank" className="underline">
              {monitor.url}
            </a>
          </h2>
          <h3 className="mt-2">{monitor.prompt}</h3>
        </div>

        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <Bot size={16} className="mr-1" />
            {monitor.model}
          </div>

          <div className="flex gap-1 items-center">
            <Clock size={16} className="mr-1" /> every{" "}
            {monitor.frequencyInMinutes} minutes
          </div>

          <DeleteButton monitorId={monitor.id} />
        </div>
      </div>

      <Tabs defaultValue="last_20" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="change_events" className="w-full">
            Change Events
          </TabsTrigger>
          <TabsTrigger value="last_20" className="w-full">
            Last 20 events
          </TabsTrigger>
        </TabsList>
        <TabsContent value="last_20">
          <DataTableDemo data={monitor.events} />
        </TabsContent>
        <TabsContent value="change_events">
          <DataTableDemo
            data={monitor.changeEvents}
            emptyMessage="The value you're monitoring hasn't changed yet"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
