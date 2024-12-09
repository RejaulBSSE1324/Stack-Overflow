import { Client } from 'minio';
import dotenv from 'dotenv';
dotenv.config();

// Initialize MinIO Client
const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT,  // Ensure this is set correctly in your .env
    port: parseInt(process.env.MINIO_PORT, 10),  // Ensure the port is parsed as a number
    useSSL: false,  // Set to true if using HTTPS
    accessKey: process.env.MINIO_ROOT_USER,  // Use MINIO_ROOT_USER from .env
    secretKey: process.env.MINIO_ROOT_PASSWORD,  // Use MINIO_ROOT_PASSWORD from .env
});

// Check if the bucket exists or needs to be created
minioClient.bucketExists(process.env.MINIO_BUCKET, (err, exists) => {
    if (err) {
        console.log('Error checking bucket existence:', err);
        return;
    }

    if (exists) {
        console.log(`Bucket '${process.env.MINIO_BUCKET}' already exists.`);
    } else {
        // If bucket doesn't exist, create it
        minioClient.makeBucket(process.env.MINIO_BUCKET, 'us-east-1', (err) => {
            if (err) {
                console.log('Error creating bucket:', err);
                return;
            }
            console.log(`Bucket '${process.env.MINIO_BUCKET}' created successfully.`);
        });
    }
});

export default minioClient;
