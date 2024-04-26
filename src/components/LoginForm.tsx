import React, { useState } from 'react'
import {TextField, Button, Paper, Typography, CircularProgress} from '@mui/material'
import { z } from "zod"
import axios, { HttpStatusCode } from 'axios'
import { useCookies } from 'react-cookie'
import * as Auth from "../utils/auth"

interface SubmitParams{
    username: String
    password: String
}

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<String>('')
    const [password, setPassword] = useState<String>('')
    const [httpError, setHttpError] = useState<String>('')

    const [loading, setLoading] = useState<Boolean>(false)
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const [, setCookies] = useCookies(['auth_token'])

    const schema = z.object({
        username: z.string().min(1, 'Username cannot be empty'),
        password: z.string().min(1, 'Password cannot be empty')
    })

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true)
        try {
            schema.parse({username, password})

            setErrors({})

            onSubmit({username, password})
        } catch (error) {
            if(error instanceof z.ZodError){
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach(err => {
                    if(err.path){
                        fieldErrors[err.path[0]] = err.message
                    }
                });
                setErrors(fieldErrors)
            }   
            setLoading(false)
        }
    };

    const onSubmit = async ({username, password}: SubmitParams) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/', { username, password })
            if(response.status === HttpStatusCode.Ok){
                setCookies('auth_token', response.data.access, {path: '/'});
                setLoading(false)
                window.location.replace('/');
            }
        } catch (error: any) {
            console.error("There was an error while trying to fetch the api: ", error)
            setHttpError(error.message);
            setLoading(false)
        }
    }

    if(Auth.isAuthenticated()) window.location.replace('/') 
    return (
        <Paper elevation={3} style={{padding: 20, minWidth: 400, maxHeight: 400, overflow: 'hidden'}}>
            <Typography variant="h5" style={{textAlign: 'center'}}>
                Login
            </Typography>
            {httpError && 
                <div>
                    <p style={{ color: 'red' }}>{httpError}</p>
                </div>
            }
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <TextField 
                    label="Username"
                    fullWidth
                    margin='normal'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                />
                <TextField 
                    label="Password"
                    fullWidth
                    margin='normal'
                    type='password'
                    value={password}
                    onChange={(event) => {setPassword(event.target.value)}}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    style={{marginTop: 20, width: '30%'}}
                >
                    {loading ? <CircularProgress thickness={4} color='success'/> : 'LogIn'}
                </Button>
            </form>
            <div style={{textAlign: 'center', marginTop: '1em'}}>
                <Typography variant='subtitle2' style={{fontWeight: 'bold'}}>
                    <a style={{textDecoration: 'none', color: 'white'}} href='/register'>Don't have an account yet? Register now!</a>
                </Typography>
            </div>
        </Paper>
    )
}

export default LoginForm;