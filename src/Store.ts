import { store, auth } from './fb';
import { AsyncStorage } from "react-native"

export class Store {
    public static async registerUser( user: FBStore.UserCreationData ) {
        try {
                const { user: authUser } = await auth.createUserWithEmailAndPassword(user.mail, user.password);
                const { uid } = authUser!;
                const storeUser = { ...user };
                delete storeUser.password;
                await store
                .collection('users')
                .doc(uid)
                .set(storeUser);

        } catch (e) {
            // TODO delete auth user or recover smh
            throw e;
        }
    }

    public static async recordLocalUser() {
        const currentUser = await auth.currentUser;
        if ( !currentUser ) throw 'Tried recordLocalUser while not signed in';
        const { uid } = currentUser;

        const userSnapshot = await store.collection('users').doc(uid).get();
        const userDoc = await userSnapshot.data();
        return AsyncStorage.setItem('user', JSON.stringify({...userDoc, uid}) );
    }

    public static async clearLocalUser() {
        return AsyncStorage.removeItem('user');
    }

    public static async getLocalUser(): Promise<FBStore.StoreUser> {
        const userStr = await AsyncStorage.getItem('user');
        if ( !userStr ) throw 'getLocalUser: no local user';
        return JSON.parse(userStr);
    }


    public static async signIn(mail: string, password: string) {
        return auth.signInWithEmailAndPassword(mail, password);
    }

    public static async signOut() {
        await auth.signOut();
    }

    public static async getPeers() {
        const { domain, mail, address, car } = await this.getLocalUser();
        const usersColl = await store.collection('users');
        const querySs = await usersColl.where('domain', '==', domain).get();
        let peers: FBStore.StoreUser[] = [];
        for ( const doc of querySs.docs ) {
            const peer = await doc.data() as FBStore.StoreUser;
            peers.push(peer);
        }

        const euclideanDistance = (a: FBStore.Address, b: FBStore.Address ) => ( Math.sqrt( Math.pow((a.lat - b.lat), 2) + Math.pow((a.lng - b.lng), 2) ) );

        // O(n log n) where n is number of users (?)
        // TODO change backed to sylos
        peers = peers.map( peer => ({ ...peer, key: peer.mail }) );
        peers = peers.filter( peer => ( peer.mail !== mail && peer.car !== car ) );
        peers = peers.sort(
            (a, b) => (
                euclideanDistance(address, a.address) < euclideanDistance(address, b.address) ? -1 :
                (
                    euclideanDistance(address, a.address) < euclideanDistance(address, b.address) ? 1 : 0
                )
            )
        );
        return peers;
    }
}