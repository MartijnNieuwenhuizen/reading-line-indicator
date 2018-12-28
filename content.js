// @TODO: store this in Chrome extension store
var appActive = false

var helpers = {
  getComputedStyle: function(element, stylingProperty) {
    return Math.round(
      Number(this.removePx(window.getComputedStyle(element).getPropertyValue(stylingProperty)))
    )
  },
  getComputedLineHeight: function(element) {
    const elementLineHeight = window.getComputedStyle(element).getPropertyValue('line-height')
    const elementFontSize = window.getComputedStyle(element).getPropertyValue('font-size')

    return elementLineHeight === 'normal'
      ? Number(this.removePx(elementFontSize))
      : Number(this.removePx(elementLineHeight))
  },
  getDocumentHeight: function() {
    var body = document.body
    var html = document.documentElement

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    )
  },

  removePx: function(input) {
    return input.split('px')[0]
  },

  turnToPxValue: function(input) {
    return Math.round(input) + 'px'
  }
}

var style = {
  add: function(element, styles) {
    for (var style in styles) {
      element.style[style] = styles[style]
    }
  }
}

var controls = {
  count: 0,

  addEventListeners: function(allElementDimensions, lineIndicator, documentHeight) {
    window.addEventListener('keydown', event => {
      if (event.keyCode === 40) {
        event.preventDefault()
        this.next(allElementDimensions, lineIndicator, documentHeight)
      }
      if (event.keyCode === 38) {
        event.preventDefault()
        this.prev(allElementDimensions, lineIndicator, documentHeight)
      }
    })
  },

  next: function(allElementDimensions, lineIndicator, documentHeight) {
    if (this.count + 2 <= allElementDimensions.length) {
      this.count = this.count + 1
      indicator.decideHowToMove(allElementDimensions, lineIndicator, documentHeight, this.count)
    }
  },

  prev: function(allElementDimensions, lineIndicator, documentHeight) {
    if (this.count > 0) {
      this.count = this.count - 1
      indicator.decideHowToMove(allElementDimensions, lineIndicator, documentHeight, this.count)
    }
  }
}

var globalWindow = {
  move: function(lineIndicator, domElementsDimensions, index) {
    console.log('domElementsDimensions: ', domElementsDimensions)
    const styles = {
      height: helpers.turnToPxValue(domElementsDimensions[index].height),
      width: helpers.turnToPxValue(domElementsDimensions[index].width),
      top: '50%',
      left: helpers.turnToPxValue(domElementsDimensions[index].x)
    }
    style.add(lineIndicator, styles)

    if (!lineIndicator.hasAttribute('center')) {
      lineIndicator.setAttribute('center', true)
      indicator.addCenterStyling(lineIndicator)
    }

    this.center(domElementsDimensions[index])
  },

  center: function(elementBounds) {
    var centerOfElementYPos = elementBounds.y + elementBounds.height / 2
    var halfWindowHeight = window.innerHeight / 2

    this.scroll(Math.round(centerOfElementYPos - halfWindowHeight))
  },

  scroll: function(top) {
    window.scrollTo({ top, left: 0, behavior: 'smooth' })
  }
}

var elements = {
  getAll: function() {
    var elementListWithinArticle =
      'article h1, article h2, article h3, article h4, article h5, article h6, article p, article blockquote, article li'
    var elementListWithinMain =
      'main h1, main h2, main h3, main h4, main h5, main h6, main p, main blockquote, main li'
    var elementsListGlobal = 'h1, h2, h3, h4, h5, h6, p, blockquote, li'

    var allPageItems = Array.prototype.slice.call(
      document.querySelectorAll(elementListWithinArticle)
    )
    if (!allPageItems.length) {
      allPageItems = Array.prototype.slice.call(document.querySelectorAll(elementListWithinMain))
    }
    if (!allPageItems.length) {
      allPageItems = Array.prototype.slice.call(document.querySelectorAll(elementsListGlobal))
    }
    return allPageItems
  },

  getAllPositionsValues(elements) {
    var collection = []

    for (let i = 0; i < elements.length; i++) {
      var pageItem = elements[i]

      var elementDimensions = pageItem.getBoundingClientRect()
      var elementHeight = elementDimensions.height
      var elementWidth = elementDimensions.width

      var elementPaddingTop = helpers.getComputedStyle(pageItem, 'padding-top')
      var elementPaddingBottom = helpers.getComputedStyle(pageItem, 'padding-bottom')
      var elementLineHeight = helpers.getComputedLineHeight(pageItem)

      var elementReducedHeight = elementHeight - elementPaddingTop - elementPaddingBottom
      var amountOfLines = Math.round(elementReducedHeight / elementLineHeight)
      var indicatorHeight = Math.round(elementLineHeight)

      for (let i = 0; i < amountOfLines; i++) {
        collection.push({
          x: elementDimensions.x,
          y: elementDimensions.y + i * indicatorHeight + elementPaddingTop,
          width: elementWidth,
          height: indicatorHeight
        })
      }
    }

    return collection
  }
}

var indicator = {
  create: function() {
    var element = document.createElement('div')
    element.classList.add('line-indicator')
    document.querySelector('body').appendChild(element)

    return document.querySelector('.line-indicator')
  },

  style: function(element) {
    var styles = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(29, 160, 183, 0.3)',
      willChange: 'top, left, width, height',
      paddingLeft: '16px',
      paddingRight: '16px',
      marginLeft: '-16px',
      boxSizing: 'content-box',
      transition:
        '0.3s ease-in-out width, 0.3s ease-in-out height, 0.3s ease-in-out top, 0.3s ease-in-out left'
    }

    style.add(element, styles)
  },

  addCenterStyling: function(lineIndicator) {
    var styles = {
      position: 'fixed',
      transform: 'translateY(-50%)',
      top: '-50%',
      willChange: 'left, width, height'
    }
    style.add(lineIndicator, styles)
  },

  removeCenterStyling: function(lineIndicator) {
    var styles = {
      position: 'absolute',
      transform: 'translateY(0)',
      willChange: 'top, left, width, height'
    }
    style.add(lineIndicator, styles)
  },

  decideHowToMove: function(domElementsDimensions, lineIndicator, documentHeight, index) {
    var currentLineIsOnTopHalfOfWindow = domElementsDimensions[index].y < window.innerHeight / 2
    var currentLineIsOnBottomHalfOfWindow =
      domElementsDimensions[index].y > documentHeight - window.innerHeight / 2

    currentLineIsOnTopHalfOfWindow || currentLineIsOnBottomHalfOfWindow
      ? this.move(domElementsDimensions, lineIndicator, index)
      : globalWindow.move(lineIndicator, domElementsDimensions, index)
  },

  move: function(domElementsDimensions, lineIndicator, index) {
    var styles = {
      height: helpers.turnToPxValue(domElementsDimensions[index].height),
      width: helpers.turnToPxValue(domElementsDimensions[index].width),
      top: helpers.turnToPxValue(domElementsDimensions[index].y),
      left: helpers.turnToPxValue(domElementsDimensions[index].x)
    }

    style.add(lineIndicator, styles)

    // @TODO: Check if this can be done better
    if (lineIndicator.hasAttribute('center')) {
      lineIndicator.removeAttribute('center')
      this.removeCenterStyling(lineIndicator)
    }
  }
}

function init() {
  appActive = !appActive
  if (appActive) {
    var count = controls.count
    var allDomElement = elements.getAll()
    var allElementDimensions = elements.getAllPositionsValues(allDomElement)
    var documentHeight = helpers.getDocumentHeight()
    var lineIndicator = indicator.create()

    indicator.style(lineIndicator)
    indicator.decideHowToMove(allElementDimensions, lineIndicator, documentHeight, count)
    controls.addEventListeners(allElementDimensions, lineIndicator, documentHeight)
  }
}

chrome.runtime.onMessage.addListener(function(request) {
  request.action === 'init' ? init() : ''
})
