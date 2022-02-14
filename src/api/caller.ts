import apiUrl from '../config'

const call = (
	endpoint: string,
	method: string,
	info?: any
): Promise<Response> => {
	if (method === 'GET') {
		if (info?.token) {
			return fetch(apiUrl + endpoint, {
				headers: { JWT: info.token },
			})
		} else {
			return fetch(apiUrl + endpoint)
		}
	}
	const headers = {
		'Content-Type': info ? 'application/json' : null,
		JWT: info?.token ? info.token : null,
	}
	return fetch(apiUrl + endpoint, {
		method: method,
		headers,
		body: info ? JSON.stringify(info) : null,
	})
}

export default call