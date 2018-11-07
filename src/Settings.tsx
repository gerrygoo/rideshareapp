import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from './Styles';
import { Store } from './Store';


export class Settings extends React.Component {
    render = () =>
        <View style = {styles.container} >
            <TouchableOpacity
                style = {styles.button}
                onPress = { () => Store.signOut() }
            >
                <Text>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
}


