import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { HelloWorldClient } from '../contracts/hello_world'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import algosdk from 'algosdk'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [contractInput, setContractInput] = useState<string>('')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  })


  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const indexer = algokit.getAlgoIndexerClient({
    server: indexerConfig.server,
    port: indexerConfig.port,
    token: indexerConfig.token,
  })

  const { enqueueSnackbar } = useSnackbar()
  const { signer, activeAddress, activeAccount, signTransactions, sendTransactions } = useWallet()

  const sendAppCall = async () => {
    setLoading(true)

    const appDetails = {
      resolveBy: 'creatorAndName',
      sender: { signer, addr: activeAddress } as TransactionSignerAccount,
      creatorAddress: activeAddress,
      findExistingUsing: indexer,
    } as AppDetails

    const appClient = new HelloWorldClient(appDetails, algodClient)

    // Please note, in typical production scenarios,
    // you wouldn't want to use deploy directly from your frontend.
    // Instead, you would deploy your contract on your backend and reference it by id.
    // Given the simplicity of the starter contract, we are deploying it on the frontend
    // for demonstration purposes.
    const deployParams = {
      onSchemaBreak: 'append',
      onUpdate: 'append',
    }
    let appAddress = "";
    await appClient.deploy(deployParams).catch((e: Error) => {
      enqueueSnackbar(`Error deploying the contract: ${e.message}`, { variant: 'error' })
      setLoading(false).
        return
    }).then((response) => {
      if (response) {
        appAddress = response.appAddress
      }
    })

    const response = await appClient.hello({ name: contractInput }).catch((e: Error) => {
      enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
      setLoading(false)
      return
    })

    // const deposit = await appClient.deposit({
    //   address: activeAddress ?? "",
    // }, {
    //   sender: { signer, addr: activeAddress } as TransactionSignerAccount,
    //   accounts: [activeAddress ?? ""],
    // })




    const suggestedParams = await algodClient.getTransactionParams().do()
    const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: activeAddress ?? "",
      amount: 1e6,
      suggestedParams,
      to: appAddress,
    })

    const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

    const signedTransactions = await signTransactions([encodedTransaction])

    const waitRoundsToConfirm = 4

    try {
      enqueueSnackbar('Sending transaction...', { variant: 'info' })
      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
      enqueueSnackbar(`Transaction sent: ${id}`, { variant: 'success' })

    } catch (e) {
      enqueueSnackbar('Failed to send transaction', { variant: 'error' })
    }

    enqueueSnackbar(`Response from the contract: ${response?.return}`, { variant: 'success' })
    setLoading(false)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Say hello to your Algorand smart contract</h3>
        <br />
        <input
          type="text"
          placeholder="Provide input to hello function"
          className="input input-bordered w-full"
          value={contractInput}
          onChange={(e) => {
            setContractInput(e.target.value)
          }}
        />
        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>
          <button className={`btn`} onClick={sendAppCall}>
            {loading ? <span className="loading loading-spinner" /> : 'Send application call'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls
