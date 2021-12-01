const { exec } = require('child_process')

export default (req, res) => {
  let { message } = req.body
  if (message != undefined && message.length > 0) {
    let cmd = `echo ${message} | openssl smime -sign -binary -outform DER -noattr -signer /keys/cert.pem -inkey /keys/key.pem | base64`
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