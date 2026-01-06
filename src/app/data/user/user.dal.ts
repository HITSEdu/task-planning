import type { StateType } from "@/app/config/site.config";
import { authClient } from "@/lib/auth-client";
import type { CreateUser, LoginUser } from "./user.dto";

export class UserDAL {
  static async signUp(data: CreateUser): Promise<StateType> {
    try {
      const res = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username,
      });

      if (res.error)
        return {
          status: "error",
          message: "Почта или имя пользователя уже используются",
        };

      return {
        status: "success",
        message: "Успешная регистрация",
      };
    } catch {
      return { status: "error", message: "Ошибка регистрации!" };
    }
  }

  static async signIn(data: LoginUser): Promise<StateType> {
    try {
      const res = await authClient.signIn.username({
        username: data.username,
        password: data.password,
      });

      if (res.error) return { status: "error", message: res.error.message };

      return { status: "success", message: "Успешный вход" };
    } catch {
      return { status: "error", message: "Ошибка входа!" };
    }
  }

  static async signOut(): Promise<StateType> {
    try {
      await authClient.signOut();
      return { status: "success", message: "Успешный выход" };
    } catch {
      return { status: "error", message: "Ошибка выхода!" };
    }
  }
}
