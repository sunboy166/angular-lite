'use strict'

import {setupModuleLoader} from '../src/loader'
import {createInjector} from '../src/injector'
describe('测试injector', () => {
  beforeEach(function() {
    delete window.angular;
    setupModuleLoader(window)
  });

  it('创建注入器', function() {
    var injector = createInjector([]);
    expect(injector).toBeDefined();
  });
  it('constant函数注册一个常量', function() {
    var module = angular.module('myModule', []);
    module.constant('aConstant', 42);
    // console.log(JSON.stringify(module,null,2))
    var injector = createInjector(['myModule']);
    expect(injector.has('aConstant')).toBe(true);
  });
  it('没注册的constant返回false', function() {
    var module = angular.module('myModule', []);
    var injector = createInjector(['myModule']);
    expect(injector.has('aConstant')).toBe(false);
  });
  it('常量名不能是hasOwnProperty', function() {
    var module = angular.module('myModule', []);
    module.constant('hasOwnProperty', _.constant(false));
    expect(function() {
      createInjector(['myModule']);
    }).toThrow();
  });
  it('可以用get获取constant的值', function() {
    var module = angular.module('myModule', []);
    module.constant('aConstant', 42);
    var injector = createInjector(['myModule']);
    expect(injector.get('aConstant')).toBe(42);
  });
})