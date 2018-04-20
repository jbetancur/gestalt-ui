import styled, { withTheme, css } from 'styled-components';

const Card = styled.div`
  position: relative;
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px -3px rgba(0, 0, 0, 0.2);

  ${props => props.raise && css`
    transition-duration: .3s;
    transition-property: box-shadow;

    &:hover {
      box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.14), 0 3px 6px 2px rgba(0, 0, 0, 0.12), 0 3px 3px -2px rgba(0, 0, 0, 0.2)
    }
  `};
`;

export default withTheme(Card);
