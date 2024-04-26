import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import * as Auth from "../../utils/auth"
import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";

const Dashboard = () => {
    const [tokenClaims, setTokenClaims] = useState<any>()
    const [token, setToken] = useState<any>()

    const [totalAnswers, setTotalAnswers] = useState<any>([])
    const [prcAnswers, setPrcAnswers] = useState<Object>({})
    const [recentAnswers, setRecentAnswers] = useState<any>([{}])

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
                        console.log(totalAnswers);
                    }

                    const responseTwo = await axios.get("http://localhost:8000/api/user/prct-answers", {headers: {"Authorization": "Bearer " + token}})
                    if(responseTwo.status === HttpStatusCode.Ok){
                        setPrcAnswers(responseTwo.data)
                        console.log(prcAnswers);
                    }

                    const responseThree = await axios.get("http://localhost:8000/api/user/recent-answers", {headers: {"Authorization": "Bearer " + token}})
                    if(responseThree.status === HttpStatusCode.Ok){
                        setRecentAnswers(responseThree.data)
                        console.log(recentAnswers);
                    }
                } catch (error) {
                    console.error('There was an error while trying to fetch for user related statistics.')
                }
            }
            fetch()
        }
    }, [prcAnswers, totalAnswers, recentAnswers, token])

    if(tokenClaims)
        return(
            <div style={{marginTop: '1em', marginBottom: '1em'}}>
                <div>
                    <Typography variant="h4">Dashboard</Typography>
                </div>
                <div>
                    <Typography variant="subtitle1">Welcome to your dasboard {tokenClaims.username}!</Typography>
                </div>
                <div style={{marginTop: '1em', marginBottom: '2em'}}>
                    <Typography variant="h5">Your results so far: </Typography>
                    <div>
                    <Card sx={{ maxWidth: 345, margin: '.5em' }}>
                        <CardHeader
                            title={Object.keys(prcAnswers)}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" style={{fontWeight: 'bold', fontSize: '1em', textAlign: 'center'}}>
                                {Object.values(prcAnswers)}%
                            </Typography>
                        </CardContent>
                    </Card>
                    </div>
                </div>
                <div>
                    <Typography variant="h5">Your recently answered questions: </Typography>
                    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {recentAnswers.map((ans: any, idx: any) => {
                            return(<Card key={idx} sx={{ maxWidth: 345, margin: '.5em' }}>
                            <CardHeader
                                title={ans.quiz_title}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" style={{fontWeight: 'bold', fontSize: '1em', textAlign: 'center'}}>
                                    {new Date(ans.submited_at).toLocaleString('en-US', {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',hour: 'numeric',minute: 'numeric',second: 'numeric'})}
                                </Typography>
                            </CardContent>
                        </Card>)
                        })}
                    </div>
                </div>
            </div>
        )
    else
        return(<p>Loading</p>)
}

export default Dashboard;