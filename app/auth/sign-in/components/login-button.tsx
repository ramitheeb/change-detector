"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type={pending ? "button" : "submit"} aria-disabled={pending}>
      {pending && (
        <Loader2 className="mr-2 animate-spin" size={16} color="black" />
      )}

      {pending ? "Logging in" : "Login"}

      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </Button>
  );
}
