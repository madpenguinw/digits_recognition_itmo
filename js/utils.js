export function imageDataToGrayscale(imgData) {
  let grayscaleImg = []

  for (let y = 0; y < imgData.height; y++) {
    grayscaleImg[y] = []
    for (let x = 0; x < imgData.width; x++) {
      let offset = y * 4 * imgData.width + 4 * x
      let alpha = imgData.data[offset + 3]

      if (alpha == 0) {
        imgData.data[offset] = 255
        imgData.data[offset + 1] = 255
        imgData.data[offset + 2] = 255
      }

      imgData.data[offset + 3] = 255
      grayscaleImg[y][x] = imgData.data[y * 4 * imgData.width + x * 4 + 0] / 255
    }
  }

  return grayscaleImg
}

export function reduceImage(img) {
  let arr = new Array(28)

  for (let y = 0; y < 28; y++) {
    arr[y] = new Array(28)

    for (let x = 0; x < 28; x++) {
      let mean = 0
      for (let v = 0; v < 10; v++) {
        for (let h = 0; h < 10; h++) {
          mean += img[y * 10 + v][x * 10 + h]
        }
      }

      arr[y][x] = 1 - mean / 100
    }
  }

  return arr
}

export function get_shift(arr) {
  let sum_x = 0, sum_y = 0, n = 0

  for (let x = 0; x < 28; x++) {
    for (let y = 0; y < 28; y++) {
      if (arr[x][y]) {
        sum_x += x
        sum_y += y
        n++
      }
    }
  }

  if (!n) return [0, 0]
  return [14 - parseInt(sum_x / n), 14 - parseInt(sum_y / n)]
}

export function centralize(arr) {
  let [dx, dy] = get_shift(arr)
  let new_arr = [...Array(28)].map(_ => [...Array(28)].map(_ => 0))

  for (let x = -Math.min(0, dx); x < 28 - Math.max(0, dx); x++) {
    for (let y = -Math.min(0, dy); y < 28 - Math.max(0, dy); y++) {
      if (arr[x][y]) new_arr[x + dx][y + dy] = arr[x][y]
    }
  }

  return new_arr
}

export function flatten(arr) {
  let new_arr = []

  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      new_arr.push(arr[i][j])
    }
  }

  return new_arr
}
