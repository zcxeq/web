import React from "react";
import styled from "styled-components";

import GaugeChart from "./../../../Visualizations/GaugeChart";
import constants from "../../../constants";

const Styled = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background-color: #121722;
  padding: 6px 0;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  @media only screen and (min-width: ${constants.appWidth}px) {
    .gauge-chart:nth-child(even)::after {
      content: "";
      width: 2px;
      height: 300px;
      position: absolute;
      background: rgba(255, 255, 255, 0.06);
      bottom: -50px;
      right: -13px;
    }
  }
`;
const Group = styled.div`
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const GroupLabel = styled.div`
  padding: 8px 0;
  font: 700 12px Inter, Roboto, sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
`;
const ChartPair = styled.div`
  display: flex;
  flex-direction: row;
`;

const Summary = ({
  data,
}: {
  data: Record<string, { label: string; data: any[] }>;
}) => (
  <Styled>
    {Object.values(data).flatMap((group) => (
      <Group>
        <GroupLabel>{group.label}</GroupLabel>
        <ChartPair>
          {group.data.map((el: any) => (
            <GaugeChart
              key={`${group.label}-${el.category}`}
              number={el.matches}
              percent={el.winPercent}
              caption={el.category}
            />
          ))}
        </ChartPair>
      </Group>
    ))}
  </Styled>
);

export default Summary;
