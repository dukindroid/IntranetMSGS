var mongoose = require('mongoose');
var moment = require('moment');
moment.locale('es');

var roles = 'aplicante ejecutivo subgerente gerente todos'.split();

var msgSchema = mongoose.Schema ({
    text:   String,
    author: String,
    dest :  String,
    roleDest : String,
    created: Date,
    leido: Boolean
}/*,  { timestamps: { createdAt: 'created_at' }}*/);

var virtual = msgSchema.virtual('creado');
virtual.get(function(){
	return moment(this.created).format("dddd, MMMM Do YYYY, h:mm:ss a");
});

module.exports = mongoose.model('Message', msgSchema);
