import { Form } from "./components/form";
import { signIn } from "lib/auth";
import { LoginButton } from "./components/login-button";

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-border  px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-muted-foreground">
            Use your email and password to sign in
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", formData);
          }}
        >
          <LoginButton />
        </Form>
      </div>
    </div>
  );
}
