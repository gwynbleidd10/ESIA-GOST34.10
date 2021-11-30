const { v4: uuidv4 } = require('uuid')
const { exec } = require('child_process')

export default async (req, res) => {
  let { message } = req.body

  let fileName = `/tmp/${uuidv4()}`
  let cmd = `docker run --rm -v $(pwd):$(pwd) -w $(pwd) rnix/openssl-gost openssl smime -sign -binary -outform DER -noattr -signer /root/keys/cert.pem -inkey /root/keys/key.pem -out ${fileName}.p7b && cat ${fileName}.p7b | base64`

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