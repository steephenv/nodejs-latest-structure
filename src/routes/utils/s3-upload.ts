import { RequestHandler } from 'express';
import { get as getConfig } from 'config';
import { generate as generateShortId } from 'shortid';
import * as AWS from 'aws-sdk';

import {
  RequestError,
  RequestErrorType,
} from '../../error-handler/RequestError';

const AWS_S3_BUCKET = getConfig('AWS_BUCKET_NAME');

AWS.config.update({
  accessKeyId: getConfig('AWS_ACCESS_KEY_ID'), // config
  secretAccessKey: getConfig('AWS_SECRET_ACCESS_KEY'), // config
});

AWS.config.region = getConfig('AWS_REGION'); // config
const s3 = new AWS.S3({
  signatureVersion: 'v4',
});

const makePutSignedUrl = (fileName: any, fileType: any) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: AWS_S3_BUCKET, // config
      // Expires: 3600,
      Key: fileName,
      ContentType: fileType,
    };
    return resolve(s3.getSignedUrl('putObject', params));
  });
};

export const makeGetSignedUrl = (fileName: any) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: AWS_S3_BUCKET, // config
      Expires: 100000,
      Key: fileName,
    };
    return resolve(s3.getSignedUrl('getObject', params));
  });
};

export const createSignedUrl: RequestHandler = async (req, res, next) => {
  try {
    const rand = generateShortId();
    const generatedName = `${rand}_${req.body.fileName}.${req.body.fileType}`;
    const signedUrl = await makePutSignedUrl(generatedName, req.body.fileType);
    const imgUrl = await makeGetSignedUrl(generatedName);
    return res
      .status(200)
      .send({ signed_url: signedUrl, fileName: generatedName, photo: imgUrl });
  } catch (err) {
    return next(new RequestError(RequestErrorType.INTERNAL_SERVER_ERROR));
  }
};

export const getUploadedImage: RequestHandler = async (req, res, next) => {
  try {
    // const rand = generateShortId();
    // const generatedName = `${rand}_${req.body.fileName}`;
    const imgUrl = await makeGetSignedUrl(req.query.fileName);
    return res.status(200).send({ image_url: imgUrl });
  } catch (err) {
    return next(new RequestError(RequestErrorType.INTERNAL_SERVER_ERROR));
  }
};

export const deleteUploadedFile: RequestHandler = async (req, res, next) => {
  try {
    const param: any = {
      Bucket: AWS_S3_BUCKET, // config
      Key: req.query.fileName,
    };
    await s3.deleteObject(param, () => {
      return;
    });
    return res.status(200).send({ success: true });
  } catch (err) {
    return next(new RequestError(RequestErrorType.INTERNAL_SERVER_ERROR));
  }
};
