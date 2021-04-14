#!/bin/bash

set -o errexit
set -o xtrace
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# setup database
cd ${PROJECT_DIR}/lumos
git checkout v0.14.2-rc6
yarn
cd packages/sql-indexer
cat << EOF > knexfile.js
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'postgres',
      database: 'lumos',
      user:     'user',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
EOF
npx knex migrate:up

# # install tools
yarn global add ts-node-dev typescript

# build godwoken
cd ${PROJECT_DIR}/godwoken
cargo install moleculec --version 0.6.1
cargo build

cd packages/godwoken
yarn global add neon-cli
neon build
cd ../../

yarn
yarn workspace @ckb-godwoken/base tsc
yarn workspace @ckb-godwoken/tools tsc


# deploy
export TOP=${PROJECT_DIR}/config
export LUMOS_CONFIG_FILE=${PROJECT_DIR}/config/lumos-config.json
export PRIVKEY=0xa800c82df5461756ae99b5c6677d019c98cc98c7786b80d7b2e77256e46ea1fe
ts-node-dev ./packages/tools/src/deploy_scripts.ts -r http://ckb:8114 --private-key ${PRIVKEY} -f $TOP/deployment.json -o $TOP/deployment-results.json -s postgresql://user:password@postgres:5432/lumos
ts-node-dev ./packages/tools/src/deploy_genesis.ts -r http://ckb:8114 --private-key ${PRIVKEY} -d $TOP/deployment-results.json -c $TOP/godwoken_config.json -o $TOP/runner_config.json -s "postgresql://user:password@postgres:5432/lumos"

# start godwoken
ts-node-dev ./packages/runner/src/index.ts --private-key ${PRIVKEY} -c $TOP/runner_config.json -s "postgresql://user:password@postgres:5432/lumos"
