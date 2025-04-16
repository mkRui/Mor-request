interface ListType {
    [key: string]: (() => void)[];
}
declare class EventDispatch {
    list: ListType;
    on(event: string, fn: () => void): void;
    emit(...args: any): boolean | undefined;
    once(event: string, fn: () => void): void;
    off(event: string, fn: () => void): boolean | undefined;
}
export default EventDispatch;
