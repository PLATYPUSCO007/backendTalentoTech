const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

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

UserSchema.pre('save', async function(next){
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(user.password, salt);
    user.password = hashedPass;
    next();
  } catch (error) {
    next(error);
  }
})

module.exports = model('User', UserSchema, "users")