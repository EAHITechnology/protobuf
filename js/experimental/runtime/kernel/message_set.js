/*
##########################################################
#                                                        #
#  __          __     _____  _   _ _____ _   _  _____    #
#  \ \        / /\   |  __ \| \ | |_   _| \ | |/ ____|   #
#   \ \  /\  / /  \  | |__) |  \| | | | |  \| | |  __    #
#    \ \/  \/ / /\ \ |  _  /| . ` | | | | . ` | | |_ |   #
#     \  /\  / ____ \| | \ \| |\  |_| |_| |\  | |__| |   #
#      \/  \/_/    \_\_|  \_\_| \_|_____|_| \_|\_____|   #
#                                                        #
#                                                        #
##########################################################
# Do not use this class in your code. This class purely  #
# exists to make proto code generation easier.           #
##########################################################
*/
goog.module('protobuf.runtime.MessageSet');

const InternalMessage = goog.require('protobuf.binary.InternalMessage');
const Kernel = goog.require('protobuf.runtime.Kernel');

/**
 * @param {!Kernel} kernel
 * @return {!Map<number, !Item>}
 */
function createItemMap(kernel) {
  const itemMap = new Map();
  let totalCount = 0;
  for (const item of kernel.getRepeatedGroupIterable(1, Item.fromKernel)) {
    itemMap.set(item.getTypeId(), item);
    totalCount++;
  }

  // Normalize the entries.
  if (totalCount > itemMap.size) {
    writeItemMap(kernel, itemMap);
  }
  return itemMap;
}

/**
 * @param {!Kernel} kernel
 * @param {!Map<number, !Item>} itemMap
 */
function writeItemMap(kernel, itemMap) {
  kernel.setRepeatedGroupIterable(1, itemMap.values());
}

/**
 * @implements {InternalMessage}
 * @final
 */
class MessageSet {
  /**
   * @param {!Kernel} kernel
   * @return {!MessageSet}
   */
  static fromKernel(kernel) {
    const itemMap = createItemMap(kernel);
    return new MessageSet(kernel, itemMap);
  }

  /**
   * @return {!MessageSet}
   */
  static createEmpty() {
    return MessageSet.fromKernel(Kernel.createEmpty());
  }

  /**
   * @param {!Kernel} kernel
   * @param {!Map<number, !Item>} itemMap
   * @private
   */
  constructor(kernel, itemMap) {
    /** @const {!Kernel} @private */
    this.kernel_ = kernel;
    /** @const {!Map<number, !Item>} @private */
    this.itemMap_ = itemMap;
  }



  // code helpers for code gen

  /**
   * @param {number} typeId
   * @param {function(!Kernel):T} instanceCreator
   * @param {number=} pivot
   * @return {?T}
   * @template T
   */
  getMessageOrNull(typeId, instanceCreator, pivot) {
    const item = this.itemMap_.get(typeId);
    return item ? item.getMessageOrNull(instanceCreator, pivot) : null;
  }

  /**
   * @param {number} typeId
   * @param {function(!Kernel):T} instanceCreator
   * @param {number=} pivot
   * @return {T}
   * @template T
   */
  getMessageAttach(typeId, instanceCreator, pivot) {
    let item = this.itemMap_.get(typeId);
    if (item) {
      return item.getMessageAttach(instanceCreator, pivot);
    }
    const message = instanceCreator(Kernel.createEmpty());
    this.setMessage(typeId, message);
    return message;
  }

  /**
   * @param {number} typeId
   * @param {number=} pivot
   * @return {?Kernel}
   * @template T
   */
  getMessageAccessorOrNull(typeId, pivot) {
    const item = this.itemMap_.get(typeId);
    return item ? item.getMessageAccessorOrNull(pivot) : null;
  }


  /**
   * @param {number} typeId
   */
  clearMessage(typeId) {
    if (this.itemMap_.delete(typeId)) {
      writeItemMap(this.kernel_, this.itemMap_);
    }
  }

  /**
   * @param {number} typeId
   * @return {boolean}
   */
  hasMessage(typeId) {
    return this.itemMap_.has(typeId);
  }

  /**
   * @param {number} typeId
   * @param {!InternalMessage} value
   */
  setMessage(typeId, value) {
    const item = this.itemMap_.get(typeId);
    if (item) {
      item.setMessage(value);
    } else {
      this.itemMap_.set(typeId, Item.create(typeId, value));
      writeItemMap(this.kernel_, this.itemMap_);
    }
  }

  /**
   * @return {!Kernel}
   * @override
   */
  internalGetKernel() {
    return this.kernel_;
  }
}

/**
 * @implements {InternalMessage}
 * @final
 */
class Item {
  /**
   * @param {number} typeId
   * @param {!InternalMessage} message
   * @return {!Item}
   */
  static create(typeId, message) {
    const messageSet = Item.fromKernel(Kernel.createEmpty());
    messageSet.setTypeId_(typeId);
    messageSet.setMessage(message);
    return messageSet;
  }


  /**
   * @param {!Kernel} kernel
   * @return {!Item}
   */
  static fromKernel(kernel) {
    return new Item(kernel);
  }

  /**
   * @param {!Kernel} kernel
   * @private
   */
  constructor(kernel) {
    /** @const {!Kernel} @private */
    this.kernel_ = kernel;
  }

  /**
   * @param {function(!Kernel):T} instanceCreator
   * @param {number=} pivot
   * @return {T}
   * @template T
   */
  getMessage(instanceCreator, pivot) {
    return this.kernel_.getMessage(3, instanceCreator, pivot);
  }

  /**
   * @param {function(!Kernel):T} instanceCreator
   * @param {number=} pivot
   * @return {?T}
   * @template T
   */
  getMessageOrNull(instanceCreator, pivot) {
    return this.kernel_.getMessageOrNull(3, instanceCreator, pivot);
  }

  /**
   * @param {function(!Kernel):T} instanceCreator
   * @param {number=} pivot
   * @return {T}
   * @template T
   */
  getMessageAttach(instanceCreator, pivot) {
    return this.kernel_.getMessageAttach(3, instanceCreator, pivot);
  }

  /**
   * @param {number=} pivot
   * @return {?Kernel}
   */
  getMessageAccessorOrNull(pivot) {
    return this.kernel_.getMessageAccessorOrNull(3, pivot);
  }

  /**
   * @param {!InternalMessage} value
   */
  setMessage(value) {
    this.kernel_.setMessage(3, value);
  }

  /** @return {number} */
  getTypeId() {
    return this.kernel_.getUint32WithDefault(2);
  }

  /**
   * @param {number} value
   * @private
   */
  setTypeId_(value) {
    this.kernel_.setUint32(2, value);
  }

  /**
   * @return {!Kernel}
   * @override
   */
  internalGetKernel() {
    return this.kernel_;
  }
}

exports = MessageSet;
