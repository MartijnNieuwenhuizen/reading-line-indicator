var count = 0
var collection = []

/**
 * Return the value of the string before the "px" characters
 * @param {String} input
 */
function removePx(input) {
  return input.split('px')[0]
}

/**
 * Set the styling of the reading-indicator that take care of the dimensions
 * @param {Number} index
 */
function setIndicatorDimensions(index) {
  lineIndicator.style.height = collection[index].height
  lineIndicator.style.width = collection[index].width
  lineIndicator.style.top = collection[index].y
  lineIndicator.style.left = collection[index].x
}

function next() {
  console.log('count: ', count)
  console.log('collection.length: ', collection.length)
  if (count + 2 <= collection.length) {
    count = count + 1
    setIndicatorDimensions(count)
  }
}

function prev() {
  if (count > 0) {
    count = count - 1
    setIndicatorDimensions(count)
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

  var lineHeight = Number(
    removePx(window.getComputedStyle(pageItem).getPropertyValue('line-height'))
  )

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

setIndicatorDimensions(count)

window.addEventListener('keyup', event => {
  if (event.keyCode === 40) {
    event.preventDefault()
    next()
  }
  if (event.keyCode === 38) {
    event.preventDefault()
    prev()
  }
})
