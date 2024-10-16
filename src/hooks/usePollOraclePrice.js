import { ChainId } from '@pancakeswap/chains'
import { useReadContract } from '@pancakeswap/wagmi'
import { chainlinkOracleABI } from '../abis/oracleabi'
// import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { useGaletoOraclePrice } from './useGaletoOraclePrice'



const usePollOraclePrice = ({ chainlinkOracleAddress, galetoOracleAddress }) => {
  // const { chainId } = useActiveChainId()
const chainId = 56;
  const shouldFetchGaletoPrice = useMemo(
    () => Boolean(galetoOracleAddress && chainId === ChainId.ZKSYNC),
    [galetoOracleAddress, chainId],
  )

  const { data: chainlinkOraclePrice = 0n, refetch: refetchChainlinkOraclePrice } = useReadContract({
    abi: chainlinkOracleABI,
    address: chainlinkOracleAddress,
    functionName: 'latestAnswer',
    chainId,
    query: {
      enabled: !shouldFetchGaletoPrice,
    },
    watch: !shouldFetchGaletoPrice,
  })

  const { galetoOraclePrice, refetchGaletoOraclePrice } = useGaletoOraclePrice({
    address: galetoOracleAddress,
    enabled: shouldFetchGaletoPrice,
  })

  return {
    price: shouldFetchGaletoPrice ? galetoOraclePrice : chainlinkOraclePrice,
    refresh: shouldFetchGaletoPrice ? refetchGaletoOraclePrice : refetchChainlinkOraclePrice,
  }
}

export default usePollOraclePrice
