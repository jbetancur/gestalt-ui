import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SelectField from 'react-md/lib/SelectFields';
import FontIcon from 'react-md/lib/FontIcons';

const OuterDiv = styled.div`
  padding-left: 2em;
`;

const IconDiv = styled.div`
  margin-top: 1em;
`;

const sortItems = [
  { name: 'name', value: 'description' },
  { name: 'short-name', value: 'name' },
  { name: 'owner', value: 'owner.name' },
  { name: 'created', value: 'created.timestamp' },
  { name: 'modified', value: 'modified.timestamp' }
];

const orderItems = [
  { name: 'ascending', value: 'asc' },
  { name: 'descending', value: 'desc' }
];

const Sort = props => (
  props.visible ?
    <OuterDiv className="flex-row">
      <IconDiv>
        <FontIcon>sort</FontIcon>
      </IconDiv>
      <SelectField
        id="sort--key"
        className="flex-1 flex-xs-6 flex-sm-3"
        menuItems={sortItems}
        itemLabel="name"
        itemValue="value"
        defaultValue={props.sortKey}
        onChange={value => props.setKey(value)}
      />
      <SelectField
        id="sort--order"
        className="flex-1 flex-xs-4 flex-sm-2"
        menuItems={orderItems}
        itemLabel="name"
        itemValue="value"
        defaultValue={props.order}
        onChange={value => props.setOrder(value)}
      />
    </OuterDiv> : null
);

Sort.propTypes = {
  visible: PropTypes.bool,
  sortKey: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  setKey: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
};

Sort.defaultProps = {
  visible: true,
};

export default Sort;
