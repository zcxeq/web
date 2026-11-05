import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Свой знак вместо <OpenDota/>: значок-монограмма + надпись
const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #fff !important;
  white-space: nowrap;

  &:hover .mark {
    transform: rotate(-6deg) scale(1.05);
  }
`;

const Mark = styled.span`
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: linear-gradient(135deg, #7c9cff 0%, #3ecf8e 100%);
  color: #0a0d14;
  font:
    800 13px/1 Inter,
    Roboto,
    sans-serif;
  letter-spacing: -0.04em;
  box-shadow: 0 4px 18px rgba(124, 156, 255, 0.35);
  transition: transform 0.2s;
`;

const Word = styled.span`
  font:
    800 16px/1 Inter,
    Roboto,
    sans-serif;
  letter-spacing: -0.02em;

  b {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
  }
`;

interface AppLogoProps {
  size?: string;
  onClick?: () => void;
}

const AppLogo = ({ onClick }: AppLogoProps) => (
  <StyledLink aria-label="На главную" to="/" onClick={onClick}>
    <Mark className="mark">MX</Mark>
    <Word>
      dota<b>·stats</b>
    </Word>
  </StyledLink>
);

export default AppLogo;
