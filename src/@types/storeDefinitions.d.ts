declare namespace FBStore {
    interface Time {
        hh: number;
        mm: number;
    }

    interface Commute {
        in: Time;
        out: Time;
    }

    interface Address {
        lat: number;
        lng: number;
    }

    interface StoreUser {
        uid?: string;

        name: string;
        mail: string;
        phone: string;
        domain: string;
        car: boolean;
        address: Address;
        schedule: FBStore.Commute[];
    }

    interface UserCreationData extends StoreUser {
        password: string;
    }
}