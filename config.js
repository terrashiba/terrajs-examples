export default {
  networks : {
      mainnet: {
          provider: 'https://lcd.terra.dev',
          transactionLink : (hash) => `https://finder.terra.money/columbus-5/tx/${hash}`,
          walletLink : (address) => `https://finder.terra.money/columbus-5/address/${address}`,
          networkName: 'columbus-5',

      },
      testnet: {
          provider: 'https://bombay-lcd.terra.dev',
          transactionLink : (hash) => `https://finder.terra.money/bombay-12/tx/${hash}`,
          walletLink : (address) => `https://finder.terra.money/bombay-12/address/${address}`,
          networkName: 'bombay-12',
      }
  }
};