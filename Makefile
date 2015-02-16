REPORTER = spec

test-gengo:
		@./node_modules/.bin/mocha \
			--reporter $(REPORTER) \
			--ui gengo \
			tests/*.js

test-all: test-gengo

.PHONY: test-all