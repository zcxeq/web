import React from "react";
import styled from "styled-components";
import LockIcon from "@mui/icons-material/Lock";
import useStrings from "../../hooks/useStrings.hook";

const Styled = styled.div`
  text-align: center;
  padding-top: 5%;

  .playerProfilePrivateTitle {
    font-size: 2rem;
    margin-bottom: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lockIcon {
    font-size: 1.8rem;
    margin-right: 2%;
  }

  .playerProfilePrivateDescription {
    max-width: 560px;
    margin: 0 auto 2%;
    color: rgba(255, 255, 255, 0.6);
  }
`;

// Вход через Steam работает только на opendota.com, поэтому здесь без кнопки входа
const PlayerProfilePrivate = () => {
  const strings = useStrings();
  const playerProfilePrivateTitle = (
    strings.player_profile_private_title || ""
  ).toUpperCase();

  return (
    <Styled>
      <div>
        <div className="playerProfilePrivateTitle">
          <LockIcon className="lockIcon" />
          <div>{playerProfilePrivateTitle}</div>
        </div>
        <div className="playerProfilePrivateDescription">
          Игрок скрыл статистику. Чтобы она появилась, нужно включить
          «Показывать данные публичных матчей» в настройках клиента Dota 2.
        </div>
      </div>
    </Styled>
  );
};

export default PlayerProfilePrivate;
