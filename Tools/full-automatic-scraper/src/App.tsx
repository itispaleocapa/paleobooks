import { useEffect, useState } from 'react';

import Queue from 'queue-promise';

import api from './api';
import './App.css';

const ALS_HOST = 'https://www.adozionilibriscolastici.it/v1';
const SCHOOL_CODE = 'BGTF010003';

const App = () => {
    const [classes, setClasses] = useState([]);
    const [log, setLog] = useState<string[]>([]);

    const handleResponse = (data: any) => {
        const currentClass: any = classes.find((thisClass: any) => thisClass.CLID === data?.id);
        const className = currentClass?.CLASSE + currentClass?.SEZION;
        const message = new Date().toLocaleTimeString() + ' | ' + className + ': ' + (data.data ? (data.data.length + ' books found') : 'cannot fetch data');
        setLog(currentLog => {
            return [...currentLog, message];
        });
    };

    useEffect(() => {
        api.request(ALS_HOST + '/classi/' + SCHOOL_CODE).then(res => {
            setClasses(res);
        });
    }, []);

    useEffect(() => {
        const queue = new Queue({
            concurrent: 5,
            interval: 500
        });

        queue.on('resolve', data => handleResponse(data));
        queue.on('reject', data => handleResponse(data));

        classes.map((currentClass: any) => {
            // @ts-ignore
            queue.enqueue(() => new Promise((resolve, reject) => {
                api.request(ALS_HOST + '/libri/' + currentClass.CLID + '/' + SCHOOL_CODE).then(data => {
                    resolve({
                        id: currentClass.CLID,
                        data
                    });
                }).catch(() => {
                    reject({
                        id: currentClass.CLID
                    });
                });
            }));
        });

    }, [classes]);

    return (
        <div className='App'>
            <header className='App-header'>
                <p>
                    {log.map(item => (
                        <>{item}<br/></>
                    ))}
                </p>
            </header>
        </div>
    );
};

export default App;
