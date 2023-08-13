export const getToken = (router) => {
    let token = document.cookie
    if (token === undefined || token === null || token === '') {
        router.push({ name: 'Login' });
        return;
    }  
    return token = token.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
}