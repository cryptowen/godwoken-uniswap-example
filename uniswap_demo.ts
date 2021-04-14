import {fullAddressInfoWithData} from "./lumos/packages/helpers/tests/addresses";
import calldataVec from "./1.calldata.json";


const shell = require('shelljs');

const LUMOS_CONFIG_FILE='/code/config/lumos-config.json';
const PRIVATE_KEY = '0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc';
const log = console.log.bind(console)
const rollupTypeHash = '0x40f696276b9013d94076535460723f7b4e3dc66c74b75a123d4c11b8563e7ccb'


const main = async () => {
    log('\r\n---begin uniswap demo---');
    await deposit();
    await createCreatorAccount(PRIVATE_KEY, rollupTypeHash, '2');

    // // 1. WETH  -> account id : 5
    log(`\r\n1. deploy ${calldataVec[0].name}`)
    await deploy('4', calldataVec[0].calldata);
    //
    // // 2. Factory  -> account id : 6
    log(`\r\n2. deploy ${calldataVec[1].name}`)
    await deploy('4', calldataVec[1].calldata);
    //
    // // 3. Router  -> account id : 7
    log(`\r\n3. deploy ${calldataVec[2].name}`)
    await deploy('4', calldataVec[2].calldata);

    // 4. MockUsdt  -> account id : 8
    log(`\r\n4. deploy ${calldataVec[3].name}`)
    await deploy('4', calldataVec[3].calldata);

    // 5. MockBTC -> account id: 9
    log(`\r\n5. deploy ${calldataVec[4].name}`)
    await deploy('4', calldataVec[4].calldata);

    // 6.
    log(`\r\n6. ${calldataVec[5].name}`)
    await callSet('9', calldataVec[5].calldata)

    // 7.
    log(`\r\n7. ${calldataVec[6].name}`)
    await callSet('8', calldataVec[6].calldata)

    // 8.
    log(`\r\n8. ${calldataVec[7].name}`)
    await callSet('7', calldataVec[7].calldata)

    // 9.
    log(`\r\n9. ${calldataVec[9].name}`)
    await callSet('8', calldataVec[9].calldata)

    // 10.
    log(`\r\n10. ${calldataVec[10].name}`)
    await callSet('8', calldataVec[10].calldata)

    // balanceOf
    log(`\r\n11. ${calldataVec[11].name}`)
    await callGet('8', calldataVec[11].calldata)

    // balanceOf
    log(`\r\n11. ${calldataVec[12].name}`)
    await callGet('8', calldataVec[12].calldata)
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

// const deploy = async (fromId: string, calldata: string) => {
//     const str = `cd /code/godwoken-examples/packages/tools &&  \
//     ts-node-dev ./src/polyjuice-cli.ts deploy ${fromId} ${calldata} \
//     0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc`
//     const res = shell.exec(str).stdout;
//     await sleep(120)
// }
//
// const callGet = async (contractAccountId: string, calldata: string) => {
//     const str = `cd /code/godwoken-examples/packages/tools &&  \
//     ts-node-dev ./src/polyjuice-cli.ts staticCall ${contractAccountId} ${calldata} 0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc
//     `
//     const res = shell.exec(str).stdout;
// }
//
// const callSet = async (contractAccountId: string, calldata: string) => {
//     const str = `cd /code/godwoken-examples/packages/tools &&  \
//     ts-node-dev ./src/polyjuice-cli.ts call ${contractAccountId} ${calldata} 0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc
//     `
//     const res = shell.exec(str).stdout;
//     await sleep(100)
// }


const deploy = async (creatorId: string, calldata: string) => {
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts deploy ${creatorId} 2000000 0 ${calldata} \
    ${rollupTypeHash} ${PRIVATE_KEY}`
    const res = shell.exec(str).stdout;
    await sleep(120)
}

const callGet = async (contractAccountId: string, calldata: string) => {
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts staticCall ${contractAccountId} 2000000 0 ${calldata} ${rollupTypeHash} ${PRIVATE_KEY}
    `
    const res = shell.exec(str).stdout;
}

const callSet = async (contractAccountId: string, calldata: string) => {
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts call ${contractAccountId} 2000000 0 ${calldata} ${rollupTypeHash} ${PRIVATE_KEY}
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
