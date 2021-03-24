const shell = require('shelljs');

const LUMOS_CONFIG_FILE='/code/config/lumos-config.json';
const PRIVATE_KEY = '0xa6b023fec4fc492c23c0e999ab03b01a6ca5524a3560725887a8de4362f9c9cc';

async function main() {
    console.log('hello');
    deposit();
    createCreatorAccount(PRIVATE_KEY, '0x9346b517fd137a58d8e266ed7cbb27ba4f693bc792118c2744c3b30b1fcdd655', '2');
}

function deposit(pk = PRIVATE_KEY, amount = '40000000000') {
    const res = shell.exec(`cd /code/godwoken-examples/packages/demo && ts-node-dev ./src/cli/deposit.ts -p ${pk} -m ${amount} -r http://ckb:8114`).stdout;
    // console.log(res);
}

function createCreatorAccount(pk = PRIVATE_KEY, rollupTypeHash: string, fromId: string) {
    shell.exec(`cd /code/godwoken-examples/packages/tools && ts-node-dev ./src/polyjuice-cli.ts createCreatorAccount ${fromId} 0x0000000000000000000000000000000000000000000000000000000000000000 ${rollupTypeHash} ${pk}`)
}


main().then(() => {
    console.log('---complete demo---');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
})