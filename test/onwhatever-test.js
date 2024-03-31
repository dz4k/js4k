describe("onwhatever", () => {
  it("adds simple event listener", () => {
    sandbox.innerHTML = `
      <button id="btn" on-click="window.success=true">Click me</button>`
    const [a] = sandbox.children
    a.click()
    window.success.should.be.true
    delete window.success
  })

  it("doesn't override built in event listener attributes", () => {
    sandbox.innerHTML = `
      <button id="btn"
        onclick="window.success ??= 0; window.success++">Click me</button>`
    const [a] = sandbox.children
    a.click()
    window.success.should.equal(1)
    delete window.success
  })

  it("dispatches init event", () => {
    sandbox.innerHTML = `
      <button id="btn" on-init="window.success=true">Click me</button>`
    const [a] = sandbox.children
    window.success.should.be.true
    delete window.success
  })

  it("passes event to listener", () => {
    sandbox.innerHTML = `
      <button id="btn" on-click="window.success=event">Click me</button>`
    const [a] = sandbox.children
    a.click()
    window.success.should.be.instanceOf(Event)
    window.success.type.should.equal("click")
    delete window.success
  })
})
