const { v4: uuidv4 } = require('uuid')
const { exec } = require('child_process')
const fs = require('fs')

export default async (req, res) => {
  // let { message } = req.body
  let { message = 'test' } = req.query

  let fileName = `/tmp/${uuidv4()}`

  let cmd = `docker run --rm -v /tmp/:/API/tmp/ -v /keys:/API/keys -w /API rnix/openssl-gost openssl smime -sign -binary -outform DER -noattr -signer ./keys/cert.pem -inkey ./keys/key.pem | base64`

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

          out = out.replace(/=/g, '')
          out = out.replace(/\+/g, '-')
          out = out.replace(/\//g, '_')

          res.status(200).json({ status: 'ok', message: out })
        }
      })
    }
  })
}