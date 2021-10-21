import pkg from '@terra-money/terra.js';
import config from './config.js';
const { LCDClient, MnemonicKey, MsgSend, Coin} = pkg;

const validWallet = /terra1[a-z0-9]{38}/g;

const getTerra = (network) => new LCDClient({
    URL: config.networks[network].provider,
    chainID: config.networks[network].networkName,
    gasPrices: [new Coin('uluna', '0.15')],
    gasAdjustment: '1.5',
    gas: 10000000,
});

const getTransaction = (txId, network) => getTerra(network).tx.txInfo(txId);
const getTransactionLink = (txId, network) => config.networks[network].transactionLink(txId);
const getWalletLink = (txId, network) => config.networks[network].walletLink(txId);
const getBalance = (address, network) => getTerra(network).bank.balance(address);

const isValidWalletAddress = (address) => validWallet.test(address);

const sendTransaction = ({ to, amount, network, mnemonic, denom = 'uluna' }) => {
    const terra = getTerra(network);
    const mk = new MnemonicKey({
        mnemonic,
    });

    const wallet = terra.wallet(mk);

    const send = new MsgSend(
        wallet.key.accAddress,
        to,
        { [denom]: amount }
    );

    return new Promise((resolve) => {
        wallet
        .createAndSignTx({
            msgs: [send],
        })
        .then(tx => terra.tx.broadcast(tx))
        .then(result => {
            resolve(result);
        });
    });
}

const main = async () => {
    const realWallet = 'terra1z75w0td9urxkh254jwqd5m8pd6ulqjfdjsxpj5';
    const fakeWallet = 'terra1z75w0td9urxkh254jwqd5m8pd6ulqjfdjsxpj';

    const isRealWalletLegit = isValidWalletAddress(realWallet);
    const isFakeWalletLegit = isValidWalletAddress(fakeWallet);

    console.log(`isRealWalletLegit: ${isRealWalletLegit}`);
    console.log(`isFakeWalletLegit: ${isFakeWalletLegit}`);

    // Transfer 0.1 Luna.
    const sendResponse = await sendTransaction({ 
        to: realWallet,
        amount: 100000,
        network: 'testnet',
        mnemonic: process.env.KEY
    });

    console.log(getTransactionLink(sendResponse.txhash, 'testnet'));

    const terra = getTerra('testnet');
    const mk = new MnemonicKey({
        mnemonic: process.env.KEY,
    });

    const wallet = terra.wallet(mk);

    console.log(await getBalance(wallet.key.accAddress, 'testnet'));
}

main();
