import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';

import { CAppBar } from "./components/CAppBar";
import { RoomList } from "./components/RoomList";

import Paper from 'material-ui/Paper';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

import FontIcon from 'material-ui/FontIcon';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

export function App () {
    return (
        <MuiThemeProvider>
            <CAppBar />

            <Divider />

            <RoomList />

            <Router>
                {/*
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/topics" component={Topics} />
                */}
            </Router>
        </MuiThemeProvider>
    );
}