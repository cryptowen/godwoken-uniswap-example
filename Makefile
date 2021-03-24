build-docker:
	cd docker && docker build -t huwenchao/godwoken:dev .

install:
	git submodule update --init --recursive
	cargo install moleculec --version 0.6.1
	cd godwoken/c && make all-via-docker
