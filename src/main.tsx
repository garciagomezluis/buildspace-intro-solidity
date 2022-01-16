import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import React from 'react';
import ReactDOM from 'react-dom';
import RealApp from './RealApp';
import theme from './theme';

import { WalletProvider } from './WalletContext';
import WaveModal, { WaveModalProvider } from './WaveModal';

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        ethereum: any;
    }
}

ReactDOM.render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <WalletProvider>
                <WaveModalProvider>
                    <WaveModal />
                    <RealApp />
                </WaveModalProvider>
            </WalletProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
