export type EventType = {
  id: string;
  title: string;
  date: string;
  activity: EventActivityType;
  mood?: MoodType;
  theme?: WeekendTheme;
  end: string
  eventId?: string
};
export enum EventActionType {
  ADD = "ADD_EVENT",
  UPDATE = "UPDATE_EVENT",
  REMOVE = "REMOVE_EVENT",
  UPDATE_ORDER = "UPDATE_ORDER_EVENTS",
}

export enum EventActivityType {
  HIKING = "HIKING_EVENT",
  BRUNCH = "BRUNCH_EVENT",
  MOVIE = "MOVIE_EVENT",
  FIGHT = "FIGHT_EVENT",
  READING = "READING_EVENT",
}

export const EventActivityEmojis: Record<EventActivityType, string> = {
  [EventActivityType.HIKING]: "⛰️",
  [EventActivityType.BRUNCH]: "🥞",
  [EventActivityType.MOVIE]: "🎬",
  [EventActivityType.FIGHT]: "🥊",
  [EventActivityType.READING]: "📖",
};

export enum MoodType {
  HAPPY = "HAPPY",
  RELAXED = "RELAXED",
  ENERGETIC = "ENERGETIC",
}

export enum WeekendTheme {
  LAZY = "LAZY_WEEKEND",
  ADVENTUROUS = "ADVENTUROUS_WEEKEND",
  FAMILY = "FAMILY_WEEKEND",
}
