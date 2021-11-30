const { v4: uuidv4 } = require('uuid')
const { exec } = require('child_process')
const fs = require('fs')

export default async (req, res) => {
  // let { message } = req.body
  let message = 'test'

  let fileName = `/tmp/${uuidv4()}`

  // let cmd = `docker run --rm -v $(pwd):$(pwd) -w $(pwd) rnix/openssl-gost openssl smime -sign -binary -outform DER -noattr -signer /keys/cert.pem -inkey /keys/key.pem -out ${fileName}.p7b && cat ${fileName}.p7b | base64`
  let cmd = `docker run --rm -v $(pwd):$(pwd) -w $(pwd) rnix/openssl-gost cat ${fileName}`
  console.log(cmd)

  fs.writeFile(fileName, message, function (err, data) {
    if (err) {
      console.log('Error', err);
      res.status(500).json({ status: 'error', error: err })
    }
    else {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.log('Error', err);
          res.status(500).json({ status: 'error', error: stderr })
        }
        else {
          let out = stdout.replace(/[\n\r]/g, '')
          // url safe base64
          out = out.replace(/=/g, '')
          out = out.replace(/\+/g, '-')
          out = out.replace(/\//g, '_')
          // out
          res.status(200).json({ status: 'ok', message: out })
        }
      })
    }
  })
}