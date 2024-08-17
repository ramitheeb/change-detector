import { IntunedClient } from "@intuned/client";

export const INTUNED_PROJECT_NAME = process.env.Intuned_project_name as string;

export function getIntunedClient() {
  return new IntunedClient({
    apiKey: process.env.Intuned_API_KEY,
    workspaceId: process.env.Intuned_workspace_id,
  });
}
