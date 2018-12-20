console.log('hello world')
const removePx = input => {
  return input.split('px')[0]
}

const allPageItems = Array.from(document.querySelectorAll('h1, h2, h3, p'))
const lineIndicator = document.querySelector('.line-indicator')

const foo = allPageItems.map(pageItem => {
  const elementDimensions = pageItem.getBoundingClientRect()
  const elementHeight = elementDimensions.height
  const elementWidth = elementDimensions.width
  const lineHeight = removePx(window.getComputedStyle(pageItem).getPropertyValue('line-height'))
  const amountOfLines = Math.round(elementHeight / lineHeight)
  const indicatorHeight = lineHeight

  const collection = []

  for (let i = 0; i < amountOfLines; i++) {
    collection.push({
      x: elementDimensions.x,
      y: elementDimensions.y + i * Math.round(indicatorHeight),
      width: elementWidth,
      height: Math.round(indicatorHeight)
    })
  }

  return collection
})

var merged = [].concat.apply([], foo)
console.log('merged: ', merged)

const setBar = index => {
  lineIndicator.style.height = merged[index].height
  lineIndicator.style.width = merged[index].width
  lineIndicator.style.top = merged[index].y
  lineIndicator.style.left = merged[index].x
}

let count = 0
setBar(count)

window.addEventListener('keyup', event => {
  if (event.keyCode === 40) {
    event.preventDefault()
    count = count + 1
    setBar(count)
  }
  if (event.keyCode === 38) {
    event.preventDefault()
    count = count - 1
    setBar(count)
  }
})
