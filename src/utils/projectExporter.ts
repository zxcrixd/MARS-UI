import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export async function exportAndroidProjectZip() {
  const zip = new JSZip();

  // Add all Android files to zip structure
  ANDROID_PROJECT_FILES.forEach(file => {
    zip.file(file.path, file.content);
  });

  // Generate binary zip blob
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mars-launcher-android-project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Celebration confetti
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff2a36', '#d6001c', '#ffffff', '#ff6b75']
    });
  } catch (_) {}
}
