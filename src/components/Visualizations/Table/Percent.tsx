import React from "react";
import { StyledContainer, PercentContainer, TitleContainer } from "./Styled";

// Спокойные полоски вместо «радуги»:
// - относительные значения (игры, GPM) — ровный акцентный цвет;
// - проценты (винрейт и т.п.) — зелёный от 50% и выше, красный ниже
const ACCENT = "rgba(124, 156, 255, 0.65)";
const GOOD = "rgba(62, 207, 142, 0.85)";
const BAD = "rgba(240, 97, 109, 0.85)";

const Percent = ({
  percent,
  altValue,
  valEl,
  inverse = false,
  relative = false,
}: {
  percent: number;
  altValue?: number;
  valEl?: React.ReactNode;
  inverse?: boolean;
  relative?: boolean;
}) => {
  const good = inverse ? percent < 50 : percent >= 50;
  const color = relative ? ACCENT : good ? GOOD : BAD;
  return (
    <StyledContainer>
      <TitleContainer>
        {valEl || percent} {altValue && <small>{altValue}</small>}
      </TitleContainer>
      <PercentContainer>
        <div
          style={{
            width: `${Math.min(100, Math.max(0, percent))}%`,
            backgroundColor: color,
          }}
        />
      </PercentContainer>
    </StyledContainer>
  );
};

export default Percent;
