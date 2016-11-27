'use strict';

class JWT_JS_Demo 
{
    constructor() 
    {
        /*
        this.Header = { "alg": "HS256", "typ": "JWT" };
		this.Payload = 
        { 
            "iss": "Me.com",
            "sub": "Demo",
            "aud": "You",
            "exp": "t1",
            "nbf": "t2",
            "iat": "t3",
            "jti": "t4"
        };    
        */
    }

    getBase64Encoded(rawStr) 
    {
        var wordArray = CryptoJS.enc.Utf8.parse(rawStr);
        var base64 = CryptoJS.enc.Base64.stringify(wordArray);
        return base64;
    }

    getBase64Decoded(encodedStr) 
    {
        var parsedWordArray = CryptoJS.enc.Base64.parse(encodedStr);
        var parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
        return parsedStr;
    }

    CreateJWT(Header, Payload, Secret) 
    {
        var base64Header = this.getBase64Encoded(Header);
        var base64Payload = this.getBase64Encoded(Payload);

        var signature = CryptoJS.HmacSHA256(base64Header + "." + base64Payload, Secret);
        var base64Sign = CryptoJS.enc.Base64.stringify(signature);

        let jwt = base64Header + "." + base64Payload + "." + base64Sign;
        return (jwt);
    }

    onCreateJWTButtonClick() 
    {
        let Header = document.getElementById('HeaderText').innerText;
        let Payload = document.getElementById('PayloadText').value;
        let Secret = document.getElementById('SecretText').value;

        let jwt = this.CreateJWT( Header.trim(), Payload.trim(), Secret );
        document.getElementById('JWT').innerHTML = jwt;
    }
}

const DemoObj = new JWT_JS_Demo();


