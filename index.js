var count = 0
var collection = []

var body = document.body,
  html = document.documentElement

function removePx(input) {
  return input.split('px')[0]
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
  lineIndicator.style.height = collection[index].height
  lineIndicator.style.width = collection[index].width
  lineIndicator.style.top = '50%'
  lineIndicator.style.left = collection[index].x
  !lineIndicator.classList.contains('center') ? lineIndicator.classList.add('center') : ''

  centerWindow(collection[index])
}
function moveIndicator(index) {
  lineIndicator.style.height = collection[index].height
  lineIndicator.style.width = collection[index].width
  lineIndicator.style.top = collection[index].y
  lineIndicator.style.left = collection[index].x
  lineIndicator.classList.contains('center') ? lineIndicator.classList.remove('center') : ''

  // window.pageYOffset !== 0 ? scroll(0) : ''
}

function centerWindow(elementBounds) {
  var centerOfElementYPos = elementBounds.y + elementBounds.height / 2
  var halfWindowHeight = window.innerHeight / 2

  scroll(centerOfElementYPos - halfWindowHeight)
}

function scroll(top) {
  window.scroll({ left: 0, top, behavior: 'smooth' })
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

var elementsList = 'h1, h2, h3, h4, h5, h6, p, blockquote'
var allPageItems = Array.prototype.slice.call(document.querySelectorAll(elementsList))
var lineIndicator = document.querySelector('.line-indicator')

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
