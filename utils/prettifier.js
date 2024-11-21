import JWT from 'jsonwebtoken';

const decodeAndPrettify = (token) => {
  let pretty = 'null';
  if (!!token) {
    const decoded = JWT.decode(token);
    pretty = JSON.stringify(decoded, null, 2);
  }
  return pretty;
};

const prettify = (data) => {
  let pretty = 'null';
  if (!!data) {
    pretty = JSON.stringify(data, null, 2);
  }
  return pretty;
}

export {
  decodeAndPrettify,
  prettify
}
