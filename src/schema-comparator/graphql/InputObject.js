const Changes = require('../changes.js')
const Sets = require('../sets')
const InputField = require('./InputField')

function InputObject({ kind, name, description, inputFields }) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.inputFields = {};
    if (inputFields) {
        inputFields.forEach(field => {
            this.inputFields[field.name] = new InputField(field, this.name);
        });
    }
}

InputObject.prototype.diff = function(old_type) {
    let changes = [];
    //inputField removed
    let removed = Sets.difference(Object.keys(old_type.inputFields), Object.keys(this.inputFields)).map(field_name => {
        return new Changes.InputFieldRemoved(old_type, old_type.inputFields[field_name]);
    });
    //inputField added
    let added = Sets.difference(Object.keys(this.inputFields), Object.keys(old_type.inputFields)).map(field_name => {
        return new Changes.InputFieldAdded(old_type, this.inputFields[field_name]);
    });
    changes = [...removed, ...added];
    Sets.intersection(Object.keys(old_type.inputFields), Object.keys(this.inputFields)).forEach(field_name => {
        let old_field = old_type.inputFields[field_name];
        let new_field = this.inputFields[field_name];
        changes = [...changes, ...new_field.diff(old_field)];
    });
    return changes;
}

module.exports = InputObject;