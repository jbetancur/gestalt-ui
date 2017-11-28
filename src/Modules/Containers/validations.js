import { isContainerName, isCommaDelimited, isCommaDelimitedConstraints, containerNamePattern } from 'util/validations';

export const nameMaxLen = 60;
export const descriptionMaxLen = 512;

export default (values) => {
  const errors = {
    properties: {
      accepted_resource_roles: '',
      constraints: '',
      provider: {},
    }
  };

  if (values.properties.provider && !values.properties.provider.id) {
    errors.properties.provider.id = 'a CaaS provider type is required';
  }

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && !isContainerName(values.name)) {
    errors.name = `invalid container name ${containerNamePattern}`;
  }

  if (values.name && values.name.length > nameMaxLen) {
    errors.name = 'name is too long';
  }

  if (values.description && values.description.length > descriptionMaxLen) {
    errors.description = 'description is too long';
  }

  if (!values.properties.network) {
    errors.properties.network = 'a network is required';
  }

  if (!values.properties.image) {
    errors.properties.image = 'an image is required';
  }

  if (!values.properties.cpus) {
    errors.properties.cpus = 'cpu is required';
  }

  if (!values.properties.memory) {
    errors.properties.memory = 'memory is required';
  }

  if (values.properties.accepted_resource_roles && !isCommaDelimited(values.properties.accepted_resource_roles)) {
    errors.properties.accepted_resource_roles = 'Must be a comma delimited list';
  }

  if (values.properties.constraints && !isCommaDelimitedConstraints(values.properties.constraints)) {
    errors.properties.constraints = 'Must be a comma delimited list';
  }

  return errors;
};
