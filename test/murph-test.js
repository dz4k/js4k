import { morph } from '../lib/murph.js'

describe('murph', () => {
  it('morphs text nodes', () => {
    sandbox.innerHTML = `<p>hello</p><p>world</p>`
    let [p1, p2] = sandbox.children
    morph(p1, p2)
    p1.innerHTML.should.equal('world')
  })
  
  it('adds elements', () => {
    sandbox.innerHTML = `<p>hello</p><p>hello<br></p>`
    let [p1, p2] = sandbox.children
    morph(p1, p2)
    p1.innerHTML.should.equal('hello<br>')
  })
  
  it('removes elements', () => {
    sandbox.innerHTML = `<p>hello<br></p><p>hello</p>`
    let [p1, p2] = sandbox.children
    morph(p1, p2)
    p1.innerHTML.should.equal('hello')
  })
  
  it('adds attributes', () => {
  sandbox.innerHTML = `<p>hello</p><p class=blue>hello</p>`
    let [p1, p2] = sandbox.children
    morph(p1, p2)
    p1.hasAttribute('class').should.be.true
    p1.className.should.equal('blue')
  })
  
  it('removes attributes', () => {
    sandbox.innerHTML = `<p class=red>hello</p><p>hello</p>`
    let [p1, p2] = sandbox.children
    morph(p1, p2)
    p1.hasAttribute('class').should.not.be.true
  })
  
  it('updates attributes', () => {
  sandbox.innerHTML = `<p class=red>hello</p><p class=blue>hello</p>`
    let [p1, p2] = sandbox.children
    morph(p1, p2)
    p1.hasAttribute('class').should.be.true
    p1.className.should.equal('blue')
  })
  
  it('can do many different changes to attributes', () => {
    sandbox.innerHTML = `
      <p class=red onerror=1 popover>hello</p>
      <p class=blue onclick=1>hello</p>
    `
    let [p1, p2] = sandbox.children
    morph(p1, p2)
    p1.attributes.should.have.lengthOf(2)
    p1.className.should.equal('blue')
    p1.should.have.property('popover', null)
    p1.hasAttribute('onerror').should.be.false
    p1.getAttribute('onclick').should.equal('1')
  })
  
  it('can reorder elements', () => {
    sandbox.innerHTML = `
      <p><strong>hello</strong> <em>world</em></p>
      <p><em>hello</em> <strong>world</strong></p>
    `
    let [p1, p2] = sandbox.children
    let [strong, em] = p1.children
    morph(p1, p2)
    p1.innerHTML.should.equal('<em>hello</em> <strong>world</strong>')
    p1.firstChild.should.equal(em)
    p1.lastChild.should.equal(strong)
  })
  
  it('can reorder elements by id', () => {
    sandbox.innerHTML = `
      <p><strong id="hello">hello</strong> <strong id="world">world</strong></p>
      <p><strong id="world">world</strong> <strong id="hello">hello</strong></p>
    `
    let [p1, p2] = sandbox.children
    let [hello, world] = p1.children
    morph(p1, p2)
    p1.innerHTML.should.equal('<strong id="world">world</strong> <strong id="hello">hello</strong>')
    p1.firstChild.should.equal(world)
    p1.lastChild.should.equal(hello)
  })
  
  it('can reparent elements by id', () => {
    sandbox.innerHTML = `
      <p><em><strong id="hello">hello</strong></em> <strong id="world">world</strong></p>
      <p><strong id="world">world</strong> <strong id="hello">hello</strong></p>
    `
    let [p1, p2] = sandbox.children
    let [em, world] = p1.children
    let [hello] = em.children
    morph(p1, p2)
    p1.innerHTML.should.equal('<strong id="world">world</strong> <strong id="hello">hello</strong>')
    p1.firstChild.should.equal(world)
    p1.lastChild.should.equal(hello)
  })
  
  it('will not change an element\'s id', () => {
    sandbox.innerHTML = `
      <p><strong id="hello">hello</strong> <strong>world</strong></p>
      <p><strong>hello</strong> <strong>world</strong></p>
    `
    let [p1, p2] = sandbox.children
    let [hello, world] = p1.children
    morph(p1, p2)
    p1.innerHTML.should.equal('<strong>hello</strong> <strong>world</strong>')
    p1.firstChild.should.not.equal(hello)
    p1.lastChild.should.not.equal(hello).but.equal(world)
  })

  it('will not morph an element with an id into one with a different id', () => {
    sandbox.innerHTML = `<div id="a"></div><div id="b"></div>`
    let [a, b] = sandbox.children
    morph(a, b)
    sandbox.firstChild.should.not.equal(a)
    sandbox.firstChild.id.should.equal('b')
  })

  it('will not morph an element with an id into one with no id', () => {
    sandbox.innerHTML = `<div id="a"></div><div></div>`
    let [a, div] = sandbox.children
    morph(a, div)
    sandbox.firstChild.should.not.equal(a)
    sandbox.firstChild.hasAttribute('id').should.be.false
  })

  it('will not morph an element with no id into one with an id', () => {
    sandbox.innerHTML = `<div></div><div id="a"></div>`
    let [div, a] = sandbox.children
    morph(div, a)
    sandbox.firstChild.should.not.equal(div)
    sandbox.firstChild.id.should.equal('a')
  })

  it('morphs tag names while preserving children', () => {
    sandbox.innerHTML = `<div><span>hello</span></div><p><span>world</span></p>`
    let [div, p] = sandbox.children
    let span = div.firstChild
    morph(div, p)
    sandbox.firstChild.tagName.should.equal('P')
    sandbox.firstChild.firstChild.should.equal(span)
    sandbox.firstChild.firstChild.innerHTML.should.equal('world')
  })

  it('updates textarea value property', () => {
    sandbox.innerHTML = `<textarea>hello</textarea><textarea>world</textarea>`
    let [t1, t2] = sandbox.children
    morph(t1, t2)
    t1.value.should.equal('world')
  })

  it('updates select value property', () => {
    sandbox.innerHTML = `
      <select><option value="a">A</option><option value="b">B</option></select>
      <select><option value="a">A</option><option value="b" selected>B</option></select>
    `
    let [s1, s2] = sandbox.children
    morph(s1, s2)
    s1.value.should.equal('b')
  })

  it('updates checkbox checked property', () => {
    sandbox.innerHTML = `<input type="checkbox"><input type="checkbox" checked>`
    let [i1, i2] = sandbox.children
    morph(i1, i2)
    i1.checked.should.be.true
  })

  it('updates boolean attributes', () => {
    sandbox.innerHTML = `<input disabled><input>`
    let [i1, i2] = sandbox.children
    morph(i1, i2)
    i1.disabled.should.be.false
    i1.hasAttribute('disabled').should.be.false
  })

  it('handles input type changes', () => {
    sandbox.innerHTML = `
      <input type="text" value="hello">
      <input type="password" value="hello">
    `
    let [i1, i2] = sandbox.children
    morph(i1, i2)
    i1.type.should.equal('password')
    i1.value.should.equal('hello')
  })

  it('handles deep nesting with mixed ids', () => {
    sandbox.innerHTML = `
      <div id="root">
        <section>
          <div id="keep-1">One</div>
          <div class="anon">Two</div>
          <div id="keep-2">Three</div>
        </section>
      </div>
      <div id="root">
        <section>
          <div id="keep-2">Three point five</div>
          <div id="keep-1">One point five</div>
          <div class="anon">Two point five</div>
        </section>
      </div>
    `
    let [root1, root2] = sandbox.children
    let keep1 = root1.querySelector('#keep-1')
    let keep2 = root1.querySelector('#keep-2')
    morph(root1, root2)
    keep1.should.equal(root1.querySelector('#keep-1'))
    keep2.should.equal(root1.querySelector('#keep-2'))
    keep1.textContent.should.equal('One point five')
    keep2.textContent.should.equal('Three point five')
    root1.querySelector('.anon').textContent.should.equal('Two point five')
  })

  it('morphs basic svg elements', () => {
    sandbox.innerHTML = `
      <svg><circle cx="50" cy="50" r="40" fill="red" /></svg>
      <svg><circle cx="60" cy="60" r="30" fill="blue" /></svg>
    `
    let [svg1, svg2] = sandbox.children
    let circle = svg1.firstChild
    morph(svg1, svg2)
    svg1.firstChild.should.equal(circle)
    circle.getAttribute('cx').should.equal('60')
    circle.getAttribute('r').should.equal('30')
    circle.getAttribute('fill').should.equal('blue')
  })

  it('swaps two elements with ids', () => {
    const container = document.createElement('div')
    container.innerHTML = `<div id="swap-a">A</div><div id="swap-b">B</div>`
    sandbox.innerHTML = ''
    sandbox.append(container)
    let [ca, cb] = container.children
    
    const target = document.createElement('div')
    target.innerHTML = `<div id="swap-b">B</div><div id="swap-a">A</div>`
    
    morph(container, target)
    
    container.children[0].id.should.equal('swap-b')
    container.children[1].id.should.equal('swap-a')
    container.children[0].should.equal(cb)
    container.children[1].should.equal(ca)
  })

  it('preserves nested ids when parent is replaced', () => {
    sandbox.innerHTML = `<div id="parent1"><span id="child">Target</span></div>`
    let div = sandbox.firstChild
    let span = div.firstChild
    
    const section = document.createElement('section')
    section.id = 'parent1'
    section.innerHTML = `<span id="child">Target Updated</span>`
    
    morph(div, section)
    
    sandbox.firstChild.tagName.should.equal('SECTION')
    sandbox.firstChild.firstChild.should.equal(span)
    sandbox.firstChild.firstChild.textContent.should.equal('Target Updated')
  })

  it('updates input value property when attribute is different', () => {
    sandbox.innerHTML = `<input id="val-test" value="attr1">`
    let i1 = sandbox.firstChild
    i1.value = 'user-typed'
    
    const i2 = document.createElement('input')
    i2.id = 'val-test'
    i2.setAttribute('value', 'attr2')
    
    morph(i1, i2)
    
    i1.value.should.equal('attr2')
    i1.getAttribute('value').should.equal('attr2')
  })

  it('handles implicit <tbody> in tables', () => {
    sandbox.innerHTML = `<table id="table-test"><tr><td>A</td></tr></table>`
    let t1 = sandbox.firstChild
    // Browsers auto-insert <tbody>
    let tbody = t1.querySelector('tbody')
    let tr = t1.querySelector('tr')
    
    const t2 = document.createElement('table')
    t2.id = 'table-test'
    t2.innerHTML = `<tr><td>B</td></tr>`
    
    morph(t1, t2)
    
    t1.querySelector('td').textContent.should.equal('B')
    // Identity check - if browsers keep the auto-inserted tbody
    if (tbody) t1.querySelector('tbody').should.equal(tbody)
    if (tr) t1.querySelector('tr').should.equal(tr)
  })

  it('morphs comments', () => {
    sandbox.innerHTML = `<div><!-- comment 1 --></div><div><!-- comment 2 --></div>`
    let [d1, d2] = sandbox.children
    let comment = d1.firstChild
    
    morph(d1, d2)
    
    d1.firstChild.should.equal(comment)
    d1.firstChild.nodeValue.should.equal(' comment 2 ')
  })

  it('handles complex nested reordering with ids', () => {
    sandbox.innerHTML = `
      <div id="root">
        <div id="a">
          <div id="a1">A1</div>
          <div id="a2">A2</div>
        </div>
        <div id="b">
          <div id="b1">B1</div>
        </div>
      </div>
      <div id="root">
        <div id="b">
          <div id="b1">B1 unique</div>
          <div id="a2">A2 moved</div>
        </div>
        <div id="a">
          <div id="a1">A1 updated</div>
        </div>
      </div>
    `
    let [root1, root2] = sandbox.children
    let a = root1.querySelector('#a')
    let b = root1.querySelector('#b')
    let a1 = root1.querySelector('#a1')
    let a2 = root1.querySelector('#a2')
    let b1 = root1.querySelector('#b1')
    
    morph(root1, root2)
    
    root1.querySelector('#b').should.equal(b)
    root1.querySelector('#a').should.equal(a)
    root1.querySelector('#b').contains(a2).should.be.true
    root1.querySelector('#b').contains(b1).should.be.true
    root1.querySelector('#a').contains(a1).should.be.true
    
    root1.querySelector('#a1').textContent.should.equal('A1 updated')
    root1.querySelector('#a2').textContent.should.equal('A2 moved')
    root1.querySelector('#b1').textContent.should.equal('B1 unique')
  })

  it('handles svg namespaced attributes', () => {
    // Note: xlink:href is deprecated but often used as a test for namespaced attrs
    sandbox.innerHTML = `
      <svg><image id="img" href="old.png"></image></svg>
      <svg><image id="img" href="new.png"></image></svg>
    `
    let [svg1, svg2] = sandbox.children
    let img = svg1.querySelector('#img')
    
    morph(svg1, svg2)
    
    svg1.querySelector('#img').should.equal(img)
    img.getAttribute('href').should.equal('new.png')
  })
  
  describe('focus preservation', () => {
    it('preserves focus on a simple input', () => {
      sandbox.innerHTML = `<input id="f1">`
      let input = sandbox.firstChild
      // Focus doesn't work if not in document, but sandbox is in document.
      input.focus()
      document.activeElement.should.equal(input)
      
      const next = document.createElement('input')
      next.id = 'f1'
      next.setAttribute('placeholder', 'new')
      
      morph(input, next)
      
      document.activeElement.should.equal(input)
      input.placeholder.should.equal('new')
    })

    it('preserves focus when element is reordered', () => {
      sandbox.innerHTML = `<div><input id="f1"><input id="f2"></div>`
      let [i1, i2] = sandbox.firstChild.children
      i2.focus()
      document.activeElement.should.equal(i2)
      
      const next = document.createElement('div')
      next.innerHTML = `<input id="f2"><input id="f1">`
      
      morph(sandbox.firstChild, next)
      
      document.activeElement.should.equal(i2)
      sandbox.firstChild.firstChild.should.equal(i2)
    })

    it('preserves focus when parent is replaced (transitive)', () => {
      sandbox.innerHTML = `<div id="p"><input id="f1"></div>`
      let div = sandbox.firstChild
      let input = div.firstChild
      input.focus()
      document.activeElement.should.equal(input)
      
      const section = document.createElement('section')
      section.id = 'p'
      section.innerHTML = `<input id="f1">`
      
      morph(div, section)
      
      // div was replaced by section, but input should have been moved
      const newParent = sandbox.firstChild
      newParent.tagName.should.equal('SECTION')
      newParent.firstChild.should.equal(input)
      document.activeElement.should.equal(input)
    })
  })
})
