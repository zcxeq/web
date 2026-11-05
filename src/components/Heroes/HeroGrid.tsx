import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { heroes } from "dotaconstants";
import config from "../../config";

type HeroesTab = "pro" | "public" | "turbo";

// Сетка героев в духе Stratz: группы по атрибутам, портрет, крупный винрейт

type Row = Record<string, any>;
type SortKey = "win" | "pick" | "name";

const ATTRS: { key: string; label: string; color: string }[] = [
  { key: "str", label: "Сила", color: "#f0616d" },
  { key: "agi", label: "Ловкость", color: "#3ecf8e" },
  { key: "int", label: "Интеллект", color: "#5fb4ff" },
  { key: "all", label: "Универсальные", color: "#c792ea" },
];

// Какие поля брать для каждой вкладки
const FIELDS: Record<
  HeroesTab,
  { win: string; pick: string; games: string; pickLabel: string }
> = {
  pro: {
    win: "winRatePro",
    pick: "pickBanRatePro",
    games: "pro_pick",
    pickLabel: "пик+бан",
  },
  public: {
    win: "winRatePub",
    pick: "pickRatePub",
    games: "pickCountPub",
    pickLabel: "пик",
  },
  turbo: {
    win: "winRateTurbo",
    pick: "pickRateTurbo",
    games: "turbo_picks",
    pickLabel: "пик",
  },
};

const wrColor = (wr: number) =>
  wr >= 0.53
    ? "#3ecf8e"
    : wr >= 0.5
      ? "#a7e3c4"
      : wr >= 0.47
        ? "#f2b8bd"
        : "#f0616d";

const num = (v: any) => (Number.isFinite(v) ? v : 0);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
`;

const Search = styled.input`
  height: 36px;
  min-width: 220px;
  flex: 1 1 220px;
  max-width: 320px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  font: 500 13px Inter, Roboto, sans-serif;
  outline: none;

  &:focus {
    border-color: rgba(124, 156, 255, 0.6);
  }
`;

const Segmented = styled.div`
  display: inline-flex;
  padding: 3px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.05);

  button {
    border: 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.55);
    font: 600 12px Inter, Roboto, sans-serif;
    padding: 6px 11px;
    border-radius: 7px;
    cursor: pointer;
  }
  button.on {
    background: rgba(124, 156, 255, 0.2);
    color: #fff;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const Group = styled.section`
  margin-bottom: 28px;
`;

const GroupTitle = styled.h3<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  font: 700 15px Inter, Roboto, sans-serif;

  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: ${(p) => p.$color};
    box-shadow: 0 0 12px ${(p) => p.$color};
  }

  span {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
`;

const Card = styled(Link)<{ $accent: string }>`
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 10px;
  background: #121722;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #fff !important;
  transition:
    transform 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    border-color: ${(p) => p.$accent};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  }

  img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .body {
    padding: 8px 10px 10px;
  }
  .name {
    font: 700 13px Inter, Roboto, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .stats {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 4px;
  }
  .wr {
    font: 800 18px Inter, Roboto, sans-serif;
    font-variant-numeric: tabular-nums;
  }
  .sub {
    font: 500 11px Inter, Roboto, sans-serif;
    color: rgba(255, 255, 255, 0.45);
    text-align: right;
    line-height: 1.3;
  }
  .bar {
    height: 3px;
    margin-top: 8px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.06);
  }
  .bar span {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #7c9cff, #3ecf8e);
  }
`;

const Hint = styled.div`
  margin: -8px 0 16px;
  font: 500 12px Inter, Roboto, sans-serif;
  color: rgba(255, 255, 255, 0.4);
`;

const Empty = styled.div`
  padding: 40px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
`;

type HeroGridProps = {
  data: Row[];
  tab: HeroesTab;
  view: "cards" | "table";
  onViewChange: (v: "cards" | "table") => void;
  table: React.ReactNode;
};

const HeroGrid = ({ data, tab, view, onViewChange, table }: HeroGridProps) => {
  const [query, setQuery] = useState("");
  // В про-матчах выборка маленькая, поэтому там по умолчанию сортируем по популярности
  const [sort, setSort] = useState<SortKey>(tab === "pro" ? "pick" : "win");
  const f = FIELDS[tab];

  // Порог «достаточно игр»: 10% от самого популярного героя, в пределах 5–30 игр
  const minGames = useMemo(
    () =>
      Math.round(
        Math.min(30, Math.max(5, 0.1 * Math.max(0, ...data.map((r) => num(r[f.games]))))),
      ),
    [data, f],
  );
  const reliable = (r: Row) => num(r[f.games]) >= minGames;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data.filter(
      (r) => !q || String(r.heroName).toLowerCase().includes(q),
    );
    const by: Record<SortKey, (a: Row, b: Row) => number> = {
      // Герои с малой выборкой уходят в конец, иначе сверху окажутся «100% за 1 игру»
      win: (a, b) =>
        Number(reliable(b)) - Number(reliable(a)) ||
        num(b[f.win]) - num(a[f.win]),
      pick: (a, b) => num(b[f.pick]) - num(a[f.pick]),
      name: (a, b) => String(a.heroName).localeCompare(String(b.heroName)),
    };
    return [...list].sort(by[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, query, sort, f, minGames]);

  const maxPick = Math.max(0.0001, ...rows.map((r) => num(r[f.pick])));

  return (
    <div>
      <Toolbar>
        <Search
          type="search"
          placeholder="Найти героя…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {view === "cards" && (
          <Segmented aria-label="Сортировка">
            <button className={sort === "win" ? "on" : ""} onClick={() => setSort("win")}>
              Винрейт
            </button>
            <button className={sort === "pick" ? "on" : ""} onClick={() => setSort("pick")}>
              Популярность
            </button>
            <button className={sort === "name" ? "on" : ""} onClick={() => setSort("name")}>
              Имя
            </button>
          </Segmented>
        )}
        <Spacer />
        <Segmented aria-label="Вид">
          <button className={view === "cards" ? "on" : ""} onClick={() => onViewChange("cards")}>
            Карточки
          </button>
          <button className={view === "table" ? "on" : ""} onClick={() => onViewChange("table")}>
            Таблица
          </button>
        </Segmented>
      </Toolbar>

      {view === "cards" && sort === "win" && rows.some((r) => !reliable(r)) && (
        <Hint>
          Блёклый винрейт — меньше {minGames} игр, такие герои стоят в конце
          списка.
        </Hint>
      )}

      {view === "table" && table}

      {view === "cards" && rows.length === 0 && (
        <Empty>{data.length ? "Ничего не нашлось" : "Загружаю героев…"}</Empty>
      )}

      {view === "cards" &&
        ATTRS.map((attr) => {
          const list = rows.filter(
            (r) => heroes[r.hero_id as keyof Heroes]?.primary_attr === attr.key,
          );
          if (!list.length) return null;
          return (
            <Group key={attr.key}>
              <GroupTitle $color={attr.color}>
                {attr.label} <span>{list.length}</span>
              </GroupTitle>
              <Grid>
                {list.map((r) => {
                  const hero = heroes[r.hero_id as keyof Heroes];
                  const wr = num(r[f.win]);
                  const games = num(r[f.games]);
                  return (
                    <Card key={r.hero_id} to={`/heroes/${r.hero_id}`} $accent={attr.color}>
                      <img
                        src={hero ? `${config.VITE_IMAGE_CDN}${hero.img}` : ""}
                        alt=""
                        loading="lazy"
                      />
                      <div className="body">
                        <div className="name">{r.heroName}</div>
                        <div className="stats">
                          <span
                            className="wr"
                            title={reliable(r) ? undefined : "Мало игр, винрейт неточный"}
                            style={{
                              color: games ? wrColor(wr) : undefined,
                              opacity: reliable(r) ? 1 : 0.45,
                            }}
                          >
                            {games ? pct(wr) : "—"}
                          </span>
                          <span className="sub">
                            {pct(num(r[f.pick]))} {f.pickLabel}
                            <br />
                            {games.toLocaleString("ru-RU")} игр
                          </span>
                        </div>
                        <div className="bar">
                          <span style={{ width: `${(num(r[f.pick]) / maxPick) * 100}%` }} />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </Grid>
            </Group>
          );
        })}
    </div>
  );
};

export default HeroGrid;
