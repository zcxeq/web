import { Tab, Tabs, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { withRouter } from "react-router-dom";

const StyledMain = styled.main`
  position: relative;
  margin: 0 0 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const StyledTabs = styled(Tabs)`
  min-height: 44px !important;

  & .MuiTabs-indicator {
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, #7c9cff, #3ecf8e);
  }
  & .MuiTabs-scrollButtons.Mui-disabled {
    opacity: 0.2;
  }
`;

const StyledTab = styled(Tab)`
  min-width: 0 !important;
  min-height: 44px !important;
  padding: 0 14px !important;
  color: rgba(255, 255, 255, 0.55) !important;
  transition: color 0.15s;

  &:hover {
    color: #fff !important;
  }
  &.Mui-selected {
    color: #fff !important;
  }
`;

const TabTooltip = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactElement<any, any>;
}) => (title ? <Tooltip title={title}>{children}</Tooltip> : children);

const TabBar = ({
  tabs,
  matchData,
  history,
  location,
}: { tabs: any[]; matchData?: Match } & RouterProps) => {
  const [tabValue, setTabValue] = useState(0);
  const visibleTabs = useMemo(
    () =>
      tabs.filter(
        (tab) => !tab.hidden || (tab.hidden && !tab.hidden(matchData)),
      ),
    [matchData, tabs],
  );

  useEffect(() => {
    const newTabIndex = visibleTabs.findIndex((tab) =>
      location.pathname.startsWith(tab.route),
    );
    setTabValue(newTabIndex !== -1 ? newTabIndex : 0);
  }, [visibleTabs, history, location.pathname]);

  const handleTabClick = useCallback(
    (e, tab, index) => {
      e.preventDefault();
      history.push(e.currentTarget.getAttribute("href"));
      setTabValue(index);
    },
    [history],
  );

  return (
    <StyledMain>
      <StyledTabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
      >
        {visibleTabs.map((tab, i) => (
          <TabTooltip
            title={tab.tooltip}
            key={`${tab.name}_${tab.route}_${tab.key}`}
          >
            <StyledTab
              //@ts-expect-error
              component="a"
              href={tab.route + window.location.search}
              onClick={(e) => handleTabClick(e, tab, i)}
              label={tab.name}
              disabled={tab.disabled}
              sx={{
                fontFamily: "Inter, Roboto, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
              }}
            />
          </TabTooltip>
        ))}
      </StyledTabs>
    </StyledMain>
  );
};

export default withRouter(TabBar);
