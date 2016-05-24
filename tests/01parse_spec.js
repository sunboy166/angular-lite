let parse = require('../src/parse')
let _ = require('lodash')
describe('Parse', () => {
  it('can parse an integer',()=>{
    let fn = parse('42')
    expect(fn).toBeDefined()
    expect(fn()).toBe(42)
  })
  it('can parse a folating point number',()=>{
    let fn = parse('4.2')
    expect(fn).toBeDefined()
    expect(fn()).toBe(4.2)
  })
  it('can parse a folating point number without an interger part',()=>{
    let fn = parse('.42')
    expect(fn).toBeDefined()
    expect(fn()).toBe(0.42)
  })

  it('can parse a folating point number in scientific notataion',()=>{
    let fn = parse('42e3')
    expect(fn).toBeDefined()
    expect(fn()).toBe(42000)
  })
  it('can parse scientific notataion with a foat coefficient',()=>{
    let fn = parse('.42e2')
    expect(fn).toBeDefined()
    expect(fn()).toBe(42)
  })
  it('can parse scientific notataion with negative exponents',()=>{
    let fn = parse('4200e-2')
    expect(fn).toBeDefined()
    expect(fn()).toBe(42)
  })
  it('can parse scientific notataion with the + sign',()=>{
    let fn = parse('.42e+2')
    expect(fn).toBeDefined()
    expect(fn()).toBe(42)
  })
  it('can parse upper case scientific notataion',()=>{
    let fn = parse('.42E2')
    expect(fn).toBeDefined()
    expect(fn()).toBe(42)
  })
  it('will not parse  invalid scientific notataion',()=>{
    expect(()=>{parse('42e-')}).toThrow()
    expect(()=>{parse('42e-a')}).toThrow()
  })

  it('can parse a string in single quotes',()=>{
    let fn = parse("'abc'")
    expect(fn()).toBe('abc')
  })
  it('can parse a string in double quotes',()=>{
    let fn = parse('"a-bc"')
    expect(fn()).toBe('a-bc')
  })
  it('not parsea string ends with mismatching quotes',()=>{
    expect(()=>{ parse('"abc\'') }).toThrow()
    // expect(fn()).toBe('abc')
  })
  it('can parse a string with single quotes inside',()=>{
    let fn = parse("'a\\\'b'")
    expect(fn()).toEqual('a\'b')
  })
  it('can parse a string with double quotes inside',()=>{
    let fn = parse('"a\\\"b"')
    expect(fn()).toEqual('a\"b')
  })
  it('will not parse a string with invalid unicode escapes',()=>{
    expect(()=>{parse('"\\u00T0"')}).toThrow()
  })

  it('will parse null',()=>{
    let fn = parse("null")
    expect(fn()).toBe(null)
  })
  it('will parse true',()=>{
    let fn = parse("true")
    expect(fn()).toBe(true)
  })
  it('will parse false',()=>{
    let fn = parse("false")
    expect(fn()).toBe(false)
  })
  it('ignore white space',()=>{
    let fn = parse(' \n 42 ')
    expect(fn()).toBe(42)
  })
  it('will parse an empty array',()=>{
    let fn = parse('[]')
    expect(fn()).toEqual([])
  })
  it('will parse an non-empty array',()=>{
    let fn = parse('[1, "two", [3,4], true]')
    expect(fn()).toEqual([1, "two", [3,4], true])
  })


  it('will parse an empty object',()=>{
    let fn = parse('{}')
    expect(fn()).toEqual({})
  })
  it('will parse an non-empty object',()=>{
    let fn = parse('{"name":"woniu",\'girlfriend\':"mushbroom"}')
    expect(fn()).toEqual({"name":"woniu",'girlfriend':"mushbroom"})
  })

  it('will parse an object with identifier keys',()=>{
    let fn = parse('{"a":1,"b":"2","c":[2,3],"d":{"e":4}}')
    expect(fn()).toEqual({a:1,b:"2",c:[2,3],d:{e:4}})
  })
  it('will parse an object with identifier keys',()=>{
    let fn = parse('{a:1,b:"2",c:[2,3],d:{e:4}}')
    expect(fn()).toEqual({a:1,b:"2",c:[2,3],d:{e:4}})
  })






























})