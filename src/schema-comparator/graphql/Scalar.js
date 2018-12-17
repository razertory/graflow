function Scalar({ kind, name, description }) {
    this.kind = kind;
    this.name = name;
    this.description = description;
}

Scalar.prototype.diff = function() {
    return [];
}

module.exports = Scalar;