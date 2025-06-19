import {
  UserDetailsContext,
  AccountScreenOpenContext,
} from "@/context/PlayerContext";
import React, { useContext, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { editName, editPhotoURL } from "@/lib/firestore";
import { uploadToCloudinary } from "@/utils/apicalls";
import { useRouter } from "next/navigation";

const AccountScreen = () => {
  const userDetails = JSON.parse(window.localStorage.getItem("user"));
  const dbuserDetails = useContext(UserDetailsContext);

  const [edit, setEdit] = useState(false);
  const [editedName, setEditedName] = useState(
    dbuserDetails.userDetails.name || "No Name"
  );
  const [loginDate, setLoginDate] = useState(null);
  const [uploadScreen, setUploadScreen] = useState(false);
  const [profilePhotoURL, setProfilePhotoURL] = useState(
    dbuserDetails.userDetails.photoURL || "/logo_img_only.png"
    );

  const inputRef = useRef(null);
  const fileRef = useRef(null);

    const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out successfully");
      window.localStorage.removeItem("user");
      router.push('/signin');
    }
    catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

useEffect(() => {
    const formatDate = (timestamp) => {
      const date = new Date(Number(timestamp));
      return date.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    if (userDetails?.lastLoginAt) {
      setLoginDate(formatDate(userDetails.lastLoginAt));
    }
  }, [userDetails]);

  
  const updateUserName = async () => {
      setEdit(false);
      if (editedName.trim() === "") {
          setEditedName(dbuserDetails.userDetails.name || "No Name");
          alert("Name cannot be empty.");
          return;
        }
        try {
            await editName(userDetails, editedName);
            window.localStorage.setItem("user", JSON.stringify({
                ...userDetails,
                displayName: editedName
            }));
        } catch (error) {
            console.error("Error updating user name:", error);
        }
    };
    
    console.log("User Details:", userDetails);

    const handleProfilePicUpdate = async (e) => {
        console.log("uploading image to Cloudinary...");
      const file = e.target.files[0];
      if (!file) return;

      try {
        const url = await uploadToCloudinary(file);
        
        console.log("Cloudinary Response:", url);
        setProfilePhotoURL(url);
        setUploadScreen(false);
        await editPhotoURL(userDetails, url);
        if (url) {
          dbuserDetails.userDetails.photoURL = url;
        } else {
          console.error("Failed to upload image to Cloudinary");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
        



  return (
    <div
      onClick={() => {setEdit(false); setUploadScreen(false);}}
      className="h-screen w-screen flex justify-center items-center bg-[#171717] flex-col relative overflow-x-hidden overflow-y-scroll scrollbar-hide"
    >
      <div className="absolute top-0 w-full flex justify-between px-3 pt-7 items-center">
        <div className="w-fit h-full flex justify-center items-center gap-2">
          <Image src="/logo_img_only.png" alt="Logo" width={35} height={35} />
          <h1 className="text-transparent bg-gradient-to-r from-[#27df6a] to-[#afafaf] bg-clip-text text-3xl font-bold font-syne">
            Meloa
          </h1>
        </div>
      </div>
      <div onClick={(e) => {e.stopPropagation(); setUploadScreen(true);}} className="h-[50%] w-screen flex justify-between items-center flex-col">
        <div className="relative">
            <AnimatePresence>
            {
                uploadScreen && (
                    <motion.div onClick={() => fileRef.current.click()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute top-0 left-0 w-full h-full bg-[#000000be] rounded-full flex justify-center items-center">
                        <p className="text-white font-syne">Change Picture</p>
                        <input type="file" ref={fileRef} onChange={handleProfilePicUpdate} className="hidden" />
                    </motion.div>
                )
            }
        </AnimatePresence>
        <Image
          src={profilePhotoURL}
          alt="User Avatar"
          width={160}
          height={160}
          className="rounded-full mb-4 bg-[#1f1f1f] shadow-lg p-2"
        />
        </div>
        <div className="w-full flex justify-center items-center flex-col gap-4">
          <div className="relative w-3/4 flex justify-between items-center flex-col">
            <label
              htmlFor="name"
              className="z-2 absolute left-2 -mt-2 px-2 text-gray-500 bg-[#171717] text-sm font-syne"
            >
              Name
            </label>
            <div className="relative flex w-full h-full">
              <input
                type="text"
                ref={inputRef}
                value={editedName}
                readOnly={!edit}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full h-[3.5rem] bg-[#171717] text-white rounded-xl px-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
              />
              <AnimatePresence>
                {edit ? (
                  <motion.div
                    key={"save-button"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                        onClick={() => updateUserName}
                      className={` w-20 h-[75%] absolute right-2 top-1/2 -translate-y-1/2 justify-center items-center bg-[#27df6a] text-black font-syne rounded-lg`}
                    >
                      Save
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={"edit-icon"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className=""
                  >
                    <FiEdit3
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit(true);
                        inputRef.current.focus();
                      }}
                      className={` z-2 absolute right-3 top-1/2 -translate-1/2`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="relative w-3/4 flex justify-between items-center flex-col">
            <label
              htmlFor="name"
              className="z-2 absolute left-2 -mt-2 px-2 text-gray-500 bg-[#171717] text-sm font-syne"
            >
              Email
            </label>
            <div className="relative flex w-full h-full">
              <input
                type="text"
                value={dbuserDetails.userDetails.email || "No Email"}
                readOnly
                className="w-full h-[3.5rem] bg-[#171717] text-white rounded-xl px-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
              />
            </div>
          </div>
          <div className="relative w-3/4 flex justify-between items-center flex-col">
            <label
              htmlFor="name"
              className="z-2 absolute left-2 -mt-2 px-2 text-gray-500 bg-[#171717] text-sm font-syne"
            >
              Last Logged In
            </label>
            <div className="relative flex w-full h-full">
              <input
                type="text"
                value={loginDate || "No Last Logged In"}
                readOnly
                className="w-full h-[3.5rem] bg-[#171717] text-white rounded-xl px-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
              />
            </div>
          </div>
          <button onClick={handleSignOut} className="w-32 h-10 bg-red-500 text-white rounded-lg mt-5">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default AccountScreen;
