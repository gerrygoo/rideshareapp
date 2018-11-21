import { store, auth } from './fb';
import { AsyncStorage } from "react-native"

export type Peer = FBStore.StoreUser & { key?: string,  distance?: number };


const meterDistance = ( a: FBStore.Address, b: FBStore.Address ) => {
    const { lat: lat1, lng: lon1 } = a;
    const { lat: lat2, lng: lon2 } = b;

    const R = 6371e3; // metres
    const φ1 = degToRad(lat1);
    const φ2 = degToRad(lat2);
    const Δφ = degToRad(lat2-lat1);
    const Δλ = degToRad(lon2-lon1);

    const A = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);

    const c = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A));

    return R * c;
}

const degToRad = (deg: number): number => ( (deg * (Math.PI/180)) );

export const all: <T>( arr: Array<T>, check: (el:T) => boolean ) => boolean =
( arr, check ) => {
    for ( var element of arr ) if ( !check(element) ) return false;
    return true;
}

export const any: <T>( arr: Array<T>, check: (el:T) => boolean ) => boolean =
( arr, check ) => {
    for ( var element of arr ) if ( check(element) ) return true;
    return false;
}


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

                await auth.signOut();

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
        const userCred = await auth.signInWithEmailAndPassword(mail, password);
        console.log('signinIn:', userCred.user);
        if ( userCred.user && !userCred.user.emailVerified) {
            await this.signOut();
            throw 'Email not verified. Check email account inbox.';
        } else {
            console.log('logged in succesfully');
        }
    }

    public static async signOut() {
        await auth.signOut();
    }

    public static async getPeers(): Promise<Peer[]> {
        const { domain, mail, address, car } = await this.getLocalUser();
        const usersColl = await store.collection('users');
        const querySs = await usersColl.where('domain', '==', domain).get();
        let peers: Peer[] = [];
        for ( const doc of querySs.docs ) {
            const peer = await doc.data() as FBStore.StoreUser;
            peers.push(peer);
        }

        // const euclideanDistance = (a: FBStore.Address, b: FBStore.Address ) => ( Math.sqrt( Math.pow((a.lat - b.lat), 2) + Math.pow((a.lng - b.lng), 2) ) );

        // O(n log n) where n is number of users (?)
        // TODO change backed to sylos
        peers = peers.filter( peer => ( peer.mail !== mail ) );
        peers = peers.map( peer => ({ ...peer, key: peer.mail, distance: meterDistance(peer.address, address) }) );
        peers = peers.sort(
            (a, b) => ( a.distance! < b.distance! ? -1 : ( a.distance! < b.distance! ? 1 : 0 ) )
        );
        return peers;
    }

}
