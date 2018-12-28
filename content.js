var appActive = false
var count = 0
var collection = []
var allPageItems = null
var lineIndicator = null

var body = document.body
var html = document.documentElement

function removePx(input) {
  return input.split('px')[0]
}
function turnToPxValue(input) {
  const foo = Math.round(input) + 'px'
  return foo
}

function move(index) {
  var documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  var currentLineIsOnTopHalfOfWindow = collection[index].y < window.innerHeight / 2
  var currentLineIsOnBottomHalfOfWindow =
    collection[index].y > documentHeight - window.innerHeight / 2

  currentLineIsOnTopHalfOfWindow || currentLineIsOnBottomHalfOfWindow
    ? moveIndicator(index)
    : moveWindow(index)
}
function moveWindow(index) {
  lineIndicator.style.height = turnToPxValue(collection[index].height)
  lineIndicator.style.width = turnToPxValue(collection[index].width)
  lineIndicator.style.top = '50%'
  lineIndicator.style.left = turnToPxValue(collection[index].x)

  if (!lineIndicator.classList.contains('center')) {
    lineIndicator.classList.add('center')
    addCenterStyling()
  }

  centerWindow(collection[index])
}
function moveIndicator(index) {
  lineIndicator.style.height = turnToPxValue(collection[index].height)
  lineIndicator.style.width = turnToPxValue(collection[index].width)
  lineIndicator.style.top = turnToPxValue(collection[index].y)
  lineIndicator.style.left = turnToPxValue(collection[index].x)

  if (lineIndicator.classList.contains('center')) {
    lineIndicator.classList.remove('center')
    removeCenterStyling()
    // lineIndicator.setAttribute('data-center', false)
  }

  // window.pageYOffset !== 0 ? scroll(0) : ''
}

function addCenterStyling() {
  lineIndicator.style.position = 'fixed'
  lineIndicator.style.transform = 'translateY(-50%)'
  lineIndicator.style.top = '-50%'
  lineIndicator.style.willChange = 'left, width, height'
}

function removeCenterStyling() {
  lineIndicator.style.position = 'absolute'
  lineIndicator.style.transform = 'translateY(0)'
  lineIndicator.style.willChange = 'top, left, width, height'
}

function centerWindow(elementBounds) {
  var centerOfElementYPos = elementBounds.y + elementBounds.height / 2
  var halfWindowHeight = window.innerHeight / 2

  scroll(Math.round(centerOfElementYPos - halfWindowHeight))
}

function scroll(top) {
  window.scrollTo({ top, left: 0, behavior: 'smooth' })
}

function next() {
  if (count + 2 <= collection.length) {
    count = count + 1
    move(count)
  }
}

function prev() {
  if (count > 0) {
    count = count - 1
    move(count)
  }
}

function getAllElements() {
  var elementsList = 'h1, h2, h3, h4, h5, h6, p, blockquote, li'
  allPageItems = Array.prototype.slice.call(document.querySelectorAll(elementsList))

  for (let i = 0; i < allPageItems.length; i++) {
    var pageItem = allPageItems[i]

    var elementDimensions = pageItem.getBoundingClientRect()
    var elementHeight = elementDimensions.height
    var elementWidth = elementDimensions.width

    const elementLineHeight = window.getComputedStyle(pageItem).getPropertyValue('line-height')
    const elementFontSize = window.getComputedStyle(pageItem).getPropertyValue('font-size')

    var lineHeight =
      elementLineHeight === 'normal'
        ? Number(removePx(elementFontSize))
        : Number(removePx(elementLineHeight))

    var amountOfLines = Math.round(elementHeight / lineHeight)
    var indicatorHeight = lineHeight

    for (let i = 0; i < amountOfLines; i++) {
      collection.push({
        x: elementDimensions.x,
        y: elementDimensions.y + i * Math.round(indicatorHeight),
        width: elementWidth,
        height: Math.round(indicatorHeight)
      })
    }
  }
}

function createLineIndicator() {
  var element = document.createElement('div')
  element.classList.add('line-indicator')
  document.querySelector('body').appendChild(element)
  lineIndicator = document.querySelector('.line-indicator')

  lineIndicator.style.position = 'absolute'
  lineIndicator.style.width = '100%'
  lineIndicator.style.height = '100%'
  lineIndicator.style.backgroundColor = 'rgba(29, 160, 183, 0.3)'
  lineIndicator.style.willChange = 'top, left, width, height'
  lineIndicator.style.paddingLeft = '16px'
  lineIndicator.style.paddingRight = '16px'
  lineIndicator.style.marginLeft = '-16px'
  lineIndicator.style.boxSizing = 'content-box'
  lineIndicator.style.transition =
    '0.3s ease-in-out width, 0.3s ease-in-out height, 0.3s ease-in-out top, 0.3s ease-in-out left'
}

function init() {
  appActive = !appActive
  if (appActive) {
    getAllElements()
    createLineIndicator()
    move(count)

    window.addEventListener('keydown', event => {
      if (event.keyCode === 40) {
        event.preventDefault()
        next()
      }
      if (event.keyCode === 38) {
        event.preventDefault()
        prev()
      }
    })
  }
}

chrome.runtime.onMessage.addListener(function(request) {
  request.action === 'init' ? init() : ''
})
