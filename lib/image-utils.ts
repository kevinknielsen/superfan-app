export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function getRandomColor(): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

export function getAspectRatio(width: number, height: number): string {
  return `${width} / ${height}`
}

export function getImagePlaceholder(width: number, height: number, text = ""): string {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`
}
