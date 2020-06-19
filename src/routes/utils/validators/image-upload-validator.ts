import * as Joi from 'joi';
import { RequestHandler } from 'express';

// tslint:disable:variable-name
const imageUploadSchema = Joi.object().keys({
  fileName: Joi.string().required(),
  fileType: Joi.string().required(),
});

export const imageUploadRule: RequestHandler = (req, res, next) => {
  Joi.validate(req.body, imageUploadSchema, err => {
    if (err) {
      return res.status(422).send({
        success: false,
        msg: err,
      });
    }
    next();
  });
};
