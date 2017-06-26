import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';

const EnhancedListItem = styled(ListItem)`
  display: ${props => (props.visible ? 'visible' : 'none')};

  @media screen and (min-width: 1025px) {
    .md-list-tile {
      height: 48px;
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
  font-size: .4em;
  text-transform: uppercase;
`;

const ListItemStacked = props => (
  <EnhancedListItem visible={props.visible} {...props}>
    <Wrapper>
      <FontIcon>{props.icon}</FontIcon>
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
