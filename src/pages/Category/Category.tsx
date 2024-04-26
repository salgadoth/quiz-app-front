import { Button, Typography } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import * as Auth from '../../utils/auth' 
import QuestionForm from "../../components/QuestionForm";
import { useParams } from "react-router-dom";
import CardsTable from "../../components/CardsTable";

const Category = () => {
    const [quizData, setQuizData] = useState<any>([])
    const [quizId, setQuizId] = useState<Number | null>(null)
    const [tokenClaims, setTokenClaims] = useState<any>()
    const [formState, setFormState] = useState<Boolean>(false)
    
    const { categoryName } = useParams()
    let categoryNormalized
    if(categoryName){
        categoryNormalized = capitalizeFirstLetter(categoryName)
    }

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    console.log(quizData)
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:8000/api/category/" + categoryName)
            if(response.status === HttpStatusCode.Ok){
                if(!(response.data instanceof Array)){
                    setQuizId(response.data.id)
                }
                if(response.data.length >= 0){
                    setQuizId(response.data.at(0).category_id)
                }
                setQuizData(response.data)
            }
        }
        fetchData()
        
        const tokenData = Auth.getClaims()
        setTokenClaims(tokenData)
    }, [])

    return(
        <>
            <div>
                <Typography variant="h3" style={{ fontWeight: 'bold', marginTop: '1em'}}>{categoryNormalized}</Typography>
                {tokenClaims && tokenClaims.is_staff && 
                    <div style={{marginTop: '1em', marginBottom: '1em'}}>
                        <Button onClick={() => setFormState(!formState)} variant="contained" style={{fontWeight: 'bold'}} endIcon={<AddCircleOutlineIcon/>}>Create a new Quiz</Button> 
                    </div>
                }
                {formState && 
                    <QuestionForm category_id={quizData.id}/>
                }
            </div>
            <div>
                <Typography variant="h6" style={{marginTop: '1em'}}>Disponible quizzes: </Typography>
            </div>
            {quizData.length > 0 ? (
                <div>
                    <CardsTable data={quizData} />
                </div>
            ) : <p>Sorry, there aren't any disponible quizzes for this category as of yet.</p>}
        </>
    )
}

export default Category;