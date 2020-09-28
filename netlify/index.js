// Lambda Urls
BASE_URL = 'https://7tmyw05dri.execute-api.us-east-1.amazonaws.com/dev'
UPLOAD_PORTFOLIO = `${BASE_URL}/examiner-portfolio`
PROCESS_DOWNLOAD = `${BASE_URL}/get-processed-excel-sheet`


function load(){
  const uploadButton = document.getElementById('#upload_button')
  const responseDiv = document.getElementById('#response')

  async function onClickHandler(e) {
    e.preventDefault()
    // Button to upload and capture the file
    const uploadInput = document.getElementById('#upload_input')
    // ! Assuming there is only one file being uploaded
    const file = uploadInput.files[0]

    // Get a presignedUrl to upload file to S3 prior to processing
    const presignedUrlRequest = new Request(UPLOAD_PORTFOLIO, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': file.type,
        'Content-Type': file.type,
        'X-filename': file.name,
        'X-size': file.size,
      },
      body: file.file
    })
    const response = await fetch(presignedUrlRequest)
      .then( 
        resolve => resolve.json(), 
        reject => `No url given --> ${reject}`
      )

    // Notify user of progress
    responseDiv.innerText = response.message

    // Upload file using the presignedUrl
    const uploadRequest = new Request(response.presignedUrl, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Accept': file.type,
          'Content-Type': file.type,
          'X-filename': file.name,
          'X-size': file.size,
        },
        body: file,
      })
    const uploadResponse = await fetch(uploadRequest)
      .then(
        resolve => { 
          console.log(`File ${file.name} uploaded.`)
          console.log(resolve.status)
        },
        reject => `Not uploaded --> ${reject}`
      )
    
    // Call Lambda to process uploaded file and then download from S3
    const processFileRequest = new Request(PROCESS_DOWNLOAD, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        message: 'Request - please process and send the processed file.'
      })
    })
    const processFileResponse = await fetch(processFileRequest)
      .then( 
        resolve => resolve.json(), 
        reject => `No url given --> ${reject}`
      )
    
    // Notify user and download file in separate tab
    responseDiv.innerText = `
      Your file ${processFileResponse.filename} has been downloaded. 
      Thank you for waiting. 
      ${processFileResponse.message}.
    `
    window.open(processFileResponse.presignedUrl, '_blank')

  }

  if (uploadButton) {
    uploadButton.addEventListener('click', onClickHandler)
  }
}

window.onload = load