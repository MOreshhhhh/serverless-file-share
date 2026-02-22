const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const BUCKET = 'YOUR_BUCKET_NAME_HERE';
const TABLE = 'Files';

exports.handler = async (event) => {
    const { fileName, expiryTime } = JSON.parse(event.body);
    const fileId = Date.now().toString() + Math.floor(Math.random()*1000);
    const downloadCode = Math.random().toString(36).substring(2,8);

    const params = {
        Bucket: BUCKET,
        Key: fileId + '_' + fileName,
        Expires: 60 * 60 // 1 hour presigned URL
    };
    const uploadUrl = S3.getSignedUrl('putObject', params);

    await DynamoDB.put({
        TableName: TABLE,
        Item: {
            fileId,
            fileName,
            uploadTime: Date.now(),
            expiryTime: Math.floor(expiryTime/1000),
            downloadCode,
            downloadCount: 0
        }
    }).promise();

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "YOUR BUCKET_URL_HERE",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({ uploadUrl, downloadCode })
    };
};
