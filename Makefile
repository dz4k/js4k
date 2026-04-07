
COMPONENTS := dist/croc.js dist/onwhatever.js dist/soiree.js dist/instyle.js dist/murph.js
LIBRARIES := dist/js4k.js $(COMPONENTS)
ALL := $(foreach l,$(LIBRARIES),$(l) $(l:.js=.min.js) $(l:.js=.min.js.br))

all:     $(ALL)
metrics: $(ALL)
	du -bh $^
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
dist/%.min.js:    dist/%.js
	esbuild $^ --minify --bundle --target=esnext --outfile=$@
dist/%.min.js.br: dist/%.min.js
	brotli -f $^ > $@

.EXTRA_PREREQS = dist
dist/js4k.js: lib/croc.js lib/onwhatever-croc.js lib/soiree.js lib/instyle.js lib/murph.js
	echo '$(foreach l,$^,export * from "./$(l)";)' \
	| esbuild --bundle --target=esnext --format=esm --outfile=$@

$(COMPONENTS): dist/%.js: lib/%.js
	cat $^ > $@

.PHONY: all metrics clean test
