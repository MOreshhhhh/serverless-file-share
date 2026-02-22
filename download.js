window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (code) {
    document.getElementById('codeInput').value = code;
    downloadFile();
  }
};

async function downloadFile() {
  const code = document.getElementById('codeInput').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (!code) {
    alert('Enter a download code');
    return;
  }

  try {
    const response = await fetch(`https://l7af2ihhig.execute-api.ap-south-1.amazonaws.com/demo?code=${code}`);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<span style="color:red">${data.error}</span>`;
      return;
    }

    const downloadUrl = data.downloadUrl;
    const fileName = data.fileName;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.textContent = `Click here to download: ${fileName}`;
    resultDiv.appendChild(a);

  } catch (err) {
    console.error(err);
    alert('Error fetching file');
  }
}
