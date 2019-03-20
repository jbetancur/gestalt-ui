import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPickerData } from 'Modules/MetaResource';
import { ProviderSelect } from 'components/Form';
import actions from '../actions';
import { selectProvider } from '../reducers/selectors';

const SelectedProvider = ({ providersData, ...rest }) => (
  <ProviderSelect providers={providersData} {...rest} />
);

SelectedProvider.propTypes = {
  providersData: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  selectedProvider: selectProvider(state),
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS', expand: true } }),
  connect(mapStateToProps, actions),
)(SelectedProvider);
