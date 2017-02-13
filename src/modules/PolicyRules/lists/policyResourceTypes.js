export default {
  container: {
    triggers: [

      {
        name: 'container.create.post'
      },
      {
        name: 'container.delete.post'
      },
      {
        name: 'container.scale.post'
      },
      {
        name: 'container.migrate.pre'
      }
    ],
    events: [

      {
        name: 'container.create'
      },
      {
        name: 'container.delete'
      },
      {
        name: 'container.scale'
      },
      {
        name: 'container.migrate'
      }
    ],
    limits: [
      {
        name: 'container.name',
        inputType: 'text'
      },
      {
        name: 'container.properties.cpus',
        inputType: 'number'
      },
      {
        name: 'container.properties.memory',
        inputType: 'number'
      },
      {
        name: 'container.properties.num_instances',
        inputType: 'number'
      },
      {
        name: 'container.properties.image',
        inputType: 'text'
      },
      {
        name: 'container.properties.network',
        inputType: 'text'
      },
      {
        name: 'container.properties.accepted_resource_roles',
        inputType: 'text'
      },
      {
        name: 'container.properties.constraints',
        inputType: 'text'
      },
      {
        name: 'container.properties.user',
        inputType: 'text'
      },
      {
        name: 'container.properties.labels',
        inputType: 'text'
      },
      {
        name: 'container.properties.provider.id',
        inputType: 'text'
      },
      {
        name: 'container.properties.force_pull',
        inputType: 'text'
      },
      {
        name: 'container.properties.container_type',
        inputType: 'text'
      }
    ]
  },
  lambda: {
    triggers: [
      {
        name: 'lambda.create.post'
      },

      {
        name: 'lambda.delete.post'
      }

    ],
    events: [
      {
        name: 'lambda.create'
      },
      {
        name: 'lambda.delete'
      }
    ],
    limits: [
      {
        name: 'lambda.name',
        inputType: 'text'
      },
      // {
      //   name: 'lambda.properties.cpus',
      //   inputType: 'number'
      // },
      // {
      //   name: 'lambda.properties.memory',
      //   inputType: 'number'
      // },
      {
        name: 'lambda.properites.timeout',
        inputType: 'number'
      },
      {
        name: 'lambda.properties.code_type',
        inputType: 'text'
      },
      {
        name: 'lambda.properties.package_url',
        inputType: 'text'
      },
      {
        name: 'lambda.properties.public',
        inputType: 'text'
      },
      {
        name: 'lambda.properties.runtime',
        inputType: 'text'
      }
    ]
  }
};
