import { Box, Typography } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import React from "react";
import { Categories } from "../data/models/Categories";

interface CardsProps {
    data: Categories[]
}

const cards = [
    {
        title: 'JavaScript'
    },
    {
        title: 'Java'
    },
    {
        title: 'OOP Programming'
    },
    {
        title: 'DataStructures'
    },
    {
        title: 'Python'
    },
  ];

const CardsCarousel = (props: CardsProps) => {
    const [startIndex, setStartIndex] = React.useState(0);
    
    const handlePrev = () => {
        setStartIndex((prevStartIndex) => {
            // Calculate the new start index for the previous items
            const newIndex = prevStartIndex === 0 ? cards.length - 3 : prevStartIndex - 1;
            return newIndex;
        });
    };
    
    const handleNext = () => {
        setStartIndex((prevStartIndex) => {
            // Calculate the new start index for the next items
            const newIndex = prevStartIndex + 1;
            // If there are no more items to display, loop back to the beginning of the array
            return newIndex >= cards.length - 2 ? 0 : newIndex;
        });
    };

    const displayedCards = props.data.slice(startIndex, startIndex + 3);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <KeyboardDoubleArrowLeftIcon onClick={handlePrev} style={{fontSize: '3em', cursor: 'pointer', position: "relative", top: 50}}/>
                {displayedCards.map((category) => {
                    return(
                        <a key={category.title}  href={`/category/${category.title.toLowerCase()}`} style={{ textDecoration: 'none'}}>
                            <Box className='card' sx={{backgroundColor: "#443344", margin: 5, padding: 3, borderRadius: 3}}>
                                <Typography variant="subtitle1" fontWeight={'bold'} style={{color: 'white'}}>{category.title}</Typography>
                            </Box>
                        </a>
                    )
                })}
            <KeyboardDoubleArrowRightIcon onClick={handleNext} style={{fontSize: '3em', cursor: 'pointer', position: "relative", top: 50}}/>
        </div>
    );
}

export default CardsCarousel;