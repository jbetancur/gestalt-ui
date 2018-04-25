export default [
  {
    type: 'kafka',
    displayName: 'Kafka',
    formats: [
      'JSON',
      'JSON-AVRO',
      'XML',
      'PROTOBUF',
      'THRIFT',
    ]
  },
  {
    type: 'raw',
    displayName: 'RAW',
    formats: [
      'JSON',
      'JSON-INLINE',
      'CSV',
      'CSV-INLINE',
      'BINARY',
      'BINARY-INLINE',
    ]
  },
  {
    type: 'database',
    displayName: 'Database',
    formats: [
      'Postgres',
      'Oracle',
      'SQLServer',
      'SYBASE',
      'Mysql',
      'MongoDB',
      'Redis',
    ]
  },
  {
    type: 'queue',
    displayName: 'Queue',
    formats: [
      'Rabbit',
      'ZeroMQ',
      'AMQP',
      'MQSeries',
      'Redis-PubSub',
    ]
  },
  {
    type: 'object-store',
    displayName: 'Object Store',
    formats: [
      'S3',
    ]
  },
  {
    type: 'fs',
    displayName: 'File System',
    formats: [
      'NFS',
      'EFS',
    ]
  }
];
