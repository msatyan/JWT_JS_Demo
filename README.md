# JWT by using pure JavaScript 
Copyright (c) 2016 Sathyanesh Krishnan. All rights reserved.

Licensed under the Apache License, Version 2.0;



## JWT demo by using pure JavaScript 
This demo module creates JWT (JSON Web Token) by using pure JavaScript library.  
The cryptographic library used is crypto-js 
[crypto-js](https://github.com/brix/crypto-js)


### The JSON Web Token (JWT) 

JSON Web Tokens consist of three parts (Header, Payload, Signature) separated by dots (.).
The JWT may looks like this in a glimpse   
**Header.Payload.Signature**  

The Header and Payload are Base64Url encoded JSON string separated by dots (.).

#### Header

```javascript
{ 
    "alg": "HS256", 
    "typ": "JWT" 
}
```

The header contains 2 parts:  

The type, which is JWT and then the hashing algorithm to used, such as HMAC SHA256 or RSA  
(in this example I have used HMAC SHA256)  
Here is an example of Header:


#### Payload

```javascript
{ 
    "iss": "Me.com",
    "sub": "Demo",
    "aud": "You",
    "exp": 1,
    "nbf": 2,
    "iat": 3,
    "jti": 4
}
```

The payload will carry the bulk of our JWT, also called the JWT Claims. This is where we will put the information that we want to transmit and other information about our token
The payload contains the bulk of the JWT; we may put any information that explains about this token, in general it is being called the JWT Claims
We may embed multiple claims in a JWT. Some claim names are reserved, though not mandatory.

##### Some of the reserved claims are:
* iss: The issuer of the token
* sub: The subject of the token
* aud: The audience of the token
* exp: Expiration in NumericDate value. 
* nbf: Defines the time before which the JWT MUST NOT be accepted for processing
* iat: The time the JWT was issued. Can be used to determine the age of the JWT
* jti: Unique identifier for the JWT. Can be used to prevent the JWT from being replayed. This is helpful for a one time use token.



#### Signature

The third part of our JWT is the signature.   
This signature is made up of a hash of the following components:

* the header
* the payload
* secret

```javascript
HMACSHA256( 
    base64UrlEncode(Header) + "." +  base64UrlEncode(Payload),
    secret)
```




