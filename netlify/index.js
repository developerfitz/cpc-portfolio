console.log("Hello Examiners!")

function load(){
  const uploadButton = document.getElementById('#upload_button')

  if (uploadButton) {
    const data = {name: 'good data'}

    uploadButton.addEventListener('click', (e) => {
      const uploadInput = document.getElementById('#upload_input')


      for (let file of uploadInput.files) {
        console.log(file.name, file.type, file.size)
        console.log(file)
        const getTest = async () => {
          // const url = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
          const url = 'http://localhost:5000/test'
          const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Accept': file.type,
              'Content-Type': file.type,
              'Access-Control-Allow-Origin': 'http://localhost:8888'
            },
            body: file,
          }

          const req = new Request(url, options)
          await fetch(req)
            .then(res => console.log(res))
            .then(data => console.log(data))
        }  
        getTest()


        // const get = async () => {
        //   const response = await fetch(url, requestParams)
        //   return response.json()
        // }
        // get().then( data =>{
        //   console.log(data)
        // })
        // fetch(url, requestParams)
        //   .then(data => {
        //     console.log(data)
        //   })
        // const request = new Request('url', requestParams)

        // fetch(request)
        //   .then( response => {
        //     console.log(response)
        //   })
      }
    })
  }
}

window.onload = load