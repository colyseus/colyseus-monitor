import * as React from "react";
import { createBrowserHistory, createHashHistory } from "history";
import { Router, Route, Link } from "react-router-dom";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';

import { CAppBar } from "./components/CAppBar";
import { RoomList } from "./components/RoomList";
import { RoomInspect } from "./components/RoomInspect";

import Paper from 'material-ui/Paper';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

import FontIcon from 'material-ui/FontIcon';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

const history = createHashHistory();

export function App () {
    return (
        <Router history={history}>
            <MuiThemeProvider>
                <CAppBar />

                <Route exact path="/" component={RoomList} />
                <Route path="/room/:roomId" component={RoomInspect} />
            </MuiThemeProvider>
        </Router>
    );
}
