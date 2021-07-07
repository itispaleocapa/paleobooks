const KEY = 'ENexnG5uYYU23429w8ftGSe7vC6T2Seq';
const PROXY_URL = 'http://localhost:8000/proxy.php';

const api = {
    request: (url: string = '', retry: number = 0) => {
        return new Promise((resolve: (value?: any) => void, reject) => {
            const rejectWrapper = () => {
                if (retry >= 5) {
                    reject();
                }
                else {
                    api.request(url, retry + 1).then(res => resolve(res)).catch(res => reject(res));
                }
            };
            fetch(PROXY_URL + '?' + (new URLSearchParams({ key: KEY, url }))).then(res => {
                const { status } = res;
                const afterJsonDecode = (status >= 200 && status <= 299) ? resolve : rejectWrapper;
                if (status === 204) {
                    resolve();
                }
                res.json().then(json => {
                    afterJsonDecode(json);
                }).catch(() => {
                    rejectWrapper();
                });
            }).catch(() => {
                rejectWrapper();
            });
        });
    },
};

export default api;
