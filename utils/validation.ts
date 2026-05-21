import type { PlayerProfile } from "@/types/game";

export type SetupErrors = Partial<Record<keyof PlayerProfile, string>>;

export function validatePlayer(profile: PlayerProfile): SetupErrors {
  const errors: SetupErrors = {};

  if (!profile.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!profile.username.trim()) {
    errors.username = "Username is required.";
  }

  if (!Number.isFinite(profile.length) || profile.length < 2 || profile.length > 8) {
    errors.length = "Length must be between 2 and 8.";
  }

  if (!Number.isFinite(profile.width) || profile.width < 2 || profile.width > 8) {
    errors.width = "Width must be between 2 and 8.";
  }

  return errors;
}

export function hasErrors(errors: SetupErrors): boolean {
  return Object.keys(errors).length > 0;
}
