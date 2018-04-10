export default [
  {
    type: 'Kafka',
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
    type: 'RAW',
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
    type: 'Database',
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
    type: 'Queue',
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
    type: 'Object Store',
    displayName: 'Object Store',
    formats: [
      'S3',
    ]
  },
  {
    type: 'File System',
    displayName: 'File System',
    formats: [
      'NFS',
      'EFS',
    ]
  }
];
