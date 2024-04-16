### Airdrop Contract

This repository contains a smart contract for conducting ERC20 token airdrops, specifically designed and utilized for the airdrops of MARK tokens on the Arbitrum One network. The contract allows users to send a specific ERC20 token to multiple recipients in a single transaction, ensuring efficiency and cost-effectiveness.

### Features

- Allows sending ERC20 tokens to multiple recipients in a single transaction.
- Includes a function to recover accidental tokens sent to the contract.
- Utilizes OpenZeppelin's SafeERC20 library for safe token transfers.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Truffle](https://www.trufflesuite.com/)
- [Ganache](https://www.trufflesuite.com/ganache) or any other Ethereum network for testing

### Installation

1. Clone this repository:

```sh
git clone https://github.com/MchainNetwork/airdrop-contract.git
cd airdrop-contract
```

2. Install the dependencies:

```sh
npm install
```

3. Copy the `.env.example` file to a new `.env` file and update the environment variables as needed:

```sh
cp .env.example .env
```

Content of the `.env.example` file:

```env
DEPLOYER_ADDRESS=0xYourDeployerAddressHere
TOKEN_ADDRESS=0xYourTokenAddressHere
```

Ensure to replace `0xYourDeployerAddressHere` and `0xYourTokenAddressHere` with your actual addresses.

### Deployment

1. Compile the contracts:

```sh
truffle compile
```

2. Deploy the contracts to the desired network:

```sh
truffle migrate --network <network-name>
```

### Usage

To conduct an airdrop, call the `bulkTransfer` function with the following parameters:

- `recipients`: An array of Ethereum addresses you want to send the tokens to.
- `amounts`: An array of token amounts you want to send to each corresponding recipient.

Ensure you have approved enough tokens for the contract before calling `bulkTransfer`.

### Testing

To run the unit tests, start Ganache and execute:

```sh
truffle test
```

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
