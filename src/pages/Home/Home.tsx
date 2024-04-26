import { Typography } from "@mui/material";
import { Categories } from "../../data/models/Categories";
import { useEffect, useState } from "react";
import CardsCarousel from "../../components/CardsCarousel";
import CardsTable from "../../components/CardsTable";
import axios, { HttpStatusCode } from "axios";

function Home(){
    const [categoriesData, setCategoriesData] = useState<Categories[]>([])

    useEffect(() => {
        try {
            const fetchData = async () => {
                const categories = await axios.get("http://localhost:8000/api/category/")
                if(categories.status === HttpStatusCode.Ok)
                    setCategoriesData(categories.data)
            }
            fetchData()
        } catch (error) {
            console.error("There was an error while trying to fetch the homepage data: ", error)   
        }
    },[])

    return(
        <>
            <div>
                <Typography style={{marginTop: '1em', marginBottom: '.5em'}} variant="h3" fontWeight={'bold'}>Welcome!</Typography>
            </div>
            <div>
                <Typography variant="subtitle1">Explore our categories and improve your knowledge faster than you ever thought it was possible!</Typography>
            </div>
            <div style={{marginTop: '2em'}}>
                <Typography variant="h5" fontWeight={'bold'}>Categories</Typography>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <CardsCarousel data={categoriesData} />
                </div>
            </div>
            <div>
                <Typography variant="h5" fontWeight={'bold'}>Our most answered questions:</Typography>
                <div>
                    <CardsTable data={[{title: 'test1', text: 'desc1', created_date: '12/12/2002',  category: 'java', id: 2}]} />
                </div>
            </div>
        </>
    )
}

export default Home;