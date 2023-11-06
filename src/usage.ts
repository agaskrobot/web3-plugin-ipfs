import { Web3 } from 'web3';
import { IpfsPlugin } from './ipfs_plugin';
import 'dotenv/config';

const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`);

web3.registerPlugin(new IpfsPlugin());

const test = async (): Promise<void> => {
	const account = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY as string).get(0);

	if (account?.address) {
		await web3.ipfs.uploadFile('src/text.txt', account?.address);

		await web3.ipfs.listEvents(account?.address);
	}
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test().catch();
