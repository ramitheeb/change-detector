import { Button } from "components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col h-screen text-foreground bg-background">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="flex gap-2 items-end relative">
          <h1 className="text-8xl font-extrabold text-foreground">
            Change Detector
          </h1>
          {/* <p className="text-4xl absolute right-[-70px] bottom-[-5px]">Beta</p> */}
        </div>
        <div className="text-center max-w-screen-sm mb-10">
          <h1 className="font-semibold text-2xl mt-2">
            Monitor website changes using natural language!
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/app"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            <Button> Start Now</Button>
          </Link>
        </div>
        <div className="flex mt-10"></div>
      </div>
    </div>
  );
}
