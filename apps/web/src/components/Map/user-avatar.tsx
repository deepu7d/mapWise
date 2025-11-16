// src/components/UserAvatarBar.tsx
import { memo } from "react";
import { User } from "@repo/types";
import { usersColor } from "@/helper/constant";

type UserAvatarBarProps = {
  users: User[];
  onUserClick: (user: User) => void;
};

function UserAvatarBar({ users, onUserClick }: UserAvatarBarProps) {
  return (
    <div className="absolute bottom-0 left-0 flex w-full gap-2 overflow-y-auto p-2">
      {users.map((user, index) => {
        const colorTailwind = usersColor[index % usersColor.length].tailwind;
        return (
          <button
            key={user.id}
            onClick={() => onUserClick(user)}
            className={`${colorTailwind} ... h-10 w-10 rounded-full font-semibold`}
          >
            {user.name[0].toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export const MemoizedUserAvatarBar = memo(UserAvatarBar);
