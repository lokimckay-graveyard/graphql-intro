import * as tunnel from 'tunnel';
import proxyConf from '../secret/proxyConf';

// Reference: https://janmolak.com/node-js-axios-behind-corporate-proxies-8b17a6f31f9d

// Proxy conf example:
// const proxyConf = {
//     host: 'your host',
//     port: 0000,
//     proxyAuth: 'your_username:your_pass'
// }

export const baseURL = `https://anapioficeandfire.com/api/`
const agent = tunnel.httpsOverHttp({
    proxy: proxyConf
});
export const axios = {
  baseURL,
  proxy: false,
  httpsAgent: agent
}
