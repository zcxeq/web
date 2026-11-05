import config from "../../config";

const API = `${config.VITE_API_HOST}/api`;

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }
  return res.json();
}

export type Profile = {
  profile: {
    account_id: number;
    personaname: string;
    avatarfull: string;
    profileurl?: string;
    plus?: boolean;
    loccountrycode?: string;
  };
  rank_tier: number | null;
  leaderboard_rank: number | null;
};

export type WL = { win: number; lose: number };

export type RecentMatch = {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  duration: number;
  game_mode: number;
  lobby_type: number;
  hero_id: number;
  start_time: number;
  kills: number;
  deaths: number;
  assists: number;
  xp_per_min: number;
  gold_per_min: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
  last_hits: number;
  party_size: number | null;
  average_rank?: number | null;
};

export type HeroStat = {
  hero_id: number | string;
  last_played: number;
  games: number;
  win: number;
  with_games: number;
  with_win: number;
  against_games: number;
  against_win: number;
};

export type Peer = {
  account_id: number;
  last_played: number;
  win: number;
  games: number;
  with_win: number;
  with_games: number;
  personaname: string | null;
  avatarfull: string | null;
};

export type LeanMatch = {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  start_time: number;
  hero_id: number;
};

export const isRadiant = (slot: number) => slot < 128;
export const isWin = (m: { player_slot: number; radiant_win: boolean }) =>
  isRadiant(m.player_slot) === m.radiant_win;
