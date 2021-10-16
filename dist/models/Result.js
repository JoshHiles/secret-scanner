"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(type, hashed_secret, line_number) {
        this.type = type;
        this.hashed_secret = hashed_secret;
        this.line_number = line_number;
    }
}
exports.default = Result;
