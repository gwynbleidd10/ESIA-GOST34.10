const { v4: uuidv4 } = require('uuid')
const { exec } = require('child_process')

export default (req, res) => {
  let { message } = req.body
  if (message != undefined && message.length > 0) {
    console.log("Message: ", message)

    let fileName = `/tmp/${uuidv4()}`
    let cmd = `echo ${message} | openssl smime -sign -binary -outform DER -noattr -signer /keys/cert.pem -inkey /keys/key.pem -out ${fileName}.p7b && cat .${fileName}.p7b | base64`

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.log('Error: ', err);
        res.status(500).json({
          error: stderr
        })
      }
      else {
        console.log("STDOUT: ", stdout)

        let out = stdout.replace(/[\n\r]/g, '')
        out = out.replace(/=/g, '')
        out = out.replace(/\+/g, '-')
        out = out.replace(/\//g, '_')

        res.status(200).json(out)
      }
    })
  }
  else {
    res.status(400).json({
      message: 'Отсутствует поле ["message"]'
    })
  }
}