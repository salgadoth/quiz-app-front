import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FavoriteBorder } from '@mui/icons-material';

export interface CardsData {
  title: string
  text?: string
  created_date: string
  category: string,
  id: number
}

export interface CardsProps {
  data: CardsData[]
}

const CardsTable = (props: CardsProps) => {

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
      {props.data.map((card, idx) => {
        return (
          <a key={idx} href={`/quiz/${card.category}/${card.id}`} style={{textDecoration: 'none'}}>
            <Card sx={{ maxWidth: 345, margin: '.5em' }}>
              <CardHeader
                title={card.title}
                subheader="September 14, 2016"
              />
              <CardContent>
                {card.text && 
                <Typography variant="body2" color="text.secondary">
                  This impressive paella is a perfect party dish and a fun meal to cook
                  together with your guests. Add 1 cup of frozen peas along with the mussels,
                  if you like.
                </Typography>
                }
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteBorder/>
                </IconButton>
              </CardActions>
          </Card>
        </a>
      )})}
    </div>
  );
}

export default CardsTable;