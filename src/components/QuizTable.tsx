import React, { useEffect, useState } from 'react';
import { Paper, Typography, FormControlLabel, Checkbox, Radio, FormControl, Box, RadioGroup, Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { UserClaims } from '../data/models/UserClaims';
import axios, { HttpStatusCode } from 'axios';
import { useParams } from 'react-router-dom';

export interface Choice {
    id: number
    text: string
    is_correct: boolean
    created_date: string
}

export interface QuizData {
    id: number
    quiz: number
    choices: Choice[]
    title: string,
    text?: string
    choice_type: string
    created_date: string
    correct_words?: string[]
}

export interface QuizTableProps {
    data: QuizData
    user: UserClaims
}

const QuizTable = (props: QuizTableProps) => {
  const [singleAnswer, setSingleAnswer] = useState<number>(0)
  const [checked, setChecked] = useState([true, false]);
  const {categoryName, quizId} = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  
  const handleSubmit = async (event: React.MouseEvent) => {
    setLoading(true)
    try {
      let body
      if(props.data.choice_type === 'SINGLE') 
        body = {user: props.user.user_id, question: props.data.id, submited_choice: [singleAnswer], submited_words: []}
          
      const response = await axios.post("http://localhost:8000/api/answer/", body)
      if(response.status === HttpStatusCode.Created){
        setLoading(false)
        setSubmitted(true)
      }
    } catch (error) {
      console.error('There was an error while trying to submit your answer: ', error)
      setLoading(false)
    }
  }

  let choices
  if(props.data.choice_type === 'MULTIPLE'){
    choices = props.data.choices.map((choice, idx) => (
    <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label={choice.text}
        control={<Checkbox checked={checked[choice.id]} />}
      />
    </Box>)
  )} else if (props.data.choice_type === 'SINGLE') {
    choices = (
      <RadioGroup onChange={(event) => setSingleAnswer(+event.target.value)}>
        {props.data.choices.map((choice, idx) => (
          <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            <FormControlLabel
              value={choice.id}
              label={choice.text}
              control={<Radio />}
            />
          </Box>
        ))}
      </RadioGroup>
    )}
  
  return (
    <div style={{width: '50%'}}>
      <Paper style={{padding: '2em', display: 'flex', flexDirection: 'column'}} elevation={3}>
        <Typography variant="h5" width={'full'}>{props.data.title}</Typography>
        <div>
          <FormControl>
              {choices}
          </FormControl>
        </div>
        <Button
          variant="contained"
          style={{ alignSelf: 'center', width: '50%' }}
          disabled={!props.user || loading || submitted}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress /> : submitted ? <CheckIcon /> : !props.user ? 'Log in to answer' : 'Submit'}
        </Button>
      </Paper>
    </div>
  )
}


export default QuizTable;
