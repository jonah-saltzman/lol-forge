let isDev: boolean

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    isDev = true
} else {
    isDev = false
}

const apiUrl = isDev ? 'http://localhost:4001' : 'https://api.lol.jonahsaltzman.dev'

export default apiUrl