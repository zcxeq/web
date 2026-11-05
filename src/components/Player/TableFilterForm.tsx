import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import querystring from "querystring";
import styled from "styled-components";
import { heroes, patch, region } from "dotaconstants";
import { toggleShowForm } from "../../actions/formActions";
import FormField from "../Form/FormField";
import constants from "../constants";
import config from "../../config";

const textFieldStyle = { width: 53, fontSize: 9, height: "auto" };

const getPeers = async (props: TableFilterFormProps, context: any) => {
  const resp = await fetch(
    `${config.VITE_API_HOST}/api/players/${props.playerId}/peers`,
  );
  if (resp.ok) {
    const json = await resp.json();
    context.setState({ peers: json });
  }
};

const setShowFormState = (props: TableFilterFormProps) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm();
  }
};

type TableFilterFormProps = {
  currentQueryString: string;
  playerId: string;
  strings: Strings;
  showForm: boolean;
  toggleShowForm: Function;
} & RouterProps;

// Основные фильтры видны всегда, остальные прячутся под «Ещё фильтры»
const PRIMARY_FIELDS = ["hero_id", "win", "date", "lobby_type", "game_mode"];

const Panel = styled.div`
  background: #141a28;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px;
`;

const FieldsGrid = styled.div`
  display: grid;
  /* 5 основных и 10 дополнительных фильтров ложатся ровными рядами */
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  & + & {
    margin-top: 8px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  font: 600 12px Inter, Roboto, sans-serif;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  &.danger {
    border-color: rgba(240, 97, 109, 0.4);
    color: #f0616d;
  }
`;

class TableFilterForm extends React.Component<
  TableFilterFormProps,
  { peers: any[]; expanded: boolean }
> {
  constructor(props: TableFilterFormProps) {
    super(props);
    this.state = {
      peers: [],
      expanded: false,
    };
  }

  componentDidMount() {
    setShowFormState(this.props);
    getPeers(this.props, this);
  }

  componentDidUpdate(nextProps: TableFilterFormProps) {
    if (nextProps.playerId !== this.props.playerId) {
      setShowFormState(nextProps);
      getPeers(nextProps, this);
    }
  }

  render() {
    const { currentQueryString, history, strings } = this.props;
    const formSelectionState = querystring.parse(
      currentQueryString.substring(1),
    );

    const heroList = Object.keys(heroes)
      .map((id) => ({
        label: heroes[id as keyof Heroes]?.localized_name,
        id: Number(id),
      }))
      .sort((a: any, b: any) => a.label?.localeCompare(b.label));

    const laneList = Object.keys(strings)
      .filter((str) => str.indexOf("lane_role_") === 0)
      .map((str) => str.substring("lane_role_".length))
      .map((id) => ({
        label: strings[`lane_role_${id}` as keyof Strings],
        id: Number(id),
      }));

    const patchList = patch
      .map((_patch, index) => ({
        label: _patch.name,
        id: index,
      }))
      .reverse();

    const modeList = Object.keys(strings)
      .filter((str) => str.indexOf("game_mode_") === 0)
      .map((str) => str.substring("game_mode_".length))
      .map((id) => ({
        label: strings[`game_mode_${id}` as keyof Strings],
        id: Number(id),
      }));

    const lobbyTypeList = Object.keys(strings)
      .filter((str) => str.indexOf("lobby_type_") === 0)
      .map((str) => str.substring("lobby_type_".length))
      .map((id) => ({
        label: strings[`lobby_type_${id}` as keyof Strings],
        id: Number(id),
      }));

    const regionList = Object.keys(region).map((id) => ({
      label: strings[`region_${id}` as keyof Strings],
      id: Number(id),
    }));

    const factionList = [
      {
        label: strings.general_radiant,
        id: 1,
      },
      {
        label: strings.general_dire,
        id: 0,
      },
    ];

    const resultList = [
      {
        label: strings.td_win,
        id: 1,
      },
      {
        label: strings.td_loss,
        id: 0,
      },
    ];

    const dateList = [
      {
        label: strings.filter_last_week,
        id: 7,
      },
      {
        label: strings.filter_last_month,
        id: 30,
      },
      {
        label: strings.filter_last_3_months,
        id: 90,
      },
      {
        label: strings.filter_last_6_months,
        id: 180,
      },
      {
        label: strings.filter_last_12_months,
        id: 360,
      },
    ];

    const significantList = [
      {
        label: strings.filter_significant_include,
        id: 0,
      },
    ];

    const gamesPlayedList = [
      {
        label: "5",
        id: 5,
      },
      {
        label: "10",
        id: 10,
      },
      {
        label: "15",
        id: 15,
      },
      {
        label: "20",
        id: 20,
      },
      {
        label: "25",
        id: 25,
      },
    ];

    const partySize = [
      {
        label: "1",
        id: 1,
      },
      {
        label: "2",
        id: 2,
      },
      {
        label: "3",
        id: 3,
      },
      {
        label: "4",
        id: 4,
      },
      {
        label: "5",
        id: 5,
      },
    ];

    const roleList = [
      {
        label: "Carry",
        id: 1,
      },
      {
        label: "Nuker",
        id: 2,
      },
      {
        label: "Initiator",
        id: 3,
      },
      {
        label: "Disabler",
        id: 4,
      },
      {
        label: "Durable",
        id: 5,
      },
      {
        label: "Escape",
        id: 6,
      },
      {
        label: "Support",
        id: 7,
      },
      {
        label: "Pusher",
        id: 8,
      },
      {
        label: "Jungler",
        id: 9,
      },
    ];

    const peerList = this.state.peers.map((peer) => ({
      label: `${peer.personaname}`,
      id: peer.account_id,
    }));

    type FieldConfig = {
      name: string;
      label: string;
      dataSource: { label: string; id: number }[];
      strict?: boolean;
      limit?: number;
    };

    // Порядок в массиве = порядок на экране
    const fields: FieldConfig[] = [
      { name: "hero_id", label: strings.filter_hero_id, dataSource: heroList, strict: true, limit: 1 },
      { name: "win", label: strings.filter_win, dataSource: resultList, strict: true, limit: 1 },
      { name: "date", label: strings.filter_date, dataSource: dateList, strict: true, limit: 1 },
      { name: "lobby_type", label: strings.filter_lobby_type, dataSource: lobbyTypeList, strict: true, limit: 1 },
      { name: "game_mode", label: strings.filter_game_mode, dataSource: modeList, strict: true, limit: 1 },
      { name: "is_radiant", label: strings.filter_is_radiant, dataSource: factionList, strict: true, limit: 1 },
      { name: "lane_role", label: strings.filter_lane_role, dataSource: laneList, strict: true, limit: 1 },
      { name: "patch", label: strings.filter_patch, dataSource: patchList, strict: true, limit: 1 },
      { name: "region", label: strings.filter_region, dataSource: regionList, strict: true, limit: 1 },
      { name: "party_size", label: strings.filter_party_size, dataSource: partySize, strict: true, limit: 1 },
      { name: "with_hero_id", label: strings.filter_with_hero_id, dataSource: heroList, strict: true, limit: 5 },
      { name: "against_hero_id", label: strings.filter_against_hero_id, dataSource: heroList, strict: true, limit: 5 },
      { name: "included_account_id", label: strings.filter_included_account_id, dataSource: peerList, limit: 10 },
      { name: "excluded_account_id", label: strings.filter_excluded_account_id, dataSource: peerList },
      { name: "significant", label: strings.filter_significant, dataSource: significantList, strict: true, limit: 1 },
    ];

    const renderField = (f: FieldConfig) => (
      <FormField
        key={f.name}
        formSelectionState={formSelectionState}
        history={history}
        textFieldStyle={textFieldStyle}
        size="small"
        {...f}
      />
    );

    const isActive = (name: string) =>
      ([] as any[]).concat(formSelectionState[name] || []).length > 0;
    const activeCount = fields.filter((f) => isActive(f.name)).length;
    const primary = fields.filter((f) => PRIMARY_FIELDS.includes(f.name));
    const secondary = fields.filter((f) => !PRIMARY_FIELDS.includes(f.name));
    const secondaryActive = secondary.filter((f) => isActive(f.name)).length;
    // Если дополнительный фильтр уже выбран (например, по ссылке), не прячем его
    const showSecondary = this.state.expanded || secondaryActive > 0;

    return (
      <Panel>
        <FieldsGrid>{primary.map(renderField)}</FieldsGrid>
        {showSecondary && <FieldsGrid>{secondary.map(renderField)}</FieldsGrid>}
        <Toolbar>
          {secondaryActive === 0 && (
            <ToolbarButton
              type="button"
              onClick={() => this.setState({ expanded: !this.state.expanded })}
            >
              {this.state.expanded ? "Скрыть фильтры" : "Ещё фильтры"}
            </ToolbarButton>
          )}
          {activeCount > 0 && (
            <ToolbarButton
              type="button"
              className="danger"
              onClick={() => history.push(window.location.pathname)}
            >
              Сбросить ({activeCount})
            </ToolbarButton>
          )}
        </Toolbar>
      </Panel>
    );
  }
}

const mapStateToProps = (state: any) => ({
  showForm: state.app.form.show,
  currentQueryString: window.location.search,
  strings: state.app.strings,
});

const mapDispatchToProps = (dispatch: any) => ({
  toggleShowForm: () => dispatch(toggleShowForm()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TableFilterForm),
);
