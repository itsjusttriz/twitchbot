import { Events } from 'tmi.js';
import { ClientController } from '../../controllers/ClientController';

export interface Event {
    name: keyof Events;
    once?: boolean;
    isDisabled?: boolean;
    run: (client: typeof ClientController, ...args: any) => void;
}
