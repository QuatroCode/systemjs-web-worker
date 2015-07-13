class WebWorker {

    private isSetWorker = false;

    constructor(name:string) {
        if (!this.isSetWorker) {
            this.loadFakeWorker();
            this.isSetWorker = true;
        }
        return new Worker(name);
    }

    private loadFakeWorker() {
        if (Worker == null) {
            //TODO: Import fake worker
            //require("./web-worker-fake");
        }
    }
}

export default WebWorker;