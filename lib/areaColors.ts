export function getAreaColorClasses(color?: string | null) {
  switch (color) {
    case "blue":
      return {
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        card: "border-blue-500/30",
        soft: "bg-blue-950/20",
      };

    case "green":
      return {
        badge: "bg-green-500/20 text-green-300 border-green-500/30",
        card: "border-green-500/30",
        soft: "bg-green-950/20",
      };

    case "purple":
      return {
        badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        card: "border-purple-500/30",
        soft: "bg-purple-950/20",
      };

    case "yellow":
      return {
        badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        card: "border-yellow-500/30",
        soft: "bg-yellow-950/20",
      };

    case "red":
      return {
        badge: "bg-red-500/20 text-red-300 border-red-500/30",
        card: "border-red-500/30",
        soft: "bg-red-950/20",
      };

    default:
      return {
        badge: "bg-zinc-800 text-zinc-300 border-zinc-700",
        card: "border-zinc-700",
        soft: "bg-zinc-900",
      };
  }
}