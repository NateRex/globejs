
/**
 * Event emitter capable of generating events resulting in callbacks to one or more listener functions.
 * @param T The data type emitted by this event
 * @author Nathaniel Rex
 */
export class Event<T> {

    /**
     * Listener functions
     */
    private _listeners: ((data: T) => void)[] = [];

    /**
     * Constructor
     */
    public constructor() {

    }

    /**
     * Adds a listener to this event
     * @param listener Reference to a callback function
     */
    public addListener(listener: (data: T) => void) {
        this._listeners.push(listener);
    }

    /**
     * Removes a listener from this event
     * @param listener Reference to a callback function
     */
    public removeListener(listener: (data: T) => void) {
        const idx = this._listeners.indexOf(listener);
        if (idx >= 0) {
            this._listeners.splice(idx, 1);
        }
    }

    /**
     * Triggers this event. This results in callbacks to all listener functions with the given data.
     * @param data The data to broadcast to all listeners
     */
    public raise(data: T) {
        this._listeners.forEach(listener => listener(data));
    }
}