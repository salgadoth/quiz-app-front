import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Category from './pages/Category/Category';
import Quiz from './pages/Quiz/Quiz';

const darkMode = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  return (
    <ThemeProvider theme={darkMode}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <CssBaseline>
          <Router>
            <Routes>
              <Route path='/' Component={Home} />
              <Route path='/dashboard' Component={Dashboard} />
              <Route path='/login' Component={Login} />
              <Route path='/register' Component={Register} />
              <Route path='/category/:categoryName' Component={Category}/>
              <Route path='/quiz/:categoryName/:quizId' Component={Quiz}/>
            </Routes>
          </Router>
        </CssBaseline>
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;
