import { RequestHandler } from 'express';

import {
  RequestError,
  RequestErrorType,
} from '../../error-handler/RequestError';

import { User } from '../../models/User';

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const existingUser = await User.countDocuments({
      email: req.body.email,
    }).exec();
    if (existingUser) {
      return res.status(400).send({ message: 'User already registered' });
    }
    const newUser = new User(req.body);
    const result: any = await newUser.save();
    result.password = '';
    return res.status(200).send({
      success: true,
      result,
    });
  } catch (err) {
    return next(new RequestError(RequestErrorType.BAD_REQUEST, err));
  }
};
