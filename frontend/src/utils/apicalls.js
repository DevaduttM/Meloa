import axios from "axios";

export const handleFetchAudio = async (data, track, player) => {
  try {
    // const response = await fetch(`http://192.168.1.7:5000/audio?id=${data.id}`);
    const response = await fetch(`/api/audio?id=${data.id}`);
    const audioData = await response.json();
    console.log("Audio data fetched:", audioData);
    if (audioData && audioData.audioUrl) {
      player.setPlayerOpen(true);
      track.setAudioUrl((prev) => {
        const updated = [...prev, audioData.audioUrl];
        track.setCurrentIndex(updated.length - 1);
        return updated;
      });

      player.setPlaying(true);
      console.log("Audio URL set:", audioData.audioUrl);
    } else {
      console.error("No audio URL found in response");
    }
  } catch (error) {
    console.error("Error fetching audio data:", error);
  }
};

export const handleFetchNext = async (data, track, play) => {
  try {
    const response = await fetch(`http://192.168.1.7:5000/audio?id=${data.id}`);
    const audioData = await response.json();
    console.log("Audio data fetched:", audioData);
    if (audioData && audioData.audioUrl) {
      track.setAudioUrl((prev) => [...prev, audioData.audioUrl]);
      console.log("Next video URL set:", audioData.audioUrl);
        // play.setPlaying(true);
    } else {
      console.error("No next video URL found in response");
    }
  } catch (error) {
    console.error("Error fetching next video data:", error);
  }
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "meloa_img");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.response?.data || error.message);
    throw error;
  }
};


