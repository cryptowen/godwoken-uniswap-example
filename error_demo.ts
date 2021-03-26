import {fullAddressInfoWithData} from "./lumos/packages/helpers/tests/addresses";
import calldataVec from "./error-permission.calldata.json";
const shell = require('shelljs');
const PRIVATE_KEY = '0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc';
const log = console.log.bind(console)


const main = async () => {
    log('\r\n---begin uniswap demo---');
    await deposit();  // deposit to account id 2
    // creator account id == 4
    await createCreatorAccount(PRIVATE_KEY, '0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655', '2');


    let index

    // 1. deploy usdt
    index = 0
    log(`\r\n${index}. deploy ${calldataVec[index].name}`)
    await deploy('4', calldataVec[index].calldata);

    // 2. deploy demo
    index = 1
    log(`\r\n${index}. deploy ${calldataVec[index].name}`)
    await deploy('4', calldataVec[index].calldata);

    // 3. user approve demo, MockUSDT, MaxUint256
    index = 2
    log(`\r\n${index}. ${calldataVec[index].name}`)
    await callSet(`${calldataVec[index].targetAccountId}`, calldataVec[index].calldata)

    // 4. call demo testTransferFrom
    index = 3
    log(`\r\n${index}. ${calldataVec[index].name}`)
    await callSet(`${calldataVec[index].targetAccountId}`, calldataVec[index].calldata)

    // 5. " direct transferFrom, user1 -> demo  998", expect error
    index = 4
    log(`\r\n${index}. ${calldataVec[index].name}`)
    await callSet(`${calldataVec[index].targetAccountId}`, calldataVec[index].calldata)

    // 6. " direct transferFrom, user1 -> demo  998", expect error
    index = 5
    log(`\r\n${index}. ${calldataVec[index].name}`)
    await callSet(`${calldataVec[index].targetAccountId}`, calldataVec[index].calldata)


    // // 5. balanceOf
    index++
    log(`\r\n${index}. ${calldataVec[index].name}`)
    await callGet(`${calldataVec[index].targetAccountId}`, calldataVec[index].calldata)

    // // 6. balanceOf
    index++
    log(`\r\n${index}. ${calldataVec[index].name}`)
    await callGet(`${calldataVec[index].targetAccountId}`, calldataVec[index].calldata)
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

const callGet = async (contractAccountId: string, calldata: string) => {
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts staticCall ${contractAccountId} ${calldata} 0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc
    `
    const res = shell.exec(str).stdout;
}

const callSet = async (contractAccountId: string, calldata: string) => {
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts call ${contractAccountId} ${calldata} 0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc
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
