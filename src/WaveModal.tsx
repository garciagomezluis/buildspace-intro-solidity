import { FC, createContext, useContext, useRef, useState } from 'react';

import {
    Alert,
    AlertIcon,
    AlertStatus,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';

// interface con descripción de la data mostrada por un wavemodal
interface IWaveModal {
    isLocked?: boolean;
    titleText: string;
    bodyText: string;
    actionText: string;
    infoText?: string;
    infoType?: AlertStatus;
    onAction: () => void;
}

// context para exponer
// onOpenWaveModal
// onCloseWaveModal
export const WaveModalContext = createContext<{
    // eslint-disable-next-line no-unused-vars
    onOpenModal: (data: IWaveModal) => void;
    onCloseModal: () => void;
    lockModal: () => void;
    unlockModal: () => void;
    // eslint-disable-next-line no-unused-vars
    showInfo: (data: string, type: AlertStatus) => void;
}>({
    onOpenModal: () => {},
    onCloseModal: () => {},
    unlockModal: () => {},
    lockModal: () => {},
    showInfo: () => {},
});

// context para exponer
// data que utilizará el modal internamente
const WaveModalDataContext = createContext<
    IWaveModal & {
        // chakra modal utilities

        isOpen: boolean;
        onClose: () => void;
    }
>({
    // IWaveModal defaults
    isLocked: false,
    titleText: '',
    bodyText: '',
    actionText: '',
    infoText: '',
    infoType: 'info',
    onAction: () => {},

    // chakra modal utilities
    isOpen: false,
    onClose: () => {},
});

export const WaveModalProvider: FC<any> = ({ children }) => {
    // chakra modal utilities
    const { isOpen, onOpen, onClose } = useDisclosure();

    // IWaveModal defaults
    const [isLocked, setIsLocked] = useState(false);
    const [titleText, setTitleText] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [actionText, setActionText] = useState('');
    const [infoText, setInfoText] = useState('');
    const [infoType, setInfoType] = useState<AlertStatus>('info');
    const [onAction, setOnAction] = useState(() => () => {});

    const lockModal = () => {
        setIsLocked(true);
    };

    const unlockModal = () => {
        setIsLocked(false);
    };

    const showInfo = (text: string, type: AlertStatus = 'info') => {
        setInfoText(text);
        setInfoType(type);
    };

    const onOpenModal = ({
        isLocked = false,
        titleText,
        bodyText,
        actionText,
        infoText = '',
        infoType = 'info',
        onAction,
    }: IWaveModal) => {
        setIsLocked(isLocked);
        setTitleText(titleText);
        setBodyText(bodyText);
        setActionText(actionText);
        setInfoText(infoText);
        setInfoType(infoType);
        setOnAction(() => onAction);
        onOpen();
    };

    // lo exponemos para que se pueda cerrar desde fuera
    const onCloseModal = onClose;

    return (
        <WaveModalContext.Provider
            value={{
                onOpenModal,
                onCloseModal,
                lockModal,
                unlockModal,
                showInfo,
            }}
        >
            <WaveModalDataContext.Provider
                value={{
                    isLocked,
                    titleText,
                    bodyText,
                    actionText,
                    infoText,
                    infoType,
                    onAction,
                    isOpen,
                    onClose,
                }}
            >
                {children}
            </WaveModalDataContext.Provider>
        </WaveModalContext.Provider>
    );
};

export const WaveModal: FC = () => {
    const {
        isLocked,
        titleText,
        bodyText,
        actionText,
        infoText,
        infoType,
        onAction,
        isOpen,
        onClose,
    } = useContext(WaveModalDataContext);

    const initialFocusRef = useRef(null);

    return (
        <Modal
            closeOnOverlayClick={!isLocked}
            initialFocusRef={initialFocusRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{titleText}</ModalHeader>
                <ModalCloseButton disabled={isLocked} />
                <ModalBody>{bodyText}</ModalBody>

                {infoText !== '' && (
                    <Alert my="5" status={infoType}>
                        <AlertIcon />
                        {infoText}
                    </Alert>
                )}

                {infoText !== '' && infoType === 'error' && <ModalBody>Retry?</ModalBody>}
                <ModalFooter>
                    <Button colorScheme="blue" disabled={isLocked} mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        ref={initialFocusRef}
                        isLoading={isLocked}
                        variant="solid"
                        onClick={onAction}
                    >
                        {actionText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default WaveModal;
