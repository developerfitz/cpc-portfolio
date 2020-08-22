console.log("Hello Examiners let's get this started!")

function load(){
  const uploadButton = document.getElementById('#upload_button')
  const responseDiv = document.getElementById('#response')

  if (uploadButton) {
    const data = {name: 'good data'}

    uploadButton.addEventListener('click', (e) => {
      const uploadInput = document.getElementById('#upload_input')
      responseDiv.innerText = 'Loading...'


      for (let file of uploadInput.files) {
        console.log(file.name, file.type, file.size)
        console.log(file)
        const getTest = async () => {
          // const url = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
          const url = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
          const options = {
            method: 'PUT',
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
              const fulfilled = res.json()
              console.log(res)
              // console.log(res.blob)
              // console.log(res.json())
              console.log(fulfilled)
              // console.log(res.json().status)
              // console.log(res.json().value)
              return fulfilled 
            })
            .then(data => {
              responseDiv.innerText = data.message
              console.log(data)
              const putOptions = {
                method: 'PUT',
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
              const putReq = new Request(data.presignedUrl, putOptions)
              fetch(putReq)
                .then(res => {
                  // const putFulfilled = res.json()
                  console.log(res)
                  // console.log(putFulfilled)
                })
                .then (data => {
                  console.log(data)
                })
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