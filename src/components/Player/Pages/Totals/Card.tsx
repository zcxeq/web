import React from "react";
import styled from "styled-components";
import { shape } from "prop-types";
import { formatTemplateToString } from "../../../../utility";
import useStrings from "../../../../hooks/useStrings.hook";

const fastPlurality = (val: number, singular: string, plural: string) =>
  val === 1 ? singular : plural;

const formatDurationString = (sec: number, strings: Strings) => {
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec - days * 86400) / 3600);
  const minutes = Math.floor((sec - days * 86400 - hours * 3600) / 60);
  const seconds = Math.floor(sec - days * 86400 - hours * 3600 - minutes * 60);
  return [
    formatTemplateToString(
      fastPlurality(days, strings.time_abbr_d, strings.time_abbr_dd),
      days,
    ),
    formatTemplateToString(
      fastPlurality(hours, strings.time_abbr_h, strings.time_abbr_hh),
      hours,
    ),
    formatTemplateToString(
      fastPlurality(minutes, strings.time_abbr_m, strings.time_abbr_mm),
      minutes,
    ),
    formatTemplateToString(
      fastPlurality(seconds, strings.time_abbr_s, strings.time_abbr_ss),
      seconds,
    ),
  ].join(" ");
};

const Wrapper = styled.div`
  box-sizing: border-box;
  margin-bottom: 8px;
  margin-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
  width: 20%;

  @media screen and (max-width: 1000px) {
    width: 25%;
  }

  @media screen and (max-width: 850px) {
    width: 33.333%;
  }

  @media screen and (max-width: 560px) {
    width: 50%;
  }

  @media screen and (max-width: 380px) {
    width: 100%;
  }
`;

// Плитка как на дашборде: мелкая подпись сверху, крупное число под ней
const Box = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #121722;
  transition: border-color 0.15s;

  &:hover {
    border-color: rgba(124, 156, 255, 0.4);
  }
`;

const Header = styled.div`
  font: 600 11px/1.3 Inter, Roboto, sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  min-height: 28px;
`;

const Value = styled.div`
  margin-top: 6px;
  font: 800 22px/1.15 Inter, Roboto, sans-serif;
  font-variant-numeric: tabular-nums;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.small {
    font-size: 16px;
  }
`;

const Card = ({ total }: { total: { field: string; sum: number } }) => {
  const strings = useStrings();
  return (
    <Wrapper>
      <Box>
        <Header>{strings[`heading_${total.field}` as keyof Strings]}</Header>
        <Value className={total.field === "duration" ? "small" : ""}>
          {total.field === "duration"
            ? formatDurationString(total.sum, strings)
            : Math.floor(total.sum).toLocaleString("ru-RU")}
        </Value>
      </Box>
    </Wrapper>
  );
};

export default Card;
