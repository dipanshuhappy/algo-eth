import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { SnackbarProvider } from 'notistack'
import { useState } from 'react'
import AppCalls from './components/AppCalls'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import { ChakraProvider } from '@chakra-ui/react'
import Mint from './components/Mint'

let providersArray: ProvidersArray
if (import.meta.env.VITE_ALGOD_NETWORK === '') {
  providersArray = [{ id: PROVIDER_ID.KMD }]
} else {
  providersArray = [
    { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
    { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
    { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
    { id: PROVIDER_ID.EXODUS },
    // If you are interested in WalletConnect v2 provider
    // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
  ]
}

export default function App() {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal)
  }

  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    algosdkStatic: algosdk,
  })

  return (

    <SnackbarProvider maxSnack={3}>
      <WalletProvider value={walletProviders}>
        <div className="hero min-h-screen bg-red-500-400">
          <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
            <div className="max-w-md">



              <div className="grid">


                <div className="divider" />
                <button data-test-id="connect-wallet" className="btn m-2" onClick={toggleWalletModal}>
                  Wallet Connection
                </button>
                {/* 
                {activeAddress && (
                  <button data-test-id="transactions-demo" className="btn m-2" onClick={toggleDemoModal}>
                    Transactions Demo
                  </button>
                )}

                {activeAddress && (
                  <button data-test-id="appcalls-demo" className="btn m-2" onClick={toggleAppCallsModal}>
                    Contract Interactions Demo
                  </button>
                )} */}
              </div>
              <ChakraProvider>
                {
                  activeAddress ? <Mint /> : (
                    <>
                      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
                      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
                      <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} /></>

                  )
                }


              </ChakraProvider>
            </div>
          </div>
        </div>
      </WalletProvider>
    </SnackbarProvider>
  )
}
