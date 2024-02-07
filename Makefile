
all: dist/js4k.js dist/croc.js dist/onwhatever.js dist/soiree.js \
  dist/js4k.min.js dist/croc.min.js dist/onwhatever.min.js dist/soiree.min.js \
  dist/js4k.min.js.br dist/croc.min.js.br dist/onwhatever.min.js.br dist/soiree.min.js.br

dist/%.js:
	mkdir -p dist
	cat $^ > $@

dist/js4k.js: lib/croc.js lib/onwhatever-croc.js lib/soiree-croc.js
dist/croc.js: lib/croc.js
dist/onwhatever.js: lib/onwhatever.js
dist/soiree.js: lib/soiree.js

dist/%.min.js: dist/%.js
	mkdir -p dist
	swc -o $@ $^

dist/js4k.min.js: dist/js4k.js
dist/croc.min.js: dist/croc.js
dist/onwhatever.min.js: dist/onwhatever.js
dist/soiree.min.js: dist/soiree.js

dist/%.min.js.br: dist/%.min.js
	brotli -f $^ > $@

dist/js4k.min.js.br: dist/js4k.min.js
dist/croc.min.js.br: dist/croc.min.js
dist/onwhatever.min.js.br: dist/onwhatever.min.js
dist/soiree.min.js.br: dist/soiree.min.js

.PHONY: all metrics clean

metrics: all
	wc --bytes dist/*

clean:
	rm -rf dist/*
