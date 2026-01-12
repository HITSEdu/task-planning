"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import GanttChart, { ViewMode } from "react-modern-gantt";
import type { TaskWithDependenciesDTO } from "@/app/data/task/task.dto";
import { ProjectWithStatusDTO } from "@/app/data/project/project.dto";

type GanttChartItemProps = {
  tasks: TaskWithDependenciesDTO[];
  project?: ProjectWithStatusDTO;
};

type TmpTask = {
  id: string;
  raw: TaskWithDependenciesDTO;
  origStart: Date;
  origEnd: Date;
  durationMs: number;
  deps: string[];
  resolvedStart?: Date;
  resolvedEnd?: Date;
};

export const PALETTE: { color: string; name: string }[] = [
  { color: "#F4A261", name: "SoftApricot" },
  { color: "#E76F51", name: "BurntOrange" },
  { color: "#E9C46A", name: "WarmMustard" },
  { color: "#F284B6", name: "DustyPink" },
  { color: "#D16BA5", name: "RoseMauve" },
  { color: "#9B8AFB", name: "SoftLavender" },
  { color: "#5E60CE", name: "IndigoBlue" },
  { color: "#4EA8DE", name: "CalmSky" },
  { color: "#7DB9E8", name: "PowderBlue" },
  { color: "#4361EE", name: "RoyalBlue" },
  { color: "#3A0CA3", name: "DeepViolet" },
  { color: "#7209B7", name: "PlumPurple" },
  { color: "#B5179E", name: "MagentaBerry" },
  { color: "#C77DFF", name: "LightPurple" },
  { color: "#F72585", name: "HotPink" },
  { color: "#FF8FAB", name: "BlushPink" },
  { color: "#FFB703", name: "GoldenAmber" },
  { color: "#FB8500", name: "RichAmber" },
  { color: "#ADB5BD", name: "CoolGray" },
  { color: "#495057", name: "SlateGray" },
];

export const PROGRESS = new Map<string, number>([
  ["CREATED", 0],
  ["IN_PROGRESS", 50],
  ["COMPLETED", 100],
]);

export const ONE_DAY = 24 * 60 * 60 * 1000;
export const COMPLETED_COLOR = "#59AB0C";

export function hashStringToInt(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function pickColor(id: string, status?: string) {
  if (status === "COMPLETED") {
    return COMPLETED_COLOR;
  }
  const idx = hashStringToInt(id) % PALETTE.length;
  return PALETTE[idx].color;
}

export function normalizeDates(
  created?: Date | null,
  deadline?: Date | null,
  projectDeadline?: Date | null,
) {
  let origStart = created ?? new Date();
  let origEnd = deadline ?? projectDeadline ?? new Date(origStart.getTime() + ONE_DAY);

  if (origEnd.getTime() <= origStart.getTime()) {
    origEnd = new Date(origStart.getTime() + ONE_DAY);
  }

  return { origStart, origEnd };
}

export function mapDepIdsToTitles(
  deps: string[],
  byId: Map<string, TmpTask>,
): string[] {
  return deps
    .map((id) => byId.get(id)?.raw.title)
    .filter((title): title is string => Boolean(title));
}

export function createTmpItems(
  tasksInput: TaskWithDependenciesDTO[] | TaskWithDependenciesDTO,
  project?: ProjectWithStatusDTO,
) {
  const arr = Array.isArray(tasksInput) ? tasksInput : [tasksInput];

  return arr.map((t) => {
    const created = t.createdAt ?? new Date();
    const deadline = t.deadline ?? null;
    const projectDeadline = project?.deadline ?? null;

    const { origStart, origEnd } = normalizeDates(created, deadline, projectDeadline as Date | null);

    const durationMs = Math.max(1, origEnd.getTime() - origStart.getTime());
    const deps = (t.dependsOn ?? []).map((d) => String(d.id));

    return {
      id: String(t.id),
      raw: t,
      origStart,
      origEnd,
      durationMs,
      deps,
    } as TmpTask;
  });
}

export function buildById(items: TmpTask[]) {
  const byId = new Map<string, TmpTask>();
  for (const it of items) byId.set(it.id, it);
  return byId;
}

export function resolveAll(items: TmpTask[]) {
  const byId = buildById(items);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const inCycle = new Set<string>();

  function resolveTask(id: string): { start: Date; end: Date } {
    const node = byId.get(id);
    if (!node) return { start: new Date(0), end: new Date(ONE_DAY) };

    if (node.resolvedStart && node.resolvedEnd) return { start: node.resolvedStart, end: node.resolvedEnd };

    if (visiting.has(id)) {
      inCycle.add(id);
      node.resolvedStart = node.origStart;
      node.resolvedEnd = new Date(node.resolvedStart.getTime() + node.durationMs);
      visiting.delete(id);
      visited.add(id);
      return { start: node.resolvedStart, end: node.resolvedEnd };
    }

    visiting.add(id);

    let depsMaxEnd: Date | null = null;
    for (const depId of node.deps) {
      const dep = byId.get(String(depId));
      if (!dep) continue;
      const resolved = resolveTask(dep.id);
      if (!depsMaxEnd || resolved.end > depsMaxEnd) depsMaxEnd = resolved.end;
    }

    let start: Date;
    if (depsMaxEnd) {
      start = new Date(depsMaxEnd.getTime() + ONE_DAY);
    } else {
      start = node.origStart;
    }

    const end = new Date(start.getTime() + node.durationMs);

    node.resolvedStart = start;
    node.resolvedEnd = end;

    visiting.delete(id);
    visited.add(id);

    return { start, end };
  }

  for (const it of items) {
    if (!visited.has(it.id)) resolveTask(it.id);
  }

  return { items, byId, inCycle } as const;
}

export function mapTasksToGanttGroups(
  tasksInput: TaskWithDependenciesDTO[] | TaskWithDependenciesDTO,
  project: ProjectWithStatusDTO,
) {
  const items = createTmpItems(tasksInput, project);
  const { items: resolvedItems, byId } = resolveAll(items);

  const mapped = resolvedItems.map((node) => ({
    id: node.id,
    name: node.raw.title,
    description: node.raw.description,
    startDate: node.resolvedStart ?? node.origStart,
    endDate: node.resolvedEnd ?? node.origEnd,
    color: pickColor(node.id, node.raw.status),
    percent: PROGRESS.get(node.raw.status ?? "") ?? 0,
    dependencies: mapDepIdsToTitles(node.deps, byId),
    _raw: node.raw,
  }));

  return [
    {
      id: String(project.id),
      name: project.title,
      tasks: mapped,
    },
  ];
}

export default function GanttChartItem({ tasks, project }: GanttChartItemProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const groups = useMemo(() => mapTasksToGanttGroups(tasks, project!), [tasks, project?.id, project?.title]);

  return (
    <GanttChart
      headerLabel="Проекты"
      tasks={groups}
      darkMode={isDark}
      showProgress={true}
      editMode={false}
      viewMode={ViewMode.DAY}
      viewModes={[ViewMode.DAY, ViewMode.WEEK, ViewMode.MONTH]}
    />
  );
}
