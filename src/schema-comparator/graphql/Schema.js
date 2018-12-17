const Directive = require('./Directive')
const Changes = require('../changes.js')
const Sets = require('../sets.js')
const Interface = require('./Interface.js')
const Enum = require('./Enum.js')
const Union = require('./Union.js')
const ObjectType = require('./ObjectType.js')
const Scalar = require('./Scalar.js')
const InputObject = require('./InputObject.js')

function Schema(schema) {
    this.queryType = schema.queryType || {};
    this.mutationType = schema.mutationType || {};
    this.subscriptionType = schema.subscriptionType || {};
    this.types = {};
    if (!schema.types) schema.types = [];
    schema.types.forEach(type => {
        switch (type.kind) {
            case 'ENUM':
                this.types[type.name] = new Enum(type);
                break;
            case 'UNION':
                this.types[type.name] = new Union(type);
                break;
            case 'INPUT_OBJECT':
                this.types[type.name] = new InputObject(type);
                break;
            case 'OBJECT':
                this.types[type.name] = new ObjectType(type);
                break;
            case 'INTERFACE':
                this.types[type.name] = new Interface(type);
                break;
            case 'SCALAR':
                this.types[type.name] = new Scalar(type);
                break;
        }
    });
    this.directives = {};
    if (!schema.directives) schema.directives = [];
    schema.directives.forEach(directive => {
        this.directives[directive.name] = new Directive(directive);
    });
}

Schema.prototype.diff = function(old_schema) {
    let changes = [];
    changes = this.schemaChanged(old_schema);
    changes = [...changes, ...this.typesChanged(old_schema)];
    changes = [...changes, ...this.directivesChanged(old_schema)];
    return changes;
}

Schema.prototype.schemaChanged = function(old_schema) {
    let changes = [];
    if (this.queryType.name != old_schema.queryType.name) {
        changes.push(new Changes.SchemaQueryTypeChanged(old_schema.queryType, this.queryType));
    }
    if (this.mutationType.name != old_schema.mutationType.name) {
        changes.push(new Changes.SchemaMutationTypeChanged(old_schema.mutationType, this.mutationType));
    }
    if (this.subscriptionType.name != old_schema.subscriptionType.name) {
        changes.push(new Changes.SchemaSubscriptionTypeChanged(old_schema.subscriptionType, this.subscriptionType));
    }
    return changes;
}

Schema.prototype.typesChanged = function(old_schema) {
    let changes = [];
    //type removed
    let removed = Sets.difference(Object.keys(old_schema.types), Object.keys(this.types)).map(
        type_name => new Changes.TypeRemoved(old_schema.types[type_name])
    );
    //type added
    let added = Sets.difference(Object.keys(this.types), Object.keys(old_schema.types)).map(
        type_name => new Changes.TypeAdded(this.types[type_name])
    );
    changes = [...removed, ...added];
    //type changed
    Sets.intersection(Object.keys(this.types), Object.keys(old_schema.types)).forEach(type_name => {
        let old_type = old_schema.types[type_name];
        let new_type = this.types[type_name];
        changes = [...changes, ...this.typeDiff(old_type, new_type)];
    });
    return changes;
}

Schema.prototype.typeDiff = function(old_type, new_type) {
    let changes = [];
    if (old_type.kind != new_type.kind) {
        changes.push(new Changes.TypeKindChanged(old_type, new_type));
    } else {
        changes = [...changes, ...new_type.diff(old_type)];
    }

    if (old_type.description != new_type.description) {
        changes.push(new Changes.TypeDescriptionChanged(old_type, new_type));
    }
    return changes;
}

Schema.prototype.directivesChanged = function(old_schema) {
    let changes = [];
    //directive removed
    let removed = Sets.difference(Object.keys(old_schema.directives), Object.keys(this.directives)).map(
        directive_name => new Changes.DirectiveRemoved(old_schema.directives[directive_name])
    );
    //directive added
    let added = Sets.difference(Object.keys(this.directives), Object.keys(old_schema.directives)).map(
        directive_name => new Changes.DirectiveAdded(this.directives[directive_name])
    );
    changes = [...removed, ...added];
    //directive changed
    Sets.intersection(Object.keys(this.directives), Object.keys(old_schema.directives)).forEach(directive_name => {
        let old_directive = old_schema.directives[directive_name];
        let new_directive = this.directives[directive_name];
        changes = [...changes, ...new_directive.diff(old_directive)];
    });
    return changes;
}

module.exports = Schema;