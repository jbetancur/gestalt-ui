import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabStyle = styled.div`
  cursor: pointer;
  border-bottom: 2px solid ${props => (props.active ? `${props.theme.colors['$md-blue-500']}` : 'transparent')};
`;

const TabTitle = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  padding-left: 24px;
  padding-right: 24px;
  white-space: nowrap;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 13px;
  color: ${props => props.theme.colors['$md-grey-900']};
  user-select: none;
`;

const Tab = ({ title, isActive, tabIndex, onClick }) => {
  const click = (event) => {
    event.preventDefault();
    if (!isActive) {
      onClick(tabIndex);
    }
  };

  return (
    <TabStyle active={isActive}>
      <TabTitle onClick={click}>
        {title}
      </TabTitle>
    </TabStyle>
  );
};

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default Tab;
