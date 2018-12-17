function Type(type) {
    this.type = type;
    this.kind = '';
    this.name = '';
    this.non_null = false;
    this.list = false;
    this.list_non_null = false;
    this.construct(type);
}

Type.prototype.toString = function() {
    if (this.type == null) return null;
    let str = `${this.name}(${this.kind})`;
    if (this.list_non_null) str = `${str}!`;
    if (this.list) str = `[${str}]`;
    if (this.non_null) str = `${str}!`;
    return str;
}

Type.prototype.construct = function(type) {
    if (type == null) return;
    if (type.ofType == null) {
        this.kind = type.kind;
        this.name = type.name;
    } else {
        type.kind == "NON_NULL" && (this.list ? this.list_non_null = true : this.non_null = true);
        type.kind == "LIST" && (this.list = true);
        this.construct(type.ofType);
    }
}

Type.prototype.different = function(other) {
    return this.kind !== other.kind ||
        this.name !== other.name ||
        this.non_null !== other.non_null ||
        this.list !== other.list ||
        this.list_non_null !== other.list_non_null;
}

Type.prototype.safeChangeForField = function(old_type) {
    if (this.kind === old_type.kind && this.name === old_type.name && this.list === old_type.list) {
        if (this.non_null === old_type.non_null) {
            return this.list_non_null;
        } else if (this.list_non_null === old_type.list_non_null) {
            return this.non_null;
        } else return this.list_non_null && this.non_null;
    } else return false;
}

Type.prototype.safeChangeForInputField = function(old_type) {
    if (this.kind === old_type.kind && this.name === old_type.name && this.list === old_type.list) {
        if (this.non_null === old_type.non_null) {
            return old_type.list_non_null;
        } else if (this.list_non_null === old_type.list_non_null) {
            return old_type.non_null;
        } else return old_type.list_non_null && old_type.non_null;
    } else return false;
}

module.exports = Type;