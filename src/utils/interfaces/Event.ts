import { Events } from "tmi.js";
import { ClientController } from "../../controllers/client.controller";

export interface Event {
    name: keyof Events;
    once?: boolean;
    isDisabled?: boolean;
    run: (client: typeof ClientController, ...args: any) => void;
}