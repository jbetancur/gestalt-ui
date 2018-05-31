import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import styled, { withTheme, css } from 'styled-components';
import ExpanderIcon from '../components/ExpanderIcon';

const TitleSection = styled(Col)`
  ${props => !props.noShadow && css`
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 12px;
    padding-bottom: 12px;
  `};
  height: 100%;
`;

const Title = styled.div`
  display: inline-block;
  font-size: 16px;
  color: ${props => props.theme.colors['$md-grey-700']};
`;

const Icon = styled.div`
  display: inline-block;
  margin-right: 5px;
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
  ${props => !props.expandable && !props.noShadow && 'padding-left: 8px'};
  height: 48px;
  background-color: ${props => props.theme.colors['$md-white']};
  border-top: ${props => (props.noShadow ? 'none' : `1px solid ${props.theme.colors['$md-grey-200']}`)};
  font-weight: bold;
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
    icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    noShadow: PropTypes.bool,
  };

  static defaultProps = {
    expandable: true,
    expanded: true,
    onClick: null,
    count: false,
    icon: false,
    noShadow: false,
  };

  render() {
    const { title, count, expandable, expanded, onClick, icon, noShadow } = this.props;
    const showCount = (count || count !== 0) && !expanded;

    return (
      <HeaderStyle expandable={expandable} onClick={onClick} noShadow={noShadow}>
        <Row gutter={1} center fill wrap="nowrap">
          <TitleSection flex={showCount ? 10 : 12}>
            {expandable && <ExpanderIcon isExpanded={expanded}>expand_more</ExpanderIcon>}
            {icon && <Icon>{icon}</Icon>}
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
