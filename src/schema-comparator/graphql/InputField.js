const Changes = require('../changes.js')
const Type = require('./Type.js')

function InputField({ name, description, type, defaultValue }, type_name) {
    this.name = name;
    this.description = description;
    this.type = new Type(type);
    this.defaultValue = defaultValue;
    this.type_name = type_name;
}

InputField.prototype.diff = function(old_field) {
    let changes = [];
    if (old_field.description != this.description) {
        changes.push(new Changes.InputFieldDescriptionChanged(this.type_name, old_field, this));
    }

    if (old_field.defaultValue != this.defaultValue) {
        changes.push(new Changes.InputFieldDefaultChanged(this.type_name, old_field, this));
    }
    if (this.type.different(old_field.type)) {
        changes.push(new Changes.InputFieldTypeChanged(this.type_name, old_field, this));
    }
    return changes;
}

module.exports = InputField;