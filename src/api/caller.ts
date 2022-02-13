import apiUrl from '../config'

const call = (
	endpoint: string,
	method: string,
	info?: any
): Promise<Response> => {
	const headers = {
		'Content-Type': info ? 'application/json' : null,
		JWT: info?.token ? info.token : null,
	}
	console.log('calling API with headers:')
	console.log(headers)
	return fetch(apiUrl + endpoint, {
		method: method,
		headers,
		body: info ? JSON.stringify(info) : null,
	})
}

export default call