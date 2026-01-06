"use client";

import { ChevronDownIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createProjectAction } from "@/app/actions/projects";
import { formatDateForInput } from "@/app/data/utils/format-date";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CreateProjectFormProps = {
  teamId: string;
};

export default function CreateProjectForm({ teamId }: CreateProjectFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [state, action, pending] = useActionState(
    createProjectAction.bind(null, teamId),
    {},
  );

  useEffect(() => {
    if (!pending) {
      if (state.status === "error") {
        toast.error(state.message);
      } else if (state.status === "success") {
        toast.success(state.message);

        const projectId = state.data?.id;
        if (projectId) redirect(`/teams/${teamId}/projects/${projectId}`);
      }
    }
  }, [state, pending]);

  return (
    <form
      action={action}
      className="flex w-full max-w-sm items-center bg-card p-2 rounded-lg"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Создать проект</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-project-title">
                Название проекта
              </FieldLabel>
              <Input
                type="text"
                name="title"
                placeholder="Название"
                id="checkout-project-title"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-project-description">
                Описание проекта
              </FieldLabel>
              <Input
                type="text"
                name="description"
                placeholder="Описание"
                id="checkout-project-description"
              />
            </Field>
            <Field>
              <Label htmlFor="checkout-project-deadline" className="px-1">
                Срок сдачи
              </Label>
              <input
                type="hidden"
                name="deadline"
                value={formatDateForInput(date)}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="checkout-project-deadline"
                    className="w-48 justify-between font-normal"
                    type="button"
                  >
                    {date ? date.toLocaleDateString() : "Выбрать дату"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit"> {pending ? "Создание..." : "Создать"}</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
