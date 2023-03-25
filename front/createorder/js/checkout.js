// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault()
      if (!form.checkValidity()) {
        event.stopPropagation()
      } else {
        let data = {
          name: firstName.value,
          mail: email.value,
          phone: phone.value,
          messenger: messenger.value,
        }
        sendData("/createOrder", "POST", JSON.stringify(data)).then(e => {
          console.log(e);
        })
      }

      form.classList.add('was-validated')

    }, false)
  })
})()
