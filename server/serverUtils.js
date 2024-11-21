import languages from '../language/languages';
import JWT from 'jsonwebtoken';

const decodeToken = (token) => {
  const data = JWT.decode(token);
  return data;
}

const getDictionary = (req) => {
  const { headers, query } = req;
  // determine the language to use
  // use language from header unless overridden by url parameter
  const acceptLang = headers['accept-language'];
  const headLang = acceptLang && acceptLang.substring(0,2);
  var { lang = headLang } = query; // from url parameter
  // if we don't support the language, default to English
  if (!Object.keys(languages).includes(lang)) lang = 'en';
  const dict = languages[lang];
  req.dict = dict; // attach to request object
  return { lang, dict }; // pass back
}

const getServerProps = (context) => {
  const { req } = context;
  const { auth = null } = req.cookies;
  const { referer = null } = req.headers;
  
  // extract user info from the 'auth' token
  var username = '';
  var fullName = '';
  if (auth) {
    const payload = decodeToken(auth);
    ({ username = '', fullName = '' } = payload);
  }

  // returns the language identifier e.g. nl
  // sets the dict property of req e.g. req.dict
  const { lang, dict } = getDictionary(req);

  return { props: { lang, dict, referer, username, fullName } };
}

export {
  getServerProps,
  getDictionary
}
