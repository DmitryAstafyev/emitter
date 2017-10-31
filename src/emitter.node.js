/* eslint-disable no-multi-spaces,key-spacing,no-console,node/no-unsupported-features */
'use strict';

const Emitter = require('events');

/**
 *
 * Example of event interface

 class SomeEvent {

    constructor(param0, param1, param3 = false) {
        this.param0 = param0;
        this.param1 = param1;
        this.param3 = param3;
    }

}
 * */

const LOG_LEVELS = {
  debug : 'debug',
  warn  : 'warn',
  error : 'error'
};

class DefaultLogger {
  [LOG_LEVELS.debug] (msg) {
    return this._log(LOG_LEVELS.debug, msg);
  }
  [LOG_LEVELS.warn] (msg) {
    return this._log(LOG_LEVELS.warn, msg);
  }
  [LOG_LEVELS.error] (msg) {
    return this._log(LOG_LEVELS.error, msg);
  }
  _log (level, msg) {
    let _msg = this._getMsg(level, msg);
    console !== void 0 && console.log(_msg);
    return _msg;
  }
  _getMsg (level, msg) {
    return `[${level}]: ${msg}`;
  }
}

/**
 * Emitter, which provides using classes as events
 *
 * @class ExEmitter
 */
class ExEmitter extends Emitter {
  constructor (logName = '', useLogs = true, logger = null) {
    super();
    if (useLogs) {
      if (typeof logName !== 'string' || logName.trim() === '') {
        throw new Error('To use logs, please, define [logName]. It can be very helpful during debugging.');
      }
    }
    logger === null && (logger = new DefaultLogger(logName));
    this._logName = logName;
    this._logger  = logger;
    this._useLogs = useLogs;
  }

  _getNameOfEventOn (event) {
    let name = typeof event === 'function' ? (typeof event.name === 'string' ? event.name : null) : null;
    if (name === null || (name !== null && this.events !== void 0 && this.events[name] === void 0)) {
      throw new Error(this._logger.error(`${this._logName}:: For event ${name} an interface is not defined.`));
    }
    return name;
  }

  _getNameOfEventEmit (event) {
    let name = typeof event === 'object' ? (event !== null ? (typeof event.constructor.name === 'string' ? event.constructor.name : null) : null) : null;
    if (name === null || (name !== null && this.events !== void 0 && this.events[name] === void 0)) {
      throw new Error(this._logger.error(`${this._logName}:: For event ${name} an interface is not defined.`));
    }
    return name;
  }

  _incorrect (eventName, listener) {
    if (eventName !== null) {
      this._useLogs && this._logger.warn(`${this._logName}:: [on] Cannot bind listener for event: ${eventName} because type of [listener] is "${(typeof listener)}"`);
    } else {
      this._useLogs && this._logger.warn(`${this._logName}:: [on] Cannot find event's name. Check interface implementation of events.`);
    }
  }

  /*
  * Overwrite original method to process signatures
  * @param event {EventClassReference} Event's class reference
  * @param listener {function} Event's listener
  * @return {void} returns void
  * @throws if event was not declared
  * */
  on (event, listener) {
    let eventName = this._getNameOfEventOn(event);
    if (eventName !== null && typeof listener === 'function') {
      return super.on(eventName, listener);
    } else {
      this._incorrect(eventName, listener);
    }
  }

  /**
   * Overwrite original method to provide logs
   * @param event {EventClassInstance} Event's class instance
   * @return {void} returns void
   * @throws if event was not declared
   */
  emit (event) {
    let eventName = this._getNameOfEventEmit(event);
    if (eventName !== null) {
      this._useLogs && this._logger.debug(`${this._logName}:: [emit] Event "${eventName}" is triggered.`);
      return super.emit(eventName, event);
    } else {
      this._useLogs && this._logger.warn(`${this._logName}:: [emit] Unexpected format of event: ${(typeof event)}.`);
    }
  }

  /*
  * Overwrite original method to process signatures
  * @param event {EventClassReference} Event's class reference
  * @param listener {function} Event's listener
  * @return {void} returns void
  * @throws if event was not declared
  * */
  once (event, listener) {
    let eventName = this._getNameOfEventOn(event);
    if (eventName !== null && typeof listener === 'function') {
      return super.once(eventName, listener);
    } else {
      this._incorrect(eventName, listener);
    }
  }

  /*
  * Overwrite original method to process signatures
  * @param event {EventClassReference} Event's class reference
  * @param listener {function} Event's listener
  * @return {void} returns void
  * @throws if event was not declared
  * */
  removeListener (event, listener) {
    let eventName = this._getNameOfEventOn(event);
    if (eventName !== null && typeof listener === 'function') {
      return super.removeListener(eventName, listener);
    } else {
      this._incorrect(eventName, listener);
    }
  }

  /*
  * Overwrite original method to process signatures
  * @param event {EventClassReference} Event's class reference
  * @return {void} returns void
  * @throws if event was not declared
  * */
  removeAllListeners (events) {
    let _events = (events instanceof Array ? events : [events]).map((event) => {
      let eventName = this._getNameOfEventOn(event);
      if (eventName !== null) {
        return eventName;
      } else {
        this._useLogs && this._logger.warn(`${this._logName}:: [on] Cannot find event's name. Check interface implementation of events.`);
        return null;
      }
    }).filter((event) => {
      return event !== null;
    });
    return super.removeAllListeners(_events);
  }

  /*
  * Overwrite original method to process signatures
  * @param event {EventClassReference} Event's class reference
  * @param listener {function} Event's listener
  * @return {void} returns void
  * @throws if event was not declared
  * */
  listeners (event) {
    let eventName = this._getNameOfEventOn(event);
    if (eventName !== null) {
      return super.listeners(eventName);
    } else {
      this._useLogs && this._logger.warn(`${this._logName}:: [on] Cannot find event's name. Check interface implementation of events.`);
      return [];
    }
  }
}

module.exports = ExEmitter;
