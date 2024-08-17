import { NewMonitorDialog } from "./components/new-monitor-dialog";
import { getLoggedInUserId } from "@/lib/auth";
import { MonitorService } from "@/lib/data-layer/monitors";
import { MonitorsTable } from "./components/monitors-table";

export default async function ProtectedPage() {
  const userId = await getLoggedInUserId();
  const monitors = await MonitorService.list(userId);

  if (monitors.length > 0) {
    return (
      <div className="mt-5 ">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <h2 className="mb-4">
          Monitor websites changes using natural language
        </h2>

        <MonitorsTable monitors={monitors} />
      </div>
    );
  }

  return <EmptyScreen />;
}

function EmptyScreen() {
  return (
    <div className="min-h-[500px] flex justify-center flex-col items-center gap-4 self-stretch">
      <h1 className="text-3xl font-bold">Welcome!</h1>
      <h2 className="mb-4">Monitor websites changes using natural language</h2>
      <NewMonitorDialog />
    </div>
  );
}
