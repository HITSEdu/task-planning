"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { unassignUserAction } from "@/app/actions/tasks";
import type { TaskWithDependenciesDTO } from "@/app/data/task/task.dto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type UnassignUserFormProps = {
  task: TaskWithDependenciesDTO;
  userId: string;
};

export default function UnassignUserForm({
  task,
  userId,
}: UnassignUserFormProps) {
  const [state, action, pending] = useActionState(
    unassignUserAction.bind(null, task.id, userId),
    {},
  );

  useEffect(() => {
    if (!pending) {
      if (state.status === "error") {
        toast.error(state.message);
      } else if (state.status === "success") {
        toast.success(state.message);
      }
    }
  }, [state, pending]);

  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>
          {pending ? "Снятие..." : "Снять назначение"}
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Снятие назначения</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <form
            action={action}
            className="flex items-center bg-card rounded-lg"
          >
            <DialogClose asChild>
              <Button type="submit" variant="secondary">
                {pending ? "Снятие..." : "Снять назначение"}
              </Button>
            </DialogClose>
          </form>
          <DialogClose asChild>
            <Button variant="outline">Назад</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
