const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const BUCKET = 'my-file-share-bucket';
const TABLE = 'Files';

exports.handler = async (event) => {
    const code = event.queryStringParameters.code;
    const result = await DynamoDB.scan({
        TableName: TABLE,
        FilterExpression: 'downloadCode = :code',
        ExpressionAttributeValues: { ':code': code }
    }).promise();

    if (!result.Items || result.Items.length === 0) {
        return {
            statusCode: 404,
            headers: {
            "Access-Control-Allow-Origin": "BUCKET_URL_HERE",
            },
            body: JSON.stringify({ error: 'File not found or expired' })
        };
    }

    const file = result.Items[0];
    const downloadUrl = S3.getSignedUrl('getObject', {
        Bucket: BUCKET,
        Key: file.fileId + '_' + file.fileName,
        Expires: 60 * 60
    });

    // Increment download count
    await DynamoDB.update({
        TableName: TABLE,
        Key: { fileId: file.fileId },
        UpdateExpression: 'set downloadCount = downloadCount + :inc',
        ExpressionAttributeValues: { ':inc': 1 }
    }).promise();

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "YOUR_BUCKET_URL_HERE",
        },
        body: JSON.stringify({ downloadUrl, fileName: file.fileName })
    };
};
