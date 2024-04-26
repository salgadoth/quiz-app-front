import { decodeToken } from 'react-jwt'
import { UserClaims } from '../data/models/UserClaims'

export const getToken = () => {
    const cookies = document.cookie.split('; ')
    for(const cookie of cookies){
        const [name, value] = cookie.split('=')
        if(name === 'auth_token'){
            return value
        }
    }

    return null
}

export const isAuthenticated = () => {
    return !!getToken()
}

export const signOut = () => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.replace('/');
}

export const isStaff = () => {
    const token = getToken()
    if(token) {
        const decodedToken: any = decodeToken(token);
        return decodedToken.is_staff || false
    }

    return false
}

export const getClaims = () : UserClaims => {
    const token: any = getToken()
    return decodeToken(token)!
}