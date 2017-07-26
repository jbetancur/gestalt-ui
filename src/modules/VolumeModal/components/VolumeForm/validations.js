import { isKubernetesVolumeName } from 'util/validations';
import { isURL } from 'validator';

export default (values, props) => {
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

  if (props.providerType !== 'DCOS' &&
    values.container_path &&
    !isURL(values.container_path, { require_protocol: false, require_host: false, require_valid_protocol: false })) {
    errors.container_path = 'the directory path must be absolute';
  } else if (props.providerType === 'DCOS' &&
    (values.container_path && values.container_path.charAt(0) === '/')) {
    errors.container_path = 'the directory path must be relative';
  }

  if (!values.name) {
    errors.name = ' ';
  }

  if (values.name && !isKubernetesVolumeName(values.name)) {
    errors.name = 'a DNS-1123 subdomain must consist of lower case alphanumeric characters, \'-\' or \'.\', and must start and end with an alphanumeric character';
  }

  return errors;
};
