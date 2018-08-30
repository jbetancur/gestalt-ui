import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Field } from 'react-final-form';
import { SelectField } from 'components/ReduxFormFields';
import actions from '../actions';
import { selectProvider } from '../selectors';

class SelectedProvider extends Component {
  static propTypes = {
    providers: PropTypes.array.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    setSelectedProvider: PropTypes.func.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    form: PropTypes.object.isRequired,
    resetFields: PropTypes.array,
  };

  static defaultProps = {
    name: 'properties.provider.id',
    label: 'Provider',
    resetFields: [],
  };

  getProvider(id) {
    const { providers } = this.props;

    return providers.find(p => p.id === id);
  }

  handleSelectedProvider = (value) => {
    const { selectedProvider, setSelectedProvider, name, form, resetFields } = this.props;
    const selection = this.getProvider(value);

    if (selectedProvider.provider.resource_type !== selection.resource_type && resetFields.length) {
      form.batch(() => {
        resetFields.forEach(f => form.change(f.field, f.value || null));
      });
    }

    form.change(name, value);
    setSelectedProvider(selection);
  }

  render() {
    const { name, label, providers } = this.props;

    return (
      <Field
        id={`select-provider-${label.toLowerCase()}`}
        component={SelectField}
        name={name}
        label={label}
        menuItems={providers}
        itemValue="id"
        itemLabel="name"
        onChange={this.handleSelectedProvider}
        required
      />
    );
  }
}

const mapStateToProps = state => ({
  selectedProvider: selectProvider(state),
});

export default compose(
  connect(mapStateToProps, actions),
)(SelectedProvider);
