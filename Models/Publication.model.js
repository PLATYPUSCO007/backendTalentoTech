const {Schema, model} = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');

const PublicationSchema = Schema({
    user_id: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    file: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

PublicationSchema.plugin(mongoosePagination);
module.exports = model('Publication', PublicationSchema, 'publications');