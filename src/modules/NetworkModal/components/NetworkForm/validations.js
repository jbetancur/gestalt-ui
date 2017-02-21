export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = ' ';
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

  return errors;
};
