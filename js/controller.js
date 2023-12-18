import { debounce } from 'lodash-es'

import { imageDataToGrayscale, reduceImage, centralize, flatten } from './utils'
import { predict } from './brain'

const CANVAS_SIZE = 320
const CANVAS_SCALE = 1

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
const clearButton = document.querySelector('#clear')
const output = document.querySelector('#output')

let isMouseDown = false
let hasIntroText = true
let lastX = 0
let lastY = 0

ctx.lineWidth = 14
ctx.lineJoin = 'round'
ctx.font = '28px sans-serif'
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.fillStyle = '#212121'
ctx.fillText('Загрузка...', CANVAS_SIZE / 2, CANVAS_SIZE / 2)

ctx.strokeStyle = '#212121'

function clearCanvas() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  output.textContent = ''
}

function canvasMouseDown(event) {
  isMouseDown = true

  if (hasIntroText) {
    clearCanvas()
    hasIntroText = false
  }

  const x = event.offsetX / CANVAS_SCALE
  const y = event.offsetY / CANVAS_SCALE
  lastX = x + 0.001
  lastY = y + 0.001
  canvasMouseMove(event)
}

function canvasMouseMove(event) {
  const x = event.offsetX / CANVAS_SCALE
  const y = event.offsetY / CANVAS_SCALE

  if (isMouseDown) {
    drawLine(lastX, lastY, x, y)
  }

  lastX = x
  lastY = y
}

function drawLine(fromX, fromY, toX, toY) {
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.closePath()
  ctx.stroke()

  updatePredictions()
}

function bodyMouseUp() {
  isMouseDown = false
}

function bodyMouseOut(event) {
  if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
    isMouseDown = false
  }
}

const updatePredictions = debounce(async () => {
  let imgData = imageDataToGrayscale(ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE))

  let arr = centralize(reduceImage(imgData))

  let predictions = predict(flatten(arr))
  let maxPrediction = Math.max(...predictions)

  let number = predictions.findIndex(predict => predict === maxPrediction)
  output.textContent = number
}, 100)

canvas.addEventListener('mousedown', canvasMouseDown)
canvas.addEventListener('mousemove', canvasMouseMove)
document.body.addEventListener('mouseup', bodyMouseUp)
document.body.addEventListener('mouseout', bodyMouseOut)
clearButton.addEventListener('mousedown', clearCanvas)

ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
ctx.fillText('', CANVAS_SIZE / 2, CANVAS_SIZE / 2)