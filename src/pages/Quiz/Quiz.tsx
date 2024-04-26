import { useParams } from 'react-router-dom'
import QuizTable from '../../components/QuizTable';
import { useEffect, useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import * as Auth from '../../utils/auth';
import {UserClaims} from '../../data/models/UserClaims'

const Quiz = () => { //TODO: USER CAN ONLY SUBMIT A ANSWER IF HE IS LOGGED IN
    const {categoryName, quizId} = useParams()
    const [quizData, setQuizData] = useState<any>()
    const [userData, setUserData] = useState<UserClaims>()

    useEffect(() => {
        if(Auth.isAuthenticated()){
            setUserData(Auth.getClaims())
        } 

        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/quiz/" + quizId + "/questions")
                if(response.status === HttpStatusCode.Ok){
                    console.log(response.data)
                    setQuizData(response.data)
                }
            } catch (error) {
                console.error("There was an error while trying to fetch for questions: ", error)   
            }
        }

        if(quizId)
            fetchData()
    }, [])

    if(quizData && quizData.length > 0)
        return (
            <div style={{display: 'flex', justifyContent: 'center', height: '80vh', alignItems: 'center'}}>
                <QuizTable data={quizData[0]} user={userData!}/>
            </div>
        )
    else
        return(
            <p>Loading</p>
        )
}

export default Quiz;