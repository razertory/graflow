const Changes = require('../changes.js')
const Type = require('./Type')

function Argument({ name, description, type, defaultValue }, field_name, type_name) {
    this.name = name;
    this.description = description;
    this.type = new Type(type);
    this.defaultValue = defaultValue;
    this.field_name = field_name;
    this.type_name = type_name;
}

Argument.prototype.diff = function(old_arg) {
    let changes = [];
    if (old_arg.description != this.description) {
        changes.push(new Changes.FieldArgumentDescriptionChanged(this.type_name, this.field_name, old_arg, this));
    }
    if (old_arg.defaultValue != this.defaultValue) {
        changes.push(new Changes.FieldArgumentDefaultChanged(this.type_name, this.field_name, old_arg, this));
    }

    if (this.type.different(old_arg.type)) {
        changes.push(new Changes.FieldArgumentTypeChanged(this.type_name, this.field_name, old_arg, this));
    }
    return changes;
}

module.exports = Argument;