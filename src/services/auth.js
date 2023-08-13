import Config from '@/config/config.js';

export const login = async (email, password) => {
    try {
        const url = Config.apiUrl + '/auth/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();
        if (response.status === 200) {
            if (data.access_token) {
                const token = data.access_token;
                const expires = new Date();
                const userName = data.user.first_name + ' ' + data.user.last_name;
                const role = data.user.role;
                const avatar = data.user.image;
                expires.setSeconds(expires.getSeconds() + data.expires_in);
                // guardar el token en cookies
                document.cookie = `token=${token};expires=${expires.toUTCString()}; path=/`;
                document.cookie = `userName=${userName};expires=${expires.toUTCString()}; path=/`;
                document.cookie = `rol=${role};expires=${expires.toUTCString()}; path=/`;
                document.cookie = `avatar=${avatar};expires=${expires.toUTCString()}; path=/`;

                return {
                    error: false,
                    redirect: 'Home'
                };
            } else {
                return {
                    error: false,
                    redirect: 'ChangePassword',
                    data: data.session
                }
            }
        } else {
            let errorMessage;
            if (data.detail.message) {
                errorMessage = data.detail.message;
            } else {
                errorMessage = 'Ah ocurrido un error, intente mas tarde'
            }

            return {
                error: true,
                message: errorMessage
            };
        }
    } catch (error) {
        console.log("🚀 ~ file: auth.js:41 ~ login ~ error:", error)
        throw new Error('Ah ocurrido un error en el servidor, intente mas tarde o contacte al administrador');
    }
}

export const getUser = async (accessToken) => {

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
        const response = await fetch(Config.apiUrl + '/auth/user', {
            method: 'GET',
            headers: headers
        });

        const data = await response.json();
        if (response.status === 200) {
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.log("🚀 ~ file: auth.js:83 ~ getUser ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }

}

export const isAuthenticated = async () => {
    try {
        const token = document.cookie.split(';').find(cookie => cookie.startsWith('token'));

        if (token) {
            const user = await getUser(token.split('=')[1]);
            if (user) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log("🚀 ~ file: auth.js:53 ~ isAuthenticated ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const logout = async (accessToken) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }

        const response = await fetch(Config.apiUrl + '/auth/signout', {
            method: 'POST',
            headers
        });

        const data = await response.json();
        if (response.ok) {
            document.cookie = `token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            document.cookie = `userName=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            document.cookie = `rol=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            document.cookie = `avatar=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            return {
                error: false,
                redirect: 'Login'
            }
        }
        let errorMessage;
        if (data.detail.message) {
            errorMessage = data.detail.message;
        } else {
            errorMessage = 'Ah ocurrido un error, intente mas tarde';
        }
        return {
            error: true,
            message: errorMessage
        };
    } catch (error) {
        console.log("🚀 ~ file: auth.js:62 ~ logout ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const changePassword = async (email, password, session) => {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const body = {
            email: email,
            password: password,
            session: session
        }

        const response = await fetch(Config.apiUrl + '/auth/new-password', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (response.ok) {
            let expires = new Date();
            let nameUser = data.user.first_name + ' ' + data.user.last_name;
            expires.setSeconds(expires.getSeconds() + data.expires_in);
            document.cookie = `token=${data.access_token};expires=${expires.toUTCString()}; path=/`;
            document.cookie = `userName=${nameUser};expires=${expires.toUTCString()}; path=/`;
            document.cookie = `rol=${data.user.role};expires=${expires.toUTCString()}; path=/`;
            document.cookie = `avatar=${data.user.image};expires=${expires.toUTCString()}; path=/`;
            return {
                error: false,
                data: data,
                redirect: 'Login'
            }
        } else {
            let errorMessage;
            if (data.detail.message || data.detail.msg) {
                errorMessage = data.detail.message || data.detail.msg;
            } else {
                errorMessage = 'Ah ocurrido un error, intente mas tarde'
            }
            return {
                error: true,
                message: errorMessage
            };
        }

    } catch (error) {
        console.log("🚀 ~ file: auth.js:156 ~ changePassword ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const getAllUsers = async (accessToken) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const response = await fetch(`${Config.apiUrl}/auth/`, {
            method: 'GET',
            headers
        });            
        const data = await response.json();
        if (response.status === 200) {
            const users = []
            for (const user of data) {
                users.push({
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                    status: user.status,
                })
            }
            return {
                error: false,
                data: users
            }
        } else {
            return {
                error: true,
                message: data.detail.message
            };
        }
    }catch (error) {
        console.log("🚀 ~ file: auth.js:193 ~ getAllUsers ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}

export const registerUser = async (accessToken, user) => {
    try {
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer${accessToken}`
        }

        const response = await fetch(`${Config.apiUrl}/auth/signup`,{
            method: 'POST',
            headers: header,
            body: JSON.stringify(user)
        });

        const data = await response.json();
        return response.status === 200 ? {
            error: false,
            data
        } : {
            error: true,
            message: data.detail.message
        };
    }catch (error) {
        console.log("🚀 ~ file: auth.js:257 ~ registerUser ~ error:", error)
        throw new Error('Ah ocurrido un error , intente mas tarde o contacte al administrador');
    }
}