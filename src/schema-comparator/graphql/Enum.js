const Changes = require('../changes.js')
const Sets = require('../sets')

function Enum({ kind, name, description, enumValues }) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.enumValues = {};
    if (enumValues) enumValues.forEach(enumItem => {
        this.enumValues[enumItem.name] = enumItem;
    });
}

Enum.prototype.diff = function(old_enum) {
    let changes = [];
    //enum removed
    let removed = Sets.difference(Object.keys(old_enum.enumValues), Object.keys(this.enumValues)).map(
        enum_name => new Changes.EnumValueRemoved(old_enum, old_enum.enumValues[enum_name])
    );
    //enum added
    let added = Sets.difference(Object.keys(this.enumValues), Object.keys(old_enum.enumValues)).map(
        enum_name => new Changes.EnumValueAdded(old_enum, this.enumValues[enum_name])
    );
    changes = [...removed, ...added];
    Sets.intersection(Object.keys(this.enumValues), Object.keys(old_enum.enumValues)).forEach(enum_name => {
        let old_value = old_enum.enumValues[enum_name];
        let new_value = this.enumValues[enum_name];
        if (old_value.description != new_value.description) {
            changes.push(new Changes.EnumValueDescriptionChanged(old_enum, old_value, new_value));
        }
        if (old_value.deprecationReason != new_value.deprecationReason) {
            changes.push(new Changes.EnumValueDeprecated(old_enum, old_value, new_value))
        }
    })
    return changes;
}

module.exports = Enum;