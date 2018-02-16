import { create } from 'apisauce';

const api = create({
  baseURL: 'https://api.screenhole.net',
  // baseURL: 'https://screenhole-api.ngrok.io',
  // baseURL: 'https://staging-api.screenhole.net',
});

// reset on 401 API responses
api.addResponseTransform(response => {
  if (!response.ok) {
    if (response.status === 401) {
      api.resetLocalStorage();
      window.location = window.location;
    }
  }
});

api.currentUser = null;
api.authenticated = false;

api.setCurrentUser = user => {
  localStorage.setItem('user_current', JSON.stringify(user));

  api.currentUser = user;
};

api.setAuthHeader = token => {
  localStorage.setItem('default_auth_token', token);
  api.setHeader('Authorization', `Bearer ${token}`);

  api.authenticated = !!token;
};

api.resetLocalStorage = () => {
  localStorage.removeItem('default_auth_token');
  localStorage.removeItem('user_current');
};

// TEMP: migrate from user_token to default_auth_token
if (localStorage.getItem('user_token')) {
  localStorage.setItem(
    'default_auth_token',
    localStorage.getItem('user_token'),
  );

  localStorage.removeItem('user_token');
}

if (localStorage.getItem('default_auth_token')) {
  api.setAuthHeader(localStorage.getItem('default_auth_token'));
}

if (localStorage.getItem('user_current')) {
  api.setCurrentUser(JSON.parse(localStorage.getItem('user_current')));
}

export default api;
