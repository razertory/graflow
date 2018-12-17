const Changes = require('../changes.js')
const Sets = require('../sets')
const Field = require('./Field.js')

function Interface({ kind, name, description, fields, interfaces, possibleTypes }) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.fields = {};
    if (fields) fields.forEach(field => {
        this.fields[field.name] = new Field(field, this.name);
    });
    if (this.interfaces) {
        this.interfaces = {};
        interfaces.forEach(itf => {
            this.interfaces[itf.name] = itf;
        });
    }
    if (possibleTypes) {
        this.possibleTypes = {};
        possibleTypes.forEach(type => {
            this.possibleTypes[type.name] = type;
        });
    }
}

Interface.prototype.diff = function(old_type) {
    let changes = [];
    //diff fields
    let removed = Sets.difference(Object.keys(old_type.fields), Object.keys(this.fields)).map(
        field_name => new Changes.FieldRemoved(old_type, old_type.fields[field_name])
    );
    let added = Sets.difference(Object.keys(this.fields), Object.keys(old_type.fields)).map(
        field_name => new Changes.FieldAdded(this, this.fields[field_name])
    );
    changes = [...removed, ...added];
    Sets.intersection(Object.keys(this.fields), Object.keys(old_type.fields)).forEach(field_name => {
        let old_field = old_type.fields[field_name];
        let new_field = this.fields[field_name];
        changes = [...changes, ...new_field.diff(old_field)];
    });
    return changes;
}

module.exports = Interface;