const Changes = require('../changes.js')
const Sets = require('../sets.js')
const DirectiveArgument = require('./DirectiveArgument.js')

function Directive({ name, description, args, locations, onOperation, onFragment, onField }) {
    this.name = name;
    this.description = description;
    this.args = {};
    if (args) args.forEach(arg => {
        this.args[arg.name] = new DirectiveArgument(arg, name);
    });
    this.locations = locations || [];
    this.onOperation = onOperation;
    this.onFragment = onFragment;
    this.onField = onField;
}

Directive.prototype.diff = function(old_directive) {
    let changes = [];
    if (old_directive.description != this.description) {
        changes.push(new Changes.DirectiveDescriptionChanged(old_directive, this));
    }
    //location
    let l_removed = Sets.difference(old_directive.locations, this.locations).map(
        location => new Changes.DirectiveLocationRemoved(this, location)
    );
    let l_added = Sets.difference(this.locations, old_directive.locations).map(
        location => new Changes.DirectiveLocationAdded(this, location)
    );
    //args
    let arg_removed = Sets.difference(Object.keys(old_directive.args), Object.keys(this.args)).map(
        arg_name => new Changes.DirectiveArgumentRemoved(this, old_directive.args[arg_name])
    );
    let arg_added = Sets.difference(Object.keys(this.args), Object.keys(old_directive.args)).map(
        arg_name => new Changes.DirectiveArgumentAdded(this, this.args[arg_name])
    );
    changes = [...changes, ...l_removed, ...l_added, ...arg_removed, ...arg_added];
    Sets.intersection(Object.keys(this.args), Object.keys(old_directive.args)).forEach(arg_name => {
        let old_arg = old_directive.args[arg_name];
        let new_arg = this.args[arg_name];
        changes = [...changes, ...new_arg.diff(old_arg)];
    });
    return changes;
}

module.exports = Directive;