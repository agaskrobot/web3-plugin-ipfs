import fs from 'fs';
import type { PathLike } from 'fs';
import { Web3PluginBase, Contract } from 'web3';
import type { Address, EventLog } from 'web3';
import { create } from 'ipfs-http-client';
import { abi } from './artifacts';
import 'dotenv/config';

const contractAddress: Address = '0xA683BF985BC560c5dc99e8F33f3340d1e53736EB';

export class IpfsPlugin extends Web3PluginBase {
	public pluginNamespace = 'ipfs';

	async uploadFile(path: PathLike, ownerAddress: Address): Promise<void> {
		const content = fs.readFileSync(path, 'utf-8');
		const ipfs = create({ url: '/ip4/127.0.0.1/tcp/5002' });
		const { cid } = await ipfs.add(content.toString());
		const contract = new Contract(abi, contractAddress);

		// Adds Web3Context to Contract instance
		contract.link(this);

		await contract.methods.store(cid.toString()).send({ from: ownerAddress });
	}

	async listEvents(address: Address): Promise<(string | EventLog)[]> {
		const contract = new Contract(abi, contractAddress);

		// Adds Web3Context to Contract instance
		contract.link(this);

		const resu = await contract.getPastEvents('CIDStored', {
			filter: {
				owner: address,
			},
			fromBlock: 4630236,
			toBlock: 'latest',
		});

		// Prints all CIDStored events from contract to the console
		console.log('CIDStored', resu);
		return resu;
	}
}

declare module 'web3' {
	// Here is where you're adding your plugin inside Web3Context
	interface Web3Context {
		ipfs: IpfsPlugin;
	}
}
