import React from 'react';
import styled from 'styled-components';
import DataTable from 'react-md/lib/DataTables/DataTable';

// TODO: fix checkbox width in header
// TODO: set a global padding to account for header
const Table = styled(DataTable)`
  // max-height: calc(100vh - 200px);
  // overflow: 'scroll';

  .md-table-checkbox {
    width: 67px;
  }
`;

const EnhancedTable = props => <Table {...props} />;

export default EnhancedTable;
