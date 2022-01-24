/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { useContext } from 'react';

import {
    Badge,
    Box,
    Button,
    Container,
    HStack,
    Image,
    Link,
    Spacer,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';

import airplaneLogo from '/airplane.png';
import readLogo from '/read.png';
import walletLogo from '/wallet.png';

import { WalletContext } from './WalletContext';
import WavePanel from './WavePanel';
// import WavePanel from './WavePanel';

const RealApp = () => {
    const { connect, account, network, connected, networkError, interactionAllowed } =
        useContext(WalletContext);

    return (
        <>
            <Box>
                <Container maxW="container.xl">
                    <HStack h="10" my="6">
                        <HStack align="center">
                            <Link alt="buildspace" href="https://buildspace.so">
                                <Image
                                    alt="logo"
                                    h="40px"
                                    src="https://api.typedream.com/v0/document/public/f71c1437-09d6-45e9-a6e8-3f18592cc3ef_image-removebg-preview_1_png.png"
                                    title="Buildspace"
                                />
                            </Link>
                        </HStack>
                        <Spacer />
                        {network && account && (
                            <Badge
                                colorScheme={networkError ? 'red' : 'green'}
                                me="20px !important"
                                variant="outline"
                            >
                                {network}
                            </Badge>
                        )}
                        {account && (
                            <Link
                                alt="profilepic"
                                href={`https://etherscan.io/address/${account}`}
                                title="View on Etherscan"
                            >
                                <Image
                                    src={`https://www.gravatar.com/avatar/${account}?s=40&d=retro`}
                                />
                            </Link>
                        )}
                        {!connected && <Button onClick={connect}>Connect a wallet</Button>}
                    </HStack>
                </Container>
            </Box>

            <Box bg="blue.800" mb="10" py="20">
                <Container maxW="container.xl">
                    <Stack direction={{ base: 'column', md: 'row' }} justify="space-between">
                        <VStack align="flex-start" maxW={{ md: '50%' }}>
                            <Text fontSize="5xl" fontWeight={700} w="full">
                                SendMe a Wave!
                            </Text>
                            <Text
                                bg="linear-gradient(350deg, #22c1c3, #fd2df5);"
                                bgClip="text"
                                fontSize="3xl"
                                fontWeight={700}
                                letterSpacing="1px"
                                w="full"
                            >
                                buildspace #0
                            </Text>
                            <Text fontSize="20" w="full">
                                Feel free to send me a nice message, which will be stored on the
                                Ethereum blockchain (Rinkeby network) for everyone to see in the
                                future.
                            </Text>
                        </VStack>
                        <Image
                            alt="buildspace nft"
                            src="https://tokens.buildspace.so/assets/CHf7d3f8a8-5ac3-4676-8fe4-220e8a755104-547/render.png"
                            title="buildspace nft"
                            w="300px"
                        />
                    </Stack>
                </Container>
            </Box>

            {!interactionAllowed && (
                <Box>
                    <Container maxW="container.xl">
                        <Stack direction={{ base: 'column', md: 'row' }} justify="space-around">
                            <VStack
                                bg="linear-gradient(350deg, #22c1c3, #fd2df5);"
                                flex="1"
                                mx="20px !important"
                                p="10"
                                pos="relative"
                                pt="20"
                            >
                                <Image
                                    alt="wallet"
                                    blockSize="150px"
                                    pos="absolute"
                                    src={walletLogo}
                                    title="MetaMask"
                                    top="-75px"
                                />
                                <Text fontSize="20" fontWeight={700}>
                                    Connect your wallet
                                </Text>
                                <Text>
                                    A wallet will let you sign transactions to send messages over
                                    the Ethereum network. Need to have some ETH in order to pay the
                                    Gas required (~300K).
                                </Text>
                            </VStack>
                            <VStack
                                bg="linear-gradient(350deg, #22c1c3, #fd2df5);"
                                flex="1"
                                mx="20px !important"
                                p="10"
                                pos="relative"
                                pt="20"
                            >
                                <Image
                                    alt="airplane"
                                    blockSize="150px"
                                    pos="absolute"
                                    src={airplaneLogo}
                                    title="airdrop"
                                    top="-75px"
                                />
                                <Text fontSize="20" fontWeight={700}>
                                    Write
                                </Text>
                                <Text>
                                    Send me a nice message! &quot;Hello World&quot; may be? Do you
                                    speak in spanish? What about &quot;Hola Mundo!&quot;. After
                                    sending your message, you will have a change to win some small
                                    amount of ETH!
                                </Text>
                            </VStack>
                            <VStack
                                bg="linear-gradient(350deg, #22c1c3, #fd2df5);"
                                flex="1"
                                mx="20px !important"
                                p="10"
                                pos="relative"
                                pt="20"
                            >
                                <Image
                                    alt="read"
                                    blockSize="150px"
                                    pos="absolute"
                                    src={readLogo}
                                    title="read"
                                    top="-75px"
                                />
                                <Text fontSize="20" fontWeight={700}>
                                    Read
                                </Text>
                                <Text>
                                    Do not stop participating! Get into the code, send messages, or
                                    just read the comments from all around the world!
                                </Text>
                            </VStack>
                        </Stack>
                    </Container>
                </Box>
            )}

            {interactionAllowed && (
                <Container maxW="container.xl">
                    <WavePanel />
                </Container>
            )}
        </>
    );
};

export default RealApp;
