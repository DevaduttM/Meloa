"use client"
import Splash from "@/components/Splash";
import Image from "next/image";
import {React, useState, useEffect} from "react";
import GetStarted from "@/components/GetStarted";

export default function Home() {

  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {splash ? <Splash /> : <GetStarted />}
    </>
  );
}
