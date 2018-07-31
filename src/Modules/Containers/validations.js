import {
  isContainerName,
  isCommaDelimited,
  isCommaDelimitedConstraints,
  isContainerServicePortName,
  containerNamePattern,
  containerServicePortNamePattern,
  kubernetesVolumeNamePattern,
  isKubernetesVolumeName
} from 'util/validations';
import { isURL } from 'validator';

export const nameMaxLen = 60;
export const descriptionMaxLen = 512;
export const portMappingServiceNameMaxLen = 15;

export default (values) => {
  const errors = {
    properties: {
      accepted_resource_roles: '',
      constraints: '',
      provider: {},
      port_mappings: [],
      volumes: [],
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

  // if (values.properties.accepted_resource_roles && !isCommaDelimited(values.properties.accepted_resource_roles)) {
  //   errors.properties.accepted_resource_roles = 'Must be a comma delimited list';
  // }

  if (values.properties.constraints && !isCommaDelimitedConstraints(values.properties.constraints)) {
    errors.properties.constraints = 'Must be a comma delimited list';
  }

  if (values.properties.port_mappings && values.properties.port_mappings.length) {
    const portMappingErrors = [];
    values.properties.port_mappings.forEach((port, index) => {
      const portMapError = {};

      if (!port || !port.type) {
        portMapError.type = 'required';
        portMappingErrors[index] = portMapError;
      }

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

      if (!port || !port.lb_port) {
        portMapError.lb_port = 'required';
        portMappingErrors[index] = portMapError;
      }

      if (port.lb_port > 65536) {
        portMapError.lb_port = 'must be between 0-65536';
        portMappingErrors[index] = portMapError;
      }

      if (!port || !port.container_port) {
        portMapError.container_port = 'required';
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

  if (values.properties.volumes && values.properties.volumes.length) {
    const volumeErrors = [];
    values.properties.volumes.forEach((volume, index) => {
      const volumeMapError = {
        persistent: {},
      };

      if (!volume.mode) {
        volumeMapError.mode = 'required';
        volumeErrors[index] = volumeMapError;
      }

      if (!volume.host_path) {
        volumeMapError.host_path = 'required';
        volumeErrors[index] = volumeMapError;
      }

      if (!volume.container_path) {
        volumeMapError.container_path = 'required';
        volumeErrors[index] = volumeMapError;
      }

      if (!volume.name) {
        volumeMapError.name = 'required';
        volumeErrors[index] = volumeMapError;
      }

      if (volume.name && !isKubernetesVolumeName(volume.name)) {
        volumeMapError.name = `a DNS-1123 subdomain must consist of lower case alphanumeric characters, \\'-\\' or \\'.\\', and must start and end with an alphanumeric character ${kubernetesVolumeNamePattern}`;
        volumeErrors[index] = volumeMapError;
      }

      if (volume.persistent && !volume.persistent.size) {
        volumeMapError.persistent.size = ' ';
        volumeErrors[index] = volumeMapError;
      }

      if (volume.persistent && !volume.persistent.size > 0) {
        volumeMapError.persistent.size = 'must be between greater that 0';
        volumeErrors[index] = volumeMapError;
      }

      if (volume.host_path &&
        !isURL(volume.host_path, { require_protocol: false, require_host: false, require_valid_protocol: false })) {
        volumeMapError.host_path = 'the path must be absolute';
        volumeErrors[index] = volumeMapError;
      }
    });

    if (volumeErrors.length) {
      errors.properties.volumes = volumeErrors;
    }
  }

  if (values.properties.health_checks && values.properties.health_checks.length) {
    const healthCheckErrors = [];
    values.properties.health_checks.forEach((check, index) => {
      const healthCheckError = {};

      if (!check.protocol) {
        healthCheckError.protocol = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (!check.grace_period_seconds) {
        healthCheckError.grace_period_seconds = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (!check.interval_seconds) {
        healthCheckError.interval_seconds = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (!check.timeout_seconds) {
        healthCheckError.timeout_seconds = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (!check.max_consecutive_failures) {
        healthCheckError.max_consecutive_failures = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (!check.path) {
        healthCheckError.path = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (!check.command) {
        healthCheckError.command = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (!check.port) {
        healthCheckError.port = 'required';
        healthCheckErrors[index] = healthCheckError;
      }

      if (check.port > 65536) {
        healthCheckError.port = 'Invalid Port';
        healthCheckErrors[index] = healthCheckError;
      }
    });

    if (healthCheckErrors.length) {
      errors.properties.health_checks = healthCheckErrors;
    }
  }

  return errors;
};
