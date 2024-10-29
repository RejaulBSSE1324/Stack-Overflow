const Minio = require('minio');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER, 
  secretKey: process.env.MINIO_ROOT_PASSWORD, 
});

// Create a bucket if it doesn't exist
minioClient.bucketExists(process.env.MINIO_BUCKET, (err) => {
  if (err) {
      minioClient.makeBucket(process.env.MINIO_BUCKET, '', (err) => {
          if (err) console.log('Error creating bucket.', err);
          else console.log('Bucket created successfully');
      });
  } else {
      console.log('Bucket already exists');
  }
});
module.exports = minioClient;
