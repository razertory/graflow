function Criticality(level, reason) {
    this.level = level;
    this.reason = reason;
}
const NON_BREAKING = 1;
const DANGEROUS = 2;
const BREAKING = 3;

const fn = Criticality.prototype;

fn.isBreaking = function() {
    return this.leval == BREAKING;
}

fn.isNonBreaking = function() {
    return this.leval == NON_BREAKING;
}

fn.isDangerous = function() {
    return this.leval == DANGEROUS;
}

const breaking = function(reason = "This change is a breaking change") {
    return new Criticality(BREAKING, reason);
}

const non_breaking = function(reason = "This change is safe") {
    return new Criticality(NON_BREAKING, reason);
}

const dangerous = function(reason = "This change is dangerous") {
    return new Criticality(DANGEROUS, reason);
}

module.exports = {
    breaking,
    non_breaking,
    dangerous
};