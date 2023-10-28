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
import { useState } from "react"

const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'

const Mint = () => {
    const [nftName, setNftName] = useState("")
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
                            0.05 ETH
                        </Text>
                        <Button paddingX={12}>Mint NFT</Button>
                    </VStack>
                </Stack>
            </Box>
        </Center>
    )
}

export default Mint;