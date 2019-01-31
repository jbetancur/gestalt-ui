import styled from 'styled-components';

const Caption = styled.span`
  font-size: 12px !important;
  color: ${props => props.theme.colors[props.light ? '$md-grey-500' : '$md-grey-800']};
  ${props => props.block && 'display: block'};
  ${props => props.small && 'font-size: 11px!important'};
  ${props => props.large && 'font-size: 13px!important'};

  * {
    color: ${props => props.theme.colors[props.light ? '$md-grey-500' : '$md-grey-800']};
  }
`;

export default Caption;
