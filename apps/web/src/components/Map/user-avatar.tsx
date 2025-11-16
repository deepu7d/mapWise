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
    <div className="flex gap-2 p-2 overflow-y-auto w-full absolute bottom-0 left-0">
      {users.map((user, index) => {
        const colorTailwind = usersColor[index % usersColor.length].tailwind;
        return (
          <button
            key={user.id}
            onClick={() => onUserClick(user)}
            className={`${colorTailwind} w-10 h-10 rounded-full font-semibold ...`}
          >
            {user.name[0].toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export const MemoizedUserAvatarBar = memo(UserAvatarBar);
