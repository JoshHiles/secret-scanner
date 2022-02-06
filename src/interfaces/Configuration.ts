// import Plugin from './Plugin';

export default interface Configuration {
    plugins: string[];
    disable_plugins: string[];
    exclude: {
        lines: string[];
        files: string[];
        secrets: string[];
    };
}
