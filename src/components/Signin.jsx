"use client";
import React, { use, useState } from "react";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";


const Signin = () => {
  const [signin, setSignin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const formKey = signin ? "signin" : "signup";
  const router = useRouter();

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
            <button className="w-3/4 h-[2.5rem] bg-white text-black rounded-xl text-sm cursor-pointer flex justify-center items-center mb-8">
              <FaGoogle className="text-black mr-3" />
              Continue with Google
            </button>

            <div className="relative w-[95%] mb-8">
              <hr className="border-[#a5a5a549]" />
              <span className="absolute left-1/2 w-fit transform -translate-x-1/2 bg-[#171717] top-1/2 -translate-y-1/2 px-2 text-[#a5a5a549] text-xs font-Syne">
                OR
              </span>
            </div>

            <form className="w-full flex flex-col items-center">
              <input
                type="email"
                placeholder="Email"
                className="w-full h-[3.5rem] bg-[#1f1f1f] text-white rounded-xl px-4 mb-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
              />
              <div className="relative w-full mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-[3.5rem] bg-[#1f1f1f] text-white rounded-xl px-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
                />
                {
                    showPassword ? (
                      <IoEyeSharp onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    ) : (
                      <IoEyeOffSharp onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    )
                }
              </div>
              {!signin && (
                <div className="relative w-full mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-[3.5rem] bg-[#1f1f1f] text-white rounded-xl px-4 outline-none border border-[#a5a5a549] focus:border-white text-sm font-syne"
                />
                {
                    showPassword ? (
                      <IoEyeSharp onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    ) : (
                      <IoEyeOffSharp onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    )
                }
              </div>
              )}
            </form>
          </div>

          <button onClick={() => {router.push('/home')}} className="w-[75%] h-[3rem] font-bold bg-[#27df6a] text-black rounded-xl font-syne text-sm cursor-pointer flex justify-center items-center">
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

export default Signin;
