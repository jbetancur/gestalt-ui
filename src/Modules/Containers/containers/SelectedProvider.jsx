import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPickerData } from 'Modules/MetaResource';
import { ProviderSelect } from 'components/Form';
import actions from '../actions';
import { selectProvider } from '../selectors';

const SelectedProvider = ({ providersData, ...rest }) => (
  <ProviderSelect providers={providersData} {...rest} />
);

const mapStateToProps = state => ({
  selectedProvider: selectProvider(state),
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  connect(mapStateToProps, actions),
)(SelectedProvider);
