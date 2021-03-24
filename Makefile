build-docker:
	cd docker && docker build -t godwoken:dev .

install:
	git submodule update --init --recursive
	cd godwoken/c && make all-via-docker