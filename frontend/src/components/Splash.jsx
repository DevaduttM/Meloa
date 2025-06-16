import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const Splash = () => {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-[#171717]">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, times: [0, 0.3, 0.9, 1] }}
          >
            <Image
              src="/logo.png"
              alt="Splash Image"
              width={300}
              height={300}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Splash;
