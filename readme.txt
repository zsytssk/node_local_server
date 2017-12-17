
```javascript
var CryptoJS = require("crypto-js");

var data = [{id: 1}, {id: 2}]

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123');

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData);
let encrypt_data = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(config.commKey), {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
});



// JSEncrypt
// 支持 512、1024、2048、4096
// key 越长, 生成密钥和加密时间越长
let crypt = new JSEncrypt({
  default_key_size: 512
});

// 获取公钥
let public_key = crypt.getPublicKey();
`-----BEGIN PUBLIC KEY-----
MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAbIPKuBsvHf65r4KLVZ+C6GrLsV2Gn9T9
fh2wP1lrFUpFS/y/KTLE2K4zZq0vQePODdnMzPq8qeWyN44qk6PLZwIDAQAB
-----END PUBLIC KEY-----`

'SL6kwjItTFyrtc+EMS4Az5KlZxwWOHazedU5y+EHCAUdzHuNnmiEZrudmAgPBpUXYjtBS1/2JaZIo70yWpwb/Q=='

// 获取私钥
let private_key = crypt.getPrivateKey();
`-----BEGIN RSA PRIVATE KEY-----
MIIBOQIBAAJAbIPKuBsvHf65r4KLVZ+C6GrLsV2Gn9T9fh2wP1lrFUpFS/y/KTLE
2K4zZq0vQePODdnMzPq8qeWyN44qk6PLZwIDAQABAkA7DT00ExcA662ApTnNzpAe
in9udcbdE7se9mkDEFYFrz5h0/tu6Oo4eau04HIZRGPokBMSJZC37vQ/OficIpcB
AiEAvGtSkvDYI70rj9oiLBXN02xIzGYEUyqWbjHFI9AuVk8CIQCTb6K6J1M2ob3f
DTPKmK/l3X1HXQYC1vE7MTYT0AMLaQIgVfW0j1sXkH5+QDupOWmdJGaTc8TbFkIo
rQ9BvEv+x9sCIGOuJXIAZnVYUzv7/BkstDgQUMQv84F1+zDO68XnbDeJAiEAt5Dp
K+k8pGHi3yJyu46T2fg7cWCDjeXS5l/hvhurywg=
-----END RSA PRIVATE KEY-----`



const crypto = require('crypto');
const sign = crypto.createSign('RSA-SHA256');

sign.update('some data to sign');

const privateKey = getPrivateKeySomehow();
console.log(sign.sign(privateKey, 'hex'));


var crypto = require('crypto');

var prime_length = 60;
var diffHell = crypto.createDiffieHellman(prime_length);

diffHell.generateKeys('base64');
console.log("Public Key : " ,diffHell.getPublicKey('base64'));
console.log("Private Key : " ,diffHell.getPrivateKey('base64'));

let PublicKey =  "0k253c/rTYEN+yx5JvwBDZHsgONIwUlTc8VXOyoQsOOU4VFWi9IKD8vjXMytSt0EC2V2jE/LL8EEUrv2XTzyJg==";
let PrivateKey =  "QkYk8MvQrNFplSqFgzgU3ZE74db8gBspc3v9KKrnXTHnuMqoxojYEAPa43mFhYYf2Rcy/AIjDJDVZhO0O/t7Mw==";


// rsa 验证
var crypto = require('crypto');
var fs = require('fs');
var privatePem = fs.readFileSync('server.pem');
var publicPem = fs.readFileSync('cert.pem');
var key = privatePem.toString();
var pubkey = publicPem.toString();
var data = "abcdef"
var sign = crypto.createSign('RSA-SHA256');
sign.update(data);
var sig = sign.sign(key, 'hex');
var verify = crypto.createVerify('RSA-SHA256');
verify.update(data);
verify.update(data);
verify.verify(pubkey, sig, 'hex');



crypto.privateDecrypt(private_key, buffer);
crypto.privateEncrypt(private_key, buffer);
crypto.publicDecrypt(public_key, buffer);
crypto.publicEncrypt(public_key, buffer);
```