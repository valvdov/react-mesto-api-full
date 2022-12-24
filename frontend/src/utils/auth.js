class Auth {
  constructor(url) {
    this._url = url;
  };

  login = (email, password) => {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    }).then((res) => this._getResponse(res))
  };

  register = (email, password) => {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    }).then((res) => this._getResponse(res))
  };

  getContent = (token) => {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }).then((res) => this._getResponse(res))
  }

  _getResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  };
}

const auth = new Auth('https://api.mesto.valvdov.nomoredomains.club');
//const auth = new Auth('http://192.168.0.35:3000');
export default auth;
