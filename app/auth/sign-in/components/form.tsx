import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Form({
  action,
  children,
}: {
  action: any;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      className="flex flex-col space-y-4  px-4 py-8 sm:px-16"
    >
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          required
        />
      </div>
      {children}
    </form>
  );
}
