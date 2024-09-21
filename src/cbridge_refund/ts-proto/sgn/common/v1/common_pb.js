// source: sgn/common/v1/common.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = function () {
  if (this) {
    return this;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  return Function('return this')();
}.call(null);

var gogoproto_gogo_pb = require('../../../gogoproto/gogo_pb.js');
goog.object.extend(proto, gogoproto_gogo_pb);
goog.exportSymbol('proto.sgn.common.v1.ContractInfo', null, global);
goog.exportSymbol('proto.sgn.common.v1.ERC20Token', null, global);
goog.exportSymbol('proto.sgn.common.v1.Signature', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.common.v1.Signature = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.common.v1.Signature, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.common.v1.Signature.displayName = 'proto.sgn.common.v1.Signature';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.common.v1.ContractInfo = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.common.v1.ContractInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.common.v1.ContractInfo.displayName =
    'proto.sgn.common.v1.ContractInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.common.v1.ERC20Token = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.common.v1.ERC20Token, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.common.v1.ERC20Token.displayName = 'proto.sgn.common.v1.ERC20Token';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.sgn.common.v1.Signature.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.sgn.common.v1.Signature.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.sgn.common.v1.Signature} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.sgn.common.v1.Signature.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        signer: jspb.Message.getFieldWithDefault(msg, 1, ''),
        sigBytes: msg.getSigBytes_asB64(),
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.common.v1.Signature}
 */
proto.sgn.common.v1.Signature.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.common.v1.Signature();
  return proto.sgn.common.v1.Signature.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.common.v1.Signature} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.common.v1.Signature}
 */
proto.sgn.common.v1.Signature.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString());
        msg.setSigner(value);
        break;
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes());
        msg.setSigBytes(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.common.v1.Signature.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.sgn.common.v1.Signature.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.common.v1.Signature} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.common.v1.Signature.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined;
  f = message.getSigner();
  if (f.length > 0) {
    writer.writeString(1, f);
  }
  f = message.getSigBytes_asU8();
  if (f.length > 0) {
    writer.writeBytes(2, f);
  }
};

/**
 * optional string signer = 1;
 * @return {string}
 */
proto.sgn.common.v1.Signature.prototype.getSigner = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''));
};

/**
 * @param {string} value
 * @return {!proto.sgn.common.v1.Signature} returns this
 */
proto.sgn.common.v1.Signature.prototype.setSigner = function (value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};

/**
 * optional bytes sig_bytes = 2;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.common.v1.Signature.prototype.getSigBytes = function () {
  return /** @type {!(string|Uint8Array)} */ (
    jspb.Message.getFieldWithDefault(this, 2, '')
  );
};

/**
 * optional bytes sig_bytes = 2;
 * This is a type-conversion wrapper around `getSigBytes()`
 * @return {string}
 */
proto.sgn.common.v1.Signature.prototype.getSigBytes_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSigBytes()));
};

/**
 * optional bytes sig_bytes = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSigBytes()`
 * @return {!Uint8Array}
 */
proto.sgn.common.v1.Signature.prototype.getSigBytes_asU8 = function () {
  return /** @type {!Uint8Array} */ (
    jspb.Message.bytesAsU8(this.getSigBytes())
  );
};

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.common.v1.Signature} returns this
 */
proto.sgn.common.v1.Signature.prototype.setSigBytes = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.sgn.common.v1.ContractInfo.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.sgn.common.v1.ContractInfo.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.sgn.common.v1.ContractInfo} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.sgn.common.v1.ContractInfo.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        chainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
        address: jspb.Message.getFieldWithDefault(msg, 2, ''),
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.common.v1.ContractInfo}
 */
proto.sgn.common.v1.ContractInfo.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.common.v1.ContractInfo();
  return proto.sgn.common.v1.ContractInfo.deserializeBinaryFromReader(
    msg,
    reader
  );
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.common.v1.ContractInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.common.v1.ContractInfo}
 */
proto.sgn.common.v1.ContractInfo.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint64());
        msg.setChainId(value);
        break;
      case 2:
        var value = /** @type {string} */ (reader.readString());
        msg.setAddress(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.common.v1.ContractInfo.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.sgn.common.v1.ContractInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.common.v1.ContractInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.common.v1.ContractInfo.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint64(1, f);
  }
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(2, f);
  }
};

/**
 * optional uint64 chain_id = 1;
 * @return {number}
 */
proto.sgn.common.v1.ContractInfo.prototype.getChainId = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};

/**
 * @param {number} value
 * @return {!proto.sgn.common.v1.ContractInfo} returns this
 */
proto.sgn.common.v1.ContractInfo.prototype.setChainId = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};

/**
 * optional string address = 2;
 * @return {string}
 */
proto.sgn.common.v1.ContractInfo.prototype.getAddress = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''));
};

/**
 * @param {string} value
 * @return {!proto.sgn.common.v1.ContractInfo} returns this
 */
proto.sgn.common.v1.ContractInfo.prototype.setAddress = function (value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.sgn.common.v1.ERC20Token.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.sgn.common.v1.ERC20Token.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.sgn.common.v1.ERC20Token} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.sgn.common.v1.ERC20Token.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        chainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
        symbol: jspb.Message.getFieldWithDefault(msg, 2, ''),
        address: jspb.Message.getFieldWithDefault(msg, 3, ''),
        decimals: jspb.Message.getFieldWithDefault(msg, 4, 0),
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.common.v1.ERC20Token}
 */
proto.sgn.common.v1.ERC20Token.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.common.v1.ERC20Token();
  return proto.sgn.common.v1.ERC20Token.deserializeBinaryFromReader(
    msg,
    reader
  );
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.common.v1.ERC20Token} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.common.v1.ERC20Token}
 */
proto.sgn.common.v1.ERC20Token.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint64());
        msg.setChainId(value);
        break;
      case 2:
        var value = /** @type {string} */ (reader.readString());
        msg.setSymbol(value);
        break;
      case 3:
        var value = /** @type {string} */ (reader.readString());
        msg.setAddress(value);
        break;
      case 4:
        var value = /** @type {number} */ (reader.readUint32());
        msg.setDecimals(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.common.v1.ERC20Token.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.sgn.common.v1.ERC20Token.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.common.v1.ERC20Token} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.common.v1.ERC20Token.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint64(1, f);
  }
  f = message.getSymbol();
  if (f.length > 0) {
    writer.writeString(2, f);
  }
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(3, f);
  }
  f = message.getDecimals();
  if (f !== 0) {
    writer.writeUint32(4, f);
  }
};

/**
 * optional uint64 chain_id = 1;
 * @return {number}
 */
proto.sgn.common.v1.ERC20Token.prototype.getChainId = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};

/**
 * @param {number} value
 * @return {!proto.sgn.common.v1.ERC20Token} returns this
 */
proto.sgn.common.v1.ERC20Token.prototype.setChainId = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};

/**
 * optional string symbol = 2;
 * @return {string}
 */
proto.sgn.common.v1.ERC20Token.prototype.getSymbol = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''));
};

/**
 * @param {string} value
 * @return {!proto.sgn.common.v1.ERC20Token} returns this
 */
proto.sgn.common.v1.ERC20Token.prototype.setSymbol = function (value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};

/**
 * optional string address = 3;
 * @return {string}
 */
proto.sgn.common.v1.ERC20Token.prototype.getAddress = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''));
};

/**
 * @param {string} value
 * @return {!proto.sgn.common.v1.ERC20Token} returns this
 */
proto.sgn.common.v1.ERC20Token.prototype.setAddress = function (value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};

/**
 * optional uint32 decimals = 4;
 * @return {number}
 */
proto.sgn.common.v1.ERC20Token.prototype.getDecimals = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};

/**
 * @param {number} value
 * @return {!proto.sgn.common.v1.ERC20Token} returns this
 */
proto.sgn.common.v1.ERC20Token.prototype.setDecimals = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};

goog.object.extend(exports, proto.sgn.common.v1);
