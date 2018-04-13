import { metaModels } from 'Modules/MetaResource';
import validate, { nameMaxLen, descriptionMaxLen } from './validations';

describe('(ResourceTypes) Form Validations', () => {
  it('should have not an error when name is present', () => {
    const values = {
      ...metaModels.resourceType,
      name: 'whatevs',
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeUndefined();
  });

  it('should have an error when name is blank', () => {
    const values = {
      ...metaModels.resourceType,
      name: '',
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeDefined();
  });

  it('should have an error when name is too long', () => {
    const values = {
      ...metaModels.resourceType,
      name: new Array(nameMaxLen + 2).join('a'),
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeDefined();
  });

  it('should have an error when name has spaces', () => {
    const values = {
      ...metaModels.resourceType,
      name: 'We Are The Robots',
    };

    const doValidate = validate(values);

    expect(doValidate.name).toBeDefined();
  });

  it('should have an error when description is too long', () => {
    const values = {
      ...metaModels.resourceType,
      description: new Array(descriptionMaxLen + 2).join('a'),
    };

    const doValidate = validate(values);

    expect(doValidate.description).toBeDefined();
  });

  it('should have not an error when extend is present', () => {
    const values = {
      ...metaModels.resourceType,
      extend: 'whatevs',
    };

    const doValidate = validate(values);

    expect(doValidate.extend).toBeUndefined();
  });

  it('should have an error when extend is blank', () => {
    const values = {
      ...metaModels.resourceType,
      extend: '',
    };

    const doValidate = validate(values);

    expect(doValidate.extend).toBeDefined();
  });

  it('should have an error for the prefix field if empty and verbs are defined', () => {
    const values = {
      ...metaModels.resourceType,
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

  it('should have not have any error for property_defs name, data_type, or refers_to if the values are present', () => {
    const values = {
      ...metaModels.resourceType,
      property_defs: [
        { name: 'not', data_type: 'gonna', refers_to: 'doit' },
      ],
    };

    const doValidate = validate(values);

    expect(doValidate.property_defs[0]).toBeUndefined();
  });

  it('should have an error for property_defs name if there is a space', () => {
    const values = {
      ...metaModels.resourceType,
      property_defs: [
        { name: 'spaces hah hah hah', data_type: 'string' },
      ],
    };

    const doValidate = validate(values);

    expect(doValidate.property_defs[0].name).toBeDefined();
  });

  it('should have an error for property_defs name, data_type, or refers_to properties are not present', () => {
    const values = {
      ...metaModels.resourceType,
      property_defs: [
        { name: '', data_type: '', refers_to: '' },
      ],
    };

    const doValidate = validate(values);

    expect(doValidate.property_defs[0].name).toBeDefined();
    expect(doValidate.property_defs[0].data_type).toBeDefined();
    expect(doValidate.property_defs[0].refers_to).toBeDefined();
  });
});
