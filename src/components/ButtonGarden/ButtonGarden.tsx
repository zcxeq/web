import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import styled from "styled-components";
import useStrings from "../../hooks/useStrings.hook";

// Самые нужные показатели — быстрыми кнопками, остальные через поиск
const QUICK = [
  "kills",
  "deaths",
  "assists",
  "kda",
  "gold_per_min",
  "xp_per_min",
  "hero_damage",
];

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 4px 0 12px;
`;

const Chip = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font: 600 12px Inter, Roboto, sans-serif;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  &.on {
    background: rgba(124, 156, 255, 0.2);
    border-color: rgba(124, 156, 255, 0.6);
    color: #fff;
  }
`;

const ButtonGarden = ({
  buttonNames,
  selectedButton,
  onClick,
}: {
  buttonNames: string[];
  selectedButton: string;
  onClick: Function;
}) => {
  const strings = useStrings();
  const label = (name: string) =>
    strings[`heading_${name}` as keyof Strings] || name;

  const quick = QUICK.filter((name) => buttonNames.includes(name));
  const options = [...buttonNames].sort((a, b) =>
    String(label(a)).localeCompare(String(label(b)), "ru"),
  );

  return (
    <Bar>
      {quick.map((name) => (
        <Chip
          key={name}
          type="button"
          className={selectedButton === name ? "on" : ""}
          onClick={() => onClick(name)}
        >
          {label(name)}
        </Chip>
      ))}
      <Autocomplete
        size="small"
        sx={{ width: 260 }}
        options={options}
        value={selectedButton}
        getOptionLabel={(name: string) => String(label(name))}
        disableClearable
        onChange={(_e, name) => name && onClick(name)}
        renderInput={(params) => (
          <TextField {...params} label="Все показатели" />
        )}
      />
    </Bar>
  );
};

export default ButtonGarden;
