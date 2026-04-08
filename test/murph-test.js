import { htmlParse } from '../lib/croc.js'
import { morph } from '../lib/murph.js'

describe('murph', () => {
  it('morphs text nodes', () => {
    sandbox.innerHTML = `<p>hello</p>`
    let source = htmlParse(`<p>world</p>`).firstChild
    let dest = sandbox.firstChild
    morph(dest, source)
    dest.innerHTML.should.equal('world')
  })
  
  it('adds elements', () => {
    sandbox.innerHTML = `<p>hello</p>`
    let source = htmlParse(`<p>hello<br></p>`).firstChild
    let dest = sandbox.firstChild
    morph(dest, source)
    dest.innerHTML.should.equal('hello<br>')
  })
  
  it('removes elements', () => {
    sandbox.innerHTML = `<p>hello<br></p>`
    let source = htmlParse(`<p>hello</p>`).firstChild
    let dest = sandbox.firstChild
    morph(dest, source)
    dest.innerHTML.should.equal('hello')
  })
  
  it('adds attributes', () => {
    sandbox.innerHTML = `<p>hello</p>`
    let source = htmlParse(`<p class=blue>hello</p>`).firstChild
    let dest = sandbox.firstChild
    morph(dest, source)
    dest.hasAttribute('class').should.be.true
    dest.className.should.equal('blue')
  })
  
  it('removes attributes', () => {
    sandbox.innerHTML = `<p class=red>hello</p>`
    let source = htmlParse(`<p>hello</p>`).firstChild
    let dest = sandbox.firstChild
    morph(dest, source)
    dest.hasAttribute('class').should.not.be.true
  })
  
  it('updates attributes', () => {
    sandbox.innerHTML = `<p class=red>hello</p>`
    let source = htmlParse(`<p class=blue>hello</p>`).firstChild
    let dest = sandbox.firstChild
    morph(dest, source)
    dest.hasAttribute('class').should.be.true
    dest.className.should.equal('blue')
  })
  
  it('can do many different changes to attributes', () => {
    sandbox.innerHTML = `<p class=red onerror=1 popover>hello</p>`
    let source = htmlParse(`<p class=blue onclick=1>hello</p>`).firstChild
    let dest = sandbox.firstChild
    morph(dest, source)
    dest.attributes.should.have.lengthOf(2)
    dest.className.should.equal('blue')
    dest.should.have.property('popover', null)
    dest.hasAttribute('onerror').should.be.false
    dest.getAttribute('onclick').should.equal('1')
  })
  
  it('can reorder elements', () => {
    sandbox.innerHTML = `<p><strong>hello</strong> <em>world</em></p>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<p><em>hello</em> <strong>world</strong></p>`).firstChild
    let [strong, em] = dest.children
    morph(dest, source)
    dest.innerHTML.should.equal('<em>hello</em> <strong>world</strong>')
    dest.firstChild.should.equal(em)
    dest.lastChild.should.equal(strong)
  })
  
  it('can reorder elements by id', () => {
    sandbox.innerHTML = `<p><strong id="hello">hello</strong> <strong id="world">world</strong></p>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<p><strong id="world">world</strong> <strong id="hello">hello</strong></p>`).firstChild
    let [hello, world] = dest.children
    morph(dest, source)
    dest.innerHTML.should.equal('<strong id="world">world</strong> <strong id="hello">hello</strong>')
    dest.firstChild.should.equal(world)
    dest.lastChild.should.equal(hello)
  })
  
  it('can reparent elements by id', () => {
    sandbox.innerHTML = `<p><em><strong id="hello">hello</strong></em> <strong id="world">world</strong></p>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<p><strong id="world">world</strong> <strong id="hello">hello</strong></p>`).firstChild
    let [em, world] = dest.children
    let [hello] = em.children
    morph(dest, source)
    dest.innerHTML.should.equal('<strong id="world">world</strong> <strong id="hello">hello</strong>')
    dest.firstChild.should.equal(world)
    dest.lastChild.should.equal(hello)
  })
  
  it('will not change an element\'s id', () => {
    sandbox.innerHTML = `<p><strong id="hello">hello</strong> <strong>world</strong></p>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<p><strong>hello</strong> <strong>world</strong></p>`).firstChild
    let [hello, world] = dest.children
    morph(dest, source)
    dest.innerHTML.should.equal('<strong>hello</strong> <strong>world</strong>')
    dest.firstChild.should.not.equal(hello)
    dest.lastChild.should.not.equal(hello).but.equal(world)
  })

  it('will not morph an element with an id into one with a different id', () => {
    sandbox.innerHTML = `<div id="a"></div>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<div id="b"></div>`).firstChild
    morph(dest, source)
    sandbox.firstChild.should.not.equal(dest)
    sandbox.firstChild.id.should.equal('b')
  })

  it('will not morph an element with an id into one with no id', () => {
    sandbox.innerHTML = `<div id="a"></div>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<div></div>`).firstChild
    morph(dest, source)
    sandbox.firstChild.should.not.equal(dest)
    sandbox.firstChild.hasAttribute('id').should.be.false
  })

  it('will not morph an element with no id into one with an id', () => {
    sandbox.innerHTML = `<div></div>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<div id="a"></div>`).firstChild
    morph(dest, source)
    sandbox.firstChild.should.not.equal(dest)
    sandbox.firstChild.id.should.equal('a')
  })

  it('morphs tag names while preserving children', () => {
    sandbox.innerHTML = `<div><span>hello</span></div>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<p><span>world</span></p>`).firstChild
    let span = dest.firstChild
    morph(dest, source)
    sandbox.firstChild.tagName.should.equal('P')
    sandbox.firstChild.firstChild.should.equal(span)
    sandbox.firstChild.firstChild.innerHTML.should.equal('world')
  })

  it('updates textarea value property', () => {
    sandbox.innerHTML = `<textarea>hello</textarea>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<textarea>world</textarea>`).firstChild
    morph(dest, source)
    dest.value.should.equal('world')
  })

  it('updates select value property', () => {
    sandbox.innerHTML = `<select><option value="a">A</option><option value="b">B</option></select>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<select><option value="a">A</option><option value="b" selected>B</option></select>`).firstChild
    morph(dest, source)
    dest.value.should.equal('b')
  })

  it('updates checkbox checked property', () => {
    sandbox.innerHTML = `<input type="checkbox">`
    let dest = sandbox.firstChild
    let source = htmlParse(`<input type="checkbox" checked>`).firstChild
    morph(dest, source)
    dest.checked.should.be.true
  })

  it('updates boolean attributes', () => {
    sandbox.innerHTML = `<input disabled>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<input>`).firstChild
    morph(dest, source)
    dest.disabled.should.be.false
    dest.hasAttribute('disabled').should.be.false
  })

  it('handles input type changes', () => {
    sandbox.innerHTML = `<input type="text" value="hello">`
    let dest = sandbox.firstChild
    let source = htmlParse(`<input type="password" value="hello">`).firstChild
    morph(dest, source)
    dest.type.should.equal('password')
    dest.value.should.equal('hello')
  })

  it('handles deep nesting with mixed ids', () => {
    sandbox.innerHTML = `<div id="root">
        <section>
          <div id="keep-1">One</div>
          <div class="anon">Two</div>
          <div id="keep-2">Three</div>
        </section>
      </div>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<div id="root">
        <section>
          <div id="keep-2">Three point five</div>
          <div id="keep-1">One point five</div>
          <div class="anon">Two point five</div>
        </section>
      </div>`).firstChild
    let keep1 = dest.querySelector('#keep-1')
    let keep2 = dest.querySelector('#keep-2')
    morph(dest, source)
    keep1.should.equal(dest.querySelector('#keep-1'))
    keep2.should.equal(dest.querySelector('#keep-2'))
    keep1.textContent.should.equal('One point five')
    keep2.textContent.should.equal('Three point five')
    dest.querySelector('.anon').textContent.should.equal('Two point five')
  })

  it('morphs basic svg elements', () => {
    sandbox.innerHTML = `<svg><circle cx="50" cy="50" r="40" fill="red" /></svg>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<svg><circle cx="60" cy="60" r="30" fill="blue" /></svg>`).firstChild
    let circle = dest.firstChild
    morph(dest, source)
    dest.firstChild.should.equal(circle)
    circle.getAttribute('cx').should.equal('60')
    circle.getAttribute('r').should.equal('30')
    circle.getAttribute('fill').should.equal('blue')
  })

  it('swaps two elements with ids', () => {
    sandbox.innerHTML = `<div><div id="swap-a">A</div><div id="swap-b">B</div></div>`
    let dest = sandbox.firstChild
    let [ca, cb] = dest.children
    let source = htmlParse(`<div><div id="swap-b">B</div><div id="swap-a">A</div></div>`).firstChild
    morph(dest, source)
    dest.children[0].id.should.equal('swap-b')
    dest.children[1].id.should.equal('swap-a')
    dest.children[0].should.equal(cb)
    dest.children[1].should.equal(ca)
  })

  it('preserves nested ids when parent is replaced', () => {
    sandbox.innerHTML = `<div id="parent1"><span id="child">Target</span></div>`
    let dest = sandbox.firstChild
    let span = dest.firstChild
    let source = htmlParse(`<section id="parent1"><span id="child">Target Updated</span></section>`).firstChild
    morph(dest, source)
    sandbox.firstChild.tagName.should.equal('SECTION')
    sandbox.firstChild.firstChild.should.equal(span)
    sandbox.firstChild.firstChild.textContent.should.equal('Target Updated')
  })

  it('updates input value property when attribute is different', () => {
    sandbox.innerHTML = `<input id="val-test" value="attr1">`
    let dest = sandbox.firstChild
    dest.value = 'user-typed'
    let source = htmlParse(`<input id="val-test" value="attr2">`).firstChild
    morph(dest, source)
    dest.value.should.equal('attr2')
    dest.getAttribute('value').should.equal('attr2')
  })

  it('handles implicit <tbody> in tables', () => {
    sandbox.innerHTML = `<table id="table-test"><tr><td>A</td></tr></table>`
    let t1 = sandbox.firstChild
    // Browsers auto-insert <tbody>
    let tbody = t1.querySelector('tbody')
    let tr = t1.querySelector('tr')
    
    let t2 = htmlParse(`<table id="table-test"><tr><td>B</td></tr></table>`).firstChild
    
    morph(t1, t2)
    
    t1.querySelector('td').textContent.should.equal('B')
    // Identity check - if browsers keep the auto-inserted tbody
    if (tbody) t1.querySelector('tbody').should.equal(tbody)
    if (tr) t1.querySelector('tr').should.equal(tr)
  })

  it('morphs comments', () => {
    sandbox.innerHTML = `<div><!-- comment 1 --></div>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<div><!-- comment 2 --></div>`).firstChild
    let comment = dest.firstChild
    
    morph(dest, source)
    
    dest.firstChild.should.equal(comment)
    dest.firstChild.nodeValue.should.equal(' comment 2 ')
  })

  it('handles complex nested reordering with ids', () => {
    sandbox.innerHTML = `<div id="root">
        <div id="a">
          <div id="a1">A1</div>
          <div id="a2">A2</div>
        </div>
        <div id="b">
          <div id="b1">B1</div>
        </div>
      </div>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<div id="root">
        <div id="b">
          <div id="b1">B1 unique</div>
          <div id="a2">A2 moved</div>
        </div>
        <div id="a">
          <div id="a1">A1 updated</div>
        </div>
      </div>`).firstChild
    
    let a = dest.querySelector('#a')
    let b = dest.querySelector('#b')
    let a1 = dest.querySelector('#a1')
    let a2 = dest.querySelector('#a2')
    let b1 = dest.querySelector('#b1')
    
    morph(dest, source)
    
    dest.querySelector('#b').should.equal(b)
    dest.querySelector('#a').should.equal(a)
    dest.querySelector('#b').contains(a2).should.be.true
    dest.querySelector('#b').contains(b1).should.be.true
    dest.querySelector('#a').contains(a1).should.be.true
    
    dest.querySelector('#a1').textContent.should.equal('A1 updated')
    dest.querySelector('#a2').textContent.should.equal('A2 moved')
    dest.querySelector('#b1').textContent.should.equal('B1 unique')
  })

  it('handles svg namespaced attributes', () => {
    // Note: xlink:href is deprecated but often used as a test for namespaced attrs
    sandbox.innerHTML = `<svg><image id="img" href="old.png"></image></svg>`
    let dest = sandbox.firstChild
    let source = htmlParse(`<svg><image id="img" href="new.png"></image></svg>`).firstChild
    let img = dest.querySelector('#img')
    
    morph(dest, source)
    
    dest.querySelector('#img').should.equal(img)
    img.getAttribute('href').should.equal('new.png')
  })
  
  describe('focus preservation', () => {
    it('preserves focus on a simple input', () => {
      sandbox.innerHTML = `<input id="f1">`
      let dest = sandbox.firstChild
      // Focus doesn't work if not in document, but sandbox is in document.
      dest.focus()
      document.activeElement.should.equal(dest)
      
      let source = htmlParse(`<input id="f1" placeholder="new">`).firstChild
      
      morph(dest, source)
      
      document.activeElement.should.equal(dest)
      dest.placeholder.should.equal('new')
    })

    it('preserves focus when element is reordered', () => {
      sandbox.innerHTML = `<div><input id="f1"><input id="f2"></div>`
      let dest = sandbox.firstChild
      let [i1, i2] = dest.children
      i2.focus()
      document.activeElement.should.equal(i2)
      
      let source = htmlParse(`<div><input id="f2"><input id="f1"></div>`).firstChild
      
      morph(dest, source)
      
      document.activeElement.should.equal(i2)
      dest.firstChild.should.equal(i2)
    })

    it('preserves focus when parent is replaced (transitive)', () => {
      sandbox.innerHTML = `<div id="p"><input id="f1"></div>`
      let dest = sandbox.firstChild
      let input = dest.firstChild
      input.focus()
      document.activeElement.should.equal(input)
      
      let source = htmlParse(`<section id="p"><input id="f1"></section>`).firstChild
      
      morph(dest, source)
      
      // div was replaced by section, but input should have been moved
      const newParent = sandbox.firstChild
      newParent.tagName.should.equal('SECTION')
      newParent.firstChild.should.equal(input)
      document.activeElement.should.equal(input)
    })
  })
})
