(function (window) {

  let PENDING = 'pending'
  let RESOLVED = 'resolved'
  let REJECTED = 'rejected'

  function Promise (excutor) {
    const self = this
    self.status = PENDING
    self.data = null
    self.callbacks = [] // { onResolved: onResolved, onRejected: onRejected }
    function resolve (value) {
      if (self.status !== PENDING) return
      self.status = RESOLVED
      self.data = value
      setTimeout(() => {
        self.callbacks.forEach(cb => {
          cb.onResolved(value)
        })
      })
    }
    function reject (reason) {
      if (self.status !== PENDING) return
      self.status = REJECTED
      self.data = reason
      setTimeout(() => {
        self.callbacks.forEach(cb => {
          cb.onRejected(reason)
        })
      })
    }
    try {
      excutor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  Promise.prototype.then = function (onResolved, onRejected) {
    const self = this
    if (typeof onResolved !== 'function') onResolved = value => value
    if (typeof onRejected !== 'function') onRejected = reason => { throw reason }
    return new Promise((resolve, reject) => {
      function handle (callback) {
        // 1、报错
        // 2、返回promise类型
        // 3、返回非promise类型
        try {
          const result = callback(self.data)
          if (result instanceof Promise) {
            result.then(value => resolve(value), reason => reject(reason))
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }
      if (self.status === PENDING) {
        self.callbacks.push({
          onResolved (value) {
            handle(onResolved)
          },
          onRejected (reason) {
            handle(onRejected)
          }
        })
      } else if (self.status === RESOLVED) {
        setTimeout(() => {
          // onResolved结果
          handle(onResolved)
        })

      } else if (self.status === REJECTED) {
        setTimeout(() => {
          // onRejected结果
          handle(onRejected)
        })
      }
    })
  }

  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }

  Promise.resolve = (value) => {
    return new Promise((resolve, reject) => {
      // 1、报错
      // 2、返回promise类型
      // 3、返回非promise类型
      if (value instanceof Promise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  Promise.reject = (reason) => {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  Promise.all = (promises = []) => {

  }

  Promise.race = (promises = []) => {
    
  }

  window.Promise = Promise
})(window)