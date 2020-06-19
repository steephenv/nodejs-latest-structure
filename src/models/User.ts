/* tslint:disable:variable-name */
import * as bcrypt from 'bcrypt';
import { model as mongooseModel, Schema } from 'mongoose';

export const description = 'Stores details of user info';

export const definitions = {
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String, enum: ['SUPER_ADMIN', 'GYM_ADMIN', 'USER'] },
  minMembers: { type: Boolean },
  bluetoothHRM: { type: Boolean },
  companyName: { type: String },
  address: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  zipcode: { type: Number },
  phone: { type: Number },
  updatedAt: { type: Date },
  createdAt: { type: Date },
  birthday: { type: String },
  gender: { type: String },
  weight: { type: String },
  heightFeet: { type: Number },
  heightInches: { type: Number },
  userName: { type: String },
  timeZone: { type: String },
  profilePicture: { type: String },
  locationId: { type: Schema.Types.ObjectId, ref: 'LOCATION' },
};

const userSchema: Schema = new Schema(definitions);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user: any = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongooseModel('User', userSchema);
