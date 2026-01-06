import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

type EmptyListProps = {
  type: "teams" | "invites" | "projects" | "tasks";
};

const phrases = {
  teams:
    "У вас пока нет команд.\n" +
    "          Вы можете создать свою или получить приглашение от других людей.",
  invites: "У вас пока нет новых приглашений.",
  projects: "У вас пока нет проектов.",
  tasks: "В этом проекте пока нет задач.",
};

const titles = {
  teams: "команд",
  invites: "приглашений",
  projects: "проектов",
  tasks: "задач",
};

export default function EmptyList({ type }: EmptyListProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Нет {titles[type]}</EmptyTitle>
        <EmptyDescription>{phrases[type]}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
