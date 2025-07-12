const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');
const saveBtn = document.getElementById('saveBtn');

let detections = [];

async function setupWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise(resolve => {
    video.onloadedmetadata = () => resolve(video);
  });
}

async function loadModels() {
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  ]);
}

async function start() {
  await setupWebcam();
  await loadModels();

  statusText.innerText = "Status: Models loaded ✅";
  detectLoop();
}

async function detectLoop() {
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    resizedDetections.forEach(result => {
      const box = result.detection.box;
      const age = Math.round(result.age);
      const gender = result.gender;
      const expressions = result.expressions;
      const mood = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];

      // Draw bounding box
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw label
      ctx.fillStyle = 'blue';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Age: ${age}, Gender: ${gender}, Mood: ${mood}`, box.x, box.y - 10);
    });

    if (resizedDetections.length === 0) {
      statusText.innerText = "Status: No face detected ❌";
    } else {
      statusText.innerText = `Status: ${resizedDetections.length} face(s) detected ✅`;
    }
  }, 200);
}

saveBtn.addEventListener('click', () => {
  if (detections.length === 0) return alert("❌ No face to save!");

  const box = detections[0].detection.box;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = box.width;
  tempCanvas.height = box.height;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.drawImage(video, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

  const link = document.createElement('a');
  link.download = 'captured-face.png';
  link.href = tempCanvas.toDataURL();
  link.click();
});

start();
