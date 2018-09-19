import validate, { nameMaxLen, descriptionMaxLen } from './validations';
import resourceTypeModel from './models/resourceType';

describe('(ResourceTypes) Form Validations', () => {
  it('should have not an error when name is present', () => {
    const values = {
      ...resourceTypeModel.get(),
      name: 'whatevs',
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeUndefined();
  });

  it('should have an error when name is blank', () => {
    const values = {
      ...resourceTypeModel.get(),
      name: '',
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeDefined();
  });

  it('should have an error when name is too long', () => {
    const values = {
      ...resourceTypeModel.get(),
      name: new Array(nameMaxLen + 2).join('a'),
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeDefined();
  });

  it('should have an error when name has spaces', () => {
    const values = {
      ...resourceTypeModel.get(),
      name: 'We Are The Robots',
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeDefined();
  });

  it('should have an error when description is too long', () => {
    const values = {
      ...resourceTypeModel.get(),
      description: new Array(descriptionMaxLen + 2).join('a'),
    };

    const doValidate = validate(values);

    expect(doValidate.description).toBeDefined();
  });

  it('should have not an error when extend is present', () => {
    const values = {
      ...resourceTypeModel.get(),
      extend: 'whatevs',
    };

    const doValidate = validate(values);

    expect(doValidate.extend).toBeUndefined();
  });

  it('should have an error for the prefix field if empty and verbs are defined', () => {
    const values = {
      ...resourceTypeModel.get(),
      properties: {
        actions: {
          prefix: '',
          verbs: ['phatheading']
        }
      },
    };

    const doValidate = validate(values);


    expect(doValidate.properties.actions.prefix).toBeDefined();
  });
});
