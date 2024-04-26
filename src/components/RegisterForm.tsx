import {TextField, Button, Paper, Typography, CircularProgress} from '@mui/material'
import axios, { HttpStatusCode } from 'axios'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { z } from "zod"

interface SubmitParams{
    username: String
    password: String
    fname: String
    lname: String
    email: String
}

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<String>('')
    const [password, setPassword] = useState<String>('')
    const [confPassword, setConfPassword] = useState<String>('')
    const [fname, setFname] = useState<String>('')
    const [lname, setLname] = useState<String>('')
    const [email, setEmail] = useState<String>('')
    const [loading, setLoading] = useState<Boolean>(false)

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [httpError, setHttpError] = useState<String>('')
    
    const [, setCookies] = useCookies(['auth_token'])

    const schema = z.object({
        username: z.string().min(1, 'Username cannot be empty'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        confPassword: z.string().min(8, 'Please confirm your password').refine(
            data => data === password,
            {
                message: 'Passwords do not match.',
                path: ['confPassword']
            }
        ),
        email: z.string().min(1, 'Email cannot be empty').email('Please enter a vaid email address'),
        fname: z.string().min(1, 'Your first name cannot be empty'),
        lname: z.string().min(1, 'Your last name cannot be empty'),
    })

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true)
        try {
            schema.parse({username, password, confPassword, fname, lname, email})

            setErrors({})

            onSubmit({username, password, fname, lname, email})
        } catch (error) {
            if(error instanceof z.ZodError){
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach(err => {
                    if(err.path){
                        fieldErrors[err.path[0]] = err.message
                    }
                });
                setErrors(fieldErrors)
                setLoading(false)
            }   
        }
    };

    const onSubmit = async ({username, password, fname, lname, email}: SubmitParams) => {
        try {
            const response = await axios.post("http://localhost:8000/api/auth/register/", {username, password, fname, lname, email})
            if(response.status === HttpStatusCode.Created){
                setCookies('auth_token', response.data.token, {path: '/'});
                setLoading(false)
                window.location.replace('/');
            }
        } catch (error: any) {
            console.error('There was an error while trying to fetch the api: ', error)
            setHttpError(error.message)
        }
    }

    
    return (
        <Paper elevation={3} style={{padding: 20, minWidth: 400}}>
            <Typography variant="h5" style={{textAlign: 'center'}}>
                Sign-Up
            </Typography>
            {httpError && 
                <div style={{textAlign: 'center'}}>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>{httpError}</p>
                </div>
            }
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', width: '75%'}}>
                    <TextField 
                        label="First Name"
                        style={{width: '35%'}}
                        margin='normal'
                        value={fname}
                        onChange={(event) => setFname(event.target.value)}
                        error={!!errors.fname}
                        helperText={errors.fname}
                    />
                    <TextField 
                        label="Last Name"
                        style={{width: '60%'}}
                        margin='normal'
                        value={lname}
                        onChange={(event) => setLname(event.target.value)}
                        error={!!errors.lname}
                        helperText={errors.lname}
                    />
                </div>
                <TextField 
                    label="E-mail"
                    fullWidth
                    margin='normal'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                />
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
                    onChange={(event) => setPassword(event.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <TextField 
                    label="Confirm your password"
                    fullWidth
                    margin='normal'
                    type='password'
                    value={confPassword}
                    onChange={(event) => setConfPassword(event.target.value)}
                    error={!!errors.confPassword}
                    helperText={errors.confPassword}
                />
                <div style={{textAlign: 'center'}}>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        style={{marginTop: 20, width: '30%'}}
                    >
                        {loading ? <CircularProgress thickness={4} color='success'/> : 'SignUp'}
                    </Button>
                </div>
            </form>
            <div style={{textAlign: 'center', marginTop: '1em'}}>
                <Typography variant='subtitle2' style={{fontWeight: 'bold'}}>
                    <a style={{textDecoration: 'none', color: 'white'}} href='/login'>Already have an account? Login now!</a>
                </Typography>
            </div>
        </Paper>
    )
}

export default RegisterForm;