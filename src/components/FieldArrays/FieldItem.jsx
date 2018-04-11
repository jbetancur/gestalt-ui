import styled, { withTheme } from 'styled-components';
import { media } from 'util/helpers/media';

const FieldItem = styled.div`
  position: relative;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 16px;
  padding-right: 8px;

  &:nth-child(odd) {
    background-color: ${props => props.theme.colors['$md-grey-100']};
  }

  &:nth-child(even) {
    background-color: ${props => props.theme.colors['$md-white']};
  }

  &:first-child {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    padding-left: 16px;
    background-color: ${props => (props.noBackground ? 'transparent' : props.theme.colors['$md-white'])};
  }

  &:nth-child(n+2) {
    display: flex;
    align-items: center;
    ${() => media.xs || media.xs`
      padding-top: 32px;
    `};
    ${() => media.sm`
      padding-top: 32px;
    `};
  }
`;

export default withTheme(FieldItem);
