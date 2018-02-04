import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import styled, { withTheme } from 'styled-components';
import ExpanderIcon from '../components/ExpanderIcon';

const TitleSection = styled(Col)`
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 16px;
  padding-bottom: 16px;
  height: 100%;
`;

const Title = styled.div`
  display: inline-block;
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.colors['$md-grey-700']};
`;

const CountSection = styled(Col)`
  text-align: right;
  padding-right: 8px;
`;

const Bubble = styled.div`
  display: inline-block;
  min-width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 5px;
  text-align: center;
  background-color: ${props => props.theme.colors['$md-blue-300']};
  color: white;
`;

const HeaderStyle = styled.header`
  ${props => !props.expandable && 'padding-left: 8px'};
  height: 4em;
  background-color: ${props => props.theme.colors['$md-grey-50']};
  border-top: 1px solid ${props => props.theme.colors['$md-grey-100']};
  font-weight: 700;
  user-select: none;

  &:hover {
    cursor: ${props => (!props.expandable ? 'inherit' : 'pointer')};
  }
`;

class Header extends PureComponent {
  static propTypes = {
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  };

  static defaultProps = {
    expandable: true,
    expanded: true,
    onClick: null,
    count: false,
  };

  render() {
    const { title, count, expandable, expanded, onClick } = this.props;
    const showCount = (count || count !== 0) && !expanded;

    return (
      <HeaderStyle expandable={expandable} onClick={onClick}>
        <Row gutter={1} center fill wrap="nowrap">
          <TitleSection flex={showCount ? 10 : 12}>
            {expandable && <ExpanderIcon isExpanded={expanded}>expand_more</ExpanderIcon>}
            <Title small>{title}</Title>
          </TitleSection>
          {showCount &&
          <CountSection flex={2}>
            <Bubble>{count}</Bubble>
          </CountSection>}
        </Row>
      </HeaderStyle>
    );
  }
}

export default withTheme(Header);
