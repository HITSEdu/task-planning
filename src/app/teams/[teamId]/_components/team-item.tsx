'use client'

import { TeamWithRoleDTO } from '@/app/data/team/team.dto'

type TeamItemProps = {
  team: TeamWithRoleDTO
}

export default function TeamItem({ team }: TeamItemProps) {


  return (
    <div className="flex-1">
      <h1 className="text-2xl font-semibold">{team.name}</h1>
      <p className="text-gray-500 mt-2">Твоя роль: {team.role}</p>
    </div>
  )
}