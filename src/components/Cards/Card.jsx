import styled, { withTheme, css } from 'styled-components';

const Card = styled.div`
  position: relative;
  background: white;
  border-radius: 3px;
  ${props => !props.noShadow && 'box-shadow: 0 1px 1px 0 rgba(0,0,0,.1), 0 1px 1px 0 rgba(0,0,0,.1), 0 0 1px -4px rgba(0,0,0,.2)'};
  ${props => props.raise && !props.noShadow && css`
    transition-duration: 0.2s;
    transition-property: box-shadow;
    transition-timing-function: ease-in;

    &:hover {
      box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.14), 0 3px 6px 2px rgba(0, 0, 0, 0.12), 0 3px 3px -2px rgba(0, 0, 0, 0.2);
    }
  `};
`;

export default withTheme(Card);
