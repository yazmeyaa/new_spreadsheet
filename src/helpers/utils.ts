export function getRandomId(): string {
    return Math.floor(Math.random() * Date.now()).toString(16);
}