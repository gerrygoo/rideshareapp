import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView, Picker, Switch } from 'react-native';
import { NavigationScreenProps  } from 'react-navigation';
import { withMappedNavigationProps, } from 'react-navigation-props-mapper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


import { Store } from './Store';

import { styles } from './Styles';


export interface CreateUserProps extends NavigationScreenProps {

}

interface CreateUserState extends FBStore.StoreUser {
    errorCode: string;
    password: string;
    passwordConfirm: string;
}

const days = [
    'Lu',
    'Ma',
    'Mi',
    'Ju',
    'Vi',
]

export const formErrors = {
    name: 'nombre inválido',
    mail: 'correo inválido',
    phone: 'teléfono inválido',
    passwordConfirm: 'las contraseñas no son iguales',
    address: 'direccion invalida',
}

export const isEmail = ( candidate:string ): boolean => (
    candidate.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    != null
);

const isPhone = ( candidate:string ): boolean => (
    candidate.match(/(?:(\+?\d{1,3}) )?(?:([\(]?\d+[\)]?)[ -])?(\d{1,5}[\- ]?\d{1,5})/)
    != null
);

@withMappedNavigationProps()
export class CreateUser extends React.Component<CreateUserProps, CreateUserState> {
    state = {
        errorCode: '',

        name: '',
        mail: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        car: false,
        domain: '',
        address: { lat: 0, lng: 0 },
        schedule: [ ...Array(5).keys() ].map( _ => ({ in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 }}) ),
    };

    render = () =>
        <KeyboardAvoidingView
            style = {[ styles.flex1, { justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 }  ]}
            behavior = 'padding'
        >
            <ScrollView style = {{ width: '100%' }}>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >Nombre</Text>
                    <TextInput
                        style = { styles.taggedTextFieldField }
                        onChangeText = { text => this.setState({ name: text }) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >Correo Institucional</Text>
                    <TextInput
                        keyboardType = 'email-address'
                        autoCapitalize = 'none'
                        style = { styles.taggedTextFieldField }
                        onChangeText = { text => this.setState({ mail: text }) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >Número celular</Text>
                    <TextInput
                        keyboardType = 'phone-pad'
                        style = { styles.taggedTextFieldField }
                        onChangeText = { text => this.setState({ phone: text }) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >Contraseña</Text>
                    <TextInput
                        style = { styles.taggedTextFieldField }
                        secureTextEntry
                        onChangeText = { text => this.setState({ password: text }) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >Confirma Contraseña</Text>
                    <TextInput
                        style = { styles.taggedTextFieldField }
                        secureTextEntry
                        onChangeText = { text => this.setState({ passwordConfirm: text }) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >Tengo auto</Text>
                    <Switch
                        value ={this.state.car}
                        onValueChange = { (value) => this.setState({car : value}) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = {[styles.taggedTextFieldTag, { flex: 0.2, marginHorizontal: 10,}]} >Vivo en:</Text>

                    <GooglePlacesAutocomplete
                        query = {{key: 'AIzaSyDZp3F25-5QHhVr94i2G3fRfuX2ygZyCcs'}}
                        GoogleReverseGeocodingQuery = {{ key: 'AIzaSyDZp3F25-5QHhVr94i2G3fRfuX2ygZyCcs' }}
                        fetchDetails
                        listViewDisplayed={false}
                        onPress = { (data: any, details: any = null) => {
                                this.setState({
                                    address: {
                                        lat: details.geometry.location.lat,
                                        lng: details.geometry.location.lng
                                    }
                                });
                            }
                        }
                        styles={{
                            textInputContainer: {
                                backgroundColor: 'rgba(0,0,0,0)',
                            },
                            textInput: {
                                flex: 3,
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb'
                            },
                          }}
                    />
                </View>

                {
                    [ ...Array(5).keys() ].map(
                        day => (
                            <View
                                style = { [styles.taggedTextField, { alignItems: 'center', marginVertical: 10, marginHorizontal: 10 } ] }
                                key = { (day + 2) * 3 }
                            >
                                <Text style = {{ flex: 0.5, marginHorizontal: 10 }}  >{`${days[day]}`}</Text>
                                <Picker
                                    selectedValue = { this.state.schedule[day].in.hh }
                                    style = {[ styles.picker, {  }  ]}
                                    onValueChange = { (value, _) => this.setState(
                                        prevState => {
                                            let newSchedule = prevState.schedule;
                                            newSchedule[day].in.hh = value;
                                            return {
                                                ...prevState,
                                                schedule: newSchedule,
                                            }
                                        }
                                    ) }
                                >
                                    {[...Array(24).keys()].map( n => <Picker.Item label = {`${n}`} value = { n } key = { n }/> )}
                                </Picker>
                                <Picker
                                    selectedValue = { this.state.schedule[day].in.mm }
                                    style = {[ styles.picker, {  }  ]}
                                    onValueChange = { (value, _) => this.setState(
                                        prevState => {
                                            let newSchedule = prevState.schedule;
                                            newSchedule[day].in.mm = value;
                                            return {
                                                ...prevState,
                                                schedule: newSchedule,
                                            }
                                        }
                                    ) }
                                >
                                    {[...Array(4).keys()].map( n => <Picker.Item label = {`${15 * n}`} value = { 15 * n } key = { n }/> )}
                                </Picker>
                                <Picker
                                    selectedValue = { this.state.schedule[day].out.hh }
                                    style = {[ styles.picker, {  }  ]}
                                    onValueChange = { (value, _) => this.setState(
                                        prevState => {
                                            let newSchedule = prevState.schedule;
                                            newSchedule[day].out.hh = value;
                                            return {
                                                ...prevState,
                                                schedule: newSchedule,
                                            }
                                        }
                                    ) }
                                >
                                    {[...Array(24).keys()].map( n => <Picker.Item label = {`${n}`} value = { n } key = { n }/> )}
                                </Picker>
                                <Picker
                                    selectedValue = { this.state.schedule[day].out.mm }
                                    style = {[ styles.picker, {  }  ]}
                                    onValueChange = { (value, _) => this.setState(
                                        prevState => {
                                            let newSchedule = prevState.schedule;
                                            newSchedule[day].out.mm = value;
                                            return {
                                                ...prevState,
                                                schedule: newSchedule,
                                            }
                                        }
                                    ) }
                                >
                                    {[...Array(4).keys()].map( n => <Picker.Item label = {`${15 * n}`} value = { 15 * n } key = { n }/> )}
                                </Picker>
                            </View>
                        )
                    )
                }


            </ScrollView>

            { this.state.errorCode !== '' &&
                <Text style = {{color: 'red'}}>{ this.state.errorCode }</Text>
            }

            <TouchableOpacity
                style = {[styles.button, { width: '70%' }]}
                onPress = { () => this.handleSubmit() }
            >
                <Text>Ir</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>;

    isValid() {
        const { name, mail, phone, password, passwordConfirm, address } = this.state;
        if ( !name ) return formErrors.name;
        if ( !isEmail(mail) ) return formErrors.mail;
        if ( !isPhone(phone) ) return formErrors.phone;
        if ( !password && password === passwordConfirm )  return formErrors.passwordConfirm;
        if ( address.lat === 0 ) return formErrors;
        return '';
    };

    private handleSubmit() {

        const validationError = this.isValid();
        if (validationError) {
            this.setState({errorCode: `${validationError}`});
            return;
        }

        console.log(this.state.address);

        const domain = this.state.mail.match(/@(\w*)?\./)![1];
        const {  name, mail, phone, car, schedule, password, address } = this.state;
        try {
            Store.registerUser({
                name,
                mail,
                phone,
                car,
                domain,
                address,
                schedule,

                password,
            });
        } catch ( e ) {
            this.setState({errorCode: `${e}`});
        }
    }

}