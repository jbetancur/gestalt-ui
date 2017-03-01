import styled from 'styled-components';
import { ExpansionPanel } from 'react-md/lib/ExpansionPanels';

const ExpansionPanelNoPadding = styled(ExpansionPanel)`
  .md-panel-content {
    padding: 0;
  }
  .md-panel-column {
    margin-top: 1em;
  }
`;

export default ExpansionPanelNoPadding;
