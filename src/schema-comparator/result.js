const NON_BREAKING = 1;
const DANGEROUS = 2;
const BREAKING = 3;

function Result(changes) {
    this.changes = changes.sort((a, b) => {
        if (a.criticality.level === b.criticality.level) {
            return a.path < b.path;
        } else return a.criticality.level < b.criticality.level;
    }) || [];
    this.breaking_changes = this.changes.filter(item => {
        return item.criticality.level === BREAKING;
    }).map(item => ({ reason: item.criticality.reason, message: item.message, path: item.path, }));
    this.non_breaking_changes = this.changes.filter(item => {
        return item.criticality.level === NON_BREAKING;
    }).map(item => ({ reason: item.criticality.reason, message: item.message, path: item.path, }));
    this.dangerous_changes = this.changes.filter(item => {
        return item.criticality.level === DANGEROUS;
    }).map(item => ({ reason: item.criticality.reason, message: item.message, path: item.path, }));
}

Result.prototype.getResult = function() {
    return {
        identical: this.identical(),
        isBreaking: this.isBreaking(),
        breaking_changes: this.breaking_changes,
        non_breaking_changes: this.non_breaking_changes,
        dangerous_changes: this.dangerous_changes
    }
}

Result.prototype.identical = function() {
    return !this.changes.length;
}

Result.prototype.isBreaking = function() {
    return !!this.breaking_changes.length;
}

module.exports = Result;