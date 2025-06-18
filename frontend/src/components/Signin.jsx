"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { auth, provider, db } from "@/lib/firebase";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import withAuth from "@/lib/withAuth";
import { setUserDetails } from "@/lib/firestore";

const Signin = () => {
  const [signin, setSignin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const formKey = signin ? "signin" : "signup";
  const router = useRouter();
  const inputRef = useRef(null);
  const submitButtonRef = useRef(null);

  const handleGoogleSignIn = async () => {
    try{
      const result  = await signInWithPopup(auth, provider);
      const user = result.user;
      await setUserDetails(user);
      console.log("Google Sign In successful:", user);
      window.localStorage.setItem("user", JSON.stringify(user));
      router.push('/home');
    }
    catch (error) {
      console.error("Error during Google Sign In:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(signin){
        if(!email || !password){
          alert("Please fill in all fields.");
          return;
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        window.localStorage.setItem("user", JSON.stringify(user));
        router.push('/home');
      }
      else {
        if(!email || !password || !confirmPassword){
          alert("Please fill in all fields.");
          return;
        }
        if(password !== confirmPassword){
          alert("Passwords do not match.");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        window.localStorage.setItem("user", JSON.stringify(user));
        await setUserDetails(user);
        alert("Sign Up Successfull!");
        setSignin(true);
      }
    }
    catch (error) {
      console.log("Error during sign in/sign up:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Email already exists. Please use a different one.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      }
    } finally {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#171717] relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={formKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full absolute flex flex-col items-center justify-center"
        >
          <Image
            src="/logo.png"
            alt="Meloa Logo"
            width={50}
            height={50}
            className="absolute top-5"
          />
          <h1 className="text-white text-4xl font-Syne mb-3">
            {signin ? "Sign In" : "Sign Up"}
          </h1>

          <div className="w-3/4 flex items-center justify-center flex-col mb-10">
            <p className="text-[#a5a5a5] text-sm font-Syne mb-8">
              Please enter your credentials to continue.
            </p>
            <button onClick={handleGoogleSignIn} className="w-3/4 h-[2.5rem] bg-white text-black rounded-xl text-sm cursor-pointer flex justify-center items-center mb-8">
              <FaGoogle className="text-black mr-3" />
              Continue with Google
            </button>

            <div className="relative w-[95%] mb-8">
              <hr className="border-[#a5a5a549]" />
              <span className="absolute left-1/2 w-fit transform -translate-x-1/2 bg-[#171717] top-1/2 -translate-y-1/2 px-2 text-[#a5a5a549] text-xs font-Syne">
                OR
              </span>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              <input
                value={email}
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[3.5rem] bg-[#1f1f1f] text-white rounded-xl px-4 mb-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
              />
              <div className="relative w-full mb-4">
                <input
                  value={password}
                  ref = {inputRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[3.5rem] bg-[#1f1f1f] text-white rounded-xl px-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
                />
                {
                    showPassword ? (
                      <IoEyeSharp onClick={() => {setShowPassword((prev) => !prev); inputRef.current.focus(); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    ) : (
                      <IoEyeOffSharp onClick={() => {setShowPassword((prev) => !prev); inputRef.current.focus(); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    )
                }
              </div>
              {!signin && (
                <div className="relative w-full mb-4">
                <input
                  value={confirmPassword}
                  id="confirm-password"
                  ref={inputRef}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-[3.5rem] bg-[#1f1f1f] text-white rounded-xl px-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
                />
                {
                    showPassword ? (
                      <IoEyeSharp onClick={() => {setShowPassword((prev) => !prev); inputRef.current.focus(); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    ) : (
                      <IoEyeOffSharp onClick={() => {setShowPassword((prev) => !prev); inputRef.current.focus(); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    )
                }
                <AnimatePresence>
                {
                  password && confirmPassword && password !== confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="">
                      <label htmlFor="confirm-password" className="ml-2 text-sm text-red-700">Passwords don't match</label>
                    </motion.div>
                  )
                }
                </AnimatePresence>
              </div>
              )}
              <input
                type="submit"
                ref={submitButtonRef}
                className="hidden"
              />
            </form>
          </div>
          <button onClick={() => submitButtonRef.current.click()} className="w-[75%] h-[3rem] font-bold bg-[#27df6a] text-black rounded-xl font-syne text-sm cursor-pointer flex justify-center items-center">
            {signin ? "Sign In" : "Sign Up"}
          </button>


          <p className="text-[#a5a5a5] text-sm font-Syne mt-4">
            {signin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setSignin((prev) => !prev)}
              className="text-white cursor-pointer"
            >
              {signin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default withAuth(Signin);
