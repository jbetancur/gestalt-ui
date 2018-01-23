import styled, { withTheme } from 'styled-components';
import { TableCardHeader } from 'react-md';

const EnhancedTableCardHeader = styled(TableCardHeader)`
  h2 {
    font-size: 20px;
    font-weight: 400;
    color: ${props => props.theme.colors['$md-grey-800']};
    min-height: 1.5em;
  }
`;

export default withTheme(EnhancedTableCardHeader);
