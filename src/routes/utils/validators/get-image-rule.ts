import * as Joi from 'joi';
import { RequestHandler } from 'express';

// tslint:disable:variable-name
const getImageSchema = Joi.object().keys({
  fileName: Joi.string().required(),
});

export const getImageRule: RequestHandler = (req, res, next) => {
  Joi.validate(req.query, getImageSchema, err => {
    if (err) {
      return res.status(422).send({
        success: false,
        msg: err,
      });
    }
    next();
  });
};
