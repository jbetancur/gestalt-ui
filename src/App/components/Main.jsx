import styled, { withTheme } from 'styled-components';

const Main = styled.main`
  height: 100%;
  padding-top: 4.6em;
  // background-color: ${props => props.theme.mainBackgroundColor};

  @media (min-width: 0) and (max-width: 768px) {
    padding-top: 3.8em;
  }
`;

export default withTheme(Main);
