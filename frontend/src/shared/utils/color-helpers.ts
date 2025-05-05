export const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-amber-500";
      case "editor":
        return "bg-emerald-500";
      case "viewer":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };