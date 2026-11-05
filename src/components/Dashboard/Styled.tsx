import styled, { css, keyframes } from "styled-components";
import { Link } from "react-router-dom";

// Палитра дашборда (в духе Stratz)
export const C = {
  bg: "#090c12",
  card: "#121722",
  cardHover: "#182030",
  border: "rgba(255,255,255,0.06)",
  text: "rgba(255,255,255,0.92)",
  muted: "rgba(255,255,255,0.5)",
  accent: "#7c9cff",
  green: "#3ecf8e",
  red: "#f0616d",
};

export const Page = styled.div`
  font-family: Inter, Roboto, sans-serif;
  color: ${C.text};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

export const Card = styled.section`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 12px;
  padding: 18px 20px;
  min-width: 0;
`;

export const CardTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${C.muted};
  margin-bottom: 8px;
`;

export const TitleLink = styled(Link)`
  font-size: 13px;
  font-weight: 500;
  color: ${C.accent};
`;

export const Muted = styled.div`
  font-size: 12px;
  color: ${C.muted};
`;

export const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${C.muted};
  margin-bottom: 4px;
`;

export const Value = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export const Big = styled.div`
  font-size: 24px;
  font-weight: 800;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
`;

export const W = styled.span`
  color: ${C.green};
`;
export const L = styled.span`
  color: ${C.red};
`;

// ---- профиль ----

export const ProfileCard = styled.section`
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid ${C.border};
  background:
    radial-gradient(
      ellipse at 85% 0%,
      rgba(124, 156, 255, 0.22),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 0% 100%,
      rgba(62, 207, 142, 0.1),
      transparent 50%
    ),
    ${C.card};

  @media (max-width: 640px) {
    flex-wrap: wrap;
    padding: 18px;
    gap: 16px;
  }
`;

export const Avatar = styled.img`
  width: 104px;
  height: 104px;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 72px;
    height: 72px;
  }
`;

export const Name = styled.h1`
  margin: 0 0 2px;
  font-size: 28px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileStats = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 14px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const buttonCss = css`
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: ${C.accent};
  color: #0c101b !important;
  font: 600 13px Inter, Roboto, sans-serif;
  cursor: pointer;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(1.1);
  }
  &.ghost {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.16);
    color: ${C.text} !important;
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const Button = styled.button`
  ${buttonCss}
`;
export const ButtonLink = styled(Link)`
  ${buttonCss}
`;

export const Medal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const MedalName = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-top: 2px;
`;

// ---- плитки ----

export const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

export const Tile = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${C.border};
  border-radius: 10px;
  padding: 12px 14px;
`;

export const FormStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(20, minmax(0, 1fr));
  gap: 4px;
  margin-top: 16px;
`;

export const FormCell = styled(Link)`
  display: block;
  border-radius: 6px;
  padding: 2px;
  aspect-ratio: 1;
  background: ${C.red};

  &.win {
    background: ${C.green};
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  &:hover {
    filter: brightness(1.2);
  }
`;

// ---- списки ----

export const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MatchRow = styled(Link)`
  display: grid;
  grid-template-columns: 72px minmax(0, 1.4fr) 1fr 1fr 60px 60px;
  gap: 12px;
  align-items: center;
  padding: 8px 10px 8px 8px;
  border-radius: 8px;
  color: ${C.text} !important;
  border-left: 3px solid ${C.red};
  background: rgba(240, 97, 109, 0.04);
  transition: background 0.15s;

  &.win {
    border-left-color: ${C.green};
    background: rgba(62, 207, 142, 0.04);
  }
  &:hover {
    background: ${C.cardHover};
  }

  @media (max-width: 640px) {
    grid-template-columns: 56px minmax(0, 1fr) auto auto;
    gap: 8px;
  }
`;

export const HideSmall = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

export const HeroThumb = styled.img`
  width: 72px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;

  &.small {
    width: 56px;
    height: 32px;
  }
  @media (max-width: 640px) {
    width: 56px;
    height: 32px;
  }
`;

export const RowTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
`;

export const Result = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${C.red};

  &.win {
    color: ${C.green};
  }
`;

export const HeroRow = styled.div`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 40px 56px;
  gap: 12px;
  align-items: center;
  padding: 6px 0;

  & + & {
    border-top: 1px solid ${C.border};
  }
`;

export const Num = styled.div`
  text-align: right;
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const Bar = styled.div`
  height: 4px;
  margin-top: 6px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.06);

  span {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: ${C.accent};
  }
`;

export const Segmented = styled.div`
  display: inline-flex;
  padding: 2px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);

  button {
    border: 0;
    background: transparent;
    color: ${C.muted};
    font: 600 12px Inter, Roboto, sans-serif;
    padding: 5px 10px;
    border-radius: 6px;
    cursor: pointer;
  }
  button.on {
    background: rgba(124, 156, 255, 0.2);
    color: ${C.text};
  }
`;

export const TwoCols = styled.div`
  display: grid;
  /* Две колонки, пока каждой хватает 220px, иначе одна под другой */
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 20px;
`;

const miniRowCss = css`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto 52px;
  gap: 10px;
  align-items: center;
  padding: 5px 0;
  font-size: 13px;
  color: ${C.text} !important;

  img {
    width: 28px;
    height: 28px;
    object-fit: cover;
    border-radius: 6px;
  }
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  b {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

export const MiniRow = styled.div`
  ${miniRowCss}
`;
export const MiniRowLink = styled(Link)`
  ${miniRowCss}
`;

// ---- тепловая карта ----

export const HeatWrap = styled.div`
  overflow-x: auto;
`;

export const Heat = styled.div`
  display: grid;
  grid-template-columns: 24px repeat(24, minmax(0, 1fr));
  gap: 2px;
  min-width: 320px;
`;

export const HeatCell = styled.div`
  aspect-ratio: 1;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.04);
`;

export const HeatDay = styled.div`
  font-size: 11px;
  color: ${C.muted};
  display: flex;
  align-items: center;
`;

export const HeatHour = styled.div`
  font-size: 10px;
  color: ${C.muted};
  text-align: center;
`;

// ---- служебное ----

const shimmer = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

export const Skeleton = styled.div`
  border-radius: 12px;
  background: ${C.card};
  border: 1px solid ${C.border};
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

export const Error = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(240, 97, 109, 0.12);
  border: 1px solid rgba(240, 97, 109, 0.3);
  color: #ffc9ce;
  font-size: 13px;
`;
