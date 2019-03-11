import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { Field } from 'react-final-form';
import { composeValidators, required } from 'util/forms';
import { getLastFromSplit } from 'util/helpers/strings';
import SelectField from './Controls/SelectField';
import iconMap from '../../Modules/Providers/config/iconMap';

class ProviderSelect extends Component {
  static propTypes = {
    providers: PropTypes.array.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    setSelectedProvider: PropTypes.func.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    form: PropTypes.object.isRequired,
    resetFields: PropTypes.array,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    name: 'properties.provider.id',
    label: 'Provider',
    resetFields: [],
    disabled: false,
  };

  getProvider(id) {
    const { providers } = this.props;

    return providers.find(p => p.id === id);
  }

  handleSelectedProvider = (e) => {
    const { selectedProvider, setSelectedProvider, name, form, resetFields } = this.props;
    const selection = this.getProvider(e.target.value);

    if (selectedProvider.provider.resource_type !== selection.resource_type && resetFields.length) {
      form.batch(() => {
        resetFields.forEach(f => form.change(f.field, f.value || null));
      });
    }

    // calling redux causes some strange RACE behavior here with form.change where it will not set the value
    // therefore, we need to setTimeout the form.change
    setTimeout(() => form.change(name, e.target.value));
    setSelectedProvider(selection);
  }

  generateMenuItems() {
    const { providers } = this.props;
    return orderBy(providers, 'name').map(item => ({
      key: item.id,
      id: item.id,
      name: item.name,
      // secondaryLabel: item.description,
      leftIcon: item.resource_type ? iconMap(getLastFromSplit(item.resource_type)) : null,
    }));
  }

  render() {
    const { name, label, disabled } = this.props;

    return (
      <Field
        id={`select-provider-${label.toLowerCase()}`}
        component={SelectField}
        name={name}
        label={label}
        menuItems={this.generateMenuItems()}
        itemLabel="name"
        itemValue="id"
        onChange={this.handleSelectedProvider}
        disabled={disabled}
        validate={composeValidators(required())}
        required
        async
      />
    );
  }
}

export default ProviderSelect;
