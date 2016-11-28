'use strict';

class CStrLib
{
    constructor()
    {
        this.encodingChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        this.btoaSupport = (typeof btoa !== "undefined");
    }

    EncodeUtf8(s)
    {
        // The encodeURIComponent() function encodes a 
        // Uniform Resource Identifier (URI) component by 
        // replacing each instance of certain characters by 
        // one, two, three, or four escape sequences representing 
        // the UTF-8 encoding of the character.

        // FYI:
        // To avoid unexpected requests to the server, you should call 
        // encodeURIComponent on any user-entered parameters 
        // that will be passed as part of a URI. 
        // For example, a user could type "Thyme &time=again" for a variable comment. 
        // Not using encodeURIComponent on this variable will give 
        // comment=Thyme%20&time=again. 
        // Note that the ampersand and the equal sign mark a new key and value pair. 
        // So instead of having a POST comment key equal to "Thyme &time=again", 
        // you have two POST keys, 
        // one equal to "Thyme " and another (time) equal to again

        // FYI:
        // A URI is composed of a sequence of components separated by component separators. 
        // The general form is:
        //  Scheme : First / Second ; Third ? Fourth
        // where the names (Scheme, First, Second, Third, Fourth) represent components 
        // and “:”, “/”, “;” and “?” are reserved characters used as separators. 
        // The encodeURI and decodeURI functions are intended to work with complete URIs; 
        // they assume that any reserved characters in the URI are intended to have 
        // special meaning and so are not encoded. 
        // The encodeURIComponent and decodeURIComponent functions are intended to 
        // work with the individual component parts of a URI; 
        // they assume that any reserved characters represent text and so must be 
        // encoded so that they are not interpreted as reserved characters when 
        // the component is part of a complete URI.

        // The unescape() function was deprecated in JavaScript version 1.5. 
        // Use decodeURI() or decodeURIComponent() instead.
        //return unescape( encodeURIComponent(s) );

        return decodeURI(encodeURIComponent(s));

        // The decodeURIComponent() function decodes a URI component.
        // Tip: Use the encodeURIComponent() function to encode a URI component.

        // TEST this
        // http://dailyjs.com/2012/12/31/js101-strings/
        // http://monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
        //http://www.fileformat.info/info/unicode/char/227/index.htm
        // btoa(EncodeUtf8('\u0227'));
        // Exp: "yKc="
    }

    DecodeUtf8(s)
    {
        // The decodeURIComponent function computes a new version of a URI in which 
        // each escape sequence and UTF-8 encoding of the sort that might be 
        // introduced by the encodeURIComponent function is replaced with the 
        // character that it represents.
        return decodeURIComponent(escape(s));
    }

    // Converts Arrays, ArrayBuffers, TypedArrays, and Strings to
    // to either a Uint8Array or a regular Array depending on browser support.
    // You should use this when passing byte data in or out of crypto functions
    toSupportedArray(data)
    {
        // does this browser support Typed Arrays?
        var typedArraySupport = (typeof Uint8Array !== "undefined");

        // get the data type of the parameter
        var dataType = Object.prototype.toString.call(data);
        dataType = dataType.substring(8, dataType.length - 1);

        // determine the type
        switch (dataType)
        {

            // Regular JavaScript Array. Convert to Uint8Array if supported
            // else do nothing and return the array
            case "Array":
                return typedArraySupport ? new Uint8Array(data) : data;

            // ArrayBuffer. IE11 Web Crypto API returns ArrayBuffers that you have to convert
            // to Typed Arrays. Convert to a Uint8Arrays and return;
            case "ArrayBuffer":
                return new Uint8Array(data);

            // Already Uint8Array. Obviously there is support.
            case "Uint8Array":
                return data;

            case "Uint16Array":
            case "Uint32Array":
                return new Uint8Array(data);

            // String. Convert the string to a byte array using Typed Arrays if
            // supported.
            case "String":
                var newArray = typedArraySupport ? new Uint8Array(data.length) : new Array(data.length);
                for (var i = 0; i < data.length; i += 1)
                {
                    newArray[i] = data.charCodeAt(i);
                }
                return newArray;

            // Some other type. Just return the data unchanged.
            default:
                throw new Error("toSupportedArray : unsupported data type " + dataType);
        }

    }

    // Converts an Array or TypedArray to a hex string
    bytesToHexString(bytes)
    {
        var result = "";
        for (var i = 0; i < bytes.length; i++)
        {
            if (i % 4 === 0 && i !== 0) result += "-";
            var hexval = bytes[i].toString(16).toUpperCase();
            result += hexval.length === 2 ? hexval : "0" + hexval;
        }
        return result;
    }

    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    toBase64(data, base64Url=false)
    {
        /// <signature>
        ///     <summary>Converts byte data to Base64 string</summary>
        ///     <param name="data" type="Array">An array of bytes values (numbers from 0-255)</param>
        ///     <param name="base64Url" type="Boolean" optional="true">Converts to a Base64Url string if True (default = false)</param>
        ///     <returns type="String" />
        /// </signature>
        /// <signature>
        ///     <summary>Converts byte data to Base64 string</summary>
        ///     <param name="data" type="UInt8Array">A UInt8Array</param>
        ///     <param name="base64Url" type="Boolean" optional="true">Converts to a Base64Url string if True (default = false)</param>
        ///     <returns type="String" />
        /// </signature>
        /// <signature>
        ///     <summary>Converts text to Base64 string</summary>
        ///     <param name="data" type="String">Text string</param>
        ///     <param name="base64Url" type="Boolean" optional="true">Converts to a Base64Url string if True (default = false)</param>
        ///     <returns type="String" />
        /// </signature>

        var output = "";

        if (!base64Url)
        {
            base64Url = false;
        }

        // If the input is an array type, convert it to a string.
        // The built-in btoa takes strings.
        if (data.pop || data.subarray)
        {
            data = String.fromCharCode.apply(null, data);
        }

        if (this.btoaSupport)
        {
            output = btoa(data);
        } else
        {

            var char1, char2, char3, enc1, enc2, enc3, enc4;
            var i;

            for (i = 0; i < data.length; i += 3)
            {

                // Get the next three chars.
                char1 = data.charCodeAt(i);
                char2 = data.charCodeAt(i + 1);
                char3 = data.charCodeAt(i + 2);

                // Encode three bytes over four 6-bit values.
                // [A7,A6,A5,A4,A3,A2,A1,A0][B7,B6,B5,B4,B3,B2,B1,B0][C7,C6,C5,C4,C3,C2,C1,C0].
                // [A7,A6,A5,A4,A3,A2][A1,A0,B7,B6,B5,B4][B3,B2,B1,B0,C7,C6][C5,C4,C3,C2,C1,C0].

                // 'enc1' = high 6-bits from char1
                enc1 = char1 >> 2;
                // 'enc2' = 2 low-bits of char1 + 4 high-bits of char2
                enc2 = ((char1 & 0x3) << 4) | (char2 >> 4);
                // 'enc3' = 4 low-bits of char2 + 2 high-bits of char3
                enc3 = ((char2 & 0xF) << 2) | (char3 >> 6);
                // 'enc4' = 6 low-bits of char3
                enc4 = char3 & 0x3F;

                // 'char2' could be 'nothing' if there is only one char left to encode
                //   if so, set enc3 & enc4 to 64 as padding.
                if (isNaN(char2))
                {
                    enc3 = enc4 = 64;

                    // If there was only two chars to encode char3 will be 'nothing'
                    //   set enc4 to 64 as padding.
                } else if (isNaN(char3))
                {
                    enc4 = 64;
                }

                // Lookup the base-64 value for each encoding.
                output = output +
                    this.encodingChars.charAt(enc1) +
                    this.encodingChars.charAt(enc2) +
                    this.encodingChars.charAt(enc3) +
                    this.encodingChars.charAt(enc4);
            }
        }

        if (base64Url)
        {
            return output.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
        }

        return output;
    }

    base64ToString(encodedString)
    {
        /// <signature>
        ///     <summary>Converts a Base64/Base64Url string to a text</summary>
        ///     <param name="encodedString" type="String">A Base64/Base64Url encoded string</param>
        ///     <returns type="String" />
        /// </signature>

        if (this.btoaSupport)
        {

            // This could be encoded as base64url (different from base64)
            encodedString = encodedString.replace(/-/g, "+").replace(/_/g, "/");

            // In case the padding is missing, add some.
            while (encodedString.length % 4 !== 0)
            {
                encodedString += "=";
            }

            return atob(encodedString);
        }

        return String.fromCharCode.apply(null, base64ToBytes(encodedString));

    }

    base64ToBytes(encodedString)
    {
        /// <signature>
        ///     <summary>Converts a Base64/Base64Url string to an Array</summary>
        ///     <param name="encodedString" type="String">A Base64/Base64Url encoded string</param>
        ///     <returns type="Array" />
        /// </signature>

        // This could be encoded as base64url (different from base64)
        encodedString = encodedString.replace(/-/g, "+").replace(/_/g, "/");

        // In case the padding is missing, add some.
        while (encodedString.length % 4 !== 0)
        {
            encodedString += "=";
        }

        var output = [];
        var char1, char2, char3;
        var enc1, enc2, enc3, enc4;
        var i;

        // Remove any chars not in the base-64 space.
        encodedString = encodedString.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i = 0; i < encodedString.length; i += 4)
        {

            // Get 4 characters from the encoded string.
            enc1 = this.encodingChars.indexOf(encodedString.charAt(i));
            enc2 = this.encodingChars.indexOf(encodedString.charAt(i + 1));
            enc3 = this.encodingChars.indexOf(encodedString.charAt(i + 2));
            enc4 = this.encodingChars.indexOf(encodedString.charAt(i + 3));

            // Convert four 6-bit values to three characters.
            // [A7,A6,A5,A4,A3,A2][A1,A0,B7,B6,B5,B4][B3,B2,B1,B0,C7,C6][C5,C4,C3,C2,C1,C0].
            // [A7,A6,A5,A4,A3,A2,A1,A0][B7,B6,B5,B4,B3,B2,B1,B0][C7,C6,C5,C4,C3,C2,C1,C0].

            // 'char1' = all 6 bits of enc1 + 2 high-bits of enc2.
            char1 = (enc1 << 2) | (enc2 >> 4);
            // 'char2' = 4 low-bits of enc2 + 4 high-bits of enc3.
            char2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            // 'char3' = 2 low-bits of enc3 + all 6 bits of enc4.
            char3 = ((enc3 & 3) << 6) | enc4;

            // Convert char1 to string character and append to output
            output.push(char1);

            // 'enc3' could be padding
            //   if so, 'char2' is ignored.
            if (enc3 !== 64)
            {
                output.push(char2);
            }

            // 'enc4' could be padding
            //   if so, 'char3' is ignored.
            if (enc4 !== 64)
            {
                output.push(char3);
            }

        }

        return output;

    }

    getObjectType(object)
    {
        /// <signature>
        ///     <summary>Returns the name of an object type</summary>
        ///     <param name="object" type="Object"></param>
        ///     <returns type="String" />
        /// </signature>

        return Object.prototype.toString.call(object).slice(8, -1);
    }

    bytesToHexString(bytes, separate)
    {
        /// <signature>
        ///     <summary>Converts an Array of bytes values (0-255) to a Hex string</summary>
        ///     <param name="bytes" type="Array"/>
        ///     <param name="separate" type="Boolean" optional="true">Inserts a separator for display purposes (default = false)</param>
        ///     <returns type="String" />
        /// </signature>

        var result = "";
        if (typeof separate === "undefined")
        {
            separate = false;
        }

        for (var i = 0; i < bytes.length; i++)
        {

            if (separate && (i % 4 === 0) && i !== 0)
            {
                result += "-";
            }

            var hexval = bytes[i].toString(16).toUpperCase();
            // Add a leading zero if needed.
            if (hexval.length === 1)
            {
                result += "0";
            }

            result += hexval;
        }

        return result;
    }

    bytesToInt32(bytes, index)
    {
        /// <summary>
        /// Converts four bytes to a 32-bit int
        /// </summary>
        /// <param name="bytes">The bytes to convert</param>
        /// <param name="index" optional="true">Optional starting point</param>
        /// <returns type="Number">32-bit number</returns>
        index = (index || 0);

        return (bytes[index] << 24) |
            (bytes[index + 1] << 16) |
            (bytes[index + 2] << 8) |
            bytes[index + 3];
    }

    stringToBytes(messageString)
    {
        /// <signature>
        ///     <summary>Converts a String to an Array of byte values (0-255)</summary>
        ///     <param name="messageString" type="String"/>
        ///     <returns type="Array" />
        /// </signature>

        var bytes = new Array(messageString.length);

        for (var i = 0; i < bytes.length; i++)
        {
            bytes[i] = messageString.charCodeAt(i);
        }

        return bytes;
    }

    hexToBytesArray(hexString)
    {
        /// <signature>
        ///     <summary>Converts a Hex-String to an Array of byte values (0-255)</summary>
        ///     <param name="hexString" type="String"/>
        ///     <returns type="Array" />
        /// </signature>

        hexString = hexString.replace(/\-/g, "");

        var result = [];
        while (hexString.length >= 2)
        {
            result.push(parseInt(hexString.substring(0, 2), 16));
            hexString = hexString.substring(2, hexString.length);
        }

        return result;
    }

    clone(object)
    {
        /// <signature>
        ///     <summary>Creates a shallow clone of an Object</summary>
        ///     <param name="object" type="Object"/>
        ///     <returns type="Object" />
        /// </signature>

        var newObject = {};
        for (var propertyName in object)
        {
            if (object.hasOwnProperty(propertyName))
            {
                newObject[propertyName] = object[propertyName];
            }
        }
        return newObject;
    }

    unpackData(base64String, arraySize, toUint32s)
    {
        /// <signature>
        ///     <summary>Unpacks Base64 encoded data into arrays of data.</summary>
        ///     <param name="base64String" type="String">Base64 encoded data</param>
        ///     <param name="arraySize" type="Number" optional="true">Break data into sub-arrays of a given length</param>
        ///     <param name="toUint32s" type="Boolean" optional="true">Treat data as 32-bit data instead of byte data</param>
        ///     <returns type="Array" />
        /// </signature>

        var bytes = base64ToBytes(base64String),
            data = [],
            i;

        if (isNaN(arraySize))
        {
            return bytes;
        } else
        {
            for (i = 0; i < bytes.length; i += arraySize)
            {
                data.push(bytes.slice(i, i + arraySize));
            }
        }

        if (toUint32s)
        {
            for (i = 0; i < data.length; i++)
            {
                data[i] = (data[i][0] << 24) + (data[i][1] << 16) + (data[i][2] << 8) + data[i][3];
            }
        }

        return data;
    }

    int32ToBytes(int32)
    {
        /// <signature>
        ///     <summary>Converts a 32-bit number to an Array of 4 bytes</summary>
        ///     <param name="int32" type="Number">32-bit number</param>
        ///     <returns type="Array" />
        /// </signature>
        return [(int32 >>> 24) & 255, (int32 >>> 16) & 255, (int32 >>> 8) & 255, int32 & 255];
    }

    int32ArrayToBytes(int32Array)
    {
        /// <signature>
        ///     <summary>Converts an Array 32-bit numbers to an Array bytes</summary>
        ///     <param name="int32Array" type="Array">Array of 32-bit numbers</param>
        ///     <returns type="Array" />
        /// </signature>

        var result = [];
        for (var i = 0; i < int32Array.length; i++)
        {
            result = result.concat(int32ToBytes(int32Array[i]));
        }
        return result;
    }

    xorVectors(a, b)
    {
        /// <signature>
        ///     <summary>Exclusive OR (XOR) two arrays.</summary>
        ///     <param name="a" type="Array">Input array.</param>
        ///     <param name="b" type="Array">Input array.</param>
        ///     <returns type="Array">XOR of the two arrays. The length is minimum of the two input array lengths.</returns>
        /// </signature>

        var length = Math.min(a.length, b.length),
            res = new Array(length);
        for (var i = 0; i < length; i += 1)
        {
            res[i] = a[i] ^ b[i];
        }
        return res;
    }

    getVector(length, fillValue)
    {
        /// <signature>
        ///     <summary>Get an array filled with zeroes (or optional fillValue.)</summary>
        ///     <param name="length" type="Number">Requested array length.</param>
        ///     <param name="fillValue" type="Number" optional="true"></param>
        ///     <returns type="Array"></returns>
        /// </signature>

        // Use a default value of zero
        fillValue || (fillValue = 0);

        var res = new Array(length);
        for (var i = 0; i < length; i += 1)
        {
            res[i] = fillValue;
        }
        return res;
    }

    toArray(typedArray)
    {
        /// <signature>
        ///     <summary>Converts a UInt8Array to a regular JavaScript Array</summary>
        ///     <param name="typedArray" type="UInt8Array"></param>
        ///     <returns type="Array"></returns>
        /// </signature>

        // If undefined or null return an empty array
        if (!typedArray)
        {
            return [];
        }

        // If already an Array return it
        if (typedArray.pop)
        {
            return typedArray;
        }

        // If it's an ArrayBuffer, convert it to a Uint8Array first
        if (typedArray.isView)
        {
            typedArray = Uint8Array(typedArray);
        }

        // A single element array will cause a new Array to be created with the length
        // equal to the value of the single element. Not what we want.
        // We'll return a new single element array with the single value.
        return (typedArray.length === 1) ? [typedArray[0]] : Array.apply(null, typedArray);
    }

    padEnd(array, value, finalLength)
    {
        /// <signature>
        ///     <summary>Pads the end of an array with a specified value</summary>
        ///     <param name="array" type="Array"></param>
        ///     <param name="value" type="Number">The value to pad to the array</param>
        ///     <param name="finalLength" type="Number">The final resulting length with padding</param>
        ///     <returns type="Array"></returns>
        /// </signature>

        while (array.length < finalLength)
        {
            array.push(value);
        }

        return array;
    }

    padFront(array, value, finalLength)
    {
        /// <signature>
        ///     <summary>Pads the front of an array with a specified value</summary>
        ///     <param name="array" type="Array"></param>
        ///     <param name="value" type="Number">The value to pad to the array</param>
        ///     <param name="finalLength" type="Number">The final resulting length with padding</param>
        ///     <returns type="Array"></returns>
        /// </signature>

        while (array.length < finalLength)
        {
            array.unshift(value);
        }

        return array;
    }

    arraysEqual(array1, array2)
    {
        /// <signature>
        ///     <summary>Checks if two Arrays are equal by comparing their values.</summary>
        ///     <param name="array1" type="Array"></param>
        ///     <param name="array2" type="Array"></param>
        ///     <returns type="Array"></returns>
        /// </signature>

        var result = true;

        if (array1.length !== array2.length)
        {
            result = false;
        }

        for (var i = 0; i < array1.length; i++)
        {
            if (array1[i] !== array2[i])
            {
                result = false;
            }
        }

        return result;
    }

    verifyByteArray(array)
    {
        /// <signature>
        ///     <summary>Verify that an Array contains only byte values (0-255)</summary>
        ///     <param name="array" type="Array"></param>
        ///     <returns type="Boolean">Returns true if all values are 0-255</returns>
        /// </signature>

        if (getObjectType(array) !== "Array")
        {
            return false;
        }

        var element;

        for (var i = 0; i < array.length; i++)
        {

            element = array[i];

            if (isNaN(element) || element < 0 || element > 255)
            {
                return false;
            }
        }

        return true;
    }
}

//const StrLib = new CStrLib();


