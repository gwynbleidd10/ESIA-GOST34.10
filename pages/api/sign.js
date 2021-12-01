const { exec } = require('child_process')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

export default (req, res) => {
  let { message } = req.body

  if (message != undefined && message.length > 0) {
    let fileName = uuidv4()
    fs.writeFile(fileName, message, function (err, data) {
      // let cmd = `echo ${message} | openssl smime -sign -binary -outform DER -noattr -signer /keys/cert.pem -inkey /keys/key.pem | base64`
      let cmd = `cat ${fileName} | openssl smime -sign -binary -outform DER -noattr -signer /keys/cert.pem -inkey /keys/key.pem -out /tmp/${fileName}.p7b && cat /tmp/${fileName}.p7b | base64`
      console.log(cmd)
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.log('Error: ', err);
          res.status(500).json({
            error: stderr
          })
        }
        else {
          let out = stdout.replace(/[\n\r]/g, '')
          out = out.replace(/=/g, '')
          out = out.replace(/\+/g, '-')
          out = out.replace(/\//g, '_')
          res.status(200).json({ signed: out })
        }
      })
    })
  }
  else {
    res.status(400).json({
      message: 'Отсутствует обязательное поле "message"'
    })
  }
}