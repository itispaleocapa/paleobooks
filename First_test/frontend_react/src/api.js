const api = {
    request: (url = "", method = "GET", body = null) => {
        return new Promise((resolve, reject) => {
            fetch(process.env.REACT_APP_API_URL + url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
                },
                body: body
            }).then(res => {
                if (res.status !== 200) {
                    reject();
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
                var expiration_date = new Date();
                expiration_date.setFullYear(expiration_date.getFullYear() + 1);
                sessionStorage.setItem('access_token', res.access_token);
                document.cookie = "refresh_token=" + res.refresh_token + "; expires=" + expiration_date.toUTCString() + "; path=/";
                resolve();
            }).catch(() => {
                reject();
            })
        });
    },
    logout: () => {
        var expiration_date = new Date();
        expiration_date.setFullYear(expiration_date.getFullYear() + 1);
        sessionStorage.setItem('access_token', null);
        document.cookie = "refresh_token=; expires=" + expiration_date.toUTCString() + "; path=/";
    },
    isLoggedIn: () => {
        return new Promise((resolve, reject) => {
            api.request('/users/profile').then(res => {
                resolve();
            }).catch(() => {
                reject();
            })
        });
    }
}

export default api;