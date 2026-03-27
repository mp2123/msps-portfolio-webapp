export const INVISIBLE_WALL_FETCH_LIMIT = 18;
export const INVISIBLE_WALL_ALIAS_MAX_LENGTH = 24;
export const INVISIBLE_WALL_MESSAGE_MAX_LENGTH = 180;
export const INVISIBLE_WALL_COOLDOWN_MS = 1000 * 75;
export const INVISIBLE_WALL_WINDOW_MS = 1000 * 60 * 15;
export const INVISIBLE_WALL_MAX_POSTS_PER_WINDOW = 3;

export type InvisibleInkWallMessage = {
  id: string;
  alias: string | null;
  message: string;
  createdAt: string;
};

const URL_PATTERN =
  /(https?:\/\/|www\.|javascript:|data:|mailto:|discord\.gg|bit\.ly|tinyurl\.com)/i;

export const normalizeInvisibleInkValue = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();

export const normalizeInvisibleInkAlias = (value: string) =>
  normalizeInvisibleInkValue(value).slice(0, INVISIBLE_WALL_ALIAS_MAX_LENGTH);

export const normalizeInvisibleInkMessage = (value: string) =>
  normalizeInvisibleInkValue(value).slice(0, INVISIBLE_WALL_MESSAGE_MAX_LENGTH);

export const isInvisibleInkMessageAllowed = (value: string) => {
  if (!value) return false;
  if (URL_PATTERN.test(value)) return false;
  if (/[<>]/.test(value)) return false;
  if (/script/gi.test(value)) return false;
  return true;
};
