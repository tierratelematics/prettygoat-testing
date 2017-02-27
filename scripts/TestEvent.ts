class TestEvent {
    type: string;
    payload: any;
    timestamp: Date;

    constructor(type: string, payload: any, timestamp: Date) {
        this.type = type;
        this.payload = payload;
        this.timestamp = timestamp;
    }
}

export default TestEvent