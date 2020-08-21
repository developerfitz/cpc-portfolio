console.log("Hello Examiners!")

function load(){
  const uploadButton = document.getElementById('#upload_button')

  if (uploadButton) {
    uploadButton.addEventListener('click', (e) => {
      const uploadInput = document.getElementById('#upload_input')

      for (let file of uploadInput.files) {
        console.log(file.name, file.type, file.size)
        console.log(e)
        const requestParams = {
          method: 'POST',
          mode: 'cors'
          body: file,
          contentType: file.type
        }
        const request = new Request('url', requestParams)

        fetch(request)
          .then( response => {
            console.log(response)
          })
      }
    })
  }
}

window.onload = load