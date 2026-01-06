"use client";

import { ChevronDownIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createTaskAction } from "@/app/actions/tasks";
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
import { Textarea } from "@/components/ui/textarea";

type CreateTaskFormProps = {
  projectId: string;
  availableTasks: Array<{ id: string; title: string }>;
};

export default function CreateTaskForm({
  projectId,
  availableTasks,
}: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [state, action, pending] = useActionState(
    createTaskAction.bind(null, projectId),
    {},
  );

  useEffect(() => {
    if (!pending && state.time && state.time + 10 > Date.now()) {
      if (state.status === "error") {
        toast.error(state.message);
      } else if (state.status === "success") {
        toast.success(state.message);
      }
    }
  }, [state, pending]);

  return (
    <form
      action={action}
      className="flex flex-col gap-4 w-full bg-card p-4 rounded-lg max-h-[70vh] overflow-y-auto"
    >
      <FieldGroup className="flex flex-col gap-4">
        <FieldSet>
          <FieldLegend className="text-lg font-semibold mb-2">
            Создать задачу
          </FieldLegend>

          <Field className="flex flex-col gap-2">
            <FieldLabel htmlFor="checkout-task-title">
              Название задачи
            </FieldLabel>
            <Input
              type="text"
              name="title"
              placeholder="Введите название задачи"
              id="checkout-task-title"
              required
            />
          </Field>

          <Field className="flex flex-col gap-2">
            <FieldLabel htmlFor="checkout-task-description">
              Описание
            </FieldLabel>
            <Textarea
              name="description"
              placeholder="Что-то важное..."
              id="checkout-task-description"
              rows={4}
            />
          </Field>

          <Field className="flex flex-col gap-2">
            <Label htmlFor="checkout-task-deadline">Срок сдачи</Label>
            <input
              type="hidden"
              name="deadline"
              value={formatDateForInput(date)}
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="checkout-task-deadline"
                  type="button"
                  className="justify-between"
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

          <Field className="flex flex-col gap-2">
            <Label htmlFor="dependsOn">Зависит от</Label>
            <select
              id="dependsOn"
              name="dependsOn"
              multiple
              className="w-full border rounded-md p-2"
            >
              {availableTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            <small className="text-gray-500">
              Удерживайте Ctrl для выбора нескольких задач
            </small>
          </Field>
        </FieldSet>

        <Button type="submit" disabled={pending} className="mt-4">
          {pending ? "Создание..." : "Создать задачу"}
        </Button>
      </FieldGroup>
    </form>
  );
}
