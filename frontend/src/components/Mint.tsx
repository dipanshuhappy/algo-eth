import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
    VStack,
    Button,
} from '@chakra-ui/react'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useSnackbar } from 'notistack'
import { useState } from "react"
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import * as algokit from '@algorandfoundation/algokit-utils'


const IMAGE =
    'https://bafybeigk6s3t7nglgvsybexj65zfmpm47mczxh5exhedknznrhuclbnnae.ipfs.w3s.link/czfe6ijigtv71.png'

const nftAddress = "0xA37a6e1f6BAACB0876a596D0a292fdD1E009e399"
// const nftAddress = "0xad8c7e57106f74648D6292D448f2D87Ea37E5DEa"
const ONE_ETH_TO_ALGO = 17473
const ETH_VALUE = 0.000062


const Mint = () => {
    const [nftName, setNftName] = useState("Azuki")

    const [loading, setLoading] = useState<boolean>(false)
    const [receiverAddress, setReceiverAddress] = useState<string>('')

    const algodConfig = getAlgodConfigFromViteEnvironment()
    const algodClient = algokit.getAlgoClient({
        server: algodConfig.server,
        port: algodConfig.port,
        token: algodConfig.token,
    })

    const { enqueueSnackbar } = useSnackbar()
    const [assetIndex, setAssetIndex] = useState<number>(0)

    const [nftMinted, setNFTMinted] = useState<boolean>(false)

    const [assetLoading, setAssetLoading] = useState<boolean>(false)

    const { signer, activeAddress, signTransactions, sendTransactions } = useWallet()

    const handleSubmitAlgo = async () => {
        setLoading(true)


        if (!signer || !activeAddress) {
            enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
            return
        }


        const suggestedParams = await algodClient.getTransactionParams().do()

        const price = (ETH_VALUE * ONE_ETH_TO_ALGO).algos().microAlgos.toPrecision(3)
        // console.log((ETH_VALUE * ONE_ETH_TO_ALGO).microAlgos().microAlgos.toPrecision(3).toString())
        console.log(price)
        const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: activeAddress,
            to: "E2SOEYQ3C4QSWTM5PIIB73SA2C37ETH53E5M755OB57JE63BWGTZEI3T6E",
            amount: parseFloat(price),
            suggestedParams,
        })


        const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

        const signedTransactions = await signTransactions([encodedTransaction])

        const waitRoundsToConfirm = 4
        let id;
        try {
            enqueueSnackbar('Sending transaction...', { variant: 'info' })
            id = await sendTransactions(signedTransactions, waitRoundsToConfirm)
            enqueueSnackbar(`Transaction sent: ${id}`, { variant: 'success' })
            setReceiverAddress('')
        } catch (e) {
            enqueueSnackbar('Failed to send transaction', { variant: 'error' })
        }


        const res = await (await fetch(
            "http://localhost:3000/registerNft",
            {
                method: "POST",
                body: JSON.stringify({
                    nftAddress: nftAddress,
                    txId: id?.txId,
                    algoAddress: activeAddress,
                    algo: ETH_VALUE * ONE_ETH_TO_ALGO
                }),
                headers: {
                    "Accept": "*/*",

                    "Content-Type": "application/json"
                }
            }
        )).json()

        console.log({ res }, "res")
        enqueueSnackbar(`Transaction sent: ${res.txid}`, { variant: 'success' })

        setAssetIndex(res.assetIndex)


        setNFTMinted(true)

        setLoading(false)
    }


    const handleTransfer = async () => {
        setAssetLoading(true)
        console.log(assetIndex, "asset code")
        if (!activeAddress) return
        const suggestedParams = await algodClient.getTransactionParams().do()
        const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: assetIndex,
            amount: 0,
            from: activeAddress,
            suggestedParams,
            to: activeAddress ?? '',

        })
        const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

        const signedTransactions = await signTransactions([encodedTransaction])

        const waitRoundsToConfirm = 4
        let id;
        try {
            enqueueSnackbar('Sending transaction...', { variant: 'info' })
            id = await sendTransactions(signedTransactions, waitRoundsToConfirm)
            enqueueSnackbar(`Transaction sent: ${id}`, { variant: 'success' })
            setReceiverAddress('')
        } catch (e) {
            enqueueSnackbar('Failed to send transaction', { variant: 'error' })
        }

        const res = await (await fetch(
            "http://localhost:3000/sendNft",
            {
                method: "POST",
                body: JSON.stringify({
                    algoAddress: activeAddress,
                    assetIndex: assetIndex,
                }),
                headers: {
                    "Accept": "*/*",

                    "Content-Type": "application/json"
                }
            }
        )).json()
        console.log({ res }, "res")

        setAssetLoading(false)


    }



    return (
        <Center py={12}>
            <Box
                role={'group'}
                p={6}
                maxW={'330px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}>
                <Image
                    rounded={'lg'}
                    height={230}
                    width={282}
                    objectFit={'cover'}
                    src={IMAGE}
                    alt="#"
                />
                <Stack pt={10} align={'center'}>
                    <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                        Brand
                    </Text>
                    <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                        {nftName}
                    </Heading>
                    <VStack align={'center'}>
                        <Text fontWeight={800} fontSize={'xl'}>
                            {ETH_VALUE} Matic
                        </Text>
                        <Text fontWeight={800} fontSize={'xl'}>
                            {ETH_VALUE * ONE_ETH_TO_ALGO} ALGO
                        </Text>
                        <Button paddingX={12} isLoading={loading} onClick={handleSubmitAlgo}>Mint NFT</Button>

                        {nftMinted && <Button paddingX={12} isLoading={assetLoading} onClick={handleTransfer}>Transfer NFT To Wallet</Button>}
                    </VStack>
                </Stack>
            </Box>
        </Center>
    )
}

export default Mint;