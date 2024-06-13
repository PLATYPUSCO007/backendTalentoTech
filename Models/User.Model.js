const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
      },
      last_name: {
        type: String,
        required: true
      },
      nick: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      role: {
        type: String,
        default: "role_user"
      },
      image: {
        type: String,
        default: "default.png"
      },
      created_at: {
        type: Date,
        default: Date.now
      }
});

module.exports = model('User', UserSchema, "users")