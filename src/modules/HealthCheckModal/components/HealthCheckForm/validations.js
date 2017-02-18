export default (values) => {
  const errors = {};

  if (!values.protocol) {
    errors.protocol = ' ';
  }

  if (!values.grace_period_seconds) {
    errors.grace_period_seconds = ' ';
  }

  if (!values.interval_seconds) {
    errors.interval_seconds = ' ';
  }

  if (!values.timeout_seconds) {
    errors.timeout_seconds = ' ';
  }

  if (!values.max_consecutive_failures) {
    errors.max_consecutive_failures = ' ';
  }

  if (!values.port) {
    errors.port = ' ';
  }

  if (!values.port_index) {
    errors.port_index = ' ';
  }

  if (!values.path) {
    errors.path = ' ';
  }

  if (!values.command) {
    errors.command = ' ';
  }

  return errors;
};
