export interface Event {
    name: string;
    once: boolean;
    isDisabled?: boolean;
    run: (...args: any) => void;
}