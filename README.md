# Serverless File Share

A serverless file sharing application built using AWS S3, Lambda, API Gateway, and DynamoDB.

This project demonstrates:
- Secure file uploads using S3 pre-signed URLs
- Temporary download links with expiration logic
- Serverless backend architecture
- File metadata tracking in DynamoDB
- Frontend built with vanilla HTML, CSS, and JavaScript

## Architecture
Frontend (Static Website hosted on S3)
→ API Gateway
→ Lambda Functions
   → Generate Upload URL
   → Generate Download URL
→ S3 (File Storage)
→ DynamoDB (File Metadata Storage)

## Key Features
- Pre-signed URL based secure uploads
- Download code system
- Expiry-based file lifecycle
- Download count tracking
- Fully serverless architecture


### Flow

1. User selects file in frontend.
2. Frontend requests a pre-signed upload URL from Lambda.
3. File is uploaded directly to S3.
4. Metadata is stored in DynamoDB.
5. User receives a download code.
6. Download requests generate a temporary signed URL.


## Technologies Used

- AWS S3
- AWS Lambda
- AWS API Gateway
- AWS DynamoDB
- Pre-signed URLs
- Vanilla JavaScript
- HTML & CSS

## Security Considerations

- Files are uploaded using pre-signed S3 URLs (no direct credential exposure).
- Temporary download URLs are generated via Lambda.
- Expiry logic controls file access duration.
- No AWS credentials are exposed in frontend code.

## Deployment Steps

1. Create an S3 bucket for file storage.
2. Create a DynamoDB table for metadata.
3. Deploy Lambda functions.
4. Connect API Gateway to Lambda.
5. Enable CORS for frontend domain.
6. Host frontend on S3 static website hosting.


## Future Improvements

- Replace DynamoDB scan with query using indexed keys.
- Add server-side expiry enforcement.
- Add rate limiting and abuse protection.
- Improve random download code generation.
- Add authentication layer.

