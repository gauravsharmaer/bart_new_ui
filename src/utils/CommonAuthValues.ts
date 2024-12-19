import { TinyFaceDetectorOptions } from "face-api.js";

import { NODE_API_URL } from "../config";

export const MAX_NO_FACE_FRAMES = 10;
// const MODEL_URL = "/models";

export const API_URL_FACE = `${NODE_API_URL}/login-with-face`;
export const BLINK_THRESHOLD = 0.3;
export const OPEN_EYE_THRESHOLD = 0.4;
export const HEAD_TURN_THRESHOLD = 0.02;
export const ANALYSIS_INTERVAL = 500;
export const ANALYSIS_OPTIONS = new TinyFaceDetectorOptions({ inputSize: 224 });
