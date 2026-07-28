// utils/avatar.js
export const getAvatarColor = (name) => {
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-lime-400",
    "bg-green-400",
    "bg-teal-400",
    "bg-cyan-400",
    "bg-blue-400",
    "bg-indigo-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-rose-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const getInitials = (firstName, lastName) => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};
