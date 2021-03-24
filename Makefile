build-docker:
	cd docker && docker build -t huwenchao/godwoken:dev .

install:
	git submodule update --init --recursive
	cargo install moleculec --version 0.6.1
	cd godwoken/c && make all-via-docker

init-uniswap-demo:
	cp config/runner_config.json godwoken-examples/packages/demo/src/configs/runner_config.json
	cp godwoken-examples/packages/demo/src/configs/config.json.sample godwoken-examples/packages/demo/src/configs/config.json
	cd godwoken-examples && yarn && yarn workspace @godwoken-examples/godwoken tsc

