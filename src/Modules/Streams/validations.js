import { merge } from 'lodash';
import { nestedObjectFromString } from 'util/helpers/transformations';

export default (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'required';
  }

  if (values.properties) {
    if (!values.properties.cpus) {
      merge(errors, nestedObjectFromString('properties.cpus', 'required'));
    }

    if (!values.properties.mem) {
      merge(errors, nestedObjectFromString('properties.mem', 'required'));
    }

    if (!values.properties.parallelization) {
      merge(errors, nestedObjectFromString('properties.parallelization', 'required'));
    }

    if (!Object.keys(values.properties.provider).length) {
      merge(errors, nestedObjectFromString('properties.provider', 'required'));
    }

    if (!values.properties.lambda_provider || !values.properties.lambda_provider.url) {
      merge(errors, nestedObjectFromString('properties.lambda_provider.url', 'required'));
    }

    if (!values.properties.processor || !values.properties.processor.lambdaId) {
      merge(errors, nestedObjectFromString('properties.processor.lambdaId', 'required'));
    }

    if (!values.properties.processor || !values.properties.processor.inputStreamConfig || !values.properties.processor.inputStreamConfig.feedID) {
      merge(errors, nestedObjectFromString('properties.processor.inputStreamConfig.feedID', 'required'));
    }

    if (!values.properties.processor || !values.properties.processor.inputStreamConfig || !values.properties.processor.inputStreamConfig.name) {
      merge(errors, nestedObjectFromString('properties.processor.inputStreamConfig.name', 'required'));
    }

    if (!values.properties.processor || !values.properties.processor.outputStreamConfig || !values.properties.processor.outputStreamConfig.feedID) {
      merge(errors, nestedObjectFromString('properties.processor.outputStreamConfig.feedID', 'required'));
    }

    if (!values.properties.processor || !values.properties.processor.outputStreamConfig || !values.properties.processor.outputStreamConfig.name) {
      merge(errors, nestedObjectFromString('properties.processor.outputStreamConfig.name', 'required'));
    }

    const { partition } = values.properties.processor.inputStreamConfig.partitions[0];
    if ((!values.properties.processor || !partition) && !Number.isInteger(partition)) {
      merge(errors, nestedObjectFromString('properties.processor.inputStreamConfig.partitions[0].partition', 'required'));
    }

    const { startOffset } = values.properties.processor.inputStreamConfig.partitions[0];
    if ((!values.properties.processor || !startOffset) && !Number.isInteger(startOffset)) {
      merge(errors, nestedObjectFromString('properties.processor.inputStreamConfig.partitions[0].startOffset', 'required'));
    }

    const { endOffset } = values.properties.processor.inputStreamConfig.partitions[0];
    if ((!values.properties.processor || !endOffset) && !Number.isInteger(endOffset)) {
      merge(errors, nestedObjectFromString('properties.processor.inputStreamConfig.partitions[0].endOffset', 'required'));
    }
  }


  return errors;
};
