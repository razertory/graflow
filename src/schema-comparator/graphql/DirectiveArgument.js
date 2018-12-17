const Type = require('./Type.js')
const Changes = require('../changes.js')

function DirectiveArgument({ name, description, type, defaultValue }, directive_name) {
    this.name = name;
    this.description = description;
    this.type = new Type(type);
    this.defaultValue = defaultValue;
    this.directive_name = directive_name;
}

DirectiveArgument.prototype.diff = function(old_arg) {
    let changes = [];
    if (old_arg.description != this.description) {
        changes.push(new Changes.DirectiveArgumentDescriptionChanged(this.directive_name, old_arg, this))
    }

    if (old_arg.defaultValue != this.defaultValue) {
        changes.push(new Changes.DirectiveArgumentDefaultChanged(this.directive_name, old_arg, this));
    }

    if (this.type.different(old_arg.type)) {
        changes.push(new Changes.DirectiveArgumentTypeChanged(this.directive_name, old_arg, this));
    }
    return changes;
}

module.exports = DirectiveArgument;