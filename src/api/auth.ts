import call from "./caller"

const login = async (info: Login): Promise<LoginResponse> => {
    const result: LoginResponse = {
        loggedIn: false,
        email: null,
        token: null,
        message: 'Unknown error'
    }
    try {
        const req = await call('/auth/signin', 'POST', info)
        switch (req.status) {
            case 404:
                return {...result, message: 'User not found'}
            case 401:
                return {...result, message: 'Incorrect password'}
            case 500:
                return {...result, message: 'Unknown server error'}
            case 200:
                const res = await req.json() as ApiResponse
                const data = res.data as TokenResponse
                return {
                                loggedIn: true,
                                email: info.email,
                                token: data.token,
                                message: res.message,
                            }
            default:
                return {...result, message: 'Connection error'}
        }
    } catch {
        return result
    }   
}

const changePassword = async (info: ChangePass): Promise<boolean> => {
    try {
        const res = await call('/changepass', 'PATCH', info)
        return res.status === 200
    } catch {
        return false
    }
}

const signOut = async (token: string): Promise<boolean> => {
    const res = await call('/signout', 'GET', { token })
    console.log(res.status)
    return true
}

const signUp = async (info: Login): Promise<boolean> => {
    const res = await call('/auth/signup', 'POST', info)
    return res.status === 201
}

const api = {
    login,
    changePassword,
    signOut,
    signUp
}

export default api