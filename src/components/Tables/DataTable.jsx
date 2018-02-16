import React from 'react';
import styled from 'styled-components';
import { DataTable } from 'react-md';

// TODO: fix checkbox width in header
// TODO: set a global padding to account for header
const Table = styled(DataTable)`
  .md-table-checkbox {
    width: 67px;
  }

  .md-table-column--adjusted {
    padding-right: 24px;
  }
`;

const EnhancedTable = props => <Table {...props} />;

export default EnhancedTable;
