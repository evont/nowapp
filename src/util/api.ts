const PREFIX = 'https://now.nefelibata.art/api/v1/'

const APIMAP = {
  HOME: 'home',
  NIPPONCOLOR: 'getColor',
  POEM: 'poem',
  ENCLAVE: 'enclave',
  ENCLAVE_ARTICLE: 'enclave/article',
  ESSAY: 'essay',
  TOTHEEND: 'totheend/today'
}

function queryString(obj?:Object) {
  if (!obj) {
    return '';
  }
  return '?' + Object.keys(obj).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
  }).join('&')
}

function getURL(api:string, query?:Object) {
  return `${PREFIX}${api}${queryString(query)}`
}

export default {
  getURL,
  APIMAP,
}