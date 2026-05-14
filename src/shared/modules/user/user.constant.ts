export const DEFAULT_AVATAR_PATH = '/static/avatar.jpg';
export const USER_TYPES = ['ordinary', 'pro'] as const;

export type UserType = typeof USER_TYPES[number];
