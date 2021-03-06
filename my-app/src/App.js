import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import NavMenu from './Components/Nav-Menu/Nav-Menu';
import Landing from './Routes/Landing/Landing';
import Home from './Routes/Home/Home';
import AccountCreation from './Routes/Account-Creation/Account-Creation';
import AccountLogin from './Routes/Account-Login/Account-Login';
import DetailedView from './Routes/Detailed-View/Detailed-View';
import SearchResults from './Components/Search-Results/Search-Results';
import AuthHelper from './Helpers/Auth';
import Context from './Components/Context/Context';
import config from './config';
import CreateListing from './Routes/Create-Listing/Create-Listing';
import Profile from './Routes/Profile/Profile';
import EditListing from './Routes/Edit-Listing/Edit-Listing';
import EditAccount from './Routes/Edit-Account/Edit-Account';
import NotFound from './Routes/NotFound/NotFound';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      isLoggedIn: false,
      isLight: true,
      hasToken: this.hasAuthToken()
    };
  }

  // checks if the user has an auth token, if the user does have an auth token then it gets their auth token and uses a helper function to make a api call to get the current users data
  componentDidMount() {
    if (this.hasAuthToken()) {
      AuthHelper.getCurrentUser(this.getAuthToken()).then(data =>
        this.setState(prevState => ({
          currentUser: data,
          isLoggedIn: true
        }))
      );
    }
  }

  // saves the users auth token to local storage
  saveAuthToken = token => {
    window.localStorage.setItem(config.TOKEN_KEY, token);
  };

  // gets the users auth token
  getAuthToken = () => {
    return window.localStorage.getItem(config.TOKEN_KEY);
  };

  // checks if the user has an auth token
  hasAuthToken = () => {
    return !!this.getAuthToken();
  };

  // creates a auth token
  makeBasicAuthToken = (userName, password) => {
    return window.btoa(`${userName}:${password}`);
  };

  // on login gets the users data and sets the loggedin status to true
  onLogin = () => {
    AuthHelper.getCurrentUser(this.getAuthToken()).then(data =>
      this.setState(prevState => ({
        currentUser: data,
        isLoggedIn: true
      }))
    );
  };

  // on logout clears the users auth token and sets the loggedin status to false
  onLogout = () => {
    window.localStorage.removeItem(config.TOKEN_KEY);
    this.setState({ currentUser: {}, isLoggedIn: false });
  };

  // toggles the light mode status
  toggleLightMode = () => {
    this.setState(prevState => ({
      isLight: !prevState.isLight
    }));
    if (this.state.isLight) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  render() {
    return (
      <Context.Provider
        value={{
          currentUser: this.state.currentUser,
          hasToken: this.state.hasToken,
          isLoggedIn: this.state.isLoggedIn,
          saveAuthToken: this.saveAuthToken,
          getAuthToken: this.getAuthToken,
          hasAuthToken: this.hasAuthToken,
          makeBasicAuthToken: this.makeBasicAuthToken,
          lightMode: this.toggleLightMode,
          isLight: this.state.isLight,
          onLogin: this.onLogin,
          onLogout: this.onLogout
        }}
      >
        {' '}
        <div className='App'>
          <NavMenu />
          <Switch>
            <Route
              exact
              path='/'
              render={routeProps => {
                return <Landing {...routeProps} />;
              }}
            />
            <Route
              exact
              path='/Home'
              render={routeProps => {
                return <Home {...routeProps} />;
              }}
            />
            <Route
              exact
              path='/Login'
              render={routeProps => {
                return <AccountLogin {...routeProps} />;
              }}
            />
            <Route
              exact
              path='/Create-Account'
              render={routeProps => {
                return <AccountCreation {...routeProps} />;
              }}
            />
            <Route
              exact
              path='/Edit-Account'
              render={routeProps => {
                return <EditAccount {...routeProps} />;
              }}
            />
            <Route
              exact
              path='/user/:username'
              render={routeProps => {
                return <Profile {...routeProps} />;
              }}
            />
            <Route
              exact
              path='/Search/:term'
              render={routeProps => {
                return <SearchResults {...routeProps} />;
              }}
            />
            <Route
              path='/Create-Listing'
              render={routeProps => {
                return <CreateListing {...routeProps} />;
              }}
            />
            <Route
              path='/listing/:listingid'
              render={routeProps => {
                return <DetailedView {...routeProps} />;
              }}
            />
            <Route
              exact
              path='/Edit-Listing/:listingid'
              render={routeProps => {
                return <EditListing {...routeProps} />;
              }}
            />
            <Route
              render={routeProps => {
                return <NotFound {...routeProps} />;
              }}
            />
          </Switch>
        </div>
      </Context.Provider>
    );
  }
}

export default App;
