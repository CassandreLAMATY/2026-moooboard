export default function getFaviconAddress(address: string): string {
    const regex = /^((?:[^/]*\/){2}[^/]*)\//;

    if (address.match(regex) && address.match(regex)![1]) {
        return `${address.match(regex)![1]}/favicon.ico`;
    }

    return `${address}/favicon.ico`;
}
