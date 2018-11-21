import React from 'react';
import { StatusBar, View, Platform, } from 'react-native';
import { AppLoading } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';

import { auth } from './fb';

import { HomeStack } from './Home';
import { Settings } from './Settings';

import { Login } from './Login';
import { Store } from './Store';

interface AppState {
    isReady: boolean;
    userAuth: boolean;
    userVerified: boolean;
}

export default class App extends React.Component<{}, AppState> {

    state = {
        isReady: false,
        userAuth: false,
        userVerified: false,
    };

    private async handleAuth( user: firebase.User | null ) {
            if ( user ) {
                if ( !user.emailVerified ) await user.sendEmailVerification();
                await Store.recordLocalUser();
            } else {
                await Store.clearLocalUser();
            }
            this.setState({
                userAuth: !!user,
                userVerified: ( !!user && user.emailVerified ),
                isReady: true,
            });
    }


    componentDidMount = async () =>
        auth.onAuthStateChanged( user => this.handleAuth( user ) );


    render = () => this.state.isReady ?
        <View style = {{flex: 1}}>
            {
                this.state.userVerified ?
                    <UserNavigation />
                :
                    <Login />
            }
        </View>
        : <AppLoading />


}

const UserNavigation = createBottomTabNavigator(
    {
      Inicio: HomeStack,
      Opciones: Settings,
    }
);