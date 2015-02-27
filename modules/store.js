var Proto = require('uberproto');
var _ = require('lodash');

var store = Proto.extend({
    init: function(io, opt) {
        if (!this.type) this.type = opt ? opt.type : 'memory';
        this.set(io);
        return this;
    },
    set: function(io, opt) {
        if (io) this.io = io;
        switch (this.type) {
            case "memory":
                this.memory();
                break;
        }
        return this;
    },
    memory: function() {
        if (!this.data) this.data = {};
        this.type = 'memory';
        return this;
    },
    save: function() {
        switch (this.type) {
            case 'memory':
                if (!this.data[this.io.name]) {
                    this.data[this.io.name] = this.io.read();
                    delete this.io.data;
                }
                break;
            default:
                break;
        }
        return this.data;
    }
});


module.exports = function(io) {
    return store.create(io);
}
