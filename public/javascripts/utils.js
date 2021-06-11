/**
 * @param {DOMString} selector 
 * @returns {Element}
 */
export const $ = (selector) => document.querySelector(selector)

/**
 * @param {DOMString} selector 
 * @returns {NodeList}
 */
export const $$ = (selector) => document.querySelectorAll(selector)

/**
 * @typedef {Response & {data: any}} HttpResponse
 */
export const http = (function create(defaults = {}) {
  /**
   * @param {string} url
   * @param {RequestInit & {
   * baseURL?: string
   * url?: RequestInfo
   * query?: Record<any, any>
   * json?: Record<any, any>
   * data?: Record<any, any>
   * form?: HTMLFormElement
   * modifyRequest?: function
   * ignoreStatus?: boolean
   * modifyResponse?: function
   * }} [config={}]
   * @returns {Promise<HttpResponse>}
   */
  function http(url, config = {}) {
    Object.assign(config, defaults);
    config.url = url;
    config.method = config.method?.toUpperCase() ?? 'GET';
    config.headers = config.headers || {};
    const { query, json, data, form, body } = config;

    if (config.baseURL) {
      config.url = '' + new URL(url, config.baseURL);
    }

    if (query) {
      config.url += `?${new URLSearchParams(query).toString()}`;
    }

    if (!body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      if (json) {
        config.headers['content-type'] = 'application/json';
        config.body = JSON.stringify(json);
      } else if (data) {
        config.body = new URLSearchParams(data);
      } else if (form) {
        config.body = new FormData(form);
      }
    }

    config = config.modifyRequest ? config.modifyRequest(config) : config;

    return fetch(config.url, config).then(async (
      /** @type {HttpResponse} */ response
    ) => {
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      response.data = isJson ? await response.json() : await response.text();

      const ok = response.ok || config.ignoreStatus;

      response = config.modifyResponse
        ? config.modifyResponse(response)
        : response;

      return ok ? response : Promise.reject(response);
    });
  }

  http.get = (url = '', config) => http(url, { ...config, method: 'GET' });
  http.post = (url = '', config) => http(url, { ...config, method: 'POST' });
  http.put = (url = '', config) => http(url, { ...config, method: 'PUT' });
  http.patch = (url = '', config) => http(url, { ...config, method: 'PATCH' });
  http.delete = (url = '', config) =>
    http(url, { ...config, method: 'DELETE' });

  http.create = create;

  return http;
})();

/**
 * @param {Event} event
 * @returns {Promise<HttpResponse>}
 */
export function submitFormEvent(event) {
  event.preventDefault();

  /** @type {HTMLFormElement} */
  const form = event.target;
  const data = new FormData(form);
  const url = new URL(form.action);

  const options = {
    method: form.method
  }

  if (form.method.toUpperCase() === 'GET') {
    const allSearch = {
      ...Object.fromEntries(url.searchParams),
      ...Object.fromEntries(data),
    };
    url.search = new URLSearchParams(allSearch);
  } else {
    options.body = new URLSearchParams(data)
  }

  return http(url, options);
}
