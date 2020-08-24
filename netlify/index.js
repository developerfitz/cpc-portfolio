console.log("Hello Examiners")

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
            },
            body: file,
          }
          // PUT request for 🤷🏽‍♂️ but I get a presigned url
          const req = new Request(uploadUrl, options)
          const getPresignedUploadUrl = await fetch(req)
            .then(resolve => {
              const fulfilled = resolve.json()
              console.log(resolve)
              console.log(fulfilled)
              return fulfilled 
            }, rejected => new Error('Upload url not recieved'))
            .then(async (data) => {
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
              const getPresignedDownloadUrl = await fetch(putReq)
                .then(resolve => {
                  console.log(resolve)
                }, rejected => new Error('Download Url not recieved'))

              // Start the file to be processed and downloaded
              // TODO: ensure the file is uploaded before sending this request
              const downloadFileOptions = {
                method: 'PUT',
                mode: 'cors',
                body: JSON.stringify({
                  filename: file.name,
                  contentType: file.type,
                  message: 'Local - can I have a url please?'
                })
              }
              const getExcelFile = new Request(
                downloadUrl, 
                downloadFileOptions)
              const startProcessingFile = await fetch(getExcelFile)
                .then( resolve => {
                  return resolve.json()
                })
                .then( data => {
                  console.log(data)
                  responseDiv.innerText = `
                    Your file ${data.filename} has been downloaded. 
                    Thank you for waiting. 
                    ${data.message}.
                    `
                  window.open(data.presignedUrl, '_blank')
                })
                .catch( error => {
                  console.warn(error)
                  return new Error('File not processed.')
                })

            })
        }  
        getTest()
      }
    })
  }
}

window.onload = load