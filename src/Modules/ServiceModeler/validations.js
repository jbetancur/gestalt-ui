
export const nameMaxLen = 60;
export const descriptionMaxLen = 512;

export default () => {
  const errors = {
    properties: {}
  };

  // if (!values.name) {
  //   errors.name = 'Required';
  // }

  // if (!values.extend) {
  //   errors.extend = 'Required';
  // }

  return errors;
};
