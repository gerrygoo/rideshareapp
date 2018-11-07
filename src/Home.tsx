import React from 'react';
import { Text, View, FlatList, StatusBar, Platform } from 'react-native';

import { styles } from './Styles';

import { Store } from './Store';
import { NavigationScreenProps } from 'react-navigation';

interface HomeState {
    peers: FBStore.StoreUser[];
    loading: boolean;
}


export class Home extends React.Component<NavigationScreenProps<{}>, HomeState> {
    state = {
        peers: [ ] as FBStore.StoreUser[],
        loading: true,
    }

    async componentDidMount() {
        const peers = await Store.getPeers();
        this.setState({ peers, loading: false });
    }

    render() {
        const { peers, loading } = this.state;
        const plural = !(peers.length === 1);
        const
            s = plural ? 's' : '',
            n = plural ? 'n' : '',
            as = plural ? '' : 'a';
        return (
            <View style = {styles.container} >
                <View style = {{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 45 }} />
                <Text style = { styles.title }>
                    {`La${s} siguiente${s} persona${s} que va${n} a tu institución vive${n} cerca de ti.`}
                </Text>
                <Text style = { styles.subTitle } >
                    {`(Ordenada${s} por proximidad a ti)`}
                </Text>
                <View style = { styles.line }/>
                <FlatList
                    data = { peers }
                    style = {{ marginTop: 10, paddingHorizontal: 5,  width: '100%', height: '100%' }}
                    renderItem = { ({ item: peer }) => (
                        <View style = { styles.flatListRow }>
                            <Text style={{textAlign: 'center'}}>{`${peer.name}`}</Text>
                            <Text>{`su celular es`}</Text>
                            <Text>{`${peer.phone}`}</Text>
                        </View>

                    )}
                    onRefresh = { () => this.setState({ loading: true }, this.refresh)}
                    refreshing = { loading }
                    ListEmptyComponent = {(<Text>No hay personas para compartir viajes aún!</Text>)}
                    ListFooterComponent = {(<Text style = { [styles.subTitle, { alignSelf: 'flex-end', }] }>{`${peers.length}${as} persona${s}.`}</Text>)}
                />
            </View>
        );
    }

    private async refresh() {
        const peers = await Store.getPeers();
        this.setState({ peers, loading: false });
    }

}
