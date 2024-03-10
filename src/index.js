const crypto = require('crypto');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Generate a key pair
crypto.generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
}, (err, publicKey, privateKey) => {
  if (err) throw err;

  // Share the public key with the Java program (e.g., send over network)
  console.log('Public key:', publicKey);
  let text = '';
  readline.question('Enter your encrypted text: ', (value) => {
    console.log(`Hello, ${value}!`);
    text = value;
    // Encrypt a message using the received encrypted message from Java
    const encryptedMessage = Buffer.from(text, 'base64');
    crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, encryptedMessage, (err, decrypted) => {
      if (err) throw err;
      console.log('Decrypted message:', decrypted.toString());
    });
    readline.close();
  });
  
});
