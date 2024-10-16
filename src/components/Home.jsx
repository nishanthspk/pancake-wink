import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { initializeContract, currentEpoch } from '../integration';
import BN from 'bignumber.js'
import { useAccount } from 'wagmi'

const Home = ({ handleFlip }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [actualEpoch, setActualEpoch] = useState(""); // State for displaying the epoch
const [totalVal, setTotalVal] = useState("")
const account = useAccount()

const [upval, setupval] = useState("")
const [downVal, setDownVal] = useState("")
const getMultiplierV2 = (total, amount) => {
  if (!total) {
    return 0
  }

  if (total === 0n || amount === 0n) {
    return 0
  }

  const rewardAmountFixed = new BN(total.toString())
  const multiplierAmountFixed = new BN(amount.toString())

  return rewardAmountFixed.div(multiplierAmountFixed)
}

const REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE = 1;


const formatPrice = (price) => {
  // Convert price to a number if it's not already
  const priceNum = Number(price);

  // Format price to have a decimal point, e.g., 504.30606593
  if (isNaN(priceNum)) return 'No data available';
  return (priceNum / 1e18).toFixed(4); // Assuming the data is in nanounits and needs division by 1e9
};

async function initialize() {

  try {

    const { provider, signer, contract } =
      await initializeContract();
    setProvider(provider);
    setSigner(signer);
    setContract(contract);

    const epoch = await contract.currentEpoch();
    setActualEpoch(epoch.toString()); 
const epoch_in_string= epoch.toString();
    const rounds = await contract.rounds(epoch_in_string);


    const totslval= rounds["totalAmount"];
    const pricepool= rounds["totalAmount"];

  
    const  val = formatPrice(totslval.toString())

setTotalVal(val)

const ba = rounds["bullAmount"];
const bearamoint = rounds["bearAmount"];
const bullMultiplier = pricepool && ba ? getMultiplierV2(pricepool, ba) : 0
const bearMultiplier = pricepool && bearamoint ? getMultiplierV2(pricepool, bearamoint) : 0


const formattedBullMultiplier = bullMultiplier.toFixed(bullMultiplier.isZero() ? 0 : 2)
const formattedBearMultiplier = bearMultiplier.toFixed(bearMultiplier.isZero() ? 0 : 2)





setupval(formattedBullMultiplier)

setDownVal(formattedBearMultiplier)
  } catch (error) {
    console.error("Error initializing contract:", error);
  }
}

const reff1 = setTimeout(() => {
  initialize()
},  10000)



  useEffect(() => {
  console.log("account",account);
  console.log("connected",account.isConnected);
    initialize();
  }, []);


  return (
    <>

    <div className="pl-4 pt-10 text-white">
    <div className="bg-[#27262C] shadow-xl lg:h-full rounded-3xl md:mx-0 w-[180px] md:w-[240px]">
      <div className="bg-[#A881FC] text-white font-bold p-2 px-4 flex justify-between items-center rounded-t-3xl">
        <div className="flex items-center text-base gap-1">
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
          <p>Next</p>
        </div>
        <div className="text-sm">
          # {actualEpoch}  
        </div>
      </div>
      <div className="p-4">
        <div className=" text-base font-bold text-center p-1 bg-[#353547] w-[120px] md:w-[140px] rounded-t-xl mx-auto">
          <p className="text-[#31D0AA] text-base font-extrabold">UP</p>
          <p className="text-[#B0A5C9] text-xs">{!isNaN(Number(upval)) ? upval : 0 }x <span className=" font-medium"> payout</span></p>
        </div>
        <div className="w-full mx-auto border-2 border-[#A881FC] p-4 rounded-xl">
          <div className="flex justify-between font-bold text-[12px] md:text-sm">
            <p>Prize Pool:</p>
            <p>{totalVal} BNB</p>
          </div>
          <div className="flex justify-center">
            <div className="space-y-3 pt-3 text-sm">
              <div className=" flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="text-white shadow-blue-950 hover:shadow-2xl w-[100px] md:w-[170px] h-[30px] md:h-[40px] bg-[#31D0AA] hover:bg-[#31D0AA]/80 font-bold rounded-xl"
                  onClick={() => handleFlip("BetBull")}
                >
                  Enter UP
                </motion.button>
              </div>
              <div className=" flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="text-white shadow-blue-950 hover:shadow-2xl w-[100px] md:w-[170px] h-[30px] md:h-[40px] bg-[#ED4B9E] hover:bg-[#ED4B9E]/80 font-bold rounded-xl"
                  onClick={() => handleFlip("BetBear")}
                >
                  Enter DOWN
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        <div className="font-bold text-center p-1 bg-[#353547] w-[120px] md:w-[140px] rounded-b-xl mx-auto">
          <p className="text-[#B0A5C9] text-xs">{!isNaN(Number(downVal)) ? downVal : 0}x <span className=" font-medium"> payout</span></p>
          <p className="text-[#ED4B9E] text-base font-extrabold">DOWN</p>
        </div>
      </div>
    </div>
  </div>
  
    </>
  );
};

export default Home;
