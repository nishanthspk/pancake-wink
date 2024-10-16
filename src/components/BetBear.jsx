import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BNBLogo from "../assets/busd.png";
import { initializeContract, betBear } from "../integration";

const BetBear = ({ handleFlip }) => {
  // Correct component name here
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const { provider, signer, address, contract } =
          await initializeContract();
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setContract(contract);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    }
    initialize();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (parseFloat(inputValue) < 0.001) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleBetBear = async () => {
    // Ensure this function matches the function being used
    if (contract && signer && parseFloat(value) >= 0.001) {
      try {
        await betBear(value);
      } catch (error) {
        console.error("Error executing betBear:", error); // Use the correct function name here
      }
    } else {
      console.warn("Invalid bet or contract not initialized");
    }
  };

  return (
    <div className="flex justify-center items-center pt-16">
      <div className="bg-[#27262C] shadow-xl h-full rounded-3xl md:mx-0 w-[200px] md:w-[220px]">
        <div className="bg-[#3A384C] text-white font-bold p-3 flex justify-between rounded-t-3xl">
          <div className="flex items-center gap-1 text-sm">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleFlip(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </motion.button>
            <p>Set Position</p>
          </div>
          {/* <p className="text-sm"># {actualEpoch}</p> */}
          <div className=" flex items-center bg-[#ED4B9E] p-1 px-3 rounded-lg text-xs">
            DOWN
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className=" flex justify-between font-bold text-lg">
            <p className=" text-[#B0A5C9] font-medium">Commit:</p>
            <p className=" flex items-center">
              <img className=" h-8 w-8" src={BNBLogo} alt="" /> BNB
            </p>
          </div>
          <input
            type="text"
            placeholder="0.0"
            value={value}
            onChange={handleInputChange}
            className="bg-[#372F47] border font-bold border-customGrayStroke/50 rounded-md w-full h-12 px-3 text-right"
          />
          {showWarning && (
            <p className="text-red-500 text-sm">
              The minimum value should be greater than 0.0001.
            </p>
          )}
          <motion.button
            onClick={handleBetBear}
            whileTap={{ scale: 0.9 }}
            className=" bg-[#ED4B9E] hover:bg-[#ED4B9E]/80 text-white w-full h-[40px] text-base rounded-md font-bold mb-3"
          >
            Confirm
          </motion.button>
          <p className="text-[#B0A5C9] text-xs font-semibold text-center">
            You won&apos;t be able to remove or change your position once
            you enter it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetBear;
