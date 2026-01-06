"use client";

import { TaskWithDependenciesDTO } from "@/app/data/task/task.dto";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import GanttChart, { ViewMode } from "react-modern-gantt";

type GanttChartItemProps = {
  tasks: TaskWithDependenciesDTO[];
  project?: { id: string; title?: string };
};

export function mapTasksToGanttGroups(
  tasksInput: TaskWithDependenciesDTO[] | TaskWithDependenciesDTO,
  groupId = "Project",
  groupName = "Tasks",
) {
  const arr = Array.isArray(tasksInput) ? tasksInput : [tasksInput];

  type Tmp = {
    id: string;
    raw: TaskWithDependenciesDTO;
    origStart: Date | null;
    origEnd: Date | null;
    durationMs: number;
    deps: string[];
    resolvedStart?: Date;
    resolvedEnd?: Date;
  };

  const ONE_DAY = 24 * 60 * 60 * 1000;

  const items: Tmp[] = arr.map((t) => {
    const created = t.createdAt;
    const deadline = t.deadline ?? null;
    let origStart = created;
    let origEnd = deadline;

    if (!origStart && origEnd) {
      origStart = new Date(origEnd.getTime() - ONE_DAY);
    }
    if (origStart && !origEnd) {
      origEnd = new Date(origStart.getTime() + ONE_DAY);
    }
    if (!origStart && !origEnd) {
      const now = new Date();
      origStart = now;
      origEnd = new Date(now.getTime() + ONE_DAY);
    }

    const durationMs = Math.max(1, origEnd!.getTime() - origStart!.getTime());
    const deps = (t.dependsOn ?? []).map((d) => String(d.id));

    return {
      id: String(t.id),
      raw: t,
      origStart,
      origEnd,
      durationMs,
      deps,
    } as Tmp;
  });

  const byId = new Map<string, Tmp>();
  items.forEach((it) => byId.set(it.id, it));

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const inCycle = new Set<string>();

  function resolveTask(id: string): { start: Date; end: Date } {
    const node = byId.get(id);
    if (!node) {
      return { start: new Date(0), end: new Date(ONE_DAY) };
    }

    if (node.resolvedStart && node.resolvedEnd) {
      return { start: node.resolvedStart, end: node.resolvedEnd };
    }

    if (visiting.has(id)) {
      inCycle.add(id);
      node.resolvedStart = node.origStart!;
      node.resolvedEnd = new Date(
        node.resolvedStart.getTime() + node.durationMs,
      );
      visiting.delete(id);
      visited.add(id);
      return { start: node.resolvedStart, end: node.resolvedEnd };
    }

    visiting.add(id);

    let depsMaxEnd: Date | null = null;
    for (const depId of node.deps) {
      const dep = byId.get(String(depId));
      if (!dep) {
        continue;
      }
      const resolved = resolveTask(dep.id);
      if (!depsMaxEnd || resolved.end > depsMaxEnd) depsMaxEnd = resolved.end;
    }

    let start: Date;
    if (depsMaxEnd) {
      start = new Date(
        Math.max(depsMaxEnd.getTime(), node.origStart!.getTime()),
      );
    } else {
      start = node.origStart!;
    }

    const end = new Date(start.getTime() + node.durationMs);

    node.resolvedStart = start;
    node.resolvedEnd = end;

    visiting.delete(id);
    visited.add(id);

    return { start, end };
  }

  for (const it of items) {
    if (!visited.has(it.id)) {
      resolveTask(it.id);
    }
  }

  const mapped = items.map((node) => ({
    id: node.id,
    name: node.raw.title,
    description: node.raw.description,
    startDate: node.resolvedStart ?? node.origStart!,
    endDate: node.resolvedEnd ?? node.origEnd!,
    color:
      node.raw.status === "COMPLETED"
        ? "#8cf071"
        : node.raw.status === "IN_PROGRESS"
          ? "#ff571f"
          : "#5c64ff",
    dependencies: node.deps.filter(Boolean),
    _raw: node.raw,
  }));

  return [
    {
      id: String(groupId),
      name: groupName,
      tasks: mapped,
    },
  ];
}

export default function GanttChartItem({
  tasks,
  project,
}: GanttChartItemProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const groups = useMemo(
    () =>
      mapTasksToGanttGroups(
        tasks,
        project?.id ?? "project",
        project?.title ?? "Tasks",
      ),
    [tasks, project?.id, project?.title],
  );

  // TODO: Добавить навигацию назад
  return (
    <GanttChart
      headerLabel="Проекты"
      tasks={groups}
      darkMode={isDark}
      showProgress={false}
      editMode={false}
      viewMode={ViewMode.MONTH}
      viewModes={[ViewMode.DAY, ViewMode.WEEK, ViewMode.MONTH, ViewMode.YEAR]}
    />
  );
}
