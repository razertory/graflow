const Changes = require('../changes.js')
const Sets = require('../sets.js')
const Argument = require('./Argument.js')
const Type = require('./Type.js')

function Field({ name, description, args, type, isDeprecated, deprecationReason }, type_name) {
    this.name = name;
    this.description = description;
    this.args = {};
    if (args) args.forEach(arg => {
        this.args[arg.name] = new Argument(arg, name, type_name);
    });
    this.type = new Type(type);
    this.isDeprecated = isDeprecated;
    this.deprecationReason = deprecationReason;
    this.type_name = type_name;
}

Field.prototype.diff = function(old_field) {
    let changes = [];
    if (old_field.description != this.description) {
        changes.push(new Changes.FieldDescriptionChanged(this.type_name, old_field, this));
    }
    if (old_field.deprecationReason != this.deprecationReason) {
        changes.push(new Changes.FieldDeprecationChanged(this.type_name, old_field, this));
    }
    if (this.type.different(old_field.type)) {
        changes.push(new Changes.FieldTypeChanged(this.type_name, old_field, this));
    }
    let removed = Sets.difference(Object.keys(old_field.args), Object.keys(this.args)).map(
        arg_name => new Changes.FieldArgumentRemoved(this.type_name, old_field, old_field.args[arg_name])
    );
    let added = Sets.difference(Object.keys(this.args), Object.keys(old_field.args)).map(
        arg_name => new Changes.FieldArgumentAdded(this.type_name, this, this.args[arg_name])
    );
    changes = [...changes, ...removed, ...added];

    Sets.intersection(Object.keys(this.args), Object.keys(old_field.args)).forEach(arg_name => {
        let old_arg = old_field.args[arg_name];
        let new_arg = this.args[arg_name];
        changes = [...changes, ...new_arg.diff(old_arg)];
    });
    return changes;
}

module.exports = Field;