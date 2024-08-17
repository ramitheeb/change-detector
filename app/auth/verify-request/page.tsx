export default function VerifyRequest() {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <div className="border flex flex-col items-center justify-center p-4 rounded-sm">
        <div className="text-xl font-bold">Check your email</div>
        <div className="text-muted-foreground mt-3">
          A sign in link has been sent to your email address.
        </div>
      </div>
    </div>
  );
}
