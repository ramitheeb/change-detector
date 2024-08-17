"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onSubmitAction, testMonitor } from "../actions";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { availableModels, formSchema } from "../utils";
import { toast } from "sonner";

export function NewMonitorDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2" size={16} />
          Create New Monitor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]  max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Create New Monitor</DialogTitle>
          <DialogDescription>
            create a new monitor to start tracking changes on a website using
            natural language.
          </DialogDescription>
        </DialogHeader>
        <CreateMonitorForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

const CreateMonitorForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: 120,
      prompt: "",
      url: "",
      name: "",
      model: "gpt-4o-mini-2024-07-18",
    },
  });

  const [isTesting, setIsTesting] = useState(false);
  const [lastTest, setLastTest] = useState<
    { result: any; prompt: string } | undefined
  >(undefined);

  const prompt = form.watch("prompt");
  const [step, setStep] = useState<0 | 1>(0);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onSubmitAction(data).then(() => {
            setOpen(false);
          })
        )}
      >
        <div className={step === 1 ? "hidden" : ""}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monitor Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Name your monitor"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Url</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem> */}
                    {/* <SelectItem value="60">1 hour</SelectItem> */}
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="360">6 hours</SelectItem>
                    <SelectItem value="720">12 hours</SelectItem>
                    <SelectItem value="1440">1 day</SelectItem>
                    <SelectItem value="4320">3 days</SelectItem>
                    <SelectItem value="10080">1 week</SelectItem>
                    <SelectItem value="20160">2 weeks</SelectItem>
                    <SelectItem value="43200">1 month</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How often you want to check the website for changes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={() => {
                const name = form.getValues("name");
                const url = form.getValues("url");
                const frequency = form.getValues("frequency");

                const result = formSchema.safeParse({
                  name,
                  url,
                  frequency,
                  prompt: "sadf asdf as ",
                  model: "gpt-4o-mini-2024-07-18",
                });

                form.trigger("frequency");
                form.trigger("url");
                form.trigger("name");

                if (!result.success) {
                  return;
                }

                setStep(1);
              }}
            >
              Next
            </Button>
          </DialogFooter>
        </div>

        <div className={step === 0 ? "hidden" : ""}>
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe what you want to monitor</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="the price of the starter plan..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-3" />

          <p className="text-muted-foreground text-sm">
            test your monitor to make sure it&lsquo;s working correctly. You can
            change the prompt and test multiple times before creating it.
          </p>

          <DialogFooter>
            <div className="flex-col justify-between w-full items-center mt-4">
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isTesting || prompt === ""}
                  onClick={async () => {
                    setIsTesting(true);
                    try {
                      const result = await testMonitor(form.getValues());
                      if (result.status !== "completed") {
                        toast("Test failed to run");
                        return;
                      }
                      setLastTest({
                        result,
                        prompt: form.getValues("prompt"),
                      });
                    } finally {
                      setIsTesting(false);
                    }
                  }}
                >
                  {isTesting ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : null}
                  {isTesting ? "Testing..." : "Test Monitor"}
                </Button>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        type="submit"
                        disabled={
                          form.formState.isSubmitting ||
                          isTesting ||
                          !lastTest ||
                          lastTest.result.status !== "completed" ||
                          lastTest.prompt !== prompt
                        }
                        size="sm"
                      >
                        {form.formState.isSubmitting ? (
                          <Loader2
                            size={16}
                            className="mr-2 animate-spin"
                            color="black"
                          />
                        ) : null}
                        {form.formState.isSubmitting ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent>
                      <p className="text-black">
                        You need to test the monitor before creating it.
                      </p>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </div>

              {lastTest ? (
                <div className="mt-4">
                  <Separator />
                  <div className="mt-4">
                    <div>
                      <p>
                        Test result:{" "}
                        {lastTest.result.status === "completed"
                          ? "Completed"
                          : "Failed"}
                      </p>
                      {lastTest.result.status === "completed" ? (
                        <div className="flex gap-2">
                          <p>data: </p>

                          <HoverCard>
                            <HoverCardTrigger>
                              <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap bg-neutral-800 px-2 p-[1px] rounded-sm">
                                {JSON.stringify(lastTest.result.value)}
                              </p>
                            </HoverCardTrigger>
                            <HoverCardPortal>
                              <HoverCardContent className="w-fit">
                                <pre>
                                  {JSON.stringify(
                                    lastTest.result.value,
                                    null,
                                    2
                                  )}
                                </pre>
                              </HoverCardContent>
                            </HoverCardPortal>
                          </HoverCard>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
};
