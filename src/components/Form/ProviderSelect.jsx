import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { last, orderBy } from 'lodash';
import { Field } from 'react-final-form';
import { SelectField } from 'components/ReduxFormFields';
import { composeValidators, required } from 'util/forms';
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

  handleSelectedProvider = (value) => {
    const { selectedProvider, setSelectedProvider, name, form, resetFields } = this.props;
    const selection = this.getProvider(value);

    if (selectedProvider.provider.resource_type !== selection.resource_type && resetFields.length) {
      form.batch(() => {
        resetFields.forEach(f => form.change(f.field, f.value || null));
      });
    }

    // calling redux causes some strange RACE behavior here with form.change where it will not set the value
    // therefore, we need to setTimeout the form.change
    setTimeout(() => form.change(name, value));
    setSelectedProvider(selection);
  }

  generateMenuItems() {
    const { providers } = this.props;
    return orderBy(providers, 'name').map(item => ({
      label: item.name,
      value: item.id,
      leftIcon: iconMap(last(item.resource_type.split('::'))),
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
        itemLabel="label"
        itemValue="value"
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
