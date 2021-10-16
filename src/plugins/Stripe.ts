import IPlugin from '../models/IPlugin';

export default class Stripe implements IPlugin {
    Name = 'Stripe';
    // Stripe standard keys begin with sk_live and restricted with rk_live
    Regexes = [new RegExp('(?:r|s)k_live_[0-9a-zA-Z]{24}', 'g')];
    ExampleMatches = [''];
}
