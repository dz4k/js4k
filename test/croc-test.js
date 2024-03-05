describe('croc', () => {
  describe('$', () => {
    it('finds simple tags', () => {
      $('body').should.equal(document.body)
    })

    it('finds elements via a class', () => {
      sandbox.innerHTML = html`<div class=foo></div>`
      const [a] = sandbox.children
      $('.foo').should.equal(a)
    })

    it('finds elements via an id', () => {
      sandbox.innerHTML = html`<div id=foo></div>`
      const [a] = sandbox.children
      $('#foo').should.equal(a)
    })

    it('supports complex selectors', () => {
      sandbox.innerHTML = html`
        <div class=foo id=foo></div>
        <div></div>
      `
      const [, b] = sandbox.children
      $('#foo + :not(.foo)').should.equal(b)
    })

    it('finds the first matching element', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div class=foo></div>
      `
      const [a] = sandbox.children
      $('.foo').should.equal(a)
    })

    it('finds elements within a scope', () => {
      sandbox.innerHTML = html`
        <div class=a>
          <div class=foo></div>
        </div>
      `
      const [a] = sandbox.children, [b] = a.children
      $('.foo', a).should.equal(b)
    })

    it('returns null if no elements match', () => {
      should.not.exist($('.foo'))
    })
  })

  describe('$$', () => {
    it('finds simple tags', () => {
      const result = $$('body')
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(document.body)
    })

    it('finds elements via a class', () => {
      sandbox.innerHTML = html`<div class=foo></div>`
      const [a] = sandbox.children
      const result = $$('.foo')
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(a)
    })

    it('finds elements via an id', () => {
      sandbox.innerHTML = html`<div id=foo></div>`
      const [a] = sandbox.children
      const result = $$('#foo')
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(a)
    })

    it('supports complex selectors', () => {
      sandbox.innerHTML = html`
        <div class=foo id=foo></div>
        <div></div>
      `
      const [, b] = sandbox.children
      const result = $$('#foo + :not(.foo)')
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(b)
    })

    it('finds all matching elements', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div class=foo></div>
      `
      const [a, b] = sandbox.children
      const result = $$('.foo')
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(2)
      result.should.have.members([a, b])
    })

    it('finds elements within a scope', () => {
      sandbox.innerHTML = html`
        <div class=foo>
          <div class=foo></div>
        </div>
      `
      const [a] = sandbox.children, [b] = a.children
      const result = $$('.foo', a)
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(b)
    })

    it('returns an empty array if no elements match', () => {
      $$('.foo').should.deep.equal([])
    })

    it('returns elements in document order', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div class=foo></div>
      `
      const [a, b] = sandbox.children
      const result = $$('.foo')
      result.should.deep.equal([a, b])
    })
  })

  describe('$x', () => {
    it('returns an element', () => {
      $x('//body').should.be.an.instanceOf(HTMLBodyElement)
    })

    it('finds simple tags', () => {
      $x('//body').should.equal(document.body)
    })

    it('finds elements within a scope', () => {
      sandbox.innerHTML = html`
        <div>
          <div class=foo></div>
        </div>
      `
      const [a] = sandbox.children, [b] = a.children

      $x('.//div[@class="foo"]', a).should.equal(b)
    })

    it('supports xpath navigation', () => {
      sandbox.innerHTML = html`<div class=foo></div>`
      const [a] = sandbox.children
      $x('//html/body//div[@class="foo"]', sandbox).should.equal(a)
    })

    it('returns null if no elements match', () => {
      should.not.exist($x('//div[@class="foo"]'))
    })

    it('returns the first matching element', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div class=foo></div>
      `
      const [a] = sandbox.children
      $x('.//div', sandbox).should.equal(a)
    })
  })

  describe('$$x', () => {
    it('finds simple tags', () => {
      const result = $$x('//body')
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(document.body)
    })

    it('finds elements within a scope', () => {
      sandbox.innerHTML = html`
        <div>
          <div class=foo></div>
        </div>
      `
      const [a] = sandbox.children, [b] = a.children

      const result = $$x('.//div', a)
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(b)
    })

    it('supports xpath navigation', () => {
      const a = document.createElement('div')
      a.className = 'foo'
      sandbox.append(a)
      const result = $$x('.//div', sandbox)
      result.should.be.an.instanceOf(Array)
      result.should.have.a.lengthOf(1)
      result[0].should.equal(a)
    })

    it('returns an empty array if no elements match', () => {
      $$x('.//div[@class="foo"]', sandbox).should.be.an('array').that.is.empty
    })

    it('returns elements in document order', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div class=foo></div>
      `
      const [a, b] = sandbox.children
      const result = $$x('.//div', sandbox)
      result.should.deep.equal([a, b])
    })
  })

  describe('on', () => {
    it('adds an event listener', () => {
      let passed = false
      const el = document.createElement('div')
      on(el, 'click', () => passed = true)
      el.click()
      passed.should.be.true
    })

    it('supports options', () => {
      let passed = false
      const el = document.createElement('div')
      on(el, 'click', () => passed = true, { capture: true })
      el.click()
      passed.should.be.true
    })
  })

  describe('dispatch', () => {
    it('dispatches a custom event', () => {
      const el = document.createElement('div')
      let passed = false
      const f = () => passed = true
      el.addEventListener('foo', f)
      dispatch(el, 'foo')
      passed.should.be.true
    })

    it('supports options', () => {
      const el = document.createElement('div')
      let passed = true
      const f = () => passed = false
      const el2 = document.createElement('div')
      el.append(el2)
      el.addEventListener('foo', f)
      dispatch(el2, 'foo', { bubbles: false })
      passed.should.be.true
    })
  })

  describe('htmlEscape', () => {
    it('escapes HTML special characters', () => {
      htmlEscape('<div>').should.equal('&#60;div&#62;')
    })

    it('will double escape if so instructed', () => {
      htmlEscape('&lt;div&gt;').should.equal('&#38;lt;div&#38;gt;')
    })

    it('dpes not escape trusted HTML', () => {
      const trusted = html`<div>`
      htmlEscape(trusted).should.equal('<div>')
    })

    it('can cope with non-string input', () => {
      htmlEscape(42).should.equal('42')
      htmlEscape(null).should.equal('null')
      htmlEscape(undefined).should.equal('undefined')
      htmlEscape({}).should.equal('[object Object]')
      htmlEscape([]).should.equal('')
      const customStringify = { toString() { return '42' } }
      htmlEscape(customStringify).should.equal('42')
    })
  })

  describe('html', () => {
    it('returns a string or when used as a template', () => {
      const trusted = html`<div>`
      trusted.should.equal('<div>')
    })

    it('should escape HTML special characters in interpolations', () => {
      const value = '<script>alert("pwnd")</script>'
      html`<div>${value}</div>`.should.equal(
        '<div>&#60;script&#62;alert(&#34;pwnd&#34;)&#60;/script&#62;</div>')
    })

    it('escapes the standard set of HTML special characters', () => {
      html`${'&<>"\''}`.should.equal('&#38;&#60;&#62;&#34;&#39;')
    })

    it('should not escape trusted strings', () => {
      const trusted = html`<script src='invasive-analytics.js'></script>`
      html`<div>${trusted}</div>`.should.equal(
        '<div><script src=\'invasive-analytics.js\'></script></div>')
    })

    it('marks strings as trusted HTML when used as plain function', () => {
      const trusted = html('<div>')
      trusted.toString().should.equal('<div>')
      const interpolated = html`<section>${trusted}</section>`
      interpolated.should.equal('<section><div></section>')
    })

    it('can cope with non-string input', () => {
      html(42).should.equal('42')
      html(null).should.equal('null')
      html(undefined).should.equal('undefined')
      html({}).should.equal('[object Object]')
      html([]).should.equal('')
      const customStringify = { toString() { return '42' } }
      html(customStringify).should.equal('42')
    })

    it('can cope with non-string input in interpolations', () => {
      html`${42}`.should.equal('42')
      html`${null}`.should.equal('null')
      html`${undefined}`.should.equal('undefined')
      html`${{}}`.should.equal('[object Object]')
      html`${[]}`.should.equal('')
      const customStringify = { toString() { return '42' } }
      html`${customStringify}`.should.equal('42')
    })
  })

  describe('h', () => {
    it('creates an element', () => {
      const el = h('div')
      el.should.be.an.instanceOf(HTMLDivElement)
    })

    it('creates an element with attributes', () => {
      const el = h('div', { id: 'foo' })
      el.should.be.an.instanceOf(HTMLDivElement)
      el.id.should.equal('foo')
    })

    it('creates an element with children', () => {
      const el = h('div', h('span', 'hello'))
      el.should.be.an.instanceOf(HTMLDivElement)
      el.children[0].should.be.an.instanceOf(HTMLSpanElement)
      el.children[0].textContent.should.equal('hello')
    })

    it('creates an element with children and attributes', () => {
      const el = h('div', { id: 'foo' }, h('span', 'hello'))
      el.should.be.an.instanceOf(HTMLDivElement)
      el.id.should.equal('foo')
      el.children[0].should.be.an.instanceOf(HTMLSpanElement)
      el.children[0].textContent.should.equal('hello')
    })

    it('can update an existing element', () => {
      const el = document.createElement('div')
      h(el, { id: 'foo' }, h('span', 'hello'))
      el.id.should.equal('foo')
      el.children[0].should.be.an.instanceOf(HTMLSpanElement)
      el.children[0].textContent.should.equal('hello')
    })
  })

  describe('css', () => {
    it('creates a CSSStyleSheet', () => {
      const sheet = css`body { color: red; }`
      sheet.should.be.an.instanceOf(CSSStyleSheet)
      sheet.cssRules[0].cssText.should.equal('body { color: red; }')
    })

    it('creates a CSSStyleSheet with interpolations', () => {
      const sheet = css`body { color: ${'red'}; }`
      sheet.should.be.an.instanceOf(CSSStyleSheet)
      sheet.cssRules[0].cssText.should.equal('body { color: red; }')
    })
  })

  describe('next', () => {
    it('gets the next element matching a selector', () => {
      sandbox.innerHTML = html`
        <div></div>
        <div class=foo></div>
      `
      const [a, b] = sandbox.children
      next('.foo', { from: a }).should.equal(b)
    })

    it('gets the next element matching a selector from the root', () => {
      sandbox.innerHTML = html`
        <div></div>
        <div class=foo></div>
      `
      const [a, b] = sandbox.children
      next('.foo', { root: sandbox }).should.equal(b)
    })

    it('gets the next element matching a selector with wrapping', () => {
      sandbox.innerHTML = html`
        <div></div>
        <div class=foo></div>
      `
      const [a, b] = sandbox.children
      next('.foo', { from: a, wrap: true }).should.equal(b)
    })

    it('gets the next element matching a selector without wrapping', () => {
      sandbox.innerHTML = html`
        <div></div>
        <div class=foo></div>
      `
      const [a, b] = sandbox.children
      should.not.exist(next('.foo', { from: a, wrap: false }))
    })

    it('returns null if no elements match', () => {
      should.not.exist(next('.foo'))
    })
  })

  describe('prev', () => {
    it('gets the previous element matching a selector', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div></div>
      `
      const [a, b] = sandbox.children
      prev('.foo', { from: b }).should.equal(a)
    })

    it('gets the previous element matching a selector from the root', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div></div>
      `
      const [a, b] = sandbox.children
      prev('.foo', { root: sandbox }).should.equal(a)
    })

    it('gets the previous element matching a selector with wrapping', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div></div>
      `
      const [a, b] = sandbox.children
      prev('.foo', { from: b, wrap: true }).should.equal(a)
    })

    it('gets the previous element matching a selector without wrapping', () => {
      sandbox.innerHTML = html`
        <div class=foo></div>
        <div></div>
      `
      const [a, b] = sandbox.children
      should.not.exist(prev('.foo', { from: b, wrap: false }))
    })

    it('returns null if no elements match', () => {
      should.not.exist(prev('.foo'))
    })
  })
})
