import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import * as Auth from "../../utils/auth"
import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { FavoriteBorder } from "@mui/icons-material";

const Dashboard = () => {
    const [tokenClaims, setTokenClaims] = useState<any>()
    const [token, setToken] = useState<any>()

    const [totalAnswers, setTotalAnswers] = useState<any>([])
    const [prcAnswers, setPrcAnswers] = useState<Object>({})
    const [recentAnswers, setRecentAnswers] = useState<any>({})

    useEffect(() => {
        if(!Auth.isAuthenticated())
            window.location.replace('/login')
        
        const tokenData = Auth.getClaims()
        setTokenClaims(tokenData)
        setToken(Auth.getToken())

        if(token){
            const fetch = async () => { //TODO: USE THEN
                try {
                    const response = await axios.get("http://localhost:8000/api/user/total-answers", {headers: {"Authorization": "Bearer " + token}})
                    if(response.status === HttpStatusCode.Ok){
                        setTotalAnswers(response.data)
                        console.log(response.data);
                    }

                    const responseTwo = await axios.get("http://localhost:8000/api/user/prct-answers", {headers: {"Authorization": "Bearer " + token}})
                    if(responseTwo.status === HttpStatusCode.Ok){
                        setPrcAnswers(responseTwo.data)
                        console.log(responseTwo.data);
                    }

                    const responseThree = await axios.get("http://localhost:8000/api/user/recent-answers", {headers: {"Authorization": "Bearer " + token}})
                    if(responseThree.status === HttpStatusCode.Ok){
                        setRecentAnswers(responseThree.data)
                        console.log(responseThree.data);
                    }
                } catch (error) {
                    console.error('There was an error while trying to fetch for user related statistics.')
                }
            }
            fetch()
        }
    }, [])

    if(tokenClaims)
        return(
            <div style={{marginTop: '1em', marginBottom: '1em'}}>
                <div>
                    <Typography variant="h4">Dashboard</Typography>
                </div>
                <div>
                    <Typography variant="subtitle1">Welcome to your dasboard {tokenClaims.username}!</Typography>
                </div>
                <div>
                    <Typography variant="h5">Your results so far: </Typography>
                    <div>
                    <Card sx={{ maxWidth: 345, margin: '.5em' }}>
                        <CardHeader
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to favorites">
                            <FavoriteBorder/>
                            </IconButton>
                        </CardActions>
                    </Card>
                    </div>
                </div>
                <div>
                    <Typography variant="h5">Your recently answered questions: </Typography>
                    <div>

                    </div>
                </div>
                <div>
                    <Typography variant="h5">Your completed quizzes: </Typography>
                </div>
            </div>
        )
    else
        return(<p>Loading</p>)
}

export default Dashboard;