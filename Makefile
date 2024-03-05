
COMPONENTS := dist/croc.js dist/onwhatever.js dist/soiree.js
LIBRARIES := dist/js4k.js $(COMPONENTS)
ALL := $(foreach l,$(LIBRARIES),$(l) $(l:.js=.min.js) $(l:.js=.min.js.br))

all:     $(ALL)
metrics: $(ALL)
	du -bh $^
clean:
	rm -rf dist

###

dist:
	mkdir -p $@
dist/%.js:
	cat $^ > $@
dist/%.min.js:    dist/%.js
	swc -o $@ $^ >&-
dist/%.min.js.br: dist/%.min.js
	brotli -f $^ > $@

.EXTRA_PREREQS = dist
dist/js4k.js: lib/croc.js lib/onwhatever-croc.js lib/soiree.js
$(COMPONENTS): dist/%.js: lib/%.js

.PHONY: all metrics clean
