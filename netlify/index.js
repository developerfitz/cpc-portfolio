console.log("Hello Examiners let's get this started!")

function load(){
  const uploadButton = document.getElementById('#upload_button')
  const responseDiv = document.getElementById('#response')

  if (uploadButton) {
    const data = {name: 'good data'}

    uploadButton.addEventListener('click', (e) => {
      const uploadInput = document.getElementById('#upload_input')


      for (let file of uploadInput.files) {
        console.log(file.name, file.type, file.size)
        console.log(file)
        const getTest = async () => {
          // const url = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
          const url = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
          const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Accept': file.type,
              'Content-Type': file.type,
              'X-filename': file.name,
              'X-size': file.size,
              // 'Access-Control-Allow-Origin': 'http://localhost:8888',
              // 'Access-Control-Allow-Origin': 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
            },
            body: file,
          }

          const req = new Request(url, options)
          // const reqPromise = fetch(req)
          // console.log(reqPromise)
          fetch(req)
            .then(res => {
              fulfilled = res.json()
              console.log(res)
              // console.log(res.blob)
              // console.log(res.json())
              console.log(fulfilled)
              // console.log(res.json().status)
              // console.log(res.json().value)
              return fulfilled 
            })
            .then(data => {
              responseDiv.innerText = data
              console.log(data)
              // console.log(data.json())
            })
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