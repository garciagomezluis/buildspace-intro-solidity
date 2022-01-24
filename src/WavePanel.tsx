import { FC, RefObject, useContext, useEffect, useRef, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Center,
    Input,
    Spinner,
    Stack,
    VStack,
} from '@chakra-ui/react';

import { MessagesInColumns } from './service';
import { WalletContext } from './WalletContext';
import { WaveModalContext } from './WaveModal';

interface WaveAtMeProps {
    inputRef: RefObject<HTMLInputElement>;
    onSuccess: () => void;
}

const WaveAtMe: FC<WaveAtMeProps> = ({ onSuccess, inputRef }) => {
    const { set } = useContext(WalletContext);

    const maxAmountOfChars = 120;
    const almostMaxAmountOfChars = 75;

    const [message, setMessage] = useState('');

    // ui model
    const [emptyNotAllowed, setEmptyNotAllowed] = useState(false);
    const [almostReachedMaxChars, setAlmostReachedMaxChars] = useState(false);
    const [reachedMaxChars, setReachedMaxChars] = useState(false);
    const [isButtonLocked, setIsButtonLocked] = useState(false);

    // modal utilities
    const { onOpenModal, onCloseModal, lockModal, unlockModal, showInfo } =
        useContext(WaveModalContext);

    useEffect(() => {
        setEmptyNotAllowed(message.trim() === '' && message.length > 0);
        setAlmostReachedMaxChars(
            almostMaxAmountOfChars <= message.trim().length &&
                message.trim().length <= maxAmountOfChars,
        );
        setReachedMaxChars(message.trim().length > maxAmountOfChars);
    }, [message]);

    useEffect(() => {
        setIsButtonLocked(emptyNotAllowed || reachedMaxChars || message.trim().length === 0);
    }, [emptyNotAllowed, reachedMaxChars, message]);

    async function onAction() {
        console.log(`sending... ${message}`);

        // cambio estado de modal
        lockModal();

        // show wallet message
        showInfo(
            'Your wallet will popup. Please, confirm the transaction and do not reload the page.',
            'info',
        );

        try {
            // envio transacción
            await set(message);

            setMessage('');

            onCloseModal();

            onSuccess();

            console.log('sent');
        } catch (error) {
            const msg = (error as Error).message;

            // msg = msg.indexOf('failed') !== -1 ? 'Transaction failed' : msg;

            showInfo(msg, 'error');

            unlockModal();
        }
    }

    function onClickEventHandler() {
        setMessage(message.trim());

        onOpenModal({
            isLocked: false,
            titleText: 'Wave at me',
            bodyText: `You will have to afford the gas cost to send this wave "${message}". Are you sure?`,
            actionText: "Let's go!",
            onAction,
        });
    }

    return (
        <VStack align="flex-end" w="full">
            <Input
                ref={inputRef}
                isInvalid={emptyNotAllowed || reachedMaxChars}
                placeholder="Show me some love!"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            {emptyNotAllowed && (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>You cannot send no waves!</AlertTitle>
                    <AlertDescription>Be creative!</AlertDescription>
                </Alert>
            )}

            {almostReachedMaxChars && (
                <Alert status="warning">
                    <AlertIcon />
                    <AlertTitle mr={2}>Reaching limit of characters!</AlertTitle>
                    <AlertDescription>
                        You are allowed to write {maxAmountOfChars - message.length} characters
                        more.
                    </AlertDescription>
                </Alert>
            )}

            {reachedMaxChars && (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Reached limit of characters!</AlertTitle>
                    <AlertDescription>
                        You are allowed to write {maxAmountOfChars - message.length} characters
                        more.
                    </AlertDescription>
                </Alert>
            )}

            <Button disabled={isButtonLocked} onClick={onClickEventHandler}>
                Wave at me!
            </Button>
        </VStack>
    );
};

interface WaveMessageProps {
    message: string;
}

const WaveMessage: FC<WaveMessageProps> = ({ message }) => {
    return (
        <Box bg="linear-gradient(350deg, #22c1c3, #fd2df5);" mt="2" p="5">
            {message}
        </Box>
    );
};

const WavePanel: FC = () => {
    const [messages, setMessages] = useState<MessagesInColumns>({});
    const [loading, setLoading] = useState(true);

    const { get } = useContext(WalletContext);

    const inputRef = useRef<HTMLInputElement>(null);

    const loadWaves = async () => {
        setMessages(await get());
        inputRef.current?.focus();
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await loadWaves();
            setLoading(false);
        })();
    }, []);

    return (
        <>
            <VStack bg="blue.800" m="0 auto" maxW="4xl" mb="5" p="5" rounded="sm" w="full">
                <WaveAtMe inputRef={inputRef} onSuccess={loadWaves} />
            </VStack>
            <Stack className="collage" direction="row" wrap="wrap">
                {loading && (
                    <Center h="36" w="full">
                        <Spinner size="xl" />
                    </Center>
                )}
                {!loading &&
                    Object.entries(messages).map(([, msgs]) => {
                        return (
                            <Box
                                key={Math.random().toString().substring(2)}
                                flex={{ base: '100%', lg: '1' }}
                                me={{ base: '0 !important', lg: '5px !important' }}
                                ms={{ base: '0 !important', lg: '5px !important' }}
                            >
                                {msgs.map((x) => (
                                    <WaveMessage key={x.id} message={x.message} />
                                ))}
                            </Box>
                        );
                    })}
            </Stack>
        </>
    );
};

export default WavePanel;
