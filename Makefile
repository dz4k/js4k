ESBUILD_ARGS := --target=esnext --format=esm

COMPONENTS := dist/croc.js dist/onwhatever.js dist/soiree.js dist/instyle.js dist/murph.js
LIBRARIES := dist/js4k.js $(COMPONENTS)
ALL := $(foreach l,$(LIBRARIES),$(l) $(l:.js=.min.js) $(l:.js=.bundle.js) $(l:.js=.bundle.min.js) $(l:.js=.min.js.br) $(l:.js=.bundle.min.js.br))

all:     $(ALL)
metrics: $(ALL)
	du -b $^
clean:
	rm -rf dist
test:
	(trap 'kill 0' SIGINT; \
	python3 -m http.server 8080 & \
	xdg-open http://localhost:8080/test/ & \
	wait)

###

dist:
	mkdir -p $@

.EXTRA_PREREQS = dist
dist/js4k.js: $(COMPONENTS:dist=lib)
	echo '$(foreach l,$^,export * from "./$(l)";)' \
	| esbuild $(ESBUILD_ARGS) --bundle --outfile=$@

$(COMPONENTS): dist/%.js: lib/%.js
	cp $^ $@

dist/%.bundle.js: lib/%.js
	esbuild $(ESBUILD_ARGS) --bundle --outfile=$@ $^

dist/%.min.js:            dist/%.js
	esbuild $(ESBUILD_ARGS) --minify --outfile=$@ $^

dist/%.min.js.br:         dist/%.min.js
	brotli -f $^ > $@

dist/js4k.bundle.js: dist/js4k.js
	cp $^ $@

.PHONY: all metrics clean test
