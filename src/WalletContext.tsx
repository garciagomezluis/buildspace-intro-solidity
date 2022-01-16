import { useToast } from '@chakra-ui/react';
import { FC, createContext, useEffect, useRef, useState } from 'react';

import {
    MessagesInColumns,
    getAccount,
    getProvider,
    getWaves,
    requestAccount,
    setWave,
} from './service';

interface IWallet {
    connect: () => void;
    connected: boolean;
    account: string;
    network: string;
    networkError: boolean;
    get(): Promise<MessagesInColumns>;
    // eslint-disable-next-line no-unused-vars
    set(v: string): Promise<void>;
}

export const WalletContext = createContext<IWallet>({
    connect: () => {},
    connected: false,
    account: '',
    network: '',
    networkError: false,
    get: async () => ({} as MessagesInColumns),
    set: async () => {},
});

// export const provider = getProvider();

export const WalletProvider: FC = ({ children }) => {
    const provider = useRef(getProvider());

    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState('');
    const [network, setNetwork] = useState('');
    const [networkError, setNetworkError] = useState(false);
    const toast = useToast();

    const get = () => getWaves(provider.current);

    const set = (value: string) => setWave(provider.current, value);

    const showToast = (description: string) => {
        toast({
            title: 'Error',
            description,
            status: 'error',
            duration: 5000,
            position: 'bottom-right',
        });
    };

    useEffect(() => {
        setConnected(account !== '' && network !== '');
    }, [account, network]);

    useEffect(() => {
        if (account === '') setNetwork('');

        updateNetwork();
    }, [account]);

    useEffect(() => {
        if (network !== 'rinkeby' && network !== '') {
            setNetworkError(true);
            showToast('Please, switch to Rinkeby network.');
        } else {
            setNetworkError(false);
        }
    }, [network]);

    useEffect(() => {
        (async () => {
            const account = await getAccount(provider.current);

            if (account) setAccount(account);
        })();

        // https://github.com/ethers-io/ethers.js/issues/1396
        window.ethereum.on('accountsChanged', async (accounts: string[]) => {
            console.log('accounts changed', accounts);

            const [account] = accounts;

            try {
                if (!account) throw new Error('Connection lost: Need an account to continue.');

                setAccount(account);
            } catch (error) {
                showToast((error as Error).message);

                setAccount('');
            }
        });

        provider.current.on('network', async (new_, old_) => {
            if (old_ && new_?.name === 'rinkeby') {
                window.location.reload();

                return;
            }

            updateNetwork();
        });
    }, []);

    const connect = async () => {
        if (connected) return;

        try {
            await requestAccount(provider.current);
        } catch (error) {
            showToast((error as Error).message);
        }
    };

    const updateNetwork = async () => {
        try {
            setNetwork((await provider.current.getNetwork()).name);
        } catch (error) {
            showToast((error as Error).message);
        }
    };

    return (
        <WalletContext.Provider
            value={{ connect, connected, account, network, networkError, get, set }}
        >
            {children}
        </WalletContext.Provider>
    );
};
