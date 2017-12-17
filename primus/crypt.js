let crypto = require('crypto');


let private_key = `-----BEGIN RSA PRIVATE KEY-----
MIIBOQIBAAJAbIPKuBsvHf65r4KLVZ+C6GrLsV2Gn9T9fh2wP1lrFUpFS/y/KTLE
2K4zZq0vQePODdnMzPq8qeWyN44qk6PLZwIDAQABAkA7DT00ExcA662ApTnNzpAe
in9udcbdE7se9mkDEFYFrz5h0/tu6Oo4eau04HIZRGPokBMSJZC37vQ/OficIpcB
AiEAvGtSkvDYI70rj9oiLBXN02xIzGYEUyqWbjHFI9AuVk8CIQCTb6K6J1M2ob3f
DTPKmK/l3X1HXQYC1vE7MTYT0AMLaQIgVfW0j1sXkH5+QDupOWmdJGaTc8TbFkIo
rQ9BvEv+x9sCIGOuJXIAZnVYUzv7/BkstDgQUMQv84F1+zDO68XnbDeJAiEAt5Dp
K+k8pGHi3yJyu46T2fg7cWCDjeXS5l/hvhurywg=
-----END RSA PRIVATE KEY-----`;

exports.encrypto = function (data, spark) {
  let commkey = getCommKey(spark);
  let encrypt_data = '';
  data = JSON.stringify(data);
  let cipher = crypto.createCipheriv('AES-256-ECB', commkey, '');
  cipher.setAutoPadding(true);
  encrypt_data += cipher.update(data, 'utf8', 'base64');
  encrypt_data += cipher.final('base64');
  return encrypt_data;
};
exports.decrypto = function (data, spark) {

  let commkey = getCommKey(spark);
  let decipher = crypto.createDecipheriv('AES-256-ECB', commkey, '');
  decipher.setAutoPadding(true);
  let dec = decipher.update(data, 'base64', 'utf8');
  dec += decipher.final('utf8');
  data = dec;

  try {
    data = JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
  return data;
};

function getCommKey(spark) {
  if (!spark.query || !spark.query.login) {
    console.log('error: commkey not in primus url');
    return;
  }
  let encrypt_commkey = spark.query.login;
  var encrypt_buffer = Buffer.from(encrypt_commkey, 'base64');
  let decrypt_buffer = crypto.privateDecrypt({
    key: private_key,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, encrypt_buffer);
  let decrypt_str = decrypt_buffer.toString('utf8');
  let decrypt_obj = getQueryString(decrypt_str);
  let commkey = decrypt_obj.commKey;
  return commkey;
}

function generateKey() {
  var prime_length = 512;
  var diffHell = crypto.createDiffieHellman(prime_length);

  diffHell.generateKeys('base64');
  let public_key = diffHell.getPublicKey('base64');
  let private_key = diffHell.getPrivateKey('base64');
  return {
    public_key: public_key,
    private_key: private_key
  };
}

function getQueryString(query) {
  var query_string = {};
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}