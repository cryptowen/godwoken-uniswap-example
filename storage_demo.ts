import {fullAddressInfoWithData} from "./lumos/packages/helpers/tests/addresses";

const shell = require('shelljs');

const LUMOS_CONFIG_FILE='/code/config/lumos-config.json';
const PRIVATE_KEY = '0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc';
const log = console.log.bind(console)

const main = async () => {
    log('---begin demo---');
    // await deposit();
    // await createCreatorAccount(PRIVATE_KEY, '0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655', '2');
    // await deploy('4');
    await callGet('5');
    await callSet('5');
    await callGet('5');
}

const deposit = async (pk = PRIVATE_KEY, amount = '40000000000') => {
    log('---1. begin deposit---')
    const res = shell.exec(`cd /code/godwoken-examples/packages/demo && \
    ts-node-dev ./src/cli/deposit.ts -p ${pk} -m ${amount} -r http://ckb:8114`).stdout;

    // log(`deposit res`, res);
    await sleep(70)
}

const createCreatorAccount = async (pk = PRIVATE_KEY, rollupTypeHash: string, fromId: string) => {
    log('---2. createCreatorAccount---')
    const res = shell.exec(`cd /code/godwoken-examples/packages/tools && \
    ts-node-dev ./src/polyjuice-cli.ts createCreatorAccount ${fromId} 0x0000000000000000000000000000000000000000000000000000000000000000 ${rollupTypeHash} ${pk}`).stdout
    // log(`createCreatorAccount res`, res);
    await sleep(70)
}

const sleep = async (seconds: number) => {
    log(`sleep for ${seconds}s`)
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

const deploy = async (fromId: string) => {
    log('---3. deploy---')
    const str = `cd /code/godwoken-examples/packages/tools &&  \
    ts-node-dev ./src/polyjuice-cli.ts deploy ${fromId} 0x60806040525b607b60006000508190909055505b610018565b60db806100266000396000f3fe60806040526004361060295760003560e01c806360fe47b114602f5780636d4ce63c14605b576029565b60006000fd5b60596004803603602081101560445760006000fd5b81019080803590602001909291905050506084565b005b34801560675760006000fd5b50606e6094565b6040518082815260200191505060405180910390f35b8060006000508190909055505b50565b6000600060005054905060a2565b9056fea2646970667358221220044daf4e34adffc61c3bb9e8f40061731972d32db5b8c2bc975123da9e988c3e64736f6c63430006060033 \
    0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655 0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc`

    const res = shell.exec(str).stdout;
    await sleep(140)
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
