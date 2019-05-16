// AutoLogout Vue Plugin
import store from '@/store/store'
import router from '@/router'
import { EventBus } from './EventBus.js'

const AutoLogoutPlugin = {
  name: 'AutoLogoutPlugin',
  props: {
    target: {
      type: String,
      default: 'document'
    },
    filter: {
      type: Function,
      default: e => true
    }
  },
  lastAction: 0,
  issuedWarning: false,
  options: {
    minutesUntilAutoLogout: 15,
    warnSecondsBeforeLogout: 30,
    storeKey: 'AutoLogoutPlugin',
    checkInterval: 5000
  },
  install (Vue, options) {
    Vue.lastAction = this.getLastAction
    this.options = (options === undefined ? this.options : options)
    this.Vue = Vue
    // initialize
    this.initListener()
    this.initInterval()
  },
  getLastAction () {
    return parseInt(store.get(this.options.storeKey))
  },
  setLastAction (value) {
    store.set(this.options.storeKey, value)
  },
  initListener () {
    this.lastAction = Date.now()
    window.addEventListener('click', () => this.reset())
  },
  initInterval () {
    window.setInterval(() => {
      this.check()
    }, this.options.checkInterval)
  },
  reset () {
    this.lastAction = Date.now()
    this.issuedWarning = false
  },
  check () {
    const now = Date.now()
    const timeleft = this.lastAction + this.options.minutesUntilAutoLogout * 60 * 1000
    const diff = timeleft - now
    const isTimeout = diff < 0
    const isNearTimeout = diff < (this.options.warnSecondsBeforeLogout * 1000)

    // console.log('idle test: Authenticated: ' + store.state.isAuthenticated + ', Idle: ' + (isTimeout && store.state.isAuthenticated))
    if (isTimeout && store.state.isAuthenticated) {
      this.reset()
      store.dispatch('setToken', null)
      store.dispatch('setUser', null)
      router.push({
        name: 'Login'
      })
    } else if (isNearTimeout && store.state.isAuthenticated && !this.issuedWarning) {
      EventBus.$emit('idleWarning', this.options.warnSecondsBeforeLogout)
      this.issuedWarning = true
    }
  }
}

export default { AutoLogoutPlugin, EventBus }
