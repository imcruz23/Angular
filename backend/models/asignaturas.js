const { Schema, model, Collection } = require('mongoose');

const AsignaturaSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    nombrecorto: {
        type: String,
        require: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        require: true
    },
    profesores: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }]
}, { collection: 'asignaturas' });

AsignaturaSchema.method('toJSON', function() {
    const { _id, __v, ...object } = this.toObject();
    object.uid = _id;
    return object;

});

module.exports = model('Asignatura', AsignaturaSchema);