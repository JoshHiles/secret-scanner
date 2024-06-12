export default interface Baseline {
    generated_at: string;
    plugins: string[];
    filters: string[];
    results: Results;
}

export interface Results {
    [path: string]: Result[];
}

export interface Result {
    type: string;
    hashed_secret: string;
    line_number: number;
    is_secret?: boolean;
}
