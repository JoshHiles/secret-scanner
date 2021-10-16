"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stripe {
    constructor() {
        this.Name = 'Stripe';
        // Stripe standard keys begin with sk_live and restricted with rk_live
        this.Regexes = [new RegExp('(?:r|s)k_live_[0-9a-zA-Z]{24}', 'g')];
        this.ExampleMatches = [''];
    }
}
exports.default = Stripe;
