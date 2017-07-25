import { isKubernetesVolumeName } from 'util/validations';

export default (values) => {
  const errors = {
    persistent: {},
  };

  if (!values.mode) {
    errors.mode = ' ';
  }

  if (!values.host_path) {
    errors.host_path = ' ';
  }

  if (values.persistent && !values.persistent.size) {
    errors.persistent.size = ' ';
  }

  if (!values.container_path) {
    errors.container_path = ' ';
  }

  if (values.container_path && values.container_path.charAt(0) === '/') {
    errors.container_path = 'a leading slash is not allowed';
  }

  if (!values.name) {
    errors.name = ' ';
  }

  if (values.name && !isKubernetesVolumeName(values.name)) {
    errors.name = 'a DNS-1123 subdomain must consist of lower case alphanumeric characters, \'-\' or \'.\', and must start and end with an alphanumeric character';
  }

  return errors;
};
