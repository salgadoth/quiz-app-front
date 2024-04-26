export interface UserClaims {
    token_type: string
    exp: number
    iat: number
    jti: string
    user_id: number
    is_staff: boolean
    username: string
}