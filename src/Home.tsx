import React from 'react';
import { Text, View, FlatList, StatusBar, Platform, TouchableOpacity, Switch } from 'react-native';

import { styles } from './Styles';

import { Store, Peer } from './Store';
import { NavigationScreenProps } from 'react-navigation';
import { createStackNavigator } from 'react-navigation';

import { Detail } from './Detail';

export interface HomeProps {

}

interface HomeState {
    peers: Peer[];
    loading: boolean;
    dontUseCar: boolean;
    userHasCar: boolean;
}

class Home extends React.Component<NavigationScreenProps<HomeProps>, HomeState> {
    state = {
        peers: [ ] as Peer[],
        loading: true,
        userHasCar: true,
        dontUseCar: false,
    }

    async componentDidMount() {
        const peers = await Store.getPeers();
        const user = await Store.getLocalUser();

        this.setState({
            peers,
            loading: false,
            userHasCar: user.car
        });
    }

    render() {
        const { peers, loading, dontUseCar, userHasCar } = this.state;
        const
            plural = !(peers.length === 1),
            s = plural ? 's' : '',
            n = plural ? 'n' : '',
            as = plural ? '' : 'a';

        const { navigation } = this.props;
        return (
            <View style = {[styles.container, { marginHorizontal: 2 }]} >
                <View style = {{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 45 }} />

                <Text style = { styles.title }>
                    {`La${s} siguiente${s} persona${s} que va${n} a tu institución podría${n} compartir contigo.`}
                </Text>
                {
                    plural &&
                    <Text style = { styles.subTitle } >
                    {`(Ordenadas por proximidad a ti)`}
                    </Text>
                }
                {
                    userHasCar &&
                    <View
                        style = {{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            marginVertical: 10,
                        }}
                    >
                        <Text style = {{ flex: 1 }}  >Tengo auto pero quiero ver si me llevan también</Text>
                        <Switch
                            value ={this.state.dontUseCar}
                            onValueChange = { (value) => this.setState({dontUseCar : value}) }
                        />
                    </View>
                }
                <View style = { styles.line }/>
                
                <FlatList
                    data = { peers }
                    style = {{ marginTop: 10, paddingHorizontal: 5,  width: '100%', height: '100%' }}
                    renderItem = { ({ item: peer }) => (
                        <TouchableOpacity
                            style = { styles.flatListRow }
                            onPress = { () => navigation.navigate({routeName: 'Detail', params: { peer }}) }
                        >
                            <Text style={{textAlign: 'center'}} >{`${peer.name}`}</Text>
                            <Text style={{textAlign: 'center'}} >{`${peer.distance!.toFixed(1)} m`}</Text>
                        </TouchableOpacity>

                    )}
                    onRefresh = { () => this.setState({ loading: true }, this.refresh)}
                    refreshing = { loading }
                    ListEmptyComponent = {(<Text>No hay personas para compartir carro aún!</Text>)}
                    ListFooterComponent = {(<Text style = { [styles.subTitle, { alignSelf: 'flex-end', }] }>{`${peers.length}${as} persona${s}`}</Text>)}
                />
            </View>
        );
    }

    private async refresh() {
        const peers = await Store.getPeers();
        this.setState({ peers, loading: false });
    }

}

export const HomeStack = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                header: null,
            },
        },
        Detail: {
            screen: Detail,
            navigationOptions: {  },
        },
    },
    {
        initialRouteName: 'Home',
    },
);
