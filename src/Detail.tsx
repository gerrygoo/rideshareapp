import React from 'react';
import { View, Text } from 'react-native';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import { NavigationScreenProps } from 'react-navigation';

import { Peer } from './Store';
import { styles } from './Styles';
import { days } from './CreateUser';

export interface DetailProps {
    peer: Peer;
}

export interface DetailState {

}

@withMappedNavigationProps()
export class Detail extends React.Component<NavigationScreenProps<DetailProps>, DetailState> {
    state = { };

    render = () => {
        if ( !this.props.navigation.state.params ) return (<Text>A royal fuckup happened</Text>);
        const { peer } = this.props.navigation.state.params;

        return (
            <View style = {{ flex: 1, marginLeft: 5 }}>
                <Text style = { [ styles.title, { marginBottom: 10 }] } >{`${peer.name}`}</Text>
                <Text style = { [ styles.subTitle, { marginBottom: 20 }]} >{`Lo encuentras en el número: ${peer.phone}`}</Text>
                <Text style = { [ styles.subTitle, { marginBottom: 20 }]} >{`Viaja los siguientes días:`}</Text>
                {
                    Object.keys(peer.schedule)
                    .map( key => ({ commute: peer.schedule[key] as FBStore.Commute, dayName: days[key] })  )
                    .map( day => (
                        <View style = {{ flexDirection: 'row' }} key = { day.dayName } >
                            <Text  >{`${day.dayName}`}</Text>
                            <Text>{` de ${day.commute.in.hh}`}</Text>
                            <Text>{` a ${day.commute.out.hh}`}</Text>
                        </View>
                    ) )
                }

            </View>
        );
    }

}