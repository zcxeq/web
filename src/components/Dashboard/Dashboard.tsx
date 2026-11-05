import React, { useEffect, useMemo, useState } from "react";
import Helmet from "react-helmet";
import { heroes } from "dotaconstants";

import config from "../../config";
import useStrings from "../../hooks/useStrings.hook";
import {
  getJson,
  HeroStat,
  isWin,
  LeanMatch,
  Peer,
  Profile,
  RecentMatch,
  WL,
} from "./api";
import * as S from "./Styled";

const ID = config.MY_ACCOUNT_ID;
const CDN = config.VITE_IMAGE_CDN;

// ---------- хелперы ----------

const hero = (id: number | string) => (heroes as any)[String(id)];
const heroImg = (id: number | string) => {
  const h = hero(id);
  return h ? `${CDN}${h.img}` : "";
};
const heroIcon = (id: number | string) => {
  const h = hero(id);
  return h ? `${CDN}${h.icon}` : "";
};
const heroName = (id: number | string) => hero(id)?.localized_name || `#${id}`;

const pct = (w: number, g: number) => (g ? (w / g) * 100 : 0);
const fmtPct = (v: number) => `${v.toFixed(1)}%`;
const wrColor = (v: number) =>
  v >= 55 ? S.C.green : v >= 50 ? "#a7e3c4" : v >= 45 ? "#f2b8bd" : S.C.red;

const fmtDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const timeAgo = (unix: number) => {
  const diff = Date.now() / 1000 - unix;
  const plural = (n: number, forms: [string, string, string]) => {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
    return forms[2];
  };
  if (diff < 3600) {
    const n = Math.max(1, Math.floor(diff / 60));
    return `${n} ${plural(n, ["минуту", "минуты", "минут"])} назад`;
  }
  if (diff < 86400) {
    const n = Math.floor(diff / 3600);
    return `${n} ${plural(n, ["час", "часа", "часов"])} назад`;
  }
  const n = Math.floor(diff / 86400);
  if (n < 30) return `${n} ${plural(n, ["день", "дня", "дней"])} назад`;
  return new Date(unix * 1000).toLocaleDateString("ru-RU");
};

const RANKS = [
  "",
  "Рекрут",
  "Страж",
  "Рыцарь",
  "Герой",
  "Легенда",
  "Властелин",
  "Божество",
  "Титан",
];

const rankInfo = (tier: number | null, lb: number | null) => {
  if (!tier) return { name: "Без ранга", icon: "rank_icon_0.png", star: 0 };
  const medal = Math.floor(tier / 10);
  const star = tier % 10;
  if (medal === 8) {
    let icon = "rank_icon_8.png";
    if (lb && lb <= 10) icon = "rank_icon_8c.png";
    else if (lb && lb <= 100) icon = "rank_icon_8b.png";
    return { name: lb ? `Титан #${lb}` : "Титан", icon, star: 0 };
  }
  return {
    name: `${RANKS[medal]} ${star || ""}`.trim(),
    icon: `rank_icon_${medal}.png`,
    star: Math.min(star, 5),
  };
};

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

// ---------- загрузка данных ----------

type Data = {
  profile?: Profile;
  wl?: WL;
  wl30?: WL;
  recent?: RecentMatch[];
  heroesAll?: HeroStat[];
  heroes180?: HeroStat[];
  peers?: Peer[];
  lean?: LeanMatch[];
};

function useDashboardData(reloadKey: number) {
  const [data, setData] = useState<Data>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setError(null);
    const p = `/players/${ID}`;
    const load = <K extends keyof Data>(key: K, path: string) =>
      getJson<Data[K]>(path)
        .then((v) => alive && setData((d) => ({ ...d, [key]: v })))
        .catch((e) => alive && setError(String(e.message || e)));

    load("profile", p);
    load("wl", `${p}/wl`);
    load("wl30", `${p}/wl?date=30`);
    load("recent", `${p}/recentMatches`);
    load("heroesAll", `${p}/heroes`);
    load("heroes180", `${p}/heroes?date=180`);
    load("peers", `${p}/peers?date=365`);
    load(
      "lean",
      `${p}/matches?date=90&project=start_time&project=radiant_win&project=player_slot&project=hero_id`,
    );
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  return { data, error };
}

// ---------- секции ----------

const ProfileCard = ({
  profile,
  wl,
  wl30,
  onRefresh,
  refreshing,
}: {
  profile?: Profile;
  wl?: WL;
  wl30?: WL;
  onRefresh: () => void;
  refreshing: boolean;
}) => {
  if (!profile) return <S.Skeleton style={{ height: 140 }} />;
  const r = rankInfo(profile.rank_tier, profile.leaderboard_rank);
  const total = wl ? wl.win + wl.lose : 0;
  const total30 = wl30 ? wl30.win + wl30.lose : 0;
  return (
    <S.ProfileCard>
      <S.Avatar src={profile.profile.avatarfull} alt="" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <S.Name>{profile.profile.personaname}</S.Name>
        <S.Muted>
          ID {profile.profile.account_id}
          {profile.profile.plus ? " · Dota Plus" : ""}
        </S.Muted>
        <S.ProfileStats>
          <div>
            <S.Label>Всего</S.Label>
            <S.Value>
              <S.W>{wl?.win ?? "—"}</S.W> / <S.L>{wl?.lose ?? "—"}</S.L>
            </S.Value>
            <S.Muted>
              {wl ? fmtPct(pct(wl.win, total)) : ""} побед
            </S.Muted>
          </div>
          <div>
            <S.Label>30 дней</S.Label>
            <S.Value>
              <S.W>{wl30?.win ?? "—"}</S.W> / <S.L>{wl30?.lose ?? "—"}</S.L>
            </S.Value>
            <S.Muted>
              {wl30 && total30 ? `${fmtPct(pct(wl30.win, total30))} побед` : "нет игр"}
            </S.Muted>
          </div>
        </S.ProfileStats>
        <S.Actions>
          <S.ButtonLink to={`/players/${ID}/overview`}>
            Полный профиль
          </S.ButtonLink>
          <S.Button onClick={onRefresh} disabled={refreshing} className="ghost">
            {refreshing ? "Обновляю…" : "Обновить данные"}
          </S.Button>
        </S.Actions>
      </div>
      <S.Medal title={r.name}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <img
            src={`/assets/images/dota2/rank_icons/${r.icon}`}
            alt={r.name}
            style={{ position: "absolute", inset: 0, width: "100%" }}
          />
          {r.star > 0 && (
            <img
              src={`/assets/images/dota2/rank_icons/rank_star_${r.star}.png`}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%" }}
            />
          )}
        </div>
        <S.MedalName>{r.name}</S.MedalName>
      </S.Medal>
    </S.ProfileCard>
  );
};

const SummaryTiles = ({ recent }: { recent?: RecentMatch[] }) => {
  if (!recent) return <S.Skeleton style={{ height: 96 }} />;
  if (!recent.length) return null;
  const wins = recent.filter(isWin).length;
  const k = avg(recent.map((m) => m.kills));
  const d = avg(recent.map((m) => m.deaths));
  const a = avg(recent.map((m) => m.assists));
  const tiles = [
    {
      label: "Винрейт",
      value: fmtPct(pct(wins, recent.length)),
      sub: `${wins}–${recent.length - wins}`,
      color: wrColor(pct(wins, recent.length)),
    },
    {
      label: "KDA",
      value: ((k + a) / Math.max(1, d)).toFixed(2),
      sub: `${k.toFixed(1)} / ${d.toFixed(1)} / ${a.toFixed(1)}`,
    },
    { label: "GPM", value: avg(recent.map((m) => m.gold_per_min)).toFixed(0) },
    { label: "XPM", value: avg(recent.map((m) => m.xp_per_min)).toFixed(0) },
    {
      label: "Урон по героям",
      value: `${(avg(recent.map((m) => m.hero_damage)) / 1000).toFixed(1)}k`,
    },
    {
      label: "Длительность",
      value: fmtDuration(Math.round(avg(recent.map((m) => m.duration)))),
    },
  ];
  return (
    <S.Card>
      <S.CardTitle>
        Последние {recent.length} игр
      </S.CardTitle>
      <S.Tiles>
        {tiles.map((t) => (
          <S.Tile key={t.label}>
            <S.Label>{t.label}</S.Label>
            <S.Big style={{ color: t.color }}>{t.value}</S.Big>
            {t.sub && <S.Muted>{t.sub}</S.Muted>}
          </S.Tile>
        ))}
      </S.Tiles>
      <S.FormStrip>
        {[...recent].reverse().map((m) => (
          <S.FormCell
            key={m.match_id}
            className={isWin(m) ? "win" : "loss"}
            title={`${heroName(m.hero_id)}: ${m.kills}/${m.deaths}/${m.assists}`}
            to={`/matches/${m.match_id}`}
          >
            <img src={heroIcon(m.hero_id)} alt="" />
          </S.FormCell>
        ))}
      </S.FormStrip>
      <S.Muted style={{ marginTop: 6 }}>Слева старые, справа последние</S.Muted>
    </S.Card>
  );
};

const RecentMatches = ({ recent }: { recent?: RecentMatch[] }) => {
  const strings = useStrings() as any;
  if (!recent) return <S.Skeleton style={{ height: 400 }} />;
  return (
    <S.Card>
      <S.CardTitle>
        Последние матчи
        <S.TitleLink to={`/players/${ID}/matches`}>Все матчи →</S.TitleLink>
      </S.CardTitle>
      <S.MatchList>
        {recent.map((m) => {
          const win = isWin(m);
          const kda = (m.kills + m.assists) / Math.max(1, m.deaths);
          return (
            <S.MatchRow key={m.match_id} to={`/matches/${m.match_id}`} className={win ? "win" : "loss"}>
              <S.HeroThumb src={heroImg(m.hero_id)} alt="" />
              <div style={{ minWidth: 0 }}>
                <S.RowTitle>{heroName(m.hero_id)}</S.RowTitle>
                <S.Muted>
                  {strings[`game_mode_${m.game_mode}`] || "Матч"}
                  {m.lobby_type === 7 ? " · Рейтинг" : ""}
                </S.Muted>
              </div>
              <div>
                <S.Result className={win ? "win" : "loss"}>{win ? "Победа" : "Поражение"}</S.Result>
                <S.Muted>{timeAgo(m.start_time + m.duration)}</S.Muted>
              </div>
              <div>
                <S.RowTitle>
                  {m.kills} / <S.L>{m.deaths}</S.L> / {m.assists}
                </S.RowTitle>
                <S.Muted>KDA {kda.toFixed(2)}</S.Muted>
              </div>
              <S.HideSmall>
                <S.RowTitle>{m.gold_per_min}</S.RowTitle>
                <S.Muted>GPM</S.Muted>
              </S.HideSmall>
              <S.HideSmall>
                <S.RowTitle>{fmtDuration(m.duration)}</S.RowTitle>
                <S.Muted>время</S.Muted>
              </S.HideSmall>
            </S.MatchRow>
          );
        })}
      </S.MatchList>
    </S.Card>
  );
};

const TopHeroes = ({
  all,
  recent180,
}: {
  all?: HeroStat[];
  recent180?: HeroStat[];
}) => {
  const [period, setPeriod] = useState<"180" | "all">("180");
  const list = period === "180" ? recent180 : all;
  if (!list) return <S.Skeleton style={{ height: 360 }} />;
  const top = list
    .filter((h) => h.games > 0)
    .sort((a, b) => b.games - a.games)
    .slice(0, 10);
  const max = top[0]?.games || 1;
  return (
    <S.Card>
      <S.CardTitle>
        Мои герои
        <S.Segmented>
          <button
            className={period === "180" ? "on" : ""}
            onClick={() => setPeriod("180")}
          >
            180 дней
          </button>
          <button
            className={period === "all" ? "on" : ""}
            onClick={() => setPeriod("all")}
          >
            Всё время
          </button>
        </S.Segmented>
      </S.CardTitle>
      {top.length === 0 && <S.Muted>Нет игр за этот период</S.Muted>}
      {top.map((h) => {
        const wr = pct(h.win, h.games);
        return (
          <S.HeroRow key={h.hero_id}>
            <S.HeroThumb src={heroImg(h.hero_id)} alt="" className="small" />
            <div style={{ minWidth: 0 }}>
              <S.RowTitle>{heroName(h.hero_id)}</S.RowTitle>
              <S.Bar>
                <span style={{ width: `${(h.games / max) * 100}%` }} />
              </S.Bar>
            </div>
            <S.Num>{h.games}</S.Num>
            <S.Num style={{ color: wrColor(wr) }}>{fmtPct(wr)}</S.Num>
          </S.HeroRow>
        );
      })}
    </S.Card>
  );
};

const Matchups = ({ all }: { all?: HeroStat[] }) => {
  if (!all) return <S.Skeleton style={{ height: 300 }} />;
  const MIN = 8;
  const pool = all.filter((h) => h.against_games >= MIN);
  const byWr = [...pool].sort(
    (a, b) =>
      pct(a.against_win, a.against_games) - pct(b.against_win, b.against_games),
  );
  const worst = byWr.slice(0, 6);
  const best = byWr.slice(-6).reverse();
  const col = (title: string, rows: HeroStat[]) => (
    <div>
      <S.SubTitle>{title}</S.SubTitle>
      {rows.map((h) => {
        const wr = pct(h.against_win, h.against_games);
        return (
          <S.MiniRow key={h.hero_id}>
            <img src={heroIcon(h.hero_id)} alt="" />
            <span>{heroName(h.hero_id)}</span>
            <S.Muted>{h.against_games}</S.Muted>
            <b style={{ color: wrColor(wr) }}>{fmtPct(wr)}</b>
          </S.MiniRow>
        );
      })}
    </div>
  );
  return (
    <S.Card>
      <S.CardTitle>Против героев</S.CardTitle>
      <S.Muted style={{ marginBottom: 12 }}>
        Мой винрейт, когда герой в команде противника (от {MIN} игр, всё время)
      </S.Muted>
      <S.TwoCols>
        {col("Неудобные", worst)}
        {col("Удобные", best)}
      </S.TwoCols>
    </S.Card>
  );
};

const Friends = ({ peers }: { peers?: Peer[] }) => {
  if (!peers) return <S.Skeleton style={{ height: 300 }} />;
  const top = peers
    .filter((p) => p.with_games >= 3)
    .sort((a, b) => b.with_games - a.with_games)
    .slice(0, 8);
  return (
    <S.Card>
      <S.CardTitle>
        Играю с ними
        <S.TitleLink to={`/players/${ID}/peers`}>Все →</S.TitleLink>
      </S.CardTitle>
      <S.Muted style={{ marginBottom: 12 }}>За последний год, в одной команде</S.Muted>
      {top.length === 0 && <S.Muted>Нет совместных игр</S.Muted>}
      {top.map((p) => {
        const wr = pct(p.with_win, p.with_games);
        return (
          <S.MiniRowLink key={p.account_id} to={`/players/${p.account_id}`}>
            <img src={p.avatarfull || ""} alt="" style={{ borderRadius: "50%" }} />
            <span>{p.personaname || p.account_id}</span>
            <S.Muted>{p.with_games}</S.Muted>
            <b style={{ color: wrColor(wr) }}>{fmtPct(wr)}</b>
          </S.MiniRowLink>
        );
      })}
    </S.Card>
  );
};

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const Activity = ({ lean }: { lean?: LeanMatch[] }) => {
  const grid = useMemo(() => {
    const g = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => ({ games: 0, wins: 0 })),
    );
    (lean || []).forEach((m) => {
      const d = new Date(m.start_time * 1000);
      const day = (d.getDay() + 6) % 7;
      const cell = g[day][d.getHours()];
      cell.games += 1;
      if (isWin(m)) cell.wins += 1;
    });
    return g;
  }, [lean]);

  if (!lean) return <S.Skeleton style={{ height: 260 }} />;
  const max = Math.max(1, ...grid.flat().map((c) => c.games));

  // Винрейт по времени суток
  const buckets = [
    { name: "Ночь", from: 0, to: 6 },
    { name: "Утро", from: 6, to: 12 },
    { name: "День", from: 12, to: 18 },
    { name: "Вечер", from: 18, to: 24 },
  ].map((b) => {
    let games = 0;
    let wins = 0;
    grid.forEach((row) =>
      row.slice(b.from, b.to).forEach((c) => {
        games += c.games;
        wins += c.wins;
      }),
    );
    return { ...b, games, wins };
  });

  return (
    <S.Card>
      <S.CardTitle>Когда я играю</S.CardTitle>
      <S.Muted style={{ marginBottom: 12 }}>
        {lean.length} игр за 90 дней, местное время
      </S.Muted>
      <S.HeatWrap>
        <S.Heat>
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <S.HeatHour key={h}>{h % 3 === 0 ? h : ""}</S.HeatHour>
          ))}
          {grid.map((row, di) => (
            <React.Fragment key={di}>
              <S.HeatDay>{DAYS[di]}</S.HeatDay>
              {row.map((c, h) => (
                <S.HeatCell
                  key={h}
                  title={`${DAYS[di]}, ${h}:00 — игр: ${c.games}${
                    c.games ? `, побед: ${c.wins}` : ""
                  }`}
                  style={{
                    background: c.games
                      ? `rgba(124, 156, 255, ${0.18 + (c.games / max) * 0.82})`
                      : undefined,
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </S.Heat>
      </S.HeatWrap>
      <S.Tiles style={{ marginTop: 16, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        {buckets.map((b) => {
          const wr = pct(b.wins, b.games);
          return (
            <S.Tile key={b.name}>
              <S.Label>
                {b.name} ({b.from}–{b.to})
              </S.Label>
              <S.Big style={{ color: b.games ? wrColor(wr) : undefined }}>
                {b.games ? fmtPct(wr) : "—"}
              </S.Big>
              <S.Muted>{b.games} игр</S.Muted>
            </S.Tile>
          );
        })}
      </S.Tiles>
    </S.Card>
  );
};

const Weekly = ({ lean }: { lean?: LeanMatch[] }) => {
  if (!lean) return <S.Skeleton style={{ height: 240 }} />;
  const WEEKS = 12;
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const start = new Date(monday);
    start.setDate(start.getDate() - 7 * (WEEKS - 1 - i));
    return { start, games: 0, wins: 0 };
  });
  lean.forEach((m) => {
    const t = m.start_time * 1000;
    for (let i = WEEKS - 1; i >= 0; i -= 1) {
      if (t >= weeks[i].start.getTime()) {
        weeks[i].games += 1;
        if (isWin(m)) weeks[i].wins += 1;
        break;
      }
    }
  });
  const maxG = Math.max(1, ...weeks.map((w) => w.games));
  const W = 640;
  const H = 180;
  const pad = 28;
  const bw = (W - pad * 2) / WEEKS;
  const y = (wr: number) => pad + (1 - wr / 100) * (H - pad * 2);
  // Линию рвём на неделях без игр: каждый отрезок — подряд идущие недели с играми
  const segments: string[][] = [];
  let current: string[] = [];
  weeks.forEach((w, i) => {
    if (w.games) {
      current.push(`${pad + bw * i + bw / 2},${y(pct(w.wins, w.games))}`);
    } else if (current.length) {
      segments.push(current);
      current = [];
    }
  });
  if (current.length) segments.push(current);
  return (
    <S.Card>
      <S.CardTitle>Прогресс по неделям</S.CardTitle>
      <S.Muted style={{ marginBottom: 8 }}>
        Столбцы: количество игр. Линия: винрейт за неделю. Пунктир: 50%.
      </S.Muted>
      <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: "100%", height: "auto" }}>
        <line
          x1={pad}
          x2={W - pad}
          y1={y(50)}
          y2={y(50)}
          stroke="rgba(255,255,255,0.25)"
          strokeDasharray="4 4"
        />
        {weeks.map((w, i) => {
          const h = (w.games / maxG) * (H - pad * 2);
          return (
            <g key={i}>
              <rect
                x={pad + bw * i + bw * 0.18}
                y={H - pad - h}
                width={bw * 0.64}
                height={h}
                rx={3}
                fill="rgba(124,156,255,0.22)"
              >
                <title>
                  {`Неделя с ${w.start.toLocaleDateString("ru-RU")}: игр ${w.games}${
                    w.games ? `, винрейт ${fmtPct(pct(w.wins, w.games))}` : ""
                  }`}
                </title>
              </rect>
              <text
                x={pad + bw * i + bw / 2}
                y={H + 6}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(255,255,255,0.45)"
              >
                {w.start.toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "numeric",
                })}
              </text>
            </g>
          );
        })}
        {segments.map((seg, i) => (
          <polyline
            key={i}
            points={seg.join(" ")}
            fill="none"
            stroke={S.C.green}
            strokeWidth={2.5}
          />
        ))}
        {weeks.map((w, i) =>
          w.games ? (
            <circle
              key={i}
              cx={pad + bw * i + bw / 2}
              cy={y(pct(w.wins, w.games))}
              r={3.5}
              fill={wrColor(pct(w.wins, w.games))}
            />
          ) : null,
        )}
      </svg>
    </S.Card>
  );
};

// ---------- страница ----------

const Dashboard = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const { data, error } = useDashboardData(reloadKey);

  const refresh = async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const res = await fetch(`${config.VITE_API_HOST}/api/players/${ID}/refresh`, {
        method: "POST",
      });
      // fetch не бросает исключение на 4xx/5xx, поэтому статус проверяем сами
      if (!res.ok) {
        throw new Error(
          res.status === 429
            ? "слишком много запросов, подожди минуту"
            : `сервер ответил ${res.status}`,
        );
      }
      // Серверу нужно немного времени, чтобы подтянуть новые матчи
      await new Promise((r) => setTimeout(r, 4000));
      setReloadKey((k) => k + 1);
    } catch (e) {
      setRefreshError(e instanceof Error ? e.message : String(e));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <S.Page>
      <Helmet title="Мой профиль" />
      {error && (
        <S.Error>
          Не удалось загрузить часть данных ({error}). Попробуй обновить страницу
          позже: у бесплатного API есть лимит запросов.
        </S.Error>
      )}
      {refreshError && (
        <S.Error>Не удалось обновить данные: {refreshError}.</S.Error>
      )}
      <ProfileCard
        profile={data.profile}
        wl={data.wl}
        wl30={data.wl30}
        onRefresh={refresh}
        refreshing={refreshing}
      />
      <SummaryTiles recent={data.recent} />
      <S.Grid>
        <S.Col>
          <RecentMatches recent={data.recent} />
          <Weekly lean={data.lean} />
        </S.Col>
        <S.Col>
          <TopHeroes all={data.heroesAll} recent180={data.heroes180} />
          <Matchups all={data.heroesAll} />
          <Friends peers={data.peers} />
          <Activity lean={data.lean} />
        </S.Col>
      </S.Grid>
    </S.Page>
  );
};

export default Dashboard;
