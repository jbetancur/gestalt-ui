import { isCommaDelimited, isContainerServicePortName } from 'util/validations';

export const serviceNameMaxLen = 15;

export default (values) => {
  const errors = {
    virtual_hosts: '',
  };

  if (!values.name) {
    errors.name = ' ';
  }

  if (values.name && values.name.length > serviceNameMaxLen) {
    errors.name = 'service name is too long';
  }

  if (!isContainerServicePortName(values.name)) {
    errors.name = 'Service Name must be at most 15 characters, matching regex [a-z0-9]([a-z0-9-]*[a-z0-9])*';
  }

  if (!values.protocol) {
    errors.protocol = ' ';
  }

  if (!values.service_port) {
    errors.service_port = ' ';
  }

  if (!values.container_port) {
    errors.container_port = ' ';
  }

  if (values.service_port > 65536) {
    errors.service_port = 'port must be between 0-65536';
  }

  if (values.container_port > 65536) {
    errors.service_port = 'port must be between 0-65536';
  }

  if (values.virtual_hosts && !isCommaDelimited(values.virtual_hosts)) {
    errors.virtual_hosts = 'Must be a comma delimited list';
  }

  return errors;
};
