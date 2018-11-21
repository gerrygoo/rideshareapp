import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView, Picker, Switch, Alert } from 'react-native';
import { NavigationScreenProps  } from 'react-navigation';
import { withMappedNavigationProps, } from 'react-navigation-props-mapper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


import { Store, any as some } from './Store';

import { styles } from './Styles';


export interface CreateUserProps extends NavigationScreenProps {

}

interface CreateUserState extends FBStore.StoreUser {
    errorCode: string;
    password: string;
    passwordConfirm: string;
}

const scheduleDays = [
    'mo',
    'tu',
    'we',
    'th',
    'fr',
    'sa',
    'su',
];

export const days: { [key: string]: string } = {
    mo: 'Lunes',
    tu: 'Martes',
    we: 'Miércoles',
    th: 'Jueves',
    fr: 'Viernes',
    sa: 'Sábados',
    su: 'Domingos',
    0: 'Lunes',
    1: 'Martes',
    2: 'Miércoles',
    3: 'Jueves',
    4: 'Viernes',
    5: 'Sábados',
    6: 'Domingos',
};

export const formErrors = {
    name: 'nombre inválido',
    mail: 'correo inválido',
    phone: 'teléfono inválido',
    passwordConfirm: 'las contraseñas no son iguales',
    address: 'direccion invalida',
    schedule: 'horario inválido',
}

export const isEmail = ( candidate:string ): boolean => (
    candidate.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    !== null
);

const isPhone = ( candidate:string ): boolean => (
    candidate.match(/\d{3}([ .-])?\d{3}([ .-])?\d{4}|\(\d{3}\)([ ])?\d{3}([.-])?\d{4}|\(\d{3}\)([ ])?\d{3}([ ])?\d{4}|\(\d{3}\)([.-])?\d{3}([.-])?\d{4}|\d{3}([ ])?\d{3}([ .-])?\d{4}/)
    !== null
);

@withMappedNavigationProps()
export class CreateUser extends React.Component<CreateUserProps, CreateUserState> {
    state: CreateUserState = {
        errorCode: '',

        name: '',
        mail: '',
        phone: '',
        car: false,
        domain: '',
        address: { lat: 0, lng: 0 },

        password: '',
        passwordConfirm: '',

        schedule: {
            // mo: { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } },
            // tu: { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } },
            // we: { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } },
            // th: { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } },
            // fr: { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } },
            // sa: { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } },
            // su: { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } },
        },
    };

    render = () =>
        <KeyboardAvoidingView
            style = {[ styles.flex1, { justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 }  ]}
            behavior = 'padding'
        >
            <ScrollView style = {{ width: '100%' }}>
                <Text style = { [styles.title, { marginLeft: 10 }] }>Tus datos</Text>
                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >{'\nNombre'}</Text>
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
                    <Text style = { styles.taggedTextFieldTag }  >{'Número\ncelular'}</Text>
                    <TextInput
                        keyboardType = 'phone-pad'
                        style = { styles.taggedTextFieldField }
                        onChangeText = { text => this.setState({ phone: text }) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >{'\nContraseña'}</Text>
                    <TextInput
                        style = { styles.taggedTextFieldField }
                        autoCapitalize = 'none'
                        secureTextEntry
                        onChangeText = { text => this.setState({ password: text }) }
                    />
                </View>

                <View style = { styles.taggedTextField } >
                    <Text style = { styles.taggedTextFieldTag }  >Confirma Contraseña</Text>
                    <TextInput
                        style = { styles.taggedTextFieldField }
                        autoCapitalize = 'none'
                        secureTextEntry
                        onChangeText = { text => this.setState({ passwordConfirm: text }) }
                    />
                </View>

                <View style = { { flexDirection: 'column' } } >
                    <View style = {styles.taggedTextField} >
                        <Text style = { styles.taggedTextFieldTag }  >Tengo auto</Text>
                        <Switch
                            value ={this.state.car}
                            onValueChange = { (value) => this.setState({car : value}) }
                        />
                    </View>
                    {
                        this.state.car &&
                        <View style = { styles.taggedTextField } >
                            <Text style = { styles.taggedTextFieldTag }  >Mi licencia expira en el año:</Text>
                            <TextInput
                                style = { styles.taggedTextFieldField }
                                onChangeText = { text => null }
                                // onChangeText = { text => this.setState({ passwordConfirm: text }) }
                            />
                        </View>
                    }
                </View>
                <Text style = { [styles.title, { marginLeft: 10 }] }>¿De dónde sales?</Text>
                <View style = { styles.taggedTextField } >
                    <Text style = {[styles.taggedTextFieldTag, { flex: 0.2, marginHorizontal: 10,}]} >Vivo por:</Text>

                    <GooglePlacesAutocomplete
                        query = {{key: 'AIzaSyDZp3F25-5QHhVr94i2G3fRfuX2ygZyCcs'}}
                        GoogleReverseGeocodingQuery = {{ key: 'AIzaSyDZp3F25-5QHhVr94i2G3fRfuX2ygZyCcs' }}
                        placeholder='Un lugar bien chido'
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
                <Text style = { [styles.title, { marginLeft: 10 }] }>¿Cuáles días?</Text>
                {
                    scheduleDays.map( scheduleDay =>
                        <View style = { [styles.taggedTextField, { flexDirection: 'column' }] } key = {scheduleDay} >
                            <View
                                style = {[{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }]}
                            >
                                <Text style = { styles.taggedTextFieldTag }  >{`${days[scheduleDay]}`}</Text>
                                <Switch
                                    value = { !!this.state.schedule[scheduleDay] }
                                    onValueChange = { value => {
                                        let newSchedule = {... this.state.schedule };
                                        if ( value ) newSchedule[scheduleDay] = { in: { hh: 0, mm: 0 }, out: { hh: 0, mm: 0 } };
                                        else delete newSchedule[scheduleDay];
                                        this.setState({ schedule: newSchedule });
                                    }}
                                />
                            </View>
                            {
                                !!this.state.schedule[scheduleDay] &&
                                <View
                                    style = {{ flexDirection: 'row', }}
                                >
                                    <Text style = { [styles.taggedTextFieldTag, { marginTop: 10, alignSelf: 'flex-start' }] } >{`Voy a la(s)`}</Text>
                                    <Text style = { [styles.taggedTextFieldTag, { marginTop: 10, alignSelf: 'flex-end' }] } >{`Regreso a la(s)`}</Text>
                                </View>
                            }
                            {
                                !!this.state.schedule[scheduleDay] &&
                                <View
                                    style = {{ flexDirection: 'row', }}
                                >
                                    <Text style = { [styles.taggedTextFieldTag, { marginTop: 10, alignSelf: 'flex-start' }] } >{`hora(s)`}</Text>
                                    <Text style = { [styles.taggedTextFieldTag, { marginTop: 10, alignSelf: 'flex-end' }] } >{`minutos`}</Text>
                                    <Text style = { [styles.taggedTextFieldTag, { marginTop: 10, alignSelf: 'flex-start' }] } >{`hora(s)`}</Text>
                                    <Text style = { [styles.taggedTextFieldTag, { marginTop: 10, alignSelf: 'flex-end' }] } >{`minutos`}</Text>
                                </View>
                            }
                            {
                                !!this.state.schedule[scheduleDay] &&
                                <View
                                    style = {[{
                                        marginVertical: 10,
                                        marginHorizontal: 2,
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                    }]}
                                >

                                    <Picker
                                        selectedValue = { this.state.schedule[scheduleDay]!.in.hh }
                                        style = {[ styles.picker, {  }  ]}
                                        onValueChange = { (value, _) => this.setState(
                                            prevState => {
                                                let newSchedule = prevState.schedule;
                                                newSchedule[scheduleDay]!.in.hh = value;
                                                return {
                                                    ...prevState,
                                                    schedule: newSchedule,
                                                }
                                            }
                                        ) }
                                    >
                                        {[...Array(24).keys()].reverse().map( n => <Picker.Item label = {`${n.toString().padStart(2, '0')}`} value = { n } key = { n }/> )}
                                    </Picker>
                                    <Picker
                                        selectedValue = { this.state.schedule[scheduleDay]!.in.mm }
                                        style = {[ styles.picker, {  }  ]}
                                        onValueChange = { (value, _) => this.setState(
                                            prevState => {
                                                let newSchedule = prevState.schedule;
                                                newSchedule[scheduleDay]!.in.mm = value;
                                                return {
                                                    ...prevState,
                                                    schedule: newSchedule,
                                                }
                                            }
                                        ) }
                                    >
                                        {[...Array(4).keys()].reverse().map( n => <Picker.Item label = {`${(15 * n).toString().padStart(2, '0')}`} value = { 15 * n } key = { n }/> )}
                                    </Picker>
                                    <Picker
                                        selectedValue = { this.state.schedule[scheduleDay]!.out.hh }
                                        style = {[ styles.picker, {  }  ]}
                                        onValueChange = { (value, _) => this.setState(
                                            prevState => {
                                                let newSchedule = prevState.schedule;
                                                newSchedule[scheduleDay]!.out.hh = value;
                                                return {
                                                    ...prevState,
                                                    schedule: newSchedule,
                                                }
                                            }
                                        ) }
                                    >
                                        {[...Array(24).keys()].reverse().map( n => <Picker.Item label = {`${n.toString().padStart(2, '0')}`} value = { n } key = { n }/> )}
                                    </Picker>
                                    <Picker
                                        selectedValue = { this.state.schedule[scheduleDay]!.out.mm }
                                        style = {[ styles.picker, {  }  ]}
                                        onValueChange = { (value, _) => this.setState(
                                            prevState => {
                                                let newSchedule = prevState.schedule;
                                                newSchedule[scheduleDay]!.out.mm = value;
                                                return {
                                                    ...prevState,
                                                    schedule: newSchedule,
                                                }
                                            }
                                        ) }
                                    >
                                        {[...Array(4).keys()].reverse().map( n => <Picker.Item label = {`${(15 * n).toString().padStart(2, '0')}`} value = { 15 * n } key = { n }/> )}
                                    </Picker>
                                </View>
                            }
                        </View>
                    )
                }
            </ScrollView>

            { this.state.errorCode !== '' &&
                <Text style = {{color: 'red'}}>{ this.state.errorCode }</Text>
            }

            <TouchableOpacity
                style = {[styles.button, { width: '80%', marginTop: 10 }]}
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
        if ( address.lat === 0 ) return formErrors.address;
        if (
            Object.keys(this.state.schedule).length === 0
            ||some( Object.keys(this.state.schedule), key => ( this.state.schedule[key]!.in.hh > this.state.schedule[key]!.out.hh ) )
        ) return formErrors.schedule;
        return '';
    };

    private async handleSubmit() {

        const validationError = this.isValid();
        if (validationError) {
            this.setState({errorCode: `${validationError}`});
            return;
        }

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
            Alert.alert(
                'Usuario creado!',
                'Revisa tu correo para verificar tu cuenta',
                [ { text: 'OK', onPress: () => null}, ],
                { cancelable: false }
            );
            this.props.navigation.navigate('LoginScreen');
        } catch ( e ) {
            this.setState({errorCode: `${e}`});
        }
    }

}