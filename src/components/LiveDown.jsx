import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { initializeContract, currentEpoch } from "../integration";
import usePriceData from "../hooks/usePriceData";
const LiveUp = ({ handleFlip }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [actualEpoch, setActualEpoch] = useState(""); // State for displaying the epoch
  const { data, refetch, isFetching, error } = usePriceData();


  const formatPrice = (price) => {
    // Convert price to a number if it's not already
    const priceNum = Number(price);

    // Format price to have a decimal point, e.g., 504.30606593
    if (isNaN(priceNum)) return 'No data available';
    return (priceNum / 1e9).toFixed(8); // Assuming the data is in nanounits and needs division by 1e9
};

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

  return (
    <div>
      <div className="flex justify-center items-center pt-10 text-white">
        <div className="bg-[#27262C] shadow-xl h-full rounded-3xl mx-6 md:mx-0 w-[240px]">
          <div className="bg-tranparent text-white font-bold p-2 px-4 flex justify-between items-center rounded-t-3xl border-b-4 border-[#A881FC]">
            <div className="flex items-center text-[#A881FC] text-base gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                  clipRule="evenodd"
                />
              </svg>
              <p>LIVE</p>
            </div>
            <div className="text-sm text-[#A881FC]"># {actualEpoch}</div>
          </div>
          <div className="p-4">
            <div className="font-bold text-center p-1 bg-[#000000] w-[140px] rounded-t-xl mx-auto">
              <p className="text-base font-extrabold">UP</p>
              <p className="text-sm">
                2.66x <span className=" font-medium"> payout</span>
              </p>
            </div>
            <div className="w-full mx-auto border-2 border-[#31D0AA] p-4 rounded-xl">
              <div className="flex justify-between font-bold">
                <p className=" text-[#B0A5C9] text-sm">LAST PRICE</p>
              </div>
              <div className="flex justify-between items-center">
                <p className=" font-bold text-[#31D0AA] text-base">${formatPrice(data)}</p>
                <div className=" flex items-center bg-[#31D0AA] p-1 px-2 rounded-lg font-semibold text-xs">
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
                  $0.3214
                </div>
              </div>
              <div className="pt-2">
                <div className=" flex justify-between items-center text-xs">
                    <p>Locked Price: </p>
                    <p>$523.8026</p>
                </div>
                <div className=" flex justify-between items-center font-bold text-sm">
                    <p>Price Pool: </p>
                    <p>2.7793 BNB</p>
                </div>
              </div>
            </div>
            <div className="font-bold text-center p-1 bg-[#353547] w-[140px] rounded-b-xl mx-auto">
              <p className="text-[#B0A5C9] text-sm">
                1.64x <span className=" font-medium"> payout</span>
              </p>
              <p className="text-[#ED4B9E] text-base">DOWN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveUp;
