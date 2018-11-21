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

    interface Schedule {
        mo?: Commute;
        tu?: Commute;
        we?: Commute;
        th?: Commute;
        fr?: Commute;
        sa?: Commute;
        su?: Commute;
        [key: string]: Commute | undefined;
    }

    interface StoreUser {
        uid?: string;

        name: string;
        mail: string;
        phone: string;
        domain: string;
        car: boolean;
        address: Address;
        schedule: Schedule;
    }

    interface UserCreationData extends StoreUser {
        password: string;
    }
}