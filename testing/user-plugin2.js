Object.defineProperty(exports, "__esModule", { value: true });
class UserPlugin2 {
    constructor() {
        this.Name = 'user-plugin2';
        this.Regexes = [new RegExp('mr_test', 'g')];
        this.ExampleMatches = ['mr_test'];
    }
}
exports.default = UserPlugin2;