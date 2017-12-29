import {
  isContainerName,
  isCommaDelimited,
  isCommaDelimitedConstraints,
  isContainerServicePortName,
  containerNamePattern,
  containerServicePortNamePattern
} from 'util/validations';

export const nameMaxLen = 60;
export const descriptionMaxLen = 512;
export const portMappingServiceNameMaxLen = 15;

export default (values) => {
  const errors = {
    properties: {
      accepted_resource_roles: '',
      constraints: '',
      provider: {},
      port_mappings: {},
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

  if (values.properties.port_mappings && values.properties.port_mappings.length) {
    const portMappingErrors = [];
    values.properties.port_mappings.forEach((port, index) => {
      const portMapError = {};

      if (!port || !port.name) {
        portMapError.name = 'required';
        portMappingErrors[index] = portMapError;
      }

      if (port.name && port.name.length > portMappingServiceNameMaxLen) {
        portMapError.name = `cannot exceed ${portMappingServiceNameMaxLen} characters`;
        portMappingErrors[index] = portMapError;
      }

      if (port.name && !isContainerServicePortName(port.name)) {
        portMapError.name = `valid format is ${containerServicePortNamePattern}`;
        portMappingErrors[index] = portMapError;
      }

      if (!port || !port.protocol) {
        portMapError.protocol = 'required';
        portMappingErrors[index] = portMapError;
      }

      if (!port || !port.container_port) {
        portMapError.container_port = 'required';
        portMappingErrors[index] = portMapError;
      }

      if (!port.service_port && !Number.isInteger(port.service_port)) {
        portMapError.service_port = ' ';
        portMappingErrors[index] = portMapError;
      }

      if (port.service_port < 0) {
        portMapError.service_port = 'cannot be negative';
        portMappingErrors[index] = portMapError;
      }

      if (port.service_port > 65536) {
        portMapError.service_port = 'must be between 0-65536';
        portMappingErrors[index] = portMapError;
      }

      if (!port.container_port && !Number.isInteger(port.container_port)) {
        portMapError.container_port = ' ';
        portMappingErrors[index] = portMapError;
      }

      if (port.container_port < 0) {
        portMapError.container_port = 'cannot be negative';
        portMappingErrors[index] = portMapError;
      }

      if (port.container_port > 65536) {
        portMapError.container_port = 'must be between 0-65536';
        portMappingErrors[index] = portMapError;
      }

      if (port.virtual_hosts && !isCommaDelimited(port.virtual_hosts)) {
        portMapError.virtual_hosts = 'must be a comma delimited list';
        portMappingErrors[index] = portMapError;
      }
    });

    if (portMappingErrors.length) {
      errors.properties.port_mappings = portMappingErrors;
    }
  }


  return errors;
};
