import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Li = styled.li`
  display: inline-block;
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
  background-color: transparent;
  white-space: nowrap;
  overflow-x: auto;
  ${props => props.active && 'border-bottom: 2px solid #2196F3'};

    a {
      display: block;
      white-space: nowrap;
      text-transform: uppercase;
      font-weight: 500;
      font-size: 14px;
      color: rgba(0,0,0,.87);
      cursor: default;
      height: 48px;
      line-height: 48px;
      padding-left: 24px;
      padding-right: 24px;
      user-select: none;
      ${props => props.active && 'color: 2px solid #2196F3'};
    }
`;

const Tab = (props) => {
  const click = (event) => {
    event.preventDefault();
    props.onClick(props.tabIndex);
  };

  return (
    <Li className="tab">
      <a active={props.isActive} onClick={click} role="tab">
        Test
      </a>
    </Li>
  );
};

Tab.propTypes = {
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  isActive: PropTypes.bool,
  iconClassName: PropTypes.string.isRequired,
  linkClassName: PropTypes.string.isRequired
};

export default Tab;
