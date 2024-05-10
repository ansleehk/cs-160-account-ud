import axios from 'axios';

class CaptchaError extends Error {
    constructor(message: string) {
        super(message);
    }
}


export default class CaptchaService{
    private secretKey: string;

    constructor(){
        this.secretKey = this.loadSecretKeyFromEnv();
    }

    private async sendVerifyRequest(
        clientToken: string,
        remoteIp: string
    ) {
        const GOOGLE_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify?";
        try {
            const response = await fetch(GOOGLE_VERIFY_URL
                + new URLSearchParams({
                    secret: this.secretKey,
                    response: clientToken,
                    remoteip: remoteIp
                }), {
                method: "POST"
            })

            return response.json();
        } catch (error) {
            console.error(error)
            throw new CaptchaError("Failed to get result response from Google");
        }
    }

    private getVerifyResult(resData: any): Promise<boolean>{
        const success = resData.success;
        
        if (!success){
            throw new CaptchaError("Failed to parse response from Google");
        }

        return success;
    }

    private loadSecretKeyFromEnv(){
        const SECRET_KEY_ENY_KEY = "CAPTCHA_SECRET_KEY";
        const secretKey = process.env[SECRET_KEY_ENY_KEY];

        if (!secretKey){
            throw new CaptchaError("Secret key not found in environment variables");
        }

        return secretKey;
    }

    public async verifyCaptcha(
        clientResponse: string,
        remoteIp: string
    ): Promise<boolean>{
        const resData = await this.sendVerifyRequest(clientResponse, remoteIp);
        const result = this.getVerifyResult(resData);

        return result;
    }
}
