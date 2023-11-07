import Web3, { Web3Eth, Web3Context } from 'web3';
import type { EventLog, Address } from 'web3';
import { IpfsPlugin } from '../../src/index';

describe('IpfsPlugin Tests', () => {
	it('should register IpfsPlugin plugin on Web3Context instance', () => {
		const web3Context = new Web3Context('http://127.0.0.1:8545');
		web3Context.registerPlugin(new IpfsPlugin('/ip4/127.0.0.1/tcp/5002'));
		expect(web3Context.ipfs).toBeDefined();
	});

	it('should register IpfsPlugin plugin on Web3Eth instance', () => {
		const web3Eth = new Web3Eth('http://127.0.0.1:8545');
		web3Eth.registerPlugin(new IpfsPlugin('/ip4/127.0.0.1/tcp/5002'));
		expect(web3Eth.ipfs).toBeDefined();
	});

	describe('IpfsPlugin method tests', () => {
		let web3Context: Web3;
		beforeAll(() => {
			web3Context = new Web3('wss://ethereum-sepolia.publicnode.com');
			web3Context.registerPlugin(new IpfsPlugin('http://127.0.0.1:8545'));
		});

		it('should call IpfsPlugin.listEvents and return CIDStored', async () => {
			const accountAddress: Address = '0x76574c0Bb8Ffa5834bD8F36117243216A5f324b7';
			const result = (await web3Context.ipfs.listEvents(accountAddress)) as EventLog[];

			expect(result[0].event).toEqual('CIDStored');
		});
	});
});
