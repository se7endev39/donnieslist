import client from 'axios';
import {
    DEVELOPMENT_URL, 
    PRODUCTION_URL, 
    STAGING_URL, TEST_URL
} from './constants/apis';

const environmentUrl = {
    test: TEST_URL,
    production: PRODUCTION_URL,
    development: DEVELOPMENT_URL,
    staging: STAGING_URL
};

const getAuthorizationHeader = () => new Promise(
    async resolve => {
        const accessToken = await localStorage.getItem('accessToken');
        if (accessToken) {
            resolve('Bearer ' + accessToken);
        } else {
            resolve(null);
        }
    }
);

export async function getEnvironmentUrl() {
    return await localStorage.getItem('environmentUrl') || environmentUrl.production;
}

export const CreateAxios = () => new Promise(resolve => {
    getAuthorizationHeader().then(async authHeader => {
        const axios = client.create({
            baseURL: await getEnvironmentUrl(),
            validateStatus: status => status >= 200 && status < 300,
            headers: {'Content-Type': 'application/json'}
        });

        axios.interceptors.request.use(
            config => {
                if (authHeader) {
                    config.headers['Authorization'] = authHeader;
                }
                return config;
            },
            error => {
                const errorObj = {boundaryId: 'fetchRequest', details: error};
                throw errorObj;
            }
        );

        axios.interceptors.response.use(
            response => {
                if (!response.data || typeof response.data === 'string') {
                    const errorObj = {boundaryId: 'fetchResponse', details: response};
                    throw errorObj;
                } else {
                    return response;
                }
            },
            error => {
                if (error.response ? error.response.status === 401 : false) {
                    localStorage.removeItem('accessToken');
                    //TODO: Navigate to login
                    // window.location = '/account/login';
                    return;
                }
                if (
                    !error.response
                    || !error.response.status
                    || !(error.response.status >= 400 && error.response.status <= 403)
                ) {
                    // AppDialog$.next({
                    // type: 'error',
                    // title: `${error.response ? error.response.status : 'Error'}`,
                    // icon: 'lan-disconnect',
                    // content: `The smartphone cannot connect to the server.\nPlease try again in 10 minutes.`,
                    // status: true
                    // });
                }
                const errorObj = {boundaryId: 'fetchResponse', details: error};
                throw errorObj;
                }
        );
        resolve(axios);
    });
});