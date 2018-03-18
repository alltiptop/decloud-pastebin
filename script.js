"use strict"

const form = document.getElementById('form'),
      code = document.getElementById('code'),
      showButton = document.getElementById('showImage'),
      hideButton = document.getElementById('hideImage')

const canvasOptions = { backgroundColor: null }

/*
 * Get text properties for lines calculations and other
 */

class textForm {
  constructor (data = "") {
    this.value = data.value ? data.value : data
    this.lines = this.value.split(/\r\n|\r|\n/)
  }
  getLines () {
    return this.lines
  }
  getLinesCount () {
    let height = this.lines.length
    this.lines.forEach((line) => {
      height += Math.floor(line.length / 80)
    })
    return height
  }
}

/*
 * Editor hotheys
 */

const hotkeys = {
  check ({ which }) {
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
    event.target.selectionStart = selectionStart + 4
    event.target.selectionEnd = selectionEnd + 4
  }
}


/*
 * Editor events
 */

const editor = {
  resize: (value = textarea.value, target = textarea) => {
    const text = new textForm(value)
    lines.update(value)
    target.style.height = text.getLinesCount() * 20 + 20 + 'px'
  },
  updateCode: (value = "") => {
    const colorized = self.hljs.highlightAuto(value)
    code.innerHTML = colorized.value
  },
  update (event) {
    event.target.value = event.target.value.replace(/\t/g, '    ')
    const { value } = event.target
    this.resize(value, event.target)
    this.updateCode(value)
  }
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
  createLine (number = null, index = null) {
    const el = document.createElement('div')
    el.innerHTML = number
    this.container.appendChild(el)
  },
  update (value = "") {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
    let index = Number(this.start)
    const text = new textForm(value)
    text.getLines().forEach((line, i) => {
      this.createLine(index)
      const lineLength = Math.floor(line.length / 80)
      for (let i = 0; i < lineLength; i++) {
        this.createLine()
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

window.onload = () => {
  const textarea = document.getElementById('textarea')
  editor.updateCode(textarea.value)
  editor.resize(textarea.value)
}
