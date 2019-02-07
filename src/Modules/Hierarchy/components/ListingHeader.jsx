import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 48px;
  width: 100%;
`;

const Left = styled.div`
  flex: 1 0 auto;
  display: flex;
`;

const Right = styled.div`
  flex: 1 0 auto;
  display: flex;
  justify-content: flex-end;
`;

const ListingHeader = ({ leftItems, rightItems, }) => (
  <Header>
    <Left>
      {leftItems}
    </Left>
    <Right>
      {rightItems}
    </Right>
  </Header>
);

ListingHeader.propTypes = {
  leftItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  rightItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ListingHeader.defaultProps = {
  rightItems: null,
};

export default ListingHeader;
