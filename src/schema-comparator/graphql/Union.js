const Changes = require('../changes.js')
const Sets = require('../sets')

function Union({ kind, name, description, possibleTypes }) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.possibleTypes = {};
    if (possibleTypes) possibleTypes.forEach(type => {
        this.possibleTypes[type.name] = type;
    });
}

Union.prototype.diff = function(old_type) {
    let changes = [];
    let removed = Sets.difference(Object.keys(old_type.possibleTypes), Object.keys(this.possibleTypes)).map(type_name => {
        return new Changes.UnionMemberRemoved(old_type, old_type.possibleTypes[type_name]);
    });
    let added = Sets.difference(Object.keys(this.possibleTypes), Object.keys(old_type.possibleTypes)).map(type_name => {
        return new Changes.UnionMemberAdded(old_type, this.possibleTypes[type_name]);
    });
    changes = [...removed, ...added];
    return changes;
}

module.exports = Union;