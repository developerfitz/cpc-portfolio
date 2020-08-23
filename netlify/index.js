console.log("Hello Examiners let's get this started!")

function load(){
  const uploadButton = document.getElementById('#upload_button')
  const responseDiv = document.getElementById('#response')

  if (uploadButton) {
    const data = {name: 'good data'}

    uploadButton.addEventListener('click', (e) => {
      const uploadInput = document.getElementById('#upload_input')
      let BUCKET = ''
      let processedFileKey = ''
      // let getUploadeFileUrl = ''
      let getProcessedFileUrl = ''

      responseDiv.innerText = 'Loading...'


      for (let file of uploadInput.files) {
        console.log(file.name, file.type, file.size)
        console.log(file)
        const getTest = async () => {
          // const url = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
          const uploadUrl = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/examiner-portfolio'
          const downloadUrl = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev/get-processed-excel-sheet'
          // This should probably just be a get for the presigned url
          // not a put or uploading of the file
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
          // PUT request for 🤷🏽‍♂️ but I get a presigned url
          const req = new Request(uploadUrl, options)
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

              // another request to upload file to S3 with presigned url
              // TODO: ensure the upload happens before the next call
              const putOptions = {
                method: 'PUT',
                mode: 'cors',
                headers: {
                  'Accept': file.type,
                  'Content-Type': file.type,
                  'X-filename': file.name,
                  'X-size': file.size,
                },
                body: file,
              }
              const putReq = new Request(data.presignedUrl, putOptions)
              fetch(putReq)
                .then(res => {
                  // const putFulfilled = res.json()
                  console.log(res)
                  // console.log(putFulfilled)
                  // return res.json()
                })
                // .then(data => {
                //   console.log(data)
                //   // usingthis data should be able
                // })
              // console.log(data.json())

              // Start the file to be processed and downloaded
              // TODO: ensure the file is uploaded before sending this request
              const downloadFileOptions = {
                method: 'PUT',
                mode: 'cors',
                // headers: {
                //   'Accept': file.type,
                //   'Content-Type': file.type,
                // },
                body: JSON.stringify({
                  filename: file.name,
                  contentType: file.type,
                  message: 'Local - can I have a url please?'
                })
              }
              const getExcelFile = new Request(
                downloadUrl, 
                downloadFileOptions)
              // console.log(downloadFileOptions.body)
              fetch(getExcelFile)
                .then( res => {
                  // response = res.json()
                  // console.log(res)
                  // console.log(response)
                  return res.json()
                })
                .then( data => {
                  console.log(data)
                  responseDiv.innerText = `Your file ${data.filename} has been downloaded. Thank you for waiting. ${data.message}.`
                  // getProcessedFileUrl = data.presignedUrl
                  window.open(data.presignedUrl, '_blank')
                  // fetch(data.presignedUrl,
                  //   { method: 'GET',
                  //     mode: 'cors',     
                  //   }
                  // )
                  //   .then( res => console.log(res) ) 
                  //   .then( data => console.log(data) )
                })

            })
        }  
        getTest()
      }
    })
  }
}

window.onload = load