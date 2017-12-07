import { isCommaDelimited, isContainerServicePortName, containerServicePortNamePattern } from 'util/validations';

export const serviceNameMaxLen = 15;

export default (values) => {
  const errors = {
    virtual_hosts: '',
  };

  if (!values.name) {
    errors.name = ' ';
  }

  if (values.name && values.name.length > serviceNameMaxLen) {
    errors.name = `cannot exceed ${serviceNameMaxLen} characters`;
  }

  if (!isContainerServicePortName(values.name)) {
    errors.name = `valid format is ${containerServicePortNamePattern}`;
  }

  if (!values.protocol) {
    errors.protocol = ' ';
  }

  if (!values.service_port && !Number.isInteger(values.service_port)) {
    errors.service_port = ' ';
  }

  if (values.service_port < 0) {
    errors.service_port = 'cannot be negative';
  }

  if (values.service_port > 65536) {
    errors.service_port = 'must be between 0-65536';
  }

  if (!values.container_port && !Number.isInteger(values.container_port)) {
    errors.container_port = ' ';
  }

  if (values.container_port < 0) {
    errors.container_port = 'cannot be negative';
  }

  if (values.container_port > 65536) {
    errors.container_port = 'must be between 0-65536';
  }

  if (values.virtual_hosts && !isCommaDelimited(values.virtual_hosts)) {
    errors.virtual_hosts = 'must be a comma delimited list';
  }

  return errors;
};
