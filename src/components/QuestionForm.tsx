import { Button, CircularProgress, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField, Typography} from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React, { useEffect, useState } from "react";
import { z } from 'zod'
import axios, { HttpStatusCode } from "axios";

interface CategoryData {
    category_id: number
}

const QuestionForm = (props: CategoryData) => {
    const [choices, setChoices] = useState([{id: 1, is_correct: false, text: ''}])
    const [quiz, setQuizTitle] = useState<String>('')
    const [idQuizCreated, setIdQuizCreated] = useState<Number | null>(null)
    const [title, setTitle] = useState<String>('')
    const [text, setText] = useState<String>('')
    const [choice_type, setChoiceType] = useState<String>('SINGLE')
    const [correct_words, setCorrectWords] = useState<String>('')

    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const [loading, setLoading] = useState<Boolean>(false)
    const [quizCreated, setQuizCreated] = useState<Boolean>(false)

    // Define Zod schema for choice object
    const ChoiceSchema = z.object({
        id: z.number(),
        text: z.string().min(1, 'Please enter the choice text.'),
        is_correct: z.boolean(),
    });
    
    // Define Zod schema for the form data
    const ChoiceQuestionFormSchema = z.object({
        title: z.string().min(1, 'Please enter the question title.'),
        choice_type: z.enum(['SINGLE', 'MULTIPLE', 'WORD']),
        text: z.string().optional(),
        choices: z.array(ChoiceSchema).min(2, 'Please enter at least two answers.').refine(choices => choices.some(choice => choice.is_correct), {
            message: 'One of the choices must be marked as correct.',
            path: ['choicesRadio'], // Set the path for the error message
        }),
    })

    const TextQuestionFormSchema = z.object({
        title: z.string().min(1, 'Please enter the question title.'),
        text: z.string().min(1, 'Please enter the question enunciate.'),
        choice_type: z.enum(['SINGLE', 'MULTIPLE', 'WORD']),
        correct_words: z.string().min(1, 'Please enter the solution.'),
    })

    const QuizFormSchema = z.object({
        quiz: z.string().min(1, 'Please enter the quiz title.'),
    })
        
    const handleAddChoice = () => {
        const newChoice = { id: choices.length + 1, is_correct: false, text: '' }; 
        setChoices([...choices, newChoice]);
    }

    const handleRemoveChoice = (indexToRemove: number) => {
        setChoices(choices.filter((_, index) => index !== indexToRemove)); // Remove choice from choices array
    };

    const handleToggleIsCorrect = (indexToToggle: number) => {
        if (choice_type === 'MULTIPLE') {
            const updatedChoices = choices.map((choice, index) => {
              if (index === indexToToggle) {
                return { ...choice, is_correct: !choice.is_correct };
              }
              return choice;
            });
            setChoices(updatedChoices);
          } else {
            const updatedChoices = choices.map((choice, index) => {
              if (index === indexToToggle) {
                return { ...choice, is_correct: true };
              } else {
                return { ...choice, is_correct: false };
              }
            });
            setChoices(updatedChoices);
          }
    };

    const handleChoiceTextChange = (index: number, newText: string) => {
        const updatedChoices = [...choices]
        updatedChoices[index].text = newText
        setChoices(updatedChoices)
      };
    

    const handleChangeAnswerType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAnswerType = event.target.value;
        if (choice_type === 'MULTIPLE' && newAnswerType === 'SINGLE') {
          // Reset all is_correct values to false when changing from 'MULTIPLE' to 'ONE'
          const updatedChoices = choices.map(choice => ({ ...choice, is_correct: false }));
          setChoices(updatedChoices);
        }
        setChoiceType(newAnswerType);
    };

    const handleQuizCreation = async (event: React.MouseEvent) => {
        event.preventDefault()
        setLoading(true)
        try {
            QuizFormSchema.parse({quiz})

            setErrors({})

            console.log({category_id: props.category_id, title: quiz});
            const response = await axios.post("http://localhost:8000/api/quiz/", {category_id: props.category_id, title: quiz})
            if(response.status === HttpStatusCode.Created){
                setLoading(false)
                setQuizCreated(true)
                console.log(response.data.id)
                setIdQuizCreated(response.data.id)
            }
        } catch (error) {
            console.error('There was an error while trying to create the quiz: ', error)
            if(error instanceof z.ZodError){
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach(err => {
                    if(err.message.includes('least')){
                        fieldErrors['array'] = err.message
                    }
                    if(err.path && err.code !== 'custom'){
                        fieldErrors[err.path[0]] = err.message
                    }
                    if(err.code === 'custom'){
                        fieldErrors[err.path[1]] = err.message
                    }
                });
                setErrors(fieldErrors)
            }
            setLoading(false)
        }
    }

    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault()
        setLoading(true)
        try {
            let formData = {}
            
            QuizFormSchema.parse({quiz})

            if(choice_type !== 'WORD')
                formData = ChoiceQuestionFormSchema.parse({
                    title,
                    choice_type,
                    correct_words,
                    choices,
                });
            else{
                formData = TextQuestionFormSchema.parse({
                    title,
                    text,
                    choice_type,
                    correct_words,
                });
                formData = {choices: [], ...formData}
            }
                

            setErrors({})
            
            const body = {...formData, quiz: idQuizCreated}
            console.log(body)
            const response = await axios.post("http://localhost:8000/api/question/", body)
            if(response.status === HttpStatusCode.Created){
                setLoading(false)
                window.location.reload()
            }

            console.log({...formData, category_id: props.category_id})
        } catch (error) {
            console.error('There was an error while trying to create the quiz: ', error)
            if(error instanceof z.ZodError){
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach(err => {
                    if(err.message.includes('least')){
                        fieldErrors['array'] = err.message
                    }
                    if(err.path && err.code !== 'custom'){
                        fieldErrors[err.path[0]] = err.message
                    }
                    if(err.code === 'custom'){
                        fieldErrors[err.path[1]] = err.message
                    }
                });
                setErrors(fieldErrors)
            }
            setLoading(false)
        }
    }

    useEffect(() => {}, [])

    return(
        <>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '30%', marginTop: '.5em'}}>
            <div>
                <TextField 
                    label='Quiz Title'
                    placeholder="Basic Math"
                    style={{marginBottom: '.5em'}}
                    value= {quiz}
                    onChange={(event) => setQuizTitle(event.target.value)}
                    error={!!errors.quiz}
                    helperText={errors.quiz}
                />
            </div>
            <div>
                <Button onClick={handleQuizCreation} variant='contained' style={{fontWeight: 'bold'}}>
                    {loading ? <CircularProgress thickness={4} color='success'/> : 'Create New Quiz'}
                </Button>
            </div>
        </div>
        {quizCreated && (
            <FormControl  style={{display: "flex", flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '.5em'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>                    
                <div style={{display: "flex", flexDirection: 'row'}}>
                    <TextField 
                        label='Title'
                        placeholder="What is 2 + 2?"
                        style={{marginRight: '.5em'}}
                        value= {title}
                        onChange={(event) => setTitle(event.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField 
                        label='Text'
                        placeholder="Question Text (optional)"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        error={!!errors.text}
                        helperText={errors.text}
                    />
                </div>
                {choice_type === 'WORD' && (
                    <TextField
                        label='Solution'
                        multiline
                        placeholder= "The word/words or phrase that answers the question. Words should be separeted by dashes ( - )."
                        value={correct_words}
                        onChange={(event) => {setCorrectWords(event.target.value)}}
                        style= {{marginTop: '.5em'}}
                        error={!!errors.correct_words}
                        helperText={errors.correct_words}
                    ></TextField>
                )}
                {choice_type !== 'WORD' &&(
                <div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: '84%'}}>
                        {!!errors.array && (
                            <Typography variant='caption' style={{color: 'red'}}>{errors.array}</Typography>
                        )}
                        {!!errors.choicesRadio && (
                            <Typography variant='caption' style={{color: 'red'}}>{errors.choicesRadio}</Typography>
                        )}
                    </div>
                    {choices.map((choice, index) => (
                        <div key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '.5em', marginBottom: '.5em'}}>
                            <TextField
                                label={`Choice ${index + 1}`}
                                placeholder={`${index + 1}`}
                                style={{ marginRight: '.5em' }}
                                value={choice.text}
                                onChange={(event) => handleChoiceTextChange(index, event.target.value)}
                                error={!!errors.choices}
                                helperText={errors.choices}
                            />
                            <RadioGroup
                                aria-labelledby={`demo-radio-buttons-group-label-${index}`}
                                defaultValue="true"
                                name={`radio-buttons-group-${index}`}
                                value={choice.is_correct ? 'true' : 'false'}
                                onChange={() => handleToggleIsCorrect(index)}
                            >
                                <FormControlLabel value="true" control={<Radio />} label="Is correct" />
                            </RadioGroup>
                            {index === choices.length - 1 && (
                                <IconButton onClick={handleAddChoice}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            )}
                            {index !== choices.length - 1 && (
                                <IconButton onClick={() => handleRemoveChoice(index)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            )}
                        </div>
                    ))}
                </div>
                )}
            </div>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={choice_type}
                name="radio-buttons-group"
                value={choice_type}
                onChange={handleChangeAnswerType}
            >
                <FormLabel id="demo-radio-buttons-group-label">Answer type</FormLabel>
                <FormControlLabel value="SINGLE" control={<Radio />} label="One Right Answer" />
                <FormControlLabel value="MULTIPLE" control={<Radio />} label="Multiple Right Answers" />
                <FormControlLabel value="WORD" control={<Radio />} label="Text Based Answer" />
            </RadioGroup>
            <Button type="submit" variant="contained" style={{fontWeight: 'bold'}} onClick={handleSubmit}>
                {loading ? <CircularProgress thickness={4} color='success'/> : 'Create'}
            </Button>
        </FormControl>
        )}
        </>
    )
}

export default QuestionForm