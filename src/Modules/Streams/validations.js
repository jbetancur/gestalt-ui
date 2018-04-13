import { merge } from 'lodash';
import { nestedObjectFromString } from 'util/helpers/transformations';

export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'required';
  }

  if (!values.properties.cpus) {
    merge(errors, nestedObjectFromString('properties.cpus', 'required'));
  }

  if (!values.properties.mem) {
    merge(errors, nestedObjectFromString('properties.mem', 'required'));
  }

  if (!values.properties.parallelization) {
    merge(errors, nestedObjectFromString('properties.parallelization', 'required'));
  }

  if (!values.properties.processor.lambda_id) {
    merge(errors, nestedObjectFromString('properties.processor.lambda_id', 'required'));
  }

  if (!values.properties.processor.input_stream_config.feed_id) {
    merge(errors, nestedObjectFromString('properties.processor.input_stream_config.feed_id', 'required'));
  }

  if (!values.properties.processor.input_stream_config.name) {
    merge(errors, nestedObjectFromString('properties.processor.input_stream_config.name', 'required'));
  }

  if (!values.properties.processor.output_stream_config.feed_id) {
    merge(errors, nestedObjectFromString('properties.processor.output_stream_config.feed_id', 'required'));
  }

  if (!values.properties.processor.output_stream_config.name) {
    merge(errors, nestedObjectFromString('properties.processor.output_stream_config.name', 'required'));
  }

  const partition = values.properties.processor.input_stream_config.partition.partition;
  if (!partition && !Number.isInteger(partition)) {
    merge(errors, nestedObjectFromString('properties.processor.input_stream_config.partition.partition', 'required'));
  }

  const startOffset = values.properties.processor.input_stream_config.partition.start_offset;
  if (!startOffset && !Number.isInteger(startOffset)) {
    merge(errors, nestedObjectFromString('properties.processor.input_stream_config.partition.start_offset', 'required'));
  }

  const endOffset = values.properties.processor.input_stream_config.partition.end_offset;
  if (!endOffset && !Number.isInteger(endOffset)) {
    merge(errors, nestedObjectFromString('properties.processor.input_stream_config.partition.end_offset', 'required'));
  }

  return errors;
};
