import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { createStackNavigator, NavigationScreenProps  } from 'react-navigation';
import { withMappedNavigationProps, } from 'react-navigation-props-mapper';

import { styles } from './Styles';

import { CreateUser, isEmail, formErrors } from './CreateUser';

import { Store } from './Store';


export interface LoginScreenProps extends NavigationScreenProps {
    // appErrorCode: string;
}

export interface LoginScreenState {
    errorCode: string;
    mail: string;
    password: string;
}

@withMappedNavigationProps()
class LoginScreen extends React.Component<NavigationScreenProps<LoginScreenProps>, LoginScreenState> {
    state = {
        errorCode: '',
        mail: '',
        password: '',
    }

    render = () =>
        <KeyboardAvoidingView
            style = {{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
            behavior = 'padding'
        >


            <Text style = { styles.title }>Aplicación para compartir tu auto con personas de tu institución.</Text>

            <View style = { [styles.taggedTextField, { marginVertical: 10 }] } >
                <Text style = { styles.taggedTextFieldTag }  >Correo Institucional</Text>
                <TextInput
                    keyboardType = 'email-address'
                    autoCapitalize = 'none'
                    style = {styles.taggedTextFieldField}
                    onChangeText = { text => this.setState({ mail: text }) }
                />
            </View>

            <View style = { styles.taggedTextField } >
                <Text style = { styles.taggedTextFieldTag }  >{'\nContraseña'}</Text>
                <TextInput
                    secureTextEntry
                    style = {styles.taggedTextFieldField}
                    onChangeText = { text => this.setState({ password: text }) }
                />
            </View>



            { this.state.errorCode !== '' &&
                <Text style = {{color: 'red'}}>{ this.state.errorCode }</Text>
            }

           <TouchableOpacity
                style = {[styles.button, { width: '80%' }]}
                onPress = { () => this.handleSubmit() }
            >
                <Text>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style = {[styles.button, { width: '80%' }]}
                onPress = { () => this.props.navigation.navigate({ routeName: 'CreateUser' }) }
            >
                <Text>No estoy registrado</Text>
            </TouchableOpacity>


        </KeyboardAvoidingView>;

        isValid() {
            const { mail, password } = this.state;
            if ( !isEmail(mail) ) return formErrors.mail;
            if ( !password )  return formErrors.passwordConfirm;
            return '';
        };

        private async handleSubmit() {

            const validationError = this.isValid();
            if (validationError) {
                this.setState({ errorCode: validationError });
                return;
            }

            const { mail, password } = this.state;
            try {
                await Store.signIn(mail, password);
            } catch ( e ) {
                this.setState({errorCode: `${e}`});
            }
        }
}

export const Login = createStackNavigator(
    {
        LoginScreen: {
            screen: LoginScreen,
            navigationOptions: {
                header: null,
            },
        },
        CreateUser: {
            screen: CreateUser,
            navigationOptions: {
                title: 'Únete'
            },
        },
    },
    {
        initialRouteName: 'LoginScreen',
    },
);
