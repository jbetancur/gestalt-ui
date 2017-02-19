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

  return errors;
};
