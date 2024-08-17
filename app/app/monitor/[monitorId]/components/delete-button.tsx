"use client";

import { deleteMonitor } from "@/app/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function DeleteButton({ monitorId }: { monitorId: string }) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            monitor and its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isDeleting}
            size="sm"
            onClick={async () => {
              setIsDeleting(true);
              try {
                await deleteMonitor(monitorId);
              } catch (e) {
                toast("Failed to delete monitor");
              } finally {
                setIsDeleting(false);
              }
            }}
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin mr-2 " color="black" />
            ) : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return;
}
