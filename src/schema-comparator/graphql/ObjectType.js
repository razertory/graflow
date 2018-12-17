const Changes = require('../changes.js')
const Sets = require('../sets')
const Field = require('./Field.js')

function ObjectType({ kind, name, description, fields, interfaces }) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.fields = {};
    if (fields) fields.forEach(field => {
        this.fields[field.name] = new Field(field, name);
    });
    this.interfaces = {};
    if (interfaces) interfaces.forEach(itf => {
        this.interfaces[itf.name] = itf;
    });
}

ObjectType.prototype.diff = function(old_type) {
    let changes = [];
    //interfaces removed
    let i_removed = Sets.difference(Object.keys(old_type.interfaces), Object.keys(this.interfaces)).map(
        interface_name => new Changes.ObjectTypeInterfaceRemoved(old_type.interfaces[interface_name], old_type)
    );
    //interfaces added
    let i_added = Sets.difference(Object.keys(this.interfaces), Object.keys(old_type.interfaces)).map(
        interface_name => new Changes.ObjectTypeInterfaceAdded(this.interfaces[interface_name], this)
    );

    //fields removed
    let f_removed = Sets.difference(Object.keys(old_type.fields), Object.keys(this.fields)).map(
        field_name => new Changes.FieldRemoved(old_type, old_type.fields[field_name])
    );
    //fields added
    let f_added = Sets.difference(Object.keys(this.fields), Object.keys(old_type.fields)).map(
        field_name => new Changes.FieldAdded(this, this.fields[field_name])
    );
    changes = [...i_removed, ...i_added, ...f_removed, ...f_added];
    //fields diff
    Sets.intersection(Object.keys(this.fields), Object.keys(old_type.fields)).forEach(field_name => {
        let old_field = old_type.fields[field_name];
        let new_field = this.fields[field_name];
        changes = [...changes, ...new_field.diff(old_field)];
    })
    return changes;
}

module.exports = ObjectType;