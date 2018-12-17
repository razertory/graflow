const Criticality = require('./criticality')

module.exports = {
    TypeRemoved: function(removed_type) {
        this.removed_type = removed_type;
        this.criticality = Criticality.breaking("Removing a type is a breaking change. " +
            "It is preferable to deprecate and remove all references to this type first.");
        this.message = `Type ${removed_type.name} was removed`;
        this.path = removed_type.name;
    },

    DirectiveRemoved: function(directive) {
        this.directive = directive;
        this.criticality = Criticality.breaking();
        this.message = `Directive ${directive.name} was removed`;
        this.path = `@${directive.name}`;
    },

    TypeKindChanged: function(old_type, new_type) {
        this.old_type = old_type;
        this.new_type = new_type;
        this.criticality = Criticality.breaking("Changing the kind of a type is a breaking change " +
            "because it can cause existing queries to error. For example, turning an object type to a scalar type " +
            "would break queries that define a selection set for this type.");
        this.message = `Type ${old_type.name} kind changed from ${old_type.kind} to ${new_type.kind}`;
        this.path = old_type.name;
    },

    EnumValueRemoved: function(enum_type, enum_value) {
        this.enum_value = enum_value;
        this.enum_type = enum_type;
        this.criticality = Criticality.breaking("Removing an enum value will cause existing queries that use this enum value to error.");
        this.message = `Enum value ${enum_value.name} was removed from enum ${enum_type.name}`;
        this.path = [enum_type.name, enum_value.name].join('.');
    },

    UnionMemberRemoved: function(union_type, union_member) {
        this.union_type = union_type;
        this.union_member = union_member;
        this.criticality = Criticality.breaking("Removing a union member from a union can cause existing queries " +
            "that use this union member in a fragment spread to error.");
        this.message = `Union member ${union_member.name} was removed from Union type ${union_type.name}`;
        this.path = union_type.name;
    },

    InputFieldRemoved: function(input_object_type, field) {
        this.input_object_type = input_object_type;
        this.field = field;
        this.criticality = Criticality.breaking("Removing an input field will cause existing queries that use this input field to error.");
        this.message = `Input field ${field.name} was removed from input object type ${input_object_type.name}`;
        this.path = [input_object_type.name, field.name].join('.');
    },

    FieldArgumentRemoved: function(object_type_name, field, argument) {
        this.object_type_name = object_type_name;
        this.field = field;
        this.argument = argument;
        this.criticality = Criticality.breaking("Removing a field argument is a breaking change " +
            "because it will cause existing queries that use this argument to error.");
        this.message = `Argument ${argument.name}: ${argument.type} was removed from field ${object_type_name}.${field.name}`;
        this.path = [object_type_name, field.name, argument.name].join('.');
    },

    DirectiveArgumentRemoved: function(directive, argument) {
        this.directive = directive;
        this.argument = argument;
        this.criticality = Criticality.breaking();
        this.message = `Argument ${argument.name} was removed from directive ${directive.name}`;
        this.path = [`@${directive.name}`, argument.name].join('.');
    },

    SchemaQueryTypeChanged: function(old_query, new_query) {
        this.old_query = old_query;
        this.new_query = new_query;
        this.criticality = Criticality.breaking();
        this.message = `Schema query root has changed from ${old_query.name} to ${new_query.name}`;
        this.path = '';
    },

    FieldRemoved: function(object_type, field) {
        this.object_type = object_type;
        this.field = field;
        this.criticality = field.deprecationReason ?
            Criticality.breaking("Removing a deprecated field is a breaking change. Before removing it, " +
                "you may want to look at the field's usage to see the impact of removing the field.") :
            Criticality.breaking("Removing a field is a breaking change. " +
                "It is preferable to deprecate the field before removing it.");
        this.message = `Field ${field.name} was removed from object type ${object_type.name}`;
        this.path = [object_type.name, field.name].join('.');
    },

    DirectiveLocationRemoved: function(directive, location) {
        this.directive = directive;
        this.location = location;
        this.criticality = Criticality.breaking();
        this.message = `Location ${location} was removed from directive ${directive.name}`;
        this.path = `@${directive.name}`;
    },
    //interface => interface_
    ObjectTypeInterfaceRemoved: function(interface_, object_type) {
        this.interface_ = interface_;
        this.object_type = object_type;
        this.criticality = Criticality.breaking("Removing an interface from an object type can cause existing queries " +
            "that use this in a fragment spread to error.");
        this.message = `${object_type.name} object type no longer implements ${interface_.name} interface`;
        this.path = object_type.name;
    },

    FieldTypeChanged: function(type_name, old_field, new_field) {
        this.type_name = type_name;
        this.old_field = old_field;
        this.new_field = new_field;
        this.criticality = new_field.type.safeChangeForField(old_field.type) ?
            Criticality.non_breaking() : Criticality.breaking();
        this.message = `Field ${type_name}.${old_field.name} changed type from ${old_field.type} to ${new_field.type}`;
        this.path = [type_name, old_field.name].join('.');
    },

    InputFieldTypeChanged: function(input_type_name, old_input_field, new_input_field) {
        this.input_type_name = input_type_name;
        this.old_input_field = old_input_field;
        this.new_input_field = new_input_field;
        this.criticality = new_input_field.type.safeChangeForInputField(old_input_field.type) ?
            Criticality.non_breaking("Changing an input field from non-null to null is considered non-breaking") :
            Criticality.breaking("Changing the type of an input field can cause existing queries that use this field to error.");
        this.message = `Input field ${input_type_name}.${old_input_field.name} changed type ` +
            `from ${old_input_field.type} to ${new_input_field.type}`;
        this.path = [input_type_name, old_input_field.name].join('.');
    },

    FieldArgumentTypeChanged: function(type_name, field_name, old_argument, new_argument) {
        this.type_name = type_name;
        this.field_name = field_name;
        this.old_argument = old_argument;
        this.new_argument = new_argument;
        this.criticality = new_argument.type.safeChangeForInputField(old_argument.type) ?
            Criticality.non_breaking("Changing an input field from non-null to null is considered non-breaking") :
            Criticality.breaking("Changing the type of a field's argument can cause existing queries that use this argument to error.");
        this.message = `Type for argument ${new_argument.name} on field ${type_name}.${field_name} changed ` +
            `from ${old_argument.type} to ${new_argument.type}`;
        this.path = [type_name, field_name, old_argument.name].join('.')
    },

    DirectiveArgumentTypeChanged: function(directive, old_argument, new_argument) {
        this.directive = directive;
        this.old_argument = old_argument;
        this.new_argument = new_argument;
        this.criticality = new_argument.type.safeChangeForInputField(old_argument.type) ?
            Criticality.non_breaking("Changing an input field from non-null to null is considered non-breaking") :
            Criticality.breaking();
        this.message = `Type for argument ${new_argument.name} on directive ${directive.name} changed ` +
            `from ${old_argument.type} to ${new_argument.type}`;
        this.path = [`@${directive.name}`, old_argument.name].join('.');
    },

    SchemaMutationTypeChanged: function(old_mutation, new_mutation) {
        this.old_mutation = old_mutation;
        this.new_mutation = new_mutation;
        this.criticality = Criticality.breaking();
        this.message = `Schema mutation root has changed from ${old_mutation.name} to ${new_mutation.name}`;
        this.path = '';
    },

    SchemaSubscriptionTypeChanged: function(old_subscription, new_subscription) {
        this.old_subscription = old_subscription;
        this.new_subscription = new_subscription;
        this.criticality = Criticality.breaking();
        this.message = `Schema subscription type has changed from ${old_subscription.name} to ${new_subscription.name}`;
        this.path = '';
    },

    FieldArgumentDefaultChanged: function(type_name, field_name, old_argument, new_argument) {
        this.type_name = type_name;
        this.field_name = field_name;
        this.old_argument = old_argument;
        this.new_argument = new_argument;
        this.criticality = Criticality.dangerous("Changing the default value for an argument may change the runtime " +
            "behaviour of a field if it was never provided.");
        this.message = old_argument.defaultValue === null ?
            `Default value ${new_argument.defaultValue} was added to argument ${new_argument.name} on field ${type_name}.${field_name}` :
            `Default value for argument ${new_argument.name} on field ${type_name}.${field_name} changed` +
            ` from ${old_argument.defaultValue} to ${new_argument.defaultValue}`;
        this.path = [type_name, field_name, old_argument.name].join('.');
    },

    InputFieldDefaultChanged: function(input_type_name, old_field, new_field) {
        this.criticality = Criticality.dangerous("Changing the default value for an argument may change the runtime " +
            "behaviour of a field if it was never provided.");
        this.input_type_name = input_type_name;
        this.old_field = old_field;
        this.new_field = new_field;
        this.message = `Input field ${input_type_name}.${old_field.name} default changed` +
            ` from ${old_field.defaultValue} to ${new_field.defaultValue}`;
        this.path = [input_type_name, old_field.name].join(".");
    },

    DirectiveArgumentDefaultChanged: function(directive_name, old_argument, new_argument) {
        this.criticality = Criticality.dangerous("Changing the default value for an argument may change the runtime " +
            "behaviour of a field if it was never provided.");
        this.directive_name = directive_name;
        this.old_argument = old_argument;
        this.new_argument = new_argument;
        this.message = `Default value for argument ${new_argument.name} on directive ${directive_name} changed` +
            ` from ${old_argument.defaultValue} to ${new_argument.defaultValue}`;
        this.path = [`@${directive_name}`, new_argument.name].join(".");
    },

    EnumValueAdded: function(enum_type, enum_value) {
        this.num_type = enum_type;
        this.enum_value = enum_value;
        this.criticality = Criticality.dangerous("Adding an enum value may break existing clients that were not " +
            "programming defensively against an added case when querying an enum.");
        this.message = `Enum value ${enum_value.name} was added to enum ${enum_type.name}`;
        this.path = [enum_type.name, enum_value.name].join(".");
    },

    UnionMemberAdded: function(union_type, union_member) {
        this.union_member = union_member;
        this.union_type = union_type;
        this.criticality = Criticality.dangerous("Adding a possible type to Unions may break existing clients " +
            "that were not programming defensively against a new possible type.");
        this.message = `Union member ${union_member.name} was added to Union type ${union_type.name}`;
        this.path = union_type.name;
    },
    //interface => interface_
    ObjectTypeInterfaceAdded: function(interface_, object_type) {
        this.criticality = Criticality.dangerous("Adding an interface to an object type may break existing clients " +
            "that were not programming defensively against a new possible type.");
        this.interface_ = interface_;
        this.object_type = object_type;
        this.message = `${object_type.name} object implements ${interface_.name} interface`;
        this.path = object_type.name;
    },

    InputFieldAdded: function(input_object_type, field) {
        this.criticality = field.type.non_null ?
            Criticality.breaking("Adding a non-null field to an existing input type will cause existing queries " +
                "that use this input type to error because they will not provide a value for this new field.") :
            Criticality.non_breaking();
        this.input_object_type = input_object_type;
        this.field = field;
        this.message = `Input field ${field.name} was added to input object type ${input_object_type.name}`;
        this.path = [input_object_type.name, field.name].join(".");
    },

    FieldArgumentAdded: function(type_name, field, argument) {
        this.criticality = argument.type.non_null ?
            Criticality.breaking("Adding a required argument to an existing field is a breaking change " +
                "because it will cause existing uses of this field to error.") :
            Criticality.non_breaking();
        this.type_name = type_name;
        this.field = field;
        this.argument = argument;
        this.message = `Argument ${argument.name}: ${argument.type} added to field ${type_name}.${field.name}`;
        this.path = [type_name, field.name, argument.name].join(".");
    },

    TypeAdded: function(type) {
        this.type = type;
        this.criticality = Criticality.non_breaking();
        this.message = `Type ${type.name} was added`;
        this.path = type.name;
    },

    DirectiveAdded: function(directive) {
        this.directive = directive;
        this.criticality = Criticality.non_breaking();
        this.message = `Directive ${directive.name} was added`;
        this.path = `@${directive.name}`;
    },

    TypeDescriptionChanged: function(old_type, new_type) {
        this.old_type = old_type;
        this.new_type = new_type;
        this.criticality = Criticality.non_breaking();
        this.message = `Description \"${old_type.description}\" on type ${old_type.name} has changed to \"${new_type.description}\"`;
        this.path = old_type.name;
    },
    //enum => enum_type
    EnumValueDescriptionChanged: function(enum_type, old_enum_value, new_enum_value) {
        this.enum_type = enum_type;
        this.old_enum_value = old_enum_value;
        this.new_enum_value = new_enum_value;
        this.criticality = Criticality.non_breaking();
        this.message = `Description for enum value ${enum_type.name}.${new_enum_value.name} changed from ` +
            `\"${old_enum_value.description}\" to \"${new_enum_value.description}\"`;
        this.path = [enum_type.name, old_enum_value.name].join(".");
    },
    //enum => enum_type
    EnumValueDeprecated: function(enum_type, old_enum_value, new_enum_value) {
        this.criticality = Criticality.non_breaking();
        this.enum_type = enum_type;
        this.old_enum_value = old_enum_value;
        this.new_enum_value = new_enum_value;
        this.message = old_enum_value.deprecationReason ?
            `Enum value ${enum_type.name}.${new_enum_value.name} deprecation reason changed ` +
            `from \"${old_enum_value.deprecationReason}\" to \"${new_enum_value.deprecationReason}\"` :
            `Enum value ${enum_type.name}.${new_enum_value.name} was deprecated with reason \"${new_enum_value.deprecationReason}\"`;
        this.path = [enum_type.name, old_enum_value.name].join(".");
    },

    InputFieldDescriptionChanged: function(input_type_name, old_field, new_field) {
        this.criticality = Criticality.non_breaking();
        this.input_type_name = input_type_name;
        this.old_field = old_field;
        this.new_field = new_field;
        this.message = `Input field ${input_type_name}.${old_field.name} description changed` +
            ` from \"${old_field.description}\" to \"${new_field.description}\"`;
        this.path = [input_type_name, old_field.name].join(".");
    },

    DirectiveDescriptionChanged: function(old_directive, new_directive) {
        this.criticality = Criticality.non_breaking();
        this.old_directive = old_directive;
        this.new_directive = new_directive;
        this.message = `Directive ${new_directive.name} description changed` +
            ` from \"${old_directive.description}\" to \"${new_directive.description}\"`;
        this.path = `@${old_directive.name}`;
    },

    FieldDescriptionChanged: function(type_name, old_field, new_field) {
        this.criticality = Criticality.non_breaking();
        this.type_name = type_name;
        this.old_field = old_field;
        this.new_field = new_field;
        this.message = `Field ${type_name}.${old_field.name} description changed` +
            ` from \"${old_field.description}\" to \"${new_field.description}\"`;
        this.path = [type_name, old_field.name].join(".");
    },

    FieldArgumentDescriptionChanged: function(type_name, field_name, old_argument, new_argument) {
        this.criticality = Criticality.non_breaking();
        this.type_name = type_name;
        this.field_name = field_name;
        this.old_argument = old_argument;
        this.new_argument = new_argument;
        this.message = `Description for argument ${new_argument.name} on field ${type_name}.${field_name} changed` +
            ` from \"${old_argument.description}\" to \"${new_argument.description}\"`;
        this.path = [type_name, field_name, old_argument.name].join(".");
    },

    DirectiveArgumentDescriptionChanged: function(directive_name, old_argument, new_argument) {
        this.criticality = Criticality.non_breaking();
        this.directive_name = directive_name;
        this.old_argument = old_argument;
        this.new_argument = new_argument;
        this.message = `Description for argument ${new_argument.name} on directive ${directive_name} changed` +
            ` from \"${old_argument.description}\" to \"${new_argument.description}\"`;
        this.path = [`@${directive_name}`, old_argument.name].join(".");
    },

    FieldDeprecationChanged: function(type_name, old_field, new_field) {
        this.criticality = Criticality.non_breaking();
        this.type_name = type_name;
        this.old_field = old_field;
        this.new_field = new_field;
        this.message = `Deprecation reason on field ${type_name}.${new_field.name} has changed ` +
            `from \"${old_field.deprecationReason}\" to \"${new_field.deprecationReason}\"`;
        this.path = [type_name, old_field.name].join(".");
    },

    FieldAdded: function(object_type, field) {
        this.criticality = Criticality.non_breaking();
        this.object_type = object_type;
        this.field = field;
        this.message = `Field ${field.name} was added to object type ${object_type.name}`;
        this.path = [object_type.name, field.name].join(".");
    },

    DirectiveLocationAdded: function(directive, location) {
        this.criticality = Criticality.non_breaking();
        this.directive = directive;
        this.location = location;
        this.message = `Location ${location} was added to directive ${directive.name}`;
        this.path = `@${directive.name}`;
    },

    /* TODO */
    FieldAstDirectiveAdded: function() {},
    FieldAstDirectiveRemoved: function() {},
    EnumValueAstDirectiveAdded: function() {},
    EnumValueAstDirectiveRemoved: function() {},
    InputFieldAstDirectiveAdded: function() {},
    InputFieldAstDirectiveRemoved: function() {},
    DirectiveArgumentAstDirectiveAdded: function() {},
    DirectiveArgumentAstDirectiveRemoved: function() {},
    FieldArgumentAstDirectiveAdded: function() {},
    FieldArgumentAstDirectiveRemoved: function() {},
    ObjectTypeAstDirectiveAdded: function() {},
    ObjectTypeAstDirectiveRemoved: function() {},
    InterfaceTypeAstDirectiveAdded: function() {},
    InterfaceTypeAstDirectiveRemoved: function() {},
    UnionTypeAstDirectiveAdded: function() {},
    UnionTypeAstDirectiveRemoved: function() {},
    EnumTypeAstDirectiveAdded: function() {},
    EnumTypeAstDirectiveRemoved: function() {},
    ScalarTypeAstDirectiveAdded: function() {},
    ScalarTypeAstDirectiveRemoved: function() {},
    InputObjectTypeAstDirectiveAdded: function() {},
    InputObjectTypeAstDirectiveRemoved: function() {},
    SchemaAstDirectiveAdded: function() {},
    SchemaAstDirectiveRemoved: function() {},

    DirectiveArgumentAdded: function(directive, argument) {
        this.criticality = argument.type.non_null ? Criticality.breaking() : Criticality.non_breaking();
        this.directive = directive;
        this.argument = argument;
        this.message = `Argument ${argument.name} was added to directive ${directive.name}`;
        this.path = [`@${directive.name}`, argument.name].join('.');
    }
}