/**
 * Handle UF selection.
 *
 * This class opens a modal showing all brazillian UFs.
 *
 * @class
 *
 * @param {(string|object)} UFPicker
 */
function UFPicker (triggerElement) {
  this.elemBody = $('body')
  this.elemTrigger = $(triggerElement)
  this.elemModal = $('<div class="uf-modal"></div>').hide().appendTo('body')

  this.elemModal.html(this.toHtml())
  this.elemTrigger.click(() => this.open())
}

/**
 * Array of UFs.
 *
 * @typedef UFArray
 * @type {array}
 * @property {string} 0 - UF's HTML value
 * @property {string} 1 - UF's name
 *
 * @return {UFArray}
 */
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

/**
 * Generate HTML of list of UFs.
 *
 * @return {string}
 */
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

/**
 * Open the selection modal.
 *
 * When this modal is open, the user is forced to pick a UF.
 * This is an intentional behavior, because it's a mandatory field.
 *
 * @return {undefined}
 */
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

/**
 * Close the selection modal.
 *
 * @return {undefined}
 */
UFPicker.prototype.close = function () {
  this.elemBody.removeClass('prevent-scroll')

  this.elemModal.animate({
    marginTop: '30px',
    opacity: 0
  }, 'fast', 'swing', () => {
    this.elemModal.hide()
  })
}

/**
 * Auto-fill the form fields whenever user picks an UF.
 *
 * This function must be called once to bind the change event.
 *
 * @param {(string|jQuery)} inpValue       Selector or jQuery object
 * @param {(string|jQuery)} inpPlaceholder Selector or jQuery object
 *
 * @return {undefined}
 */
UFPicker.prototype.autofill = function (inpValue, inpPlaceholder) {
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

/**
 * Show and hide errors inside a div (selector).
 *
 * @class
 *
 * @param {(string|jQuery)} selector Selector of the element that will show the errors
 *
 * @return {undefined}
 */
function ErrorManager (selector) {
  this.element = $(selector)
}

/**
 * Show error.
 *
 * @param {string} message
 *
 * @return {undefined}
 */
ErrorManager.prototype.show = function (message) {
  this.element.html(message).stop().animate({ opacity: 1 }, 70)

  setTimeout(() => this.hide(), 3000)
}

/**
 * Hide error.
 *
 * @return {undefined}
 */
ErrorManager.prototype.hide = function () {
  this.element.stop().animate({ opacity: 0 }, 70)
}

/**
 * Functions related to the main form.
 *
 * @class
 *
 * @param {(string|jQuery)} elemFormContent Selector of the element that wraps the fields
 * @param {(string|jQuery)} elemFormButton  Selector of the submit button
 * @param {(string|jQuery)} elemFormSuccess Selector of the overlay div that is shown when the form is submitted
 *
 * @return {undefined}
 */
function FormManager (elemFormContent, elemFormButton, elemFormSuccess) {
  this.elemFormContent = $(elemFormContent)
  this.elemFormButton = $(elemFormButton)
  this.elemFormSuccess = $(elemFormSuccess)
}

/**
 * Show the success container and update it's message.
 *
 * If the message is falsy, the container will show with it's current content. Also
 * if the delay is provided, the container will be shown afters that delay in ms.
 *
 * @param {string} innerHtml If this param is provided, it will update the success container's html with this
 * @param {number} delay     Delay to execute this function
 */
FormManager.prototype.showSuccessMessage = function (innerHtml, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      this.elemFormSuccess.attr('disabled', true)

      this.elemFormSuccess.stop().fadeOut('fast', () => {
        this.elemFormSuccess.html(html).stop().fadeIn('fast', () => {
          resolve()
        })
      })
    }, delay)
  })
}

/**
 * Show success container and redirect to Huia's website.
 *
 * Called when the user completes the form and it's validated.
 */
FormManager.prototype.hireMe = function () {
  this.elemFormContent.animate({ opacity: 0 }, 'fast', async () => {
    let elemSuccessHtml = this.elemFormSuccess.html()

    this.showSuccessMessage()
    await this.showSuccessMessage('Mas antes...', 3000)
    await this.showSuccessMessage('Obrigado <span class="color-primary">HUIA</span>', 1000)
    await this.showSuccessMessage(elemSuccessHtml, 2000)

    // Show default Huia's background for smooth transition
    setTimeout(() => {
      $('#overlay-preload').fadeIn(1000, () => {
        window.location.href = 'http://www.huia.com.br/?hire=giovanneafonso@gmail.com'
      })
    }, 3000)
  })
}

/**
 * App's "constructor"
 */
$(document).ready(function () {
  let formMgr = new FormManager()
  let errMgr = new ErrorManager('#form-error')
  let ufPicker = new UFPicker('.ufpicker')

  let elemCRM = $('#inp-crm')
  let elemUF = $('#inp-uf')

  elemCRM.mask('000.000-0')
  ufPicker.autofill(elemUF, '#inp-uf-placeholder')

  /**
   * Handle submit button's click.
   *
   * Execute some validations and then show the success container from {@link FormManager}.
   */
  $('#btn-submit').click(function () {
    if (!elemCRM.val()) {
      errMgr.show('Preencha o campo CRM')
      elemCRM.focus()
      return
    }

    if (elemCRM.val().length !== 9) {
      errMgr.show('O CRM preenchido é inválido')
      elemCRM.focus()
      return
    }

    if (!elemUF.val()) {
      errMgr.show('Preencha o campo UF')

      // Should open the modal!?
      setTimeout(() => ufPicker.open(), 500)

      return
    }

    // Eureka! Can we can work together now?
    formMgr.hireMe()
  })
})
