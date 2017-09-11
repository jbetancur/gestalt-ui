import React from 'react';
import styled from 'styled-components';
import DataTable from 'react-md/lib/DataTables/DataTable';

// TODO: fix checkbox width in header
const Table = styled(DataTable)`
.md-table-checkbox {
  width: 67px;
}
`;

const EnhancedTable = props => <Table {...props} />;

export default EnhancedTable;
