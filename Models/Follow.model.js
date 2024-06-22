const {Schema, model} = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');

const FollowSchema = Schema({
    following_user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
      },
      followed_user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
      },
      created_at: {
        type: Date,
        default: Date.now
      }
});

FollowSchema.index({following_user: 1, followed_user: 1}, {unique: true});

FollowSchema.plugin(mongoosePagination);

module.exports = model('Follow', FollowSchema, 'follows')