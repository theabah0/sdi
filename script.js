import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/+esm";

const video = document.getElementById('video');
const startButton = document.getElementById('startButton');
const resultsDiv = document.getElementById('results');

let captureInterval;
let isCapturing = false;

// Access the camera and start the video stream
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    console.error('Error accessing the camera:', error);
    resultsDiv.textContent = 'Error accessing the camera. Please allow camera permissions.';
  }
}

// Capture an image from the video stream
async function captureImage() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the image to a Blob
  const imageData = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

  // Send the image to the Gradio API
  sendImageToAPI(imageData);
}

// Send the captured image to the Gradio API
async function sendImageToAPI(imageData) {
  try {
    const client = await Client.connect("theabaho/new1");
    const result = await client.predict("/predict", { img: imageData });

    // Display the result
    resultsDiv.textContent = `API Result: ${JSON.stringify(result.data)}`;
  } catch (error) {
    console.error('Error sending image to API:', error);
    resultsDiv.textContent = 'Error sending image to API.';
  }
}

// Start/stop capturing images at a set rate
startButton.addEventListener('click', () => {
  if (isCapturing) {
    clearInterval(captureInterval);
    startButton.textContent = 'Start Capture';
    isCapturing = false;
  } else {
    captureInterval = setInterval(captureImage, 1000); // Capture every 1 second
    startButton.textContent = 'Stop Capture';
    isCapturing = true;
  }
});

// Initialize the camera when the page loads
startCamera();