export default interface Configuration {
    disable_plugins: string[];
    exclude: {
        lines: string[];
        files: string[];
        secrets: string[];
    };
}
