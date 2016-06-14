'use strict'

const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
let INSTANTIATING = {}
let createInjector = (modulesToLoad) => {
  let instanceCache = {}
  let providerCache = {}
  let loadModules = {}
  let $provide = {
    constant(key, value) {
      if (key === 'hasOwnProperty') {
        throw 'hasOwnProperty is not a avalid constant name'
      };
      instanceCache[key] = value
      providerCache[key] = value
    },
    provider(key, proObj) {
      if (_.isFunction(proObj)) {
        proObj = providerInjector.instantiate(proObj)
      };
      providerCache[key + 'Provider'] = proObj
        // cache[key] = invoke(proObj.$get,proObj)
    }
  }
  let providerInjector = createInternalInjector(providerCache, name => {
    throw 'unknow provider' + name
  })
  let instanceInjector = createInternalInjector(instanceCache, name => {
    var provider = providerInjector.get(name + 'Provider');
    return instanceInjector.invoke(provider.$get, provider);
  });

  function createInternalInjector(cache, factoryFn) {
    let getService = name => {
      if (cache.hasOwnProperty(name)) {
        if (cache[name] === INSTANTIATING) {
          throw new Error('Circular dependency found')
        };
        return cache[name]
      } else {
        // 找a的时候，需要加上Provier后缀找，并且执行
        cache[name] = INSTANTIATING
        try {
          return (cache[name] = factoryFn(name))
        } finally {
          if (cache[name] === INSTANTIATING) {
            delete cache[name];
          }
        }

        // let provider = providerCache[name+'Provider']
        // let instance = cache[name]=invoke(provider.$get)
        // // return invoke(provider.$get,provider)
        // return instance
      }
    }
    let invoke = (fn, self, locals) => {
      let args = _.map(annotate(fn), token => {
        if (_.isString(token)) {
          return locals && locals.hasOwnProperty(token) ? locals[token] : getService(token)
        } else {
          throw 'token expected a string!'
        }

      })
      if (_.isArray(fn)) {
        fn = _.last(fn)
      };
      return self::fn(...args)
    }

    let instantiate = (Type, locals)=>{
      var UnwrappedType = _.isArray(Type) ? _.last(Type) : Type;
      var instance = Object.create(UnwrappedType.prototype);
      invoke(Type, instance, locals);
      return instance;
    }
  let annotate = fn => {
    // console.log(fn)
    if (_.isArray(fn)) {
      return _.initial(fn)
    } else if (fn.$inject) {
      return fn.$inject

    } else if (!fn.length) {
      return []
    } else {
      var argDeclaration = fn.toString().match(FN_ARGS);
      return argDeclaration[1].replace(' ', '').split(',')
    }
  }
    return {
      has(key) {
        return cache.hasOwnProperty(key) || providerCache.hasOwnProperty(key + 'Provider')
      },
      get: getService,
      invoke: invoke,
      annotate: annotate,
      instantiate: instantiate
    }

  }




  _.forEach(modulesToLoad, function loadModule(moduleName) {
    if (!loadModules[moduleName]) {
      loadModules[moduleName] = true
      let module = angular.module(moduleName)
      _.forEach(module.requires, loadModule)
      _.forEach(module._invokeQueue, invokeArgs => {
        let method = invokeArgs[0]
        let args = invokeArgs[1]
          // console.log(method,args)
        $provide[method](...args)
      })
    };
  })
  return instanceInjector
}

export {
  createInjector
}