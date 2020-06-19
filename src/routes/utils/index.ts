import * as express from 'express';

import { imageUploadRule } from './validators/image-upload-validator';
import { getImageRule } from './validators/get-image-rule';

import { getUploadedImage } from './s3-upload';
import { createSignedUrl } from './s3-upload';
import { deleteUploadedFile } from './s3-upload';
export const utils = express.Router();

utils.post('/image-upload', imageUploadRule, createSignedUrl);
utils.get('/get-image-url', getImageRule, getUploadedImage);
utils.post('/delete-media', deleteUploadedFile);
