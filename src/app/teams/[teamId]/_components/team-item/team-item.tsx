"use client";

import Link from "next/link";
import type { TeamWithRoleDTO } from "@/app/data/team/team.dto";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import DeleteTeamForm from "./delete-team-form";
import EditTeamForm from "./edit-team-form";

type TeamItemProps = {
  team: TeamWithRoleDTO;
};

export default function TeamItem({ team }: TeamItemProps) {
  const isOwner = team.role === "OWNER";

  return (
    <Item variant="default" className="flex flex-col gap-4 items-start">
      <ItemContent>
        <ItemTitle>{team.name}</ItemTitle>
        <ItemDescription>Твоя роль: {team.role}</ItemDescription>
      </ItemContent>
      <ItemActions className="flex gap-4 flex-col items-start">
        <Button asChild variant="outline">
          <Link href={`/teams/${team.id}/projects`}>Проекты</Link>
        </Button>
        {isOwner && (
          <>
            <EditTeamForm team={team} />
            <DeleteTeamForm team={team} />
          </>
        )}
      </ItemActions>
    </Item>
  );
}
