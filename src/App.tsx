import { FC, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { abi as wavePortalABI } from '../artifacts/contracts/WavePortal.sol/WavePortal.json';
import {
    Box,
    Button,
    Container,
    HStack,
    Input,
    Spacer,
    Text,
    TextProps,
    VStack,
} from '@chakra-ui/react';

declare global {
    interface Window {
        ethereum: any;
    }
}

const contractAddress = '0x7647cA26cEd7450b7d01007f7F8607C81394cB6D';

const getWaveBoxId = (address: string, timestamp: number) => address.substring(2) + timestamp;

const WaveBox: FC<any> = ({ wave, onClick }) => {
    const { address, message, date } = wave;

    return (
        <Text
            bg="linear-gradient(135deg,#e09,#d0e)"
            color="white"
            cursor="pointer"
            layoutId={getWaveBoxId(address, date.getTime())}
            p="5"
            rounded="2xl"
            onClick={onClick}
        >
            {message}
        </Text>
    );
};

const WaveBoxDetail: FC<any> = ({ wave }) => {
    const { address, message, date } = wave;
    const id = getWaveBoxId(address, date.getTime());

    return (
        <VStack
            bg="linear-gradient(135deg,#e09,#d0e)"
            color="white"
            layoutId={id}
            p="5"
            rounded="2xl"
        >
            <HStack w="full">
                <Text>Address</Text>
                <Spacer />
                <Text>{address}</Text>
            </HStack>
            <HStack w="full">
                <Text>Date</Text>
                <Spacer />
                <Text>{date.toString()}</Text>
            </HStack>
            <HStack w="full">
                <Text>Message</Text>
                <Spacer />
                <Text>{message}</Text>
            </HStack>
        </VStack>
    );
};

export default function App() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [waveValue, setWaveValue] = useState('');
    const [waves, setWaves] = useState<any[]>([]);
    const [selectedWave, setSelectedWave] = useState<any>();

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have metamask!');

                return;
            }

            const [account] = await ethereum.request({ method: 'eth_accounts' });

            if (!account) {
                console.log('No authorized account found');

                return;
            }

            console.log('Found an authorized account: ', account);
            setCurrentAccount(account);
            getWaves();
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have metamask!');

                return;
            }

            const [account] = await ethereum.request({ method: 'eth_requestAccounts' });

            console.log('Connected', account);
            setCurrentAccount(account);
        } catch (error) {
            console.log(error);
        }
    };

    const getWaves = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    wavePortalABI,
                    signer,
                );

                const waves = await wavePortalContract.getWaves();

                setWaves(
                    waves.map((w) => {
                        return {
                            address: w.waver,
                            date: new Date(w.timestamp * 1000),
                            message: w.message,
                        };
                    }),
                );
                // console.log(waves);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const wave = async () => {
        try {
            if (waveValue.trim().length === 0) {
                console.log('Empty values not allowed');

                return;
            }

            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    wavePortalABI,
                    signer,
                );

                const waveTxn = await wavePortalContract.wave(waveValue);

                console.log('Mining...', waveTxn.hash);

                await waveTxn.wait();
                console.log('Mined -- ', waveTxn.hash);

                setWaveValue('');
                await getWaves();
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Box>
                <Container maxW="container.lg">
                    <HStack justify="flex-end" py="2">
                        {!currentAccount && (
                            <Button colorScheme="pink" onClick={connectWallet}>
                                Connect Wallet
                            </Button>
                        )}
                    </HStack>
                </Container>
            </Box>

            <Container maxW="container.lg">
                {currentAccount && (
                    <VStack align="flex-end">
                        <Input
                            mb="2"
                            placeholder="Show me some love!"
                            type="text"
                            value={waveValue}
                            onChange={(e) => setWaveValue(e.target.value)}
                        />
                        <Button colorScheme="pink" onClick={wave}>
                            Wave at Me
                        </Button>
                    </VStack>
                )}

                <HStack>
                    {waves.map((wave, index) => {
                        return (
                            <WaveBox
                                key={index}
                                wave={wave}
                                onClick={() => setSelectedWave(wave)}
                            />
                        );
                    })}
                </HStack>

                {selectedWave && <WaveBoxDetail wave={selectedWave} />}
            </Container>
        </>
    );
}
