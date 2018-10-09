import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { Timestamp } from 'components/TableCells';
import { Title } from 'components/Typography';
import { FontIcon } from 'react-md';
import styled from 'styled-components';

const Message = styled.div`
  padding: 8px 0 8px 0;
`;

const ContainerInstances = ({ events }) => {
  const columns = [
    {
      name: 'Message',
      selector: 'message',
      sortable: true,
      wrap: true,
      cell: row => <Message>{row.message}</Message>
    },
    {
      name: 'Reason',
      selector: 'reason',
      sortable: true,
    },
    // {
    //   name: 'Type',
    //   selector: 'eventType',
    //   sortable: true,
    // },
    {
      name: 'Age',
      selector: 'age',
      sortable: true,
      cell: row => <Timestamp timestamp={row.age} />
    },
  ];

  return (
    <DataTable
      data={events}
      columns={columns}
      sortIcon={<FontIcon>arrow_downward</FontIcon>}
      defaultSortField="age"
      noDataComponent={<Title light>There are no events to display</Title>}
      noHeader
    />
  );
};

ContainerInstances.propTypes = {
  events: PropTypes.array.isRequired,
};

export default ContainerInstances;
