export default class Result {
    type: string;
    hashed_secret: string;
    line_number: number;
    is_secret?: boolean;

    constructor(type: string, hashed_secret: string, line_number: number) {
        this.type = type;
        this.hashed_secret = hashed_secret;
        this.line_number = line_number;
    }
}
