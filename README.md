# Web3.js Ipfs Plugin

This is a [web3.js](https://github.com/web3/web3.js) plugin for uploading a provided local file to IPFS, and listing all stored CIDs of given ethereum address.

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)

## Installation

```bash
yarn add web3-plugin-ipfs
```

## Using this plugin

### Installing Version `4.x` of `web3`

When adding the `web3` package to your project:

-   `npm i -S web3`
-   `yarn add web3`

### Registering the Plugin with a web3.js Instance

After importing `IpfsPlugin` from `web3-plugin-ipfs` and `Web3` from `web3`, register an instance of `IpfsPlugin` with an instance of `Web3` like so:

```typescript
import { Web3 } from 'web3';
import { IpfsPlugin } from './index';

const web3 = new Web3('YOUR_PROVIDER_URL');

web3.registerPlugin(new IpfsPlugin('YOUR_IPFS_URL'));
```

More information about registering web3.js plugins can be found [here](https://docs.web3js.org/docs/guides/web3_plugin_guide/plugin_users#registering-the-plugin).

### Plugin Methods

#### `uploadFile`

`uploadFile`, is responsible for uploading a file to the IPFS (InterPlanetary File System) and storing the resulting Content Identifier (CID) in a Smart Contract on the blockchain

```typescript
	async uploadFile(path: PathLike, ownerAddress: Address): Promise<void> {
		const content = fs.readFileSync(path);
		const ipfs = create({ url: this.urlIpfs });
		const { cid } = await ipfs.add(content);
		const contract = new Contract(abi, contractAddress);

		// Adds Web3Context to Contract instance
		contract.link(this);

		await contract.methods.store(cid.toString()).send({ from: ownerAddress });
	}
```

It takes two parameters `path` the local file path `PathLike` of the file you want to upload to IPFS and
`ownerAddress` the Ethereum address of the owner who is initiating the file upload.
The function reads the content of the file located at the specified path using `fs.readFileSync(path)`.
It then creates an IPFS instance using the IPFS HTTP API endpoint specified by the user.
The file content is added to IPFS using the `ipfs.add(content)` method. This operation returns a `CID`, which represents the unique identifier of the uploaded file. A contract instance is created using a provided `ABI` and contract address. This contract instance is associated with a `Web3Context`, allowing interaction with the blockchain. The Smart Contract's store method is invoked with `CID` as an argument.
The send method is called to send the transaction to the Smart Contract. 

Below, you'll find an example of how to utilize this method:

```typescript
import { Web3 } from 'web3';
import { IpfsPlugin } from './index';

const web3 = new Web3('YOUR_PROVIDER_URL');

web3.registerPlugin(new IpfsPlugin('YOUR_IPFS_URL'));

web3.ipfs.uploadFile('FILE_PATH', 'OWNER_ADDRESS').then(console.log);
```

#### `listEvents`

 `listEvents`, is used to retrieve and list events from a Smart Contract on the blockchain. 

```typescript
	async listEvents(address: Address): Promise<(string | EventLog)[]> {
		const contract = new Contract(abi, contractAddress);

		// Adds Web3Context to Contract instance
		contract.link(this);

		const result = await contract.getPastEvents('CIDStored', {
			filter: {
				owner: address,
			},
			fromBlock: 4630236,
			toBlock: 'latest',
		});

		// Prints all CIDStored events from contract to the console
		console.log('CIDStored', result);
		return result;
	}
```

The `uploadFile` method, takes an address as a parameter, which is expected to be an Ethereum address.
Inside the function, a Contract instance is created using a provided ABI and contract address. This contract instance is associated with a Web3Context, which allows for interaction with the blockchain.
The function then calls the `getPastEvents` method on the contract instance to retrieve events with the event name `CIDStored` that meet certain criteria. These criteria include filtering events where the 'owner' field matches the provided address.

Below, you'll find an example of how to utilize this method:

```typescript
import { Web3 } from 'web3';
import { IpfsPlugin } from './index';

const web3 = new Web3('YOUR_PROVIDER_URL');

web3.registerPlugin(new IpfsPlugin('YOUR_IPFS_URL'));

web3.ipfs.listEvents('ADDRESS');.then(console.log);
```
