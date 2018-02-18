import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Button } from 'react-md';

const ListStyled = styled.li`
  position: relative;
  line-height: 40px;
  height: 42px;

  &:not(:first-child) {
    border-left: 1px solid ${props => props.theme.colors['$md-grey-200']};
    border-right: 1px solid ${props => props.theme.colors['$md-grey-200']};
    border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  }
  &:first-child {
    border: 1px solid ${props => props.theme.colors['$md-grey-200']};
  }
`;

const Left = styled.div`
  display: inline;
  padding: 8px;
`;

const Right = styled.div`
  position: absolute;
  right: 0;
  display: inline-block;
  width: 42px;
  border-left: 1px solid ${props => props.theme.colors['$md-grey-200']};
`;

const RemoveButton = styled(Button) `
  &:hover {
    border-radius 0;
  }
`;

class ListItem extends PureComponent {
  static propTypes = {
    item: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  remove = () => this.props.onRemove(this.props.item);

  render() {
    return (
      <ListStyled>
        <Left>{this.props.item}</Left>
        <Right>
          <RemoveButton icon primary onClick={this.remove}>remove</RemoveButton>
        </Right>
      </ListStyled>
    );
  }
}

export default withTheme(ListItem);
