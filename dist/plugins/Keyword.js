"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filetype_enum_1 = require("../models/filetype.enum");
const Denylist = [
    'api_?key',
    'auth_?key',
    'service_?key',
    'account_?key',
    'db_?key',
    'database_?key',
    'priv_?key',
    'private_?key',
    'client_?key',
    'db_?pass',
    'database_?pass',
    'key_?pass',
    'password',
    'passwd',
    'pwd',
    'secret',
    'contraseña',
    'contrasena',
];
const Closing = `[]\\'"]{0,2}`;
const AffixRegex = `\\w*`;
const DenylistRegex = `(${Denylist.join('|')})${AffixRegex}`;
// Support for prefix and suffix with keyword, needed for reverse comparisons i.e. if ("value" == my_password_secure) {}
const DenylistRegexWithPrefix = `${AffixRegex}${DenylistRegex}`;
const OptionalWhitespace = `\\s*`;
const OptionalNonWhitespace = '[^\\s]{0,50}?';
const Quote = `[\\'"\`]`;
const Secret = `(?=[^\\v\\'\\"]*)(?=\\w+)[^\\v\\'\\"]*[^\\v,\\'\\"\`]`;
const SquareBrackets = `(\\[[0-9]*\\])`;
// e.g. my_password := "bar" or my_password := bar
const FollowedByColonEqualSignsRegex = new RegExp(`${DenylistRegex}(${Closing})?${OptionalWhitespace}:=?${OptionalWhitespace}(${Quote}?)(${Secret})(\\3)`, 'ig');
// e.g. api_key: foo
const FollowedByColonRegex = new RegExp(`${DenylistRegex}(${Closing})?:${OptionalWhitespace}(${Quote}?)(${Secret})(\\3)`, 'ig');
// e.g. api_key: "foo"
const FollowedByColonQuotesRequiredRegex = new RegExp(`${DenylistRegex}(${Closing})?:(${OptionalWhitespace})(${Quote})(${Secret})(\\4)`, 'ig');
// e.g. my_password = "bar"
// e.g. my_password = @"bar"
// e.g. my_password[] = "bar";
// e.g. char my_password[25] = "bar";
const FollowedByEqualSignsOptionalBracketsOptionalAtSignQuotesRequiredRegex = new RegExp(`${DenylistRegex}(${SquareBrackets})?${OptionalWhitespace}[!=]{{1,2}}${OptionalWhitespace}(@)?(")(${Secret})(\\5)`, 'ig');
// e.g. std::string secret("bar");
// e.g. secret.assign("bar",17);
const FollowedByOptionalAssignQuotesRequiredRegex = new RegExp(`${DenylistRegex}(.assign)?\\((")(${Secret})(\\3)`);
// e.g. my_password = bar
// e.g. my_password == "bar" or my_password != "bar" or my_password === "bar"
// or my_password !== "bar"
// e.g. my_password == 'bar' or my_password != 'bar' or my_password === 'bar'
// or my_password !== 'bar'
const FollowedByEqualSignsRegex = new RegExp(`${DenylistRegex}(${Closing})?${OptionalWhitespace}(={{1,3}}|!==?)${OptionalWhitespace}(${Quote}?)(${Secret})(\\4)`, 'ig');
// e.g. "bar" == my_password or "bar" != my_password or "bar" === my_password
// or "bar" !== my_password
// e.g. 'bar' == my_password or 'bar' != my_password or 'bar' === my_password
// or 'bar' !== my_password
const PrecededByEqualComparisonSignsQuotesRequiredRegex = new RegExp(`(${Quote})(${Secret})(\\1)${OptionalWhitespace}[!=]{{2,3}}${OptionalWhitespace}${DenylistRegexWithPrefix}`, 'g');
// e.g. my_password = "bar"
// e.g. my_password == "bar" or my_password != "bar" or my_password === "bar"
// or my_password !== "bar"
// e.g. my_password == 'bar' or my_password != 'bar' or my_password === 'bar'
// or my_password !== 'bar'
const FollowedByEqualSignsQuotesRequiredRegex = new RegExp(`${DenylistRegex}(${Closing})?${OptionalWhitespace}(={{1,3}}|=|!==?)${OptionalWhitespace}(${Quote})(${Secret})(\\4)`, 'ig');
// e.g. private_key "something";
const FollowedByQuotesAndSemicolonRegex = new RegExp(`${DenylistRegex}${OptionalNonWhitespace}${OptionalWhitespace}(${Quote})(${Secret})(\\2);`, 'ig');
class Keyword {
    constructor(fileType) {
        this.Name = 'Keyword';
        this.Regexes = [];
        this.ExampleMatches = {
            0: [''],
            1: [''],
            2: [''],
            3: [''],
            4: ['password = "bar"'],
            5: [''],
            6: [''],
            7: [''],
            8: [''],
            9: [''],
            10: [''],
            11: [''],
            12: [''],
            13: [''],
            14: [''],
            15: [''],
            16: [''],
            17: [''],
            18: [''],
        };
        switch (fileType) {
            case filetype_enum_1.FileType.GO:
                this.Regexes = [
                    FollowedByColonEqualSignsRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.OBJECTIVE_C:
                this.Regexes = [FollowedByEqualSignsOptionalBracketsOptionalAtSignQuotesRequiredRegex];
                break;
            case filetype_enum_1.FileType.C_SHARP:
                this.Regexes = [FollowedByEqualSignsOptionalBracketsOptionalAtSignQuotesRequiredRegex];
                break;
            case filetype_enum_1.FileType.C:
                this.Regexes = [FollowedByEqualSignsOptionalBracketsOptionalAtSignQuotesRequiredRegex];
                break;
            case filetype_enum_1.FileType.C_PLUS_PLUS:
                this.Regexes = [FollowedByOptionalAssignQuotesRequiredRegex, FollowedByEqualSignsQuotesRequiredRegex];
                break;
            case filetype_enum_1.FileType.CLS:
                this.Regexes = [
                    FollowedByColonQuotesRequiredRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.JAVA:
                this.Regexes = [
                    FollowedByColonQuotesRequiredRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.JAVASCRIPT:
                this.Regexes = [
                    FollowedByColonQuotesRequiredRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.PYTHON:
                this.Regexes = [
                    FollowedByColonQuotesRequiredRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.SWIFT:
                this.Regexes = [
                    FollowedByColonQuotesRequiredRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.TERRAFORM:
                this.Regexes = [
                    FollowedByColonQuotesRequiredRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.YAML:
                this.Regexes = [
                    FollowedByColonRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.CONFIG:
                this.Regexes = [
                    FollowedByColonRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.INI:
                this.Regexes = [
                    FollowedByColonRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.PROPERTIES:
                this.Regexes = [
                    FollowedByColonRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            case filetype_enum_1.FileType.TOML:
                this.Regexes = [
                    FollowedByColonRegex,
                    PrecededByEqualComparisonSignsQuotesRequiredRegex,
                    FollowedByEqualSignsQuotesRequiredRegex,
                    FollowedByQuotesAndSemicolonRegex,
                ];
                break;
            default:
                this.Regexes = [];
                break;
        }
    }
}
exports.default = Keyword;
