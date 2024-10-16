import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { initializeContract, currentEpoch } from "../integration";
import usePriceData from "../hooks/usePriceData";
import BN from 'bignumber.js'
import usePollOraclePrice from "../hooks/usePollOraclePrice";
// import { Progress, ProgressProps } from '@pancakeswap/uikit'
import RoundProgress from "./RoundProgress";
import { useAccount } from 'wagmi'

const BetPosition = {
  BULL: 'Bull',
  BEAR: 'Bear',
  HOUSE: 'House',
}
const LiveUp = ({ handleFlip }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [actualEpoch, setActualEpoch] = useState(""); // State for displaying the epoch
  const [lockPrice, setLockPrice] = useState("")

  const [pricepool, seTpricepool] = useState("")

  const [upval, setupval] = useState("")
  const [downVal, setDownVal] = useState("")

  const [lockpriceActual, setLockpriceActual] = useState()

  const [realprice, setRealprice] = useState("")
  const { data, refetch, isFetching, error } = usePriceData();

  const account = useAccount()

  const config = {
    "address": "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
    "api": "https://thegraph.pancakeswap.com/prediction-v2-bsc",
    "chainlinkOracleAddress": "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
    "displayedDecimals": 4,
    "isNativeToken": true,
    "token": {
      "chainId": 56,
      "decimals": 18,
      "symbol": "BNB",
      "name": "Binance Chain Native Token",
      "isNative": true
    },
    "tokenBackgroundColor": "#F0B90B"
  }

  const { price, refresh } = usePollOraclePrice({
    chainlinkOracleAddress: config?.chainlinkOracleAddress,
    galetoOracleAddress: config?.galetoOracleAddress,
  })


  // setRealprice(price.toString())
  const formatPrice = (price) => {
    // Convert price to a number if it's not already
    const priceNum = Number(price);

    // Format price to have a decimal point, e.g., 504.30606593
    if (isNaN(priceNum)) return 'No data available';
    return (priceNum / 1e8).toFixed(4); // Assuming the data is in nanounits and needs division by 1e9
  };
  const formatPrice2 = (price) => {
    // Convert price to a number if it's not already
    const priceNum = Number(price);

    // Format price to have a decimal point, e.g., 504.30606593
    if (isNaN(priceNum)) return 'No data available';
    return (priceNum / 1e9).toFixed(3); // Assuming the data is in nanounits and needs division by 1e9
  };

  const formatPrice3 = (price) => {
    // Convert price to a number if it's not already
    const priceNum = Number(price);

    // Format price to have a decimal point, e.g., 504.30606593
    if (isNaN(priceNum)) return 'No data available';
    return (priceNum / 1e18).toFixed(4); // Assuming the data is in nanounits and needs division by 1e9
  };


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


  const REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE = 2

  const SHOW_HOUSE_BEFORE_SECONDS_TO_CLOSE = 20
  const [isCalculatingPhase, setIsCalculatingPhase] = useState(false)

  const getPriceDifference = (price, lockPrice) => {


    if (!price || !lockPrice) {
      return 0
    }

    return price - lockPrice
  }
  const [closeTimestamp, setCloseTimestamp] = useState()

  const [lockTimestamp, setLockTimestamp] = useState()
  const reff1 = setTimeout(() => {
    refresh()
  }, (REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE) * 5000)


  async function initialize() {
    try {


      const { provider, signer, contract } =
        await initializeContract();
      setProvider(provider);
      setSigner(signer);
      setContract(contract);

      const epoch = await contract.currentEpoch();
      setActualEpoch(Number(epoch.toString())); // Convert and set for display
      const epoch_in_string = epoch.toString();

      const rounds = await contract.rounds(Number(epoch_in_string) - 1);


      const totslval = rounds["lockPrice"];

      const pricepool = rounds["totalAmount"];

      const ba = rounds["bullAmount"];

      const bearamoint = rounds["bearAmount"];

      setLockpriceActual(totslval)

      const closeTimestamp = rounds["closeTimestamp"];
      const lockTimestamp = rounds["lockTimestamp"];

      setCloseTimestamp(closeTimestamp)
      setLockTimestamp(lockTimestamp)

      const r = formatPrice3(pricepool.toString())
      seTpricepool(r);

      const val = formatPrice(totslval.toString())


      setLockPrice(val)



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

  useEffect(() => {

    initialize();
  }, []);
  const getNowInSeconds = () => Math.floor(Date.now() / 1000)

  const isHouse = useMemo(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNowInSeconds() : 0
    return Boolean(lockpriceActual && price === lockpriceActual && secondsToClose <= SHOW_HOUSE_BEFORE_SECONDS_TO_CLOSE)
  }, [closeTimestamp, lockPrice, price])

  const isBull = Boolean(lockPrice && price > lockPrice)

  const betPosition = isHouse ? BetPosition.HOUSE : isBull ? BetPosition.BULL : BetPosition.BEAR


  const priceDifference = getPriceDifference(Number(price), lockpriceActual ?? 0)
  // const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds, round.closePrice)
  useEffect(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNowInSeconds() : 0
    if (secondsToClose > 0) {
      const refreshPriceTimeout = setTimeout(() => {
        refresh()
      }, (secondsToClose - REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE) * 1000)

      const calculatingPhaseTimeout = setTimeout(() => {
        setIsCalculatingPhase(true)
      }, secondsToClose * 1000)

      return () => {
        clearTimeout(refreshPriceTimeout)
        clearTimeout(calculatingPhaseTimeout)
      }
    }
    return undefined
  }, [refresh, closeTimestamp])

  const reff2 = setTimeout(() => {
    initialize()
  }, 10 * 1000)


  const startMs = lockTimestamp * 1000
  const endMs = closeTimestamp * 1000
  const now = Date.now()
  const rawProgress = ((now - startMs) / (endMs - startMs)) * 100
  const progress = rawProgress <= 100 ? rawProgress : 100
  const refValTimeour = setTimeout(() => {

    if (Math.round(progress) == 100) {
      initialize()
    }

  }, (REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE) * 1000)


  const bg1 = formatPrice(priceDifference) >= 0 ? "bg-[#31D0AA] text-[#353547]" : "bg-[#353547] text-white "
  const bg2 = formatPrice(priceDifference) > 0 ? "bg-[#353547] text-white" : "bg-[#31D0AA] text-white "

  return (
    <>
      <div className="flex justify-center items-center pt-10 text-white">
        <div className="bg-[#27262C] shadow-xl lg:h-full rounded-3xl md:mx-0 w-[180px] md:w-[240px]">
          <div className="bg-tranparent text-white font-bold p-2 px-4 flex justify-between items-center rounded-t-4xl  border-[#A881FC]">


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
            <div className="text-sm text-[#A881FC]"># {Number(actualEpoch) - 1}</div>
          </div>
          <RoundProgress
            variant="flat"
            scale="sm"
            lockTimestamp={lockTimestamp ?? 0}
            closeTimestamp={closeTimestamp ?? 0}
          />
          <div className="p-4">
            <div className={`font-bold text-center p-1 ${bg1} w-[140px] rounded-t-xl mx-auto`}>
              <p className="text-base font-extrabold">UP</p>
              <p className="text-sm">
                {upval}x <span className=" font-medium"> payout</span>
              </p>
            </div>
            <div className="w-full mx-auto border-2 border-[#31D0AA] p-4 rounded-xl">
              <div className="flex justify-between font-bold">
                <p className=" text-[#B0A5C9] text-[10px] lg:text-sm">LAST PRICE</p>
              </div>

              <div className="flex justify-between items-center">
                <p className=" font-bold text-[#31D0AA] text-[10px] lg:text-base px-1">${formatPrice(price)}</p>

                {/* <p className=" font-bold text-[#31D0AA] text-base">${formatPrice(realprice)}</p> */}
                {
                  formatPrice(priceDifference) >= 0 ? <div className=" flex items-center bg-[#31D0AA] p-1 md:px-2 rounded-lg font-semibold text-[8px] md:text-xs">
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
                    ${formatPrice(priceDifference)}
                  </div> : <div className=" flex items-center bg-[#ED4B9E] p-1 px-2 rounded-lg font-semibold text-xs">
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

                        transform="rotate(180 12 12)"
                      />
                    </svg>
                    ${formatPrice(priceDifference)}
                  </div>
                }

              </div>
              <div className="pt-2">
                <div className=" flex justify-between items-center text-[10px] md:text-xs">
                  <p>Locked Price: </p>
                  <p>${lockPrice}</p>
                </div>
                <div className=" flex justify-between items-center font-bold text-[10px] md:text-sm">
                  <p>Price Pool: </p>
                  <p>{pricepool} BNB</p>
                </div>
              </div>
            </div>
            <div className={`font-bold text-center p-1 ${bg2} w-[140px] rounded-b-xl mx-auto`}>
              <p className=" text-sm">
                {downVal}x <span className=" font-medium"> payout</span>
              </p>
              <p className=" text-base">DOWN</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveUp;
