import axios from "axios";

export const handleFetchAudio = async (data, track, player) => {
  track.setLoadingAudio(true);
  if (!data || !data.id) {
    console.error("Invalid data or missing ID:", data);
    track.setLoadingAudio(false);
    return;
  }
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/audio?id=${data.id}`);
    // const response = await fetch(`/api/audio?id=${data.id}`);
    const audioData = await response.data;
    console.log("Audio data fetched:", audioData);
    if (audioData && audioData.audioUrl) {
      player.setPlayerOpen(true);
      track.setAudioUrl((prev) => {
        const updated = [...prev, audioData.audioUrl];
        track.setCurrentIndex(updated.length - 1);

        return updated;
      });

      track.setLoadingAudio(false);
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
  track.setLoadingAudio(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/audio?id=${data.id}`);
    const audioData = await response.json();
    console.log("Audio data fetched:", audioData);
    if (audioData && audioData.audioUrl) {
      track.setAudioUrl((prev) => [...prev, audioData.audioUrl]);
      console.log("Next video URL set:", audioData.audioUrl);
      track.setLoadingAudio(false);
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


