export default class AutoId {
    static newId(): string {
        // Alphanumeric characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        for (let i = 0; i < 20; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        if (autoId.length != 20) {
            throw new Error('Invalid auto ID: ' + autoId);
        }
        return autoId;
    }
}