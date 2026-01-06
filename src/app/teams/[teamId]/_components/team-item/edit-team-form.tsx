"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateTeamAction } from "@/app/actions/teams";
import type { TeamWithRoleDTO } from "@/app/data/team/team.dto";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type DeleteTeamFormProps = {
  team: TeamWithRoleDTO;
};

export default function EditTeamForm({ team }: DeleteTeamFormProps) {
  const [state, action, pending] = useActionState(
    updateTeamAction.bind(null, team.id),
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

  if (team.role !== "OWNER") return null;

  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger>
          {pending ? "Изменение..." : "Перейти к редактированию"}
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать команду</DialogTitle>
        </DialogHeader>
        <form
          action={action}
          className="flex items-center bg-card p-2 rounded-lg"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-team-name">
                Название команды
              </FieldLabel>
              <Input
                defaultValue={team.name}
                type="text"
                name="name"
                placeholder="Название"
                id="checkout-team-name"
                required
              />
            </Field>
            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button type="submit">
                  {pending ? "Изменение..." : "Изменить"}
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline">Назад</Button>
              </DialogClose>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
