"use strict"

const form = document.getElementById('form'),
      textarea = document.getElementById('textarea'),
      numbers = document.getElementById('lines'),
      code = document.getElementById('code'),
      showButton = document.getElementById('showImage'),
      hideButton = document.getElementById('hideImage')

const canvasOptions = { backgroundColor: null }

const getLines = (string = "") => string.split(/\r\n|\r|\n/)

const resize = (value = textarea.value, item = textarea) => {
  let height = getLines(value).length,
      index = 1
  while (numbers.firstChild) {
    numbers.removeChild(numbers.firstChild)
  }
  getLines(value).forEach((line, i) => {
    const newLine = document.createElement('div')
    newLine.innerHTML = index
    numbers.appendChild(newLine)
    let lineLength = Math.floor(line.length / 80)
    if (Math.floor(line.length / 80) > 1) {
      for (let i = 0; i < lineLength; i++) {
        height++
        const clearLine = document.createElement('div')
        numbers.appendChild(clearLine)
      }
    }
    index ++
  })
  item.style.height = height * 20 + 20 + 'px'
}

const updateCode = (value = textarea.value) => {
  const colorized = self.hljs.highlightAuto(value)
  code.innerHTML = colorized.value
}

window.onload = () => {
  resize()
  updateCode()
}

textarea.onkeydown = (event) => {
  const value = new String(event.target.value)
  resize(value, textarea)

  if (event.which === 9) {
    event.preventDefault()
    const { selectionStart, selectionEnd } = event.target
    textarea.value = value.substring(0, selectionStart) +
                     '\t' +
                     value.substring(selectionEnd)
  }
}

textarea.onkeyup = (event) => {
  const value = event.target.value
  resize(value, textarea)
  updateCode(value)
}

textarea.onchange = () => {
  resize()
  updateCode()
}

/*
 * Get image
 */

const image = document.createElement("img")

const showImage = (event) => {
  showButton.style.display = 'none'
  hideButton.style.display = 'block'
  if (form.contains(image)) form.removeChild(image)
  html2canvas(form, canvasOptions).then(canvas => {
    image.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    image.classList = 'codeImage'
    form.appendChild(image)
  })
}

const hideImage = (event) => {
  showButton.style.display = 'block'
  hideButton.style.display = 'none'
  if (form.contains(image)) form.removeChild(image)
}

const saveImage = () => {
  if (form.contains(image)) form.removeChild(image)
  html2canvas(form, canvasOptions).then(canvas => {
    const link = document.createElement("a")
    link.download = 'code.png'
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  });
}
