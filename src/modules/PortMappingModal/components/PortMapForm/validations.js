import { isCommaDelimited, isContainerName } from 'util/validations';

export default (values) => {
  const errors = {
    virtual_hosts: '',
  };

  if (!values.name) {
    errors.name = ' ';
  }

  if (!isContainerName(values.name)) {
    errors.name = 'invalid port name';
  }

  if (!values.protocol) {
    errors.protocol = ' ';
  }

  if (values.service_port > 65536) {
    errors.service_port = 'Invalid Port';
  }

  if (values.container_port > 65536) {
    errors.service_port = 'Invalid Port';
  }

  if (values.virtual_hosts && !isCommaDelimited(values.virtual_hosts)) {
    errors.virtual_hosts = 'Must be a comma delimited list';
  }

  return errors;
};
