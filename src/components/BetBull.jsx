import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BNBLogo from "../assets/busd.png";
import { ethers } from "ethers";
import { initializeContract, betBull, currentEpoch } from "../integration";

const BetBull = ({ handleFlip }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [actualEpoch, setActualEpoch] = useState(""); // State for displaying the epoch

  useEffect(() => {
    async function initialize() {
      try {
        const { provider, signer, address, contract } =
          await initializeContract();
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setContract(contract);

        const epoch = await contract.currentEpoch();
        setActualEpoch(epoch.toString()); // Convert and set for display
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

  const handleBetBull = async () => {
    if (contract && signer && parseFloat(value) >= 0.001) {
      try {
        // Use BigNumber directly from the state for the transaction
        const epochForTransaction = ethers.BigNumber.from(actualEpoch);
        await betBull(value, epochForTransaction);
      } catch (error) {
        console.error("Error executing betBull:", error);
      }
    } else {
      console.warn("Invalid bet or contract not initialized");
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="bg-[#27262C] shadow-xl h-full rounded-3xl md:mx-0 w-[240px]">
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
          <div className=" flex items-center bg-[#31D0AA] p-1 px-3 rounded-lg text-sm">
            UP
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className=" space-y-2 p-4">
          <div className=" flex justify-between font-bold text-lg">
            <p className=" text-[#B0A5C9] font-medium">Commit:</p>
            <p className=" flex items-center">
              {" "}
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
            onClick={handleBetBull}
            whileTap={{ scale: 0.9 }}
            className=" bg-[#31D0AA] hover:bg-[#31D0AA]/80 text-white w-full h-[40px] text-base rounded-md font-bold mb-3"
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

export default BetBull;
