function UFPicker (triggerElement) {
  this.elemBody = $('body')
  this.elemTrigger = $(triggerElement)
  this.elemModal = $('<div class="uf-modal"></div>').hide().appendTo('body')

  this.elemModal.html(this.toHtml())
  this.elemTrigger.click(() => this.open())
}

UFPicker.prototype.getUFs = function () {
  return [
    ['AC', 'Acre'],
    ['AL', 'Alagoas'],
    ['AP', 'Amapá'],
    ['AM', 'Amazonas'],
    ['BA', 'Bahia'],
    ['CE', 'Ceará'],
    ['DF', 'Distrito Federal'],
    ['ES', 'Espírito Santo'],
    ['GO', 'Goiás'],
    ['MA', 'Maranhão'],
    ['MT', 'Mato Grosso'],
    ['MS', 'Mato Grosso do Sul'],
    ['MG', 'Minas Gerais'],
    ['PA', 'Pará'],
    ['PB', 'Paraíba'],
    ['PR', 'Paraná'],
    ['PE', 'Pernambuco'],
    ['PI', 'Piauí'],
    ['RJ', 'Rio de Janeiro'],
    ['RN', 'Rio Grande do Norte'],
    ['RS', 'Rio Grande do Sul'],
    ['RO', 'Rondônia'],
    ['RR', 'Roraima'],
    ['SC', 'Santa Catarina'],
    ['SP', 'São Paulo'],
    ['SE', 'Sergipe'],
    ['TO', 'Tocantins']
  ]
}

UFPicker.prototype.toHtml = function () {
  let ufs = this.getUFs()
  let html = '<ul class="uf-list">'

  for (let i = 0; i < ufs.length; i++) {
    let uf = ufs[i]
    html += '<li data-uf="' + uf.join(':') + '">' + uf[1] + '</li>'
  }

  html += '</ul>'

  return html
}

UFPicker.prototype.open = function () {
  this.elemBody.addClass('prevent-scroll')

  this.elemModal.css({
    display: 'block',
    marginTop: '30px',
    opacity: 0
  }).animate({
    marginTop: '0',
    opacity: 1
  }, 'fast')
}

UFPicker.prototype.close = function () {
  this.elemBody.removeClass('prevent-scroll')

  this.elemModal.animate({
    marginTop: '30px',
    opacity: 0
  }, 'fast', 'swing', () => {
    this.elemModal.hide()
  })
}

UFPicker.prototype.bindValue = function (inpValue, inpPlaceholder) {
  let elemValue = $(inpValue)
  let elemPlaceholder = $(inpPlaceholder)
  let elemUFs = this.elemModal.find('[data-uf]')

  elemUFs.click(e => {
    let elemCurrent = $(e.target)
    // Set current active item
    elemUFs.removeClass('active')
    elemCurrent.addClass('active')
    // Fill inputs
    let uf = elemCurrent.data('uf').split(':')
    elemValue.val(uf[0])
    elemPlaceholder.val(uf[1])
    this.close()
  })
}

function ErrorManager (selector) {
  this.element = $(selector)
}

ErrorManager.prototype.show = function (message) {
  this.element.html(message).stop().animate({ opacity: 1 }, 70)

  setTimeout(() => this.hide(), 3000)
}

ErrorManager.prototype.hide = function () {
  this.element.stop().animate({ opacity: 0 }, 70)
}

function DelaySuccessHtml (html) {
  return new Promise(resolve => {
    let elemSuccess = $('#form-success')

    setTimeout(() => {
      elemSuccess.stop().fadeOut('fast', () => {
        elemSuccess.html(html).fadeIn('fast', () => {
          resolve()
        })
      })
    }, 1000)
  })
}

function HireMe () {
  let elemSuccess = $('#form-success')

  $('#btn-submit').attr('disabled', true)

  $('#form-content').animate({ opacity: 0 }, 'fast', async () => {
    let elemSuccessHtml = elemSuccess.fadeIn().html()
    await DelaySuccessHtml('Mas antes...')
    await DelaySuccessHtml('Obrigado <span class="color-primary">HUIA</span>')
    await DelaySuccessHtml(elemSuccessHtml)
    setTimeout(() => {
      $('#overlay-preload').fadeIn(1000, () => {
        window.location.href = 'http://www.huia.com.br/?hire=giovanneafonso@gmail.com'
      })
    }, 3000)
  })
}

$(document).ready(function () {
  let elemCRM = $('#inp-crm')
  let elemUF = $('#inp-uf')

  elemCRM.mask('000.000-0')

  let ufPicker = new UFPicker('.ufpicker')
  ufPicker.bindValue(elemUF, '#inp-uf-placeholder')

  let err = new ErrorManager('#form-error')

  $('#btn-submit').click(function () {
    if (!elemCRM.val()) {
      err.show('Preencha o campo CRM')
      elemCRM.focus()
      return
    }

    if (elemCRM.val().length !== 9) {
      err.show('O CRM preenchido é inválido')
      elemCRM.focus()
      return
    }

    if (!elemUF.val()) {
      err.show('Preencha o campo UF')

      // Should open the modal!?
      setTimeout(() => ufPicker.open(), 500)

      return
    }

    // Eureka! Can we can work together now?
    HireMe()
  })
})
