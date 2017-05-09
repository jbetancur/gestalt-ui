import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

const EnhancedTCol = styled(TableColumn)`
  cursor: pointer;
`;

const TColButtons = styled(EnhancedTCol)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 3.8em;
`;

const EnhancedTableColumn = props => (props.containsButtons ? <TColButtons {...props} /> : <EnhancedTCol {...props} />);

EnhancedTableColumn.propTypes = {
  containsButtons: PropTypes.bool,
};

EnhancedTableColumn.defaultProps = {
  containsButtons: false,
};

export default EnhancedTableColumn;
