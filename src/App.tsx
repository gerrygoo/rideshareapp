import React from 'react';
import { StatusBar, View, Platform, } from 'react-native';
import { AppLoading } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';

import { auth } from './fb';

import { Home } from './Home';
import { Settings } from './Settings';

import { Login } from './Login';
import { Store } from './Store';

interface AppState {
    isReady: boolean;
    isLoggedIn: boolean;
}

export default class App extends React.Component<{}, AppState> {

    state = {
        isReady: false,
        isLoggedIn: false,
    };


    componentDidMount = async () =>
        auth.onAuthStateChanged(
            async user => {
                if ( user ) await Store.recordLocalUser();
                else await Store.clearLocalUser();
                this.setState({ isLoggedIn: !!user, isReady: true });
            }
        );


    render = () => this.state.isReady ?
        <View style = {{flex: 1}}>
            <StatusBar
                // hidden
                // backgroundColor='red'
                // barStyle = 'default'
            />
            {/* <View
                style = {{ height: Platform.OS == 'ios' ? 45 : StatusBar.currentHeight }}
            /> */}
            {
                this.state.isLoggedIn ?
                    <UserNavigation />
                :
                    <Login />
            }
        </View>
        : <AppLoading />
}

const UserNavigation = createBottomTabNavigator(
    {
      Inicio: Home,
      Opciones: Settings,
    }
);