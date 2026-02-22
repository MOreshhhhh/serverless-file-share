// Replace with your actual frontend domain
const FRONTEND_DOMAIN = 'YOUR_FRONTEND_DOMAIN_HERE';

// Replace with your API Gateway endpoints
const API_UPLOAD_URL = 'YOUR_API_UPLOAD_URL_HERE';

async function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  const expiryMinutes = parseInt(document.getElementById('expiryInput').value);
  const progressBar = document.getElementById('progressBar');
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (!file) {
    alert('Select a file first');
    return;
  }

  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;

  try {
    // 1. Get pre-signed URL from Lambda
    const response = await fetch('YOUR LAMBDA URL HERE', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, expiryTime })
    });

    const data = await response.json();
    const uploadUrl = data.uploadUrl;
    const downloadCode = data.downloadCode;

    // 2. Upload file to S3 using pre-signed URL
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);

    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        progressBar.value = percent;
      }
    };

    xhr.onload = function() {
      if (xhr.status === 200) {
        const shareUrl = `${FRONTEND_DOMAIN}/download.html?code=${downloadCode}`;
        resultDiv.innerHTML = `
          File uploaded successfully! <br/>
          Download Code: <b>${downloadCode}</b> <br/>
          Share Link: <a href="${shareUrl}" target="_blank">${shareUrl}</a> <br/>
          <div id="qrcode"></div>
        `;
        new QRCode(document.getElementById("qrcode"), {
          text: shareUrl,
          width: 150,
          height: 150
        });
      } else {
        resultDiv.innerHTML = 'Upload failed';
      }
    };

    xhr.send(file);

  } catch (err) {
    console.error(err);
    alert('Error uploading file');
  }
}
