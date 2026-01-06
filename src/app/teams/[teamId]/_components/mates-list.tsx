import type { UserWithTeamDTO } from "@/app/data/user/user.dto";
import { ItemGroup } from "@/components/ui/item";
import MateItem from "./mate-item";

type MatesListProps = {
  mates: UserWithTeamDTO[];
  user: UserWithTeamDTO;
};

export default function MatesList({ mates, user }: MatesListProps) {
  return (
    <ItemGroup className="space-y-3">
      {mates.map((mate) => (
        <MateItem key={mate.id} mate={mate} user={user} teamId={mate.teamId} />
      ))}
    </ItemGroup>
  );
}
