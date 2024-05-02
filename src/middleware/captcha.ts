import { NextFunction, Request, Response } from "express";
import CaptchaService from "../service/captcha.js";
import { RestError } from "../type/restError.js";

class CaptchaError extends RestError {
    public statusCode: number;
    public publicMessage: string;

    constructor(publicMessage: string){
        super(publicMessage);
        this.statusCode = 400;
        this.publicMessage = publicMessage;
    }
}

const captchaVerify = async(req: Request, res: Response, next: NextFunction) => {
    const captcha = req.body.captcha;

    if (captcha === undefined || captcha === null || captcha === '') {
        next(new CaptchaError('Captcha is required'));
    }

    const captchaService = new CaptchaService();
    const isCaptchaValid = await captchaService.verifyCaptcha(captcha, req.ip!);

    if (isCaptchaValid) {
        next();
    } else {
        next(new CaptchaError('Captcha is invalid'));
    }
}

export default captchaVerify;