// import * as fs from 'fs';
import { Web3Eth, Web3Context } from 'web3';
// import type { EventLog, Address } from 'web3';
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
});
