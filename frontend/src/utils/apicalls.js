   export const handleFetchAudio = async (data, track, player) => {
    try {
      const response = await fetch(
        `http://192.168.1.7:5000/audio?id=${data.id}`
      );
      const audioData = await response.json();
      console.log("Audio data fetched:", audioData);
      if (audioData && audioData.audioUrl) {
        player.setPlayerOpen(true);
        track.setAudioUrl(audioData.audioUrl);
        player.setPlaying(true);
        console.log("Audio URL set:", audioData.audioUrl);
      } else {
        console.error("No audio URL found in response");
      }
    } catch (error) {
      console.error("Error fetching audio data:", error);
    }
  };