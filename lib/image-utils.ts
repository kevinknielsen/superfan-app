// Get a random avatar image
export function getRandomAvatar() {
  const avatarNumber = Math.floor(Math.random() * 5) + 1
  return `/placeholder-avatars/avatar-${avatarNumber}.png`
}

// Get a random group image
export function getRandomGroupImage() {
  const groupNumber = Math.floor(Math.random() * 5) + 1
  return `/placeholder-groups/group-${groupNumber}.png`
}

// Get a random deal image
export function getRandomDealImage() {
  const dealNumber = Math.floor(Math.random() * 5) + 1
  return `/placeholder-deals/deal-${dealNumber}.png`
}

// Get initials from a name
export function getInitials(name: string): string {
  if (!name) return ""

  const parts = name.split(" ")
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
