"use strict"

const form = document.getElementById('form'),
      code = document.getElementById('code'),
      showButton = document.getElementById('showImage'),
      hideButton = document.getElementById('hideImage')

const canvasOptions = { backgroundColor: null }

const getLines = (string = "") => string.split(/\r\n|\r|\n/)

const hotkeys = {
  check ({ which }) {
    console.log(which)
    if (!which) return
    switch (which) {
      case 9:
        this.tab(event)
        break;
      default:
        return
    }
  },
  tab: (event) => {
    event.preventDefault()
    const { selectionStart, selectionEnd, value } = event.target
    event.target.value = value.substring(0, selectionStart) +
                         '    ' +
                         value.substring(selectionEnd)
    event.selectionStart = selectionStart + 4
    event.selectionEnd = selectionEnd + 4
  }
}

const editor = {
  resize: (value = textarea.value, item = textarea) => {
    let height = getLines(value).length
    lines.update(value)
    getLines(value).forEach((line, i) => {
      let lineLength = Math.floor(line.length / 80)
      for (let i = 0; i < lineLength; i++) height++
    })
    item.style.height = height * 20 + 20 + 'px'
  },
  updateCode: (value = "") => {
    const colorized = self.hljs.highlightAuto(value)
    code.innerHTML = colorized.value
  },
  update (event) {
    event.target.value = event.target.value.replace(/\t/g, '    ')
    const { value } = event.target
    this.resize(value, textarea)
    this.updateCode(value)
  }
}

window.onload = () => {
  const textarea = document.getElementById('textarea')
  editor.updateCode(textarea.value)
  editor.resize(textarea.value)
}

/*
 * Image getting
 */

const image = {
  img: document.createElement("img"),
  checkImg () {
    if (form.contains(this.img)) form.removeChild(this.img)
  },
  show (event) {
    showButton.style.display = 'none'
    hideButton.style.display = 'block'
    this.checkImg()
    html2canvas(form, canvasOptions).then(canvas => {
      this.img.src = canvas.toDataURL("image/png")
      this.img.classList = 'codeImage'
      form.appendChild(this.img)
    })
  },
  hide (event) {
    this.checkImg()
    showButton.style.display = 'block'
    hideButton.style.display = 'none'
  },
  save () {
    this.checkImg()
    html2canvas(form, canvasOptions).then(canvas => {
      const link = document.createElement("a")
      link.download = 'code.png'
      link.href = canvas.toDataURL("image/png")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    });
  }
}

/*
 * Lines editor
 */

const lines = {
  start: 1,
  container: document.getElementById('lines'),
  block: (number = null) => {
    const el = document.createElement('div')
    el.innerHTML = number
    return el
  },
  update (value = "") {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
    let index = Number(this.start)
    getLines(value).forEach((line, i) => {
      let newLine = this.block(index)
      this.container.appendChild(newLine)
      let lineLength = Math.floor(line.length / 80)
      for (let i = 0; i < lineLength; i++) {
        const clearLine = this.block()
        this.container.appendChild(clearLine)
      }
      index ++
    })
  },
  setStart (event) {
    const { value } = event.target
    if (!/^\+?([0-9]\d*)$/.test(value)) return
    this.start = value
    editor.resize()
  }
}
