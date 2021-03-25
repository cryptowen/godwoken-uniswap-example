import {fullAddressInfoWithData} from "./lumos/packages/helpers/tests/addresses";
import calldataVec from "./1.calldata.json";


const shell = require('shelljs');

const LUMOS_CONFIG_FILE='/code/config/lumos-config.json';
const PRIVATE_KEY = '0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc';
const log = console.log.bind(console)


const main = async () => {
    log('\r\n---begin uniswap demo---');
    // await deposit();
    // await createCreatorAccount(PRIVATE_KEY, '0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655', '2');

    // // 1. WETH  -> account id : 5
    // log(`\r\n1. deploy ${calldataVec[0].name}`)
    // await deploy('4', calldataVec[0].calldata);
    //
    // // 2. Factory  -> account id : 6
    // log(`\r\n2. deploy ${calldataVec[1].name}`)
    // await deploy('4', calldataVec[1].calldata);
    //
    // // 3. Router  -> account id : 7
    // log(`\r\n3. deploy ${calldataVec[2].name}`)
    // await deploy('4', calldataVec[2].calldata);

    // 4. MockUsdt  -> account id : 8
    // log(`\r\n4. deploy ${calldataVec[3].name}`)
    // await deploy('4', calldataVec[3].calldata);

    // 5. MockBTC -> account id: 9
    // log(`\r\n5. deploy ${calldataVec[4].name}`)
    // await deploy('4', calldataVec[4].calldata);

}

const deposit = async (pk = PRIVATE_KEY, amount = '40000000000') => {
    log('---1. begin deposit---')
    const res = shell.exec(`cd /code/godwoken-examples/packages/demo && \
    ts-node-dev ./src/cli/deposit.ts -p ${pk} -m ${amount} -r http://ckb:8114`).stdout;

    // log(`deposit res`, res);
    await sleep(120)
}

const createCreatorAccount = async (pk = PRIVATE_KEY, rollupTypeHash: string, fromId: string) => {
    log('---2. createCreatorAccount---')
    const res = shell.exec(`cd /code/godwoken-examples/packages/tools && \
    ts-node-dev ./src/polyjuice-cli.ts createCreatorAccount ${fromId} 0x0000000000000000000000000000000000000000000000000000000000000000 ${rollupTypeHash} ${pk}`).stdout
    // log(`createCreatorAccount res`, res);
    await sleep(120)
}

const sleep = async (seconds: number) => {
    log(`sleep for ${seconds}s`)
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

const deploy = async (fromId: string, calldata: string) => {
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts deploy ${fromId} ${calldata} \
    0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc`
    const res = shell.exec(str).stdout;
    await sleep(120)
}

const callGet = async (contractAccountId: string) => {
    log('---4. callGet---')
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts staticCall ${contractAccountId} 0x6d4ce63c 0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc
    `
    const res = shell.exec(str).stdout;
}

const callSet = async (contractAccountId: string) => {
    log('---5. callSet---')
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts call ${contractAccountId} 0x60fe47b10000000000000000000000000000000000000000000000000000000000000d10 0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc
    `
    const res = shell.exec(str).stdout;
    await sleep(100)
}

main().then(() => {
    console.log('---complete demo---');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
})
