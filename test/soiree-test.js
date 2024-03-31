/**
 * Run the function {@linkcode f} with a mocked fetch function that returns the
 * response from {@linkcode fakeFetch} when called.
 * 
 * @param {(req: Request) => Response} fakeFetch 
 * @param {() => void} f 
 */
const mockFetch = (fakeFetch, f) => {
  window.fetch = (...args) => {
    const req = args[0] instanceof Request ? args[0] : new Request(...args)
    console.log("%cmockFetch", "color: #0a0", "args:", args, "req:", req)
    return Promise.resolve(fakeFetch(req))
  }
  f();
  window.fetch = undefined;
}

const nextEvent = (target, name) => new Promise(resolve =>
  target.addEventListener(name, resolve, { once: true }))

describe("soiree", () => {
  it("performs request on link click", () => {
    let requested = false
    sandbox.innerHTML = `<a rel=swap href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch((req) => {
      requested = true
      new URL(req.url).pathname.should.equal("/info")
      return new Response("info")
    }, () => a.click())
    requested.should.be.true
  })

  it("performs request on form submit", () => {
    let requested = false
    sandbox.innerHTML = `<form rel=swap action=/add method=GET>
      <input name=foo value=bar>
    </form>`
    const [form] = sandbox.children
    mockFetch((req) => {
      requested = true
      req.method.should.equal("POST")
      new URL(req.url).pathname.should.equal("/add")
      new URL(req.url).searchParams.get("foo").should.equal("bar")
      return new Response("added")
    }, () => form.requestSubmit())
    requested.should.be.true
  })

  it("sends Soiree header", () => {
    sandbox.innerHTML = `<a rel=swap href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch((req) => {
      req.headers.get("soiree").should.equal("1")
      return new Response("info")
    }, () => a.click())
  })

  it("swaps response into target element", async () => {
    sandbox.innerHTML = `<a rel=swap href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    a.textContent.should.equal("info")
  })

  it("can target other elements with `target` attribute", async () => {
    sandbox.innerHTML = `<a rel=swap href=/info target=info-section>link</a>
      <div id=info-section></div>`
    const [a, target] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    target.textContent.should.equal("info")
  })

  it("can target other elements with `data-target` attribute", async () => {
    sandbox.innerHTML = `<a rel=swap href=/info data-target=#info-section>link</a>
      <div id=info-section></div>`
    const [a, target] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    target.textContent.should.equal("info")
  })

  it("can swap with `replaceChildren`", async () => {
    sandbox.innerHTML = `<a rel=swap-replaceChildren href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    a.textContent.should.equal("info")
  })

  it("can swap with `replaceWith`", async () => {
    sandbox.innerHTML = `<a rel=swap-replaceWith href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    sandbox.innerHTML.should.equal("info")
  })

  it("can swap with `after`", async () => {
    sandbox.innerHTML = `<a rel=swap-after href=/info>link</a>
      <div class=item></div>`
    const [a] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    a.nextSibling.should.be.instanceOf(Text)
    a.nextSibling.data.should.equal("info")
  })

  it("can swap with `before`", async () => {
    sandbox.innerHTML = `<a rel=swap-before href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    a.previousSibling.should.be.instanceOf(Text)
    a.previousSibling.data.should.equal("info")
  })

  it("can swap with `prepend`", async () => {
    sandbox.innerHTML = `<a rel=swap-prepend href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    a.textContent.should.equal("infolink")
  })

  it("can swap with `append`", async () => {
    sandbox.innerHTML = `<a rel=swap-append href=/info>link</a>
      <div class=item></div>`
    const [a] = sandbox.children
    mockFetch(() => new Response("info"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    a.textContent.should.equal("linkinfo")
  })

  it("swaps HTML", async () => {
    sandbox.innerHTML = `<a rel=swap href=/info>link</a>`
    const [a] = sandbox.children
    mockFetch(() => new Response("<b>info</b>"), () => a.click())
    await nextEvent(a, "soiree-swapped")
    a.firstChild.should.be.instanceOf(HTMLElement)
    a.innerHTML.should.equal("<b>info</b>")
  })
})
