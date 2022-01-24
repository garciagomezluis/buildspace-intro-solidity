import { useToast } from '@chakra-ui/react';
import { FC, createContext, useEffect, useState } from 'react';

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
    interactionAllowed: boolean;
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
    interactionAllowed: false,
    get: async () => ({} as MessagesInColumns),
    set: async () => {},
});

const supportedNetworks = new Set(['rinkeby']);

const isValidAccount = (account: string) => account !== '';

const isValidNetwork = (network: string) => network !== '';

const isNetworkInWhitelist = (network: string) => supportedNetworks.has(network);

let provider: any = null;

export const WalletProvider: FC = ({ children }) => {
    // si se pudo obtener un account !== "" y una network !== ""
    const [connected, setConnected] = useState(false);

    // account
    const [account, setAccount] = useState('');

    // network
    const [network, setNetwork] = useState('');

    // si la network es inválida (network !== rinkeby)
    const [networkError, setNetworkError] = useState(false);

    // si la conexión está establecida
    // si la network es válida
    const [interactionAllowed, setInteractionAllowed] = useState(false);

    const toast = useToast();

    const get = () => getWaves(provider);

    const set = (value: string) => setWave(provider, value);

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
        console.log(`account: ${account}`);
        console.log(`network: ${network}`);
        console.log(`connected: ${connected}`);
        console.log(`networkError: ${networkError}`);
        console.log(`interactionAllowed: ${interactionAllowed}`);
        console.log('=============================');
    }, [account, network, networkError, connected, interactionAllowed]);

    useEffect(() => {
        const networkEnabled = !isValidNetwork(network) || isNetworkInWhitelist(network);

        if (!networkEnabled) showToast('Please, switch to Rinkeby network.');

        setNetworkError(!networkEnabled);
    }, [network]);

    useEffect(() => {
        setConnected(isValidAccount(account) && isValidNetwork(network));
    }, [account, network]);

    useEffect(() => {
        setInteractionAllowed(connected && !networkError);
    }, [connected, networkError]);

    useEffect(() => {
        if (!window.ethereum) return;

        provider = getProvider();

        (async () => {
            const account = await getAccount(provider);

            if (account) setAccount(account);
        })();

        // https://github.com/ethers-io/ethers.js/issues/1396
        window.ethereum.on('accountsChanged', async (accounts: string[]) => {
            const [account] = accounts;

            try {
                if (!account) throw new Error('Connection lost: Need an account to continue.');

                setAccount(account);
            } catch (error) {
                showToast((error as Error).message);

                setAccount('');
            }
        });

        provider.on('network', async (new_: any, old_: any) => {
            if (old_ && new_?.name === 'rinkeby') {
                window.location.reload();

                return;
            }

            try {
                const network = (await provider.getNetwork()).name;

                setNetwork(network);
            } catch (error) {
                showToast((error as Error).message);
            }
        });
    }, []);

    const connect = async () => {
        if (connected) return;

        try {
            await requestAccount(provider);
        } catch (error) {
            showToast((error as Error).message);
        }
    };

    return (
        <WalletContext.Provider
            value={{
                connect,
                connected,
                account,
                network,
                networkError,
                interactionAllowed,
                get,
                set,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
