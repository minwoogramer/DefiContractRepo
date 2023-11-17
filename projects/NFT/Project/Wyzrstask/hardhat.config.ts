import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50000,
          },
          viaIR: true,
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        initialIndex: 0,
        accountsBalance: "10000000000000000000000000", // 10,000,000 ETH
      },
    },
    localhost: {
      allowUnlimitedContractSize: true,
    },
    avalanche_wyzrs_subnet: {
      url: "https://subnets.avacloud.io/aaa4eb41-36a4-47f0-b63c-2f84fe136756",
      chainId: 1110867,
      accounts: [ACCOUNT_PRIVATE_KEY],
      gasPrice: "auto",
    },
    // saga_wyzrs_chainlet: {
    //   url: "http://wyzrstask-1694418111538339-1.jsonrpc.sp1.sagarpc.io/",
    //   chainId: 1694418111538339,
    //   accounts: [ACCOUNT_PRIVATE_KEY],
    //   gasPrice: "auto",
    // },
  },
};

export default config;
