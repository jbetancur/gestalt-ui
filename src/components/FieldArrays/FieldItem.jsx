import styled, { withTheme } from 'styled-components';

const LI = styled.li`
  position: relative;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;

  &:nth-child(odd) {
    background-color: ${props => props.theme.colors['$md-grey-200']};
  }

  &:nth-child(even) {
    background-color: ${props => props.theme.colors['$md-grey-100']};
  }

  &:first-child {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    background-color: white;
    padding-left: 16px;
  }

  &:nth-child(2) {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }

  &:last-child {
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
`;

export default withTheme(LI);
