import React from 'react';
import styled from 'styled-components';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

const EnhancedTCol = styled(TableColumn)`
  cursor: pointer;
`;
const EnhancedTableColumn = props => <EnhancedTCol {...props} />;

export default EnhancedTableColumn;
