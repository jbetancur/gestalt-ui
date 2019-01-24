import styled, { withTheme } from 'styled-components';
import { media } from 'util/helpers/media';

const FieldItem = styled.div`
  position: relative;
  padding-bottom: 4px;
  padding-left: 16px;
  padding-right: 8px;
  display: flex;
  align-items: center;
  ${() => media.xs`
    padding-top: 32px;
  `};
  ${() => media.sm`
    padding-top: 32px;
  `};

  &:nth-child(even) {
    background-color: ${props => props.theme.colors['$md-grey-100']};
  }

  &:nth-child(odd) {
    background-color: ${props => props.theme.colors['$md-white']};
  }
`;

export default withTheme(FieldItem);
