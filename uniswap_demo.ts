// import { ckbUrl } from 'godwoken-uniswap-example/godwoken-examples/packages/demo/src/js/url';

async function main() {
    console.log('hello');
    // deploy
    // console.log({ ckbUrl });
}

main().then(() => {
    console.log('---complete demo---');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
})