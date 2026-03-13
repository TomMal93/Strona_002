export const SUPPORTED_SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'tiktok',
  'youtube',
] as const

export type SocialPlatform = (typeof SUPPORTED_SOCIAL_PLATFORMS)[number]

type SocialLink = {
  platform: string
  href: string
}

export function isSocialPlatform(platform: string): platform is SocialPlatform {
  return (SUPPORTED_SOCIAL_PLATFORMS as readonly string[]).includes(platform)
}

export function filterSupportedSocialLinks<T extends SocialLink>(
  links: readonly T[],
): Array<T & { platform: SocialPlatform }> {
  return links.filter(
    (link): link is T & { platform: SocialPlatform } => isSocialPlatform(link.platform),
  )
}
