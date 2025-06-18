import { doc, getDoc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const setUserDetails = async (user) => {
  try {
    const userRef = doc(db, 'Users', user.uid);
    const docSnap = await getDoc(userRef);
    if(!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          photoURL: user.photoURL || '',
          likedSongs: [],
        }, { merge: true });    
    }
  } catch (error) {
    console.error("Error setting user details:", error);
  }
}

export const getUserDetails = async (user) => {
  try {
    const userRef = doc(db, 'Users', user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
}

export const createPlaylist = async (user, playlistName, song) => {
  try {
    const playlistsRef = collection(db, 'Users', user.uid, 'Playlists');

    const docRef = await addDoc(playlistsRef, {
      name: playlistName,
      songs: [song],
    });
    console.log("Playlist created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating playlist:", error);
  }
};

export const addSongToPlaylist = async (user, playlistId, song) => {
    const playlistRef = doc(db, 'Users', user.uid, 'Playlists', playlistId);
    try {
        const docSnap = await getDoc(playlistRef);
        if (docSnap.exists()) {
            const playlistData = docSnap.data();
            const updatedSongs = [...playlistData.songs, song];
            await setDoc(playlistRef, { songs: updatedSongs }, { merge: true });
            console.log("Song added to playlist successfully");
        } else {
            console.error("Playlist does not exist");
        }
    } catch (error) {
        console.error("Error adding song to playlist:", error);
    }
}

export const fetchPlaylists = async (user) => {
    const playlistsRef = collection(db, 'Users', user.uid, 'Playlists');
    try {
        const querySnapshot = await getDocs(playlistsRef);
        const playlists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Playlists fetched successfully:", playlists);
    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

export const addLikedSong = async (user, song) => {
  const userRef = doc(db, 'Users', user.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const updatedLikedSongs = [...userData.likedSongs, song];
      await setDoc(userRef, { likedSongs: updatedLikedSongs }, { merge: true });
      console.log("Song added to liked songs successfully");
    } else {
      console.error("User does not exist");
    }
  } catch (error) {
    console.error("Error adding liked song:", error);
  }
}

export const removeLikedSong = async (user, song) => {
  const userRef = doc(db, 'Users', user.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const updatedLikedSongs = userData.likedSongs.filter(s => s.id !== song.id);
      await setDoc(userRef, { likedSongs: updatedLikedSongs }, { merge: true });
      console.log("Song removed from liked songs successfully");
    } else {
      console.error("User does not exist");
    }
  } catch (error) {
    console.error("Error removing liked song:", error);
  }
}