export const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: "audio/webm",
  });

  let chunks = [];

  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  mediaRecorder.start();

  return {
    stop: async () =>
      new Promise((resolve) => {
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });

          // Convert to MP3
          const file = new File([blob], "voice.mp3", { type: "audio/mp3" });

          resolve(file);
        };
        mediaRecorder.stop();
      }),
  };
};
