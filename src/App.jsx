import React, { useEffect, useState } from "react";
import HeaderLogo from "./assets/headerlogo.png";
import Home from "./components/Home";
import BetBull from "./components/BetBull";
import BetBeer from "./components/BetBear";
import { motion } from "framer-motion";
import Wallet from "./components/Wallet";
import LiveUp from "./components/LiveUp";
import LiveDown from "./components/LiveDown";
import wink from "./assets/Winks.png"
// import usePollOraclePrice from "./hooks/usePollOraclePrice";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js'
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { createContext, useContext } from 'react'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Comp from "./Comp";
import { http, createConfig } from 'wagmi'
import { bsc} from 'wagmi/chains'

export const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
})
// const ConfigContext = createContext<PredictionConfig | undefined>(undefined)

// function useConfig() {
//   return useContext(ConfigContext)
// }
const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [backComponent, setBackComponent] = useState(null);
  // const config = useConfig()


  // const { price, refresh } = usePollOraclePrice({
  //   chainlinkOracleAddress: config?.chainlinkOracleAddress,
  //   galetoOracleAddress: config?.galetoOracleAddress,
  // })
  const handleFlip = (componentName = null) => {
    setBackComponent(componentName);
    setIsFlipped(!!componentName);
  };



  // console.log("price",price);
  // console.log("refresh",refresh);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1_000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  })

//   useEffect(()=>{
// console.log("account",account)
//   },[])
  return (
    <WagmiProvider config={config}>
  <QueryClientProvider client={queryClient} >
    <div className=" from-[#A881FC] to-[#5F39AA] bg-center bg-cover min-h-screen inter-font" style={{        backgroundImage: ' radial-gradient(var(--tw-gradient-stops))',}}>


    <div className="flex-col justify-center items-center min-h-screen  inter-font">
      <div className="flex flex-col items-center mx-auto min-h-screen text-white pt-60 md:pt-6">
        <div className="flex justify-center">
          <div className=" space-y-3">
            <img
              className="h-7 w-auto md:mx-auto rounded-full"
              src={HeaderLogo}
              alt="Header Logo"
            />
            <Wallet />
          </div>
        </div>
        <div className="flex ">
        <div className="">
          <LiveUp />
          </div>
          <div className="relative w-[200px] md:w-[240px] perspective">
            <motion.div
              className="relative w-[200px] md:w-full h-[20px] md:h-full"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Front Side */}
              <div
                className="absolute w-[200px] md:w-full h-[20px] md:h-full"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <Home handleFlip={handleFlip} />


              </div>

              {/* Back Side */}
              <div
                className="absolute w-full h-full"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                {backComponent === "BetBull" && (
                  <BetBull handleFlip={handleFlip} />
                )}
                {backComponent === "BetBear" && (
                  <BetBeer handleFlip={handleFlip} />
                )}


              </div>

              
            </motion.div>
            <div className="mt-[350px] flex flex-col justify-center items-center gap-2  absolute right-[120px] w-max">Powered by Winks.fun</div>

          </div>
          
        </div>
      </div>

    </div>
    </div>
    </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;