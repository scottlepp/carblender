import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import AppBar from './layout/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { search } from './search/search';

function App() {

  const [results, setResults] = useState([]);

  const CssTextField = withStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderRadius: 40
        }
      },
    },
  })(TextField);


  const useStyles = makeStyles(theme => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginTop: 50
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    results: {
      paddingTop: '50px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingBottom: '20px'
    }
  }));

  const classes = useStyles();

  const elements = ['one', 'two', 'three', 'four', 'one', 'two', 'three', 'four'];



  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    // if (!token) {
    //     getToken();
    // }
    async function doSearch() {
      const results = await search();
      setResults(results);
    }

    doSearch();

  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <AppBar></AppBar>
      <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          pt={4}
        >

        <Grid container item xs={10} sm={8} md={6} spacing={3}>
        {/* <Box pt={5} height="40px" style={{position: 'relative', 'border-radius': '40px;', width: '100%'}}> */}
          {/* <div style={{ display: 'inline-flex' }}> */}
            {/* <CssTextField fullwidth="true" size="small" id="outlined-basic" label="Ford Festiva" variant="outlined" style={{'border-radius': '40px', width: '100%'}}/> */}
            {/* <Button variant="contained" color="primary" style={{position: 'absolute', right: 0}}>
              Search
            </Button> */}
            {/* <Fab size="small" color="secondary" aria-label="add" style={{position: 'absolute', right: 0}}>
              <SearchIcon />
            </Fab> */}
          {/* </div> */}
        {/* </Box> */}
        <Paper component="form" className={classes.root}>
          <IconButton className={classes.iconButton} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Ford F150"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
          {/* <Divider className={classes.divider} orientation="vertical" />
          <IconButton color="primary" className={classes.iconButton} aria-label="directions">
            <DirectionsIcon />
          </IconButton> */}
        </Paper>
        {/* <Box style={{position: 'absolute'}}>
          <Button variant="contained" color="primary">
            Search
          </Button>
        </Box> */}
        </Grid>

        <Grid container spacing={3} className={classes.results}>
        {results.map((car, index) => {
          return (
          <Grid item xs={12} md={3} key={index}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="Contemplative Reptile"
                  height="140"
                  image={car.thumb}
                  title={car.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {car.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )})}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
