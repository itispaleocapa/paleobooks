const api = {
    request: (url = "", method = "GET", body = null, bearer = null) => {
        return new Promise((resolve, reject) => {
            fetch(process.env.REACT_APP_API_URL + url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + (bearer !== null ? bearer : sessionStorage.getItem('access_token'))
                },
                body: body
            }).then(res => {
                if (res.status < 200 || res.status > 299) {
                    if (url !== '/auth/login' && url !== '/auth/paleoid' && url !== '/auth/refresh-token' && res.status === 400 && localStorage.getItem('refresh_token') != null) {
                        res.json().then(res => {
                            if (res.error.includes('access token')) {
                                api.request('/auth/refresh-token', 'POST', null, localStorage.getItem('refresh_token')).then((res) => {
                                    sessionStorage.setItem('access_token', res.access_token);
                                    api.request(url, method, body).then((res) => {
                                        resolve(res);
                                    }).catch(() => {
                                        reject();
                                    })
                                }).catch(() => {
                                    reject();
                                })
                            }
                            else {
                                reject(res);
                            }
                        })
                    }
                    else {
                        res.json().then(res => {
                            reject(res);
                        }).catch(() => {
                            reject();
                        });
                    }
                } else {
                    res.json().then(res => {
                        resolve(res);
                    })
                }
            });
        });
    },
    login: (email, password) => {
        return new Promise((resolve, reject) => {
            api.request('/auth/login', 'POST', JSON.stringify({email: email, password: password})).then(res => {
                sessionStorage.setItem('access_token', res.access_token);
                localStorage.setItem('refresh_token', res.refresh_token);
                localStorage.setItem('user_class', '');
                resolve();
            }).catch(() => {
                reject();
            })
        });
    },
    loginPaleoID: (code) => {
        return new Promise((resolve, reject) => {
            api.request('/auth/paleoid', 'POST', JSON.stringify({code: code, redirect_uri: process.env.REACT_APP_PALEOID_REDIRECT_URI})).then(res => {
                sessionStorage.setItem('access_token', res.access_token);
                localStorage.setItem('refresh_token', res.refresh_token);
                localStorage.setItem('user_class', res.class);
                resolve();
            }).catch(() => {
                reject();
            })
        });
    },
    logout: () => {
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token')
    },
    isLoggedIn: () => {
        return new Promise((resolve, reject) => {
            api.request('/users/profile').then(res => {
                localStorage.setItem('user_id', res.id);
                localStorage.setItem('user_email', res.email);
                resolve();
            }).catch(() => {
                reject();
            })
        });
    }
}

export default api;