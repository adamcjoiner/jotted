/* play plugin
 * adds a Run button
 */

import * as util from '../util.js'

export default class PluginPlay {
  constructor (jotted, options) {
    options = util.extend(options, {})

    var priority = 10
    // cached code
    var cache = {}
    // latest version of the code.
    // replaces the cache when the run button is pressed.
    var code = {}

    // run button
    var $button = document.createElement('button')
    $button.className = 'jotted-button jotted-button-play'
    $button.innerHTML = 'Run'

    jotted.$container.appendChild($button)
    $button.addEventListener('click', this.run.bind(this))

    // capture the code on each change
    jotted.on('change', this.change.bind(this), priority)

    // public
    this.cache = cache
    this.code = code
    this.jotted = jotted
  }

  change (params, callback) {
    // always cache the latest code
    this.code[params.type] = util.extend(params)

    // replace the params with the latest cache
    if (this.cache[params.type]) {
      callback(null, this.cache[params.type])

      // make sure we don't cache forceRender,
      // and send it with each change.
      this.cache[params.type].forceRender = null
    } else {
      // cache the first run
      this.cache[params.type] = util.extend(params)

      callback(null, params)
    }
  }

  run () {
    // trigger change on each type with the latest code
    for (let type in this.code) {
      // update the cache with the latest code
      this.cache[type] = util.extend(this.code[type], {
        // force rendering on each Run press
        forceRender: true
      })

      // trigger the change
      this.jotted.trigger('change', this.cache[type])
    }
  }
}