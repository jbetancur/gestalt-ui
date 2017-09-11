import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';

const EnhancedListItem = styled.div`
  height: 56px;
  text-decoration: none;
  display: ${props => (props.visible ? 'flex' : 'none')};
  align-items: center;

  @media screen and (min-width: 1025px) {
    .md-list-tile {
      height: 56px;
    }
  }

  .md-fake-btn {
    padding: 0;
  }
`;

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
`;

const Text = styled.div`
  font-size: .7em;
  margin-top: 6px;
  padding-bottom: 1em;
  text-align: center;
  white-space: normal;
  text-transform: uppercase;
`;

const Icon = styled(FontIcon)`
  font-size: 28px!important;

  svg {
    height: 28px;
    width: 28px;
  }
`;

const ListItemStacked = props => (
  <EnhancedListItem visible={props.visible} {...props}>
    <Wrapper>
      <Icon>{props.icon}</Icon>
      <Text>{props.title}</Text>
    </Wrapper>
  </EnhancedListItem>
);

ListItemStacked.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool,
};

ListItemStacked.defaultProps = {
  visible: true,
};

export default ListItemStacked;
