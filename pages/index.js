import { useEffect, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import FrameWrapper from '../components/FrameWrapper';
import { Button, Alert, Dropdown, DropdownButton } from 'react-bootstrap';
import { decodeAndPrettify } from '../utils/prettifier';
import languages from '../language/languages';
import { getServerProps } from '../server/serverUtils';
import base64Url from 'base64url';
import totp from 'totp-generator';

const defaultSize = { height: 600, width: 1024 };

const Index = (props) => {

  const dom = 'https://auth.flex.ciprecision.com:8443';
  const api = 'https://api.flex.ciprecision.com:5000'

  var addresses = {
    authBase: dom,
    loginUrl: `${dom}/login`,
    serviceUrl: `${dom}/service`,
    loginSys: `${dom}/api/auth`,
    loginExt: `${dom}/api/external`,
    tokenUrl: `${dom}/api/token`,
    logoutUrl: `${dom}/logout`,
    passChange: `${dom}/passchange`,
    flexFrame: `http://flex:3000`
  }

  const { authBase, loginUrl, serviceUrl, tokenUrl, logoutUrl, passChange, loginSys, flexFrame, loginExt } = addresses;

  const [showLogin, setShowLogin] = useState(false);
  const [showService, setShowService] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showFlex, setShowFlex] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [access, setAccess] = useState('');
  const [lang, setLang] = useState('en');

  const [frameSize, setFrameSize] = useState(defaultSize);

  useEffect(() => {
    const language = localStorage.getItem('language');
    const lang = language || 'en';
    setLang(lang);
    setAccess(sessionStorage.getItem('accessToken'));
  }, []);

  // this is the listener for messages from the FrameWrapper component (iFrame)
  const onFrameMessage = (message) => {
    setErrMessage(``);
    const { type } = message;
    switch (type) {
      case 'cancel':
        setShowLogin(false);
        setShowService(false);
        setShowPass(false);
        setShowFlex(false);
        setFrameSize(defaultSize);
        break;
      case 'token':
        // extract the tokens
        const { accessToken } = message;

        // Access_token stored in memory only for security reasons
        setAccess(accessToken);
        sessionStorage.setItem('accessToken', accessToken);

        setShowLogin(false);
        setShowService(false);
        break;
      case 'logout':
        setAccess('');
        sessionStorage.removeItem('accessToken');
        break;
    }
  }

  // if the access token does not exist (e.g. browser was refreshed)
  // fetch from auth endpoint (require user logged in)
  const getToken = async () => {
    setErrMessage(``);
    const url = `${tokenUrl}?lang=${lang}`;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
    });
    const json = await response.json();
    if (response.ok) {
      // extract and store token in memory
      const { accessToken } = json;
      setAccess(accessToken);
      sessionStorage.setItem('accessToken', accessToken);
    } else {
      const { error } = json;
      setErrMessage(`${response.statusText}: ${error}`);
    }
  }

  const logout = async () => {
    setErrMessage(``);
    const url = `${logoutUrl}?lang=${lang}`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
    });
    const json = await response.json();
    if (response.ok) {
      // the browser should remove the authentication cookie (auth domain) that was created when we logged in
      // we need to remove the other stuff...
      setAccess('');
      sessionStorage.removeItem('accessToken');
    } else {
      const { error } = json;
      setErrMessage(`${response.statusText}: ${error}`);
    }
  }

  const generateFactor = () => {
    const baseKey = 'QD3VSKBXXBIR36USUIXBYH2IOIKIGPPG';
    var token = totp( baseKey, {
        period: 30,
        digits: 6,
        algorithm: 'SHA-1'
      }
    );
    return token;
  }

  const sysLogin = async () => {
    setErrMessage(``);

    const factor = generateFactor();
    let userpass = base64Url.encode(`client:${factor}`);

    const url = `${loginSys}?mode=system`;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${userpass}`,
        'accept-language': lang
      })
    });
    const json = await response.json();
    if (response.ok) {
      // extract and store token in memory
      const { accessToken } = json;
      setAccess(accessToken);
      sessionStorage.setItem('accessToken', accessToken);
    } else {
      const { error } = json;
      setErrMessage(`${response.statusText}: ${error}`);
    }
  }

  const extLogin = async () => {
    setErrMessage(``);

    const username = 'externaluser'
    const password = 'anythingyouwant';

    let userpass = base64Url.encode(`${username}:${password}`);

    const url = `${loginExt}`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${userpass}`,
        'accept-language': lang
      })
    });
    const json = await response.json();
    if (response.ok) {
      // extract and store token in memory
      const { accessToken } = json;
      setAccess(accessToken);
      sessionStorage.setItem('accessToken', accessToken);
    } else {
      const { error } = json;
      setErrMessage(`${response.statusText}: ${error}`);
    }
  }

  const changeLanguage = (key) => {
    localStorage.setItem('language', key);
    setLang(key);
  }

  const langItems = () => {
    var items = [];
    Object.keys(languages).forEach(val => {
      const dict = languages[val];
      const { language } = dict;
      const item = <Dropdown.Item eventKey={val} key={val}>{language}</Dropdown.Item>
      items.push(item);
    });
    return items;
  }

  const accessPretty = decodeAndPrettify(access);

  const language = languages[lang].language;

  const langParam = `?lang=${lang}`;

  return (
    <PageWrapper>
      <Button className='menu-button' onClick={() => { setShowLogin(true) }}>Local/Domain</Button>
      <Button className='menu-button' onClick={() => { setShowService(true) }}>Service</Button>
      <Button className='menu-button' onClick={sysLogin}>System</Button>
      <Button className='menu-button' onClick={extLogin}>External</Button>
      <Button className='menu-button' onClick={getToken}>Token</Button>
      <Button className='menu-button' onClick={() => { setShowFlex(true) }}>Flex Frame</Button>
      <Button className='menu-button' onClick={logout}>Logout</Button>
      <Button className='menu-button' onClick={() => { setShowPass(true) }}>Change Password</Button>
      <DropdownButton title={language} onSelect={changeLanguage} style={{ display: 'inline-block' }}>
        {langItems()}
      </DropdownButton>
      <hr />
      <a href={authBase} target="_blank" rel="noopener noreferrer">Open app in new tab</a>
      <FrameWrapper
        targetUrl={loginUrl + langParam}
        show={showLogin}
        onMessage={onFrameMessage}
        sourceDomain={authBase}
        onHide={() => setShowLogin(false)}
        height={frameSize.height}
        width={frameSize.width}
        blurredId='host'
      />
      <FrameWrapper
        targetUrl={serviceUrl + langParam}
        show={showService}
        onMessage={onFrameMessage}
        sourceDomain={authBase}
        onHide={() => setShowService(false)}
        height={frameSize.height}
        width={frameSize.width}
        blurredId='host'
      />
      <FrameWrapper
        targetUrl={passChange + langParam}
        show={showPass}
        onMessage={onFrameMessage}
        sourceDomain={authBase}
        onHide={() => setShowPass(false)}
        height={frameSize.height}
        width={frameSize.width}
        blurredId='host'
      />
      <FrameWrapper
        targetUrl={flexFrame}
        show={showFlex}
        onMessage={onFrameMessage}
        sourceDomain='http://flex:3000'
        onHide={() => setShowFlex(false)}
        height={frameSize.height}
        width={frameSize.width}
        blurredId='host'
      />
      <hr />
      <p>Access Token</p>
      <div style={{whiteSpace: 'pre'}}>
        {accessPretty}
      </div>
      {errMessage && <Alert key='error' variant='danger' dismissible onClose={() => setErrMessage(null)}>{errMessage}</Alert>}
    </PageWrapper>
  )
}

export default Index;

export const getServerSideProps = async (context) => {
  return getServerProps(context);
}
