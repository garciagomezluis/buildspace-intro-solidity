/* eslint-disable import/prefer-default-export */

import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { abi as wavePortalABI } from '../artifacts/contracts/WavePortal.sol/WavePortal.json';

const COLUMNS_AMOUNT = 4;
const CONTRACT_ADDRESS = '0x7647cA26cEd7450b7d01007f7F8607C81394cB6D';

export type Message = {
    id: string;
    address: string;
    date: Date;
    message: string;
};

export type MessagesInColumns = { [k: number]: Message[] };

const toColumns = async (messages: Message[]) => {
    const messagesInColumns: { [k: number]: Message[] } = {};

    for (let i = 0; i < messages.length; i++) {
        const column = i % COLUMNS_AMOUNT;

        messagesInColumns[column] = messagesInColumns[column] || [];
        messagesInColumns[column].push(messages[i]);
    }

    return messagesInColumns;
};

export const getProvider = () => {
    if (!window.ethereum) {
        throw new Error('Make sure you have a wallet installed!');
    }

    return new ethers.providers.Web3Provider(window.ethereum, 'any');
};

export const getAccount = async (provider: Web3Provider) => {
    if (!window.ethereum) {
        throw new Error('Make sure you have a wallet installed!');
    }

    const [account] = await provider.send('eth_accounts', []);

    return account;
};

export const requestAccount = async (provider: Web3Provider) => {
    if (!window.ethereum) {
        throw new Error('Make sure you have a wallet installed!');
    }

    const [account] = await provider.send('eth_requestAccounts', []);

    if (!account) {
        throw new Error('No authorized account found');
    }
};

export const getWaves = async (provider: Web3Provider) => {
    if (!window.ethereum) {
        throw new Error('Make sure you have a wallet installed!');
    }

    const signer = provider.getSigner();

    const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, wavePortalABI, signer);

    const waves = await wavePortalContract.getWaves();

    return toColumns(
        waves.map((w: any) => {
            return {
                id: Math.random().toString().substring(2),
                address: w.waver,
                date: new Date(w.timestamp * 1000),
                message: w.message,
            };
        }),
    );
};

export const setWave = async (provider: Web3Provider, value: string) => {
    value = value.trim();

    if (value.length === 0) {
        throw new Error('Empty values not allowed');
    }

    if (!window.ethereum) {
        throw new Error('Make sure you have a wallet installed!');
    }

    const signer = provider.getSigner();

    const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, wavePortalABI, signer);

    const waveTxn = await wavePortalContract.wave(value);

    console.log('Mining...', waveTxn.hash);

    await waveTxn.wait();
    console.log('Mined -- ', waveTxn.hash);
};