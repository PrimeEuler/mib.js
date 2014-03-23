var IP = function (str) {
    try {
        this.fromDottedQuad(str);
    } catch (e) {
        try {
            if (str.match(/^0x/)) {
                this.fromHexadecimal(str);
            } else if (str.match(/^0/)) {
                this.fromOctal(str);
            } else {
                this.fromDecimal(str);
            }
        } catch (e) {
            try {
                this.fromPtr(str);
            } catch (e) {
                try {
                    this.fromBinary(str);
                } catch (e) {
                    throw "invalid IPv4 address '" + str + "'";
                }
            }
        }
    }
}

IP.prototype.fromBinary = function (str) {
    var newStr = str;
    if (newStr.match(/\s/)) {
        newStr = str.replace(/\s+/g, " ");
        var a = newStr.split(" ");
        for (var i = 0; i < a.length; i++) {
            a[i] = "00000000".substr(0, 8 - a[i].length) + a[i];
        }
        newStr = a.join("");
    }
    var decimal = parseInt(newStr, 2);
    var m = newStr.match(/^([10]{1,32})$/);
    if (m && isNaN(decimal) == false && decimal <= 4294967295 && decimal >= 0) {
        this.decimal = decimal;
    } else {
        throw "invalid IPv4 binary address '" + str + "'";
    }
    return this.decimal;
}

IP.prototype.fromDecimal = function (str) {
    var decimal = parseInt(str, 10);
    var m = str.match(/^\s*(\d+)\s*$/);
    if (m && isNaN(decimal) == false && decimal <= 4294967295 && decimal >= 0) {
        this.decimal = decimal;
    } else {
        throw "invalid IPv4 decimal address '" + str + "'";
    }
    return this.decimal;
}

IP.prototype.fromPtr = function (str) {
    var m = str.match(/^\s*(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.in\-addr\.arpa\s*$/);
    if (m) {
        for (i = 1; i < 5; i++) {
            if (m[i] < 0 || m[i] > 255) {
                throw "invalid IPv4 DNS PTR resource record '" + str + "'";
            }
        }
        this.decimal = (((parseInt(m[4]) << 24) + (parseInt(m[3]) << 16)
				+ (parseInt(m[2]) << 8) + parseInt(m[1])) >>> 0);
    } else {
        throw "invalid IPv4 DNS PTR resource record '" + str + "'";
    }
    return this.decimal;
}

IP.prototype.fromDottedQuad = function (str) {
    var m = str.match(/^\s*(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\s*$/);
    if (m) {
        for (i = 1; i < 5; i++) {
            if (m[i] < 0 || m[i] > 255) {
                throw "invalid IPv4 dotted quad address '" + str + "'";
            }
        }
        this.decimal = (((parseInt(m[1]) << 24) + (parseInt(m[2]) << 16)
				+ (parseInt(m[3]) << 8) + parseInt(m[4])) >>> 0);
    } else {
        throw "invalid IPv4 dotted quad address '" + str + "'";
    }
    return this.decimal;
}

IP.prototype.fromHexadecimal = function (str) {
    var decimal = parseInt(str, 16);
    var m = str.match(/^\s*0x([a-f0-9]{8})\s*$/i);
    if (m && isNaN(decimal) == false && decimal <= 4294967295 && decimal >= 0) {
        this.decimal = decimal;
    } else {
        throw "invalid IPv4 hexadecimal address '" + str + "'";
    }
    return this.decimal;
}

IP.prototype.fromOctal = function (str) {
    var decimal = parseInt(str, 8);
    var m = str.match(/^\s*([0-8]+)\s*$/i);
    if (m && isNaN(decimal) == false && decimal <= 4294967295 && decimal >= 0) {
        this.decimal = decimal;
    } else {
        throw "invalid IPv4 octal address '" + str + "'";
    }
    return this.decimal;
}

IP.prototype.toBinary = function () {
    var str = this.decimal.toString(2);
    str = "00000000000000000000000000000000".substr(0, 32 - str.length) + str;
    var m = str.match(/[01]{8}/g);
    return m[0] + " " + m[1] + " " + m[2] + " " + m[3];
}

IP.prototype.toDecimal = function () {
    return this.decimal;
}

IP.prototype.toPtr = function () {
    return (this.decimal & 0xff).toString()
			+ "."
			+ ((this.decimal & 0xff00) >> 8).toString()
			+ "."
			+ ((this.decimal & 0xff0000) >> 16).toString()
			+ "."
			+ (this.decimal >>> 24).toString()
			+ ".in-addr.arpa";
}

IP.prototype.toDottedQuad = function () {
    return (this.decimal >>> 24).toString()
			+ "."
			+ ((this.decimal & 0xff0000) >> 16).toString()
			+ "."
			+ ((this.decimal & 0xff00) >> 8).toString()
			+ "."
			+ (this.decimal & 0xff).toString();
}

IP.prototype.toHexadecimal = function () {
    var str = this.decimal.toString(16);
    return "0x" + "00000000".substr(0, 8 - str.length) + str;
}

IP.prototype.toOctal = function () {
    return "0" + this.decimal.toString(8);
}
module.exports = exports = IP;
exports.IP = IP;
exports.native = undefined;