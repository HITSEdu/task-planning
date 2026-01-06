"use client";

import { useActionState, useEffect } from "react";
import { signInAction } from "@/app/actions/user";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { redirect } from "next/navigation";
import Link from "next/link";
import { sitePages } from "@/app/config/site.config";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, {});

  useEffect(() => {
    if (!pending) {
      if (state.status === "error") {
        toast.error(state.message);
      } else if (state.status === "success") {
        toast.success(state.message);
        redirect("/");
      }
    }
  }, [state, pending]);

  return (
    <form
      action={action}
      className="flex w-full max-w-sm items-center bg-card p-4 rounded-lg"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Вход в аккаунт</FieldLegend>
          <FieldDescription>
            Войдите в аккаунт, чтобы продолжить работу
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-username">
                Имя пользователя
              </FieldLabel>
              <Input
                type="text"
                name="username"
                id="checkout-username"
                placeholder="username"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-password">Пароль</FieldLabel>
              <Input
                type="password"
                name="password"
                id="checkout-password"
                placeholder="password"
                required
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit">
            {" "}
            {pending ? "Вход..." : "Войти в аккаунт"}
          </Button>
          <Button variant="outline" asChild>
            <Link
              key={sitePages.register.path}
              href={sitePages.register.path}
              className={`transition-colors hover:text-primary`}
            >
              {sitePages.register.labelKey}
            </Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
