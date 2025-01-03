import * as __WEBPACK_EXTERNAL_MODULE__babel_runtime_helpers_asyncToGenerator_44d189ce__ from "@babel/runtime/helpers/asyncToGenerator";
import * as __WEBPACK_EXTERNAL_MODULE__babel_runtime_helpers_defineProperty_f2f42996__ from "@babel/runtime/helpers/defineProperty";
import * as __WEBPACK_EXTERNAL_MODULE__babel_runtime_helpers_slicedToArray_6101a560__ from "@babel/runtime/helpers/slicedToArray";
import * as __WEBPACK_EXTERNAL_MODULE__babel_runtime_regenerator_76f951bf__ from "@babel/runtime/regenerator";
import * as __WEBPACK_EXTERNAL_MODULE__firebase_firestore_bcad1b64__ from "@firebase/firestore";
import * as __WEBPACK_EXTERNAL_MODULE_batch_promises_0f3ddb37__ from "batch-promises";
import * as __WEBPACK_EXTERNAL_MODULE_firebase_admin_app_b7102b6a__ from "firebase-admin/app";
import * as __WEBPACK_EXTERNAL_MODULE_firebase_admin_database_2c685aaa__ from "firebase-admin/database";
import * as __WEBPACK_EXTERNAL_MODULE_firebase_admin_firestore_6055576b__ from "firebase-admin/firestore";
import * as __WEBPACK_EXTERNAL_MODULE_firebase_admin_storage_4664a9e0__ from "firebase-admin/storage";
import * as __WEBPACK_EXTERNAL_MODULE_firebase_functions_logger_471b9a2b__ from "firebase-functions/logger";
import * as __WEBPACK_EXTERNAL_MODULE_firebase_functions_params_b6cd8450__ from "firebase-functions/params";
import * as __WEBPACK_EXTERNAL_MODULE_firebase_functions_v2_firestore_3895e331__ from "firebase-functions/v2/firestore";
import * as __WEBPACK_EXTERNAL_MODULE_lodash_es_87a6bcbc__ from "lodash-es";
import * as __WEBPACK_EXTERNAL_MODULE_openai__ from "openai";
import * as __WEBPACK_EXTERNAL_MODULE_openai_helpers_zod_49d8105d__ from "openai/helpers/zod";
import * as __WEBPACK_EXTERNAL_MODULE_zod__ from "zod";
/******/ var __webpack_modules__ = ({

/***/ "./data/types/NPC.ts":
/*!***************************!*\
  !*** ./data/types/NPC.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getNPCDataForPlayer: () => (/* binding */ getNPCDataForPlayer)
/* harmony export */ });
var getNPCDataForPlayer = function getNPCDataForPlayer(player, currentRoundNumber) {
  return {
    gameId: player.gameId,
    name: "NPC - ".concat(player.name),
    currentTileLocation: player.currentTileLocation,
    letters: player.letters,
    createdRound: currentRoundNumber,
    playerTribeId: player.uid
  };
};

/***/ }),

/***/ "./data/types/Round.ts":
/*!*****************************!*\
  !*** ./data/types/Round.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultRoundData: () => (/* binding */ getDefaultRoundData)
/* harmony export */ });
var getDefaultRoundData = function getDefaultRoundData() {
  return {
    gameId: null,
    index: null,
    playersCompletedAt: {},
    processingStartedAt: null,
    processed: false
  };
};

/***/ }),

/***/ "./functions/src/helpers/getBeFirestore.ts":
/*!*************************************************!*\
  !*** ./functions/src/helpers/getBeFirestore.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBeApp: () => (/* binding */ getBeApp),
/* harmony export */   getBeFirestore: () => (/* binding */ getBeFirestore),
/* harmony export */   getBeRealtimeDb: () => (/* binding */ getBeRealtimeDb),
/* harmony export */   getBeStorage: () => (/* binding */ getBeStorage)
/* harmony export */ });
/* harmony import */ var firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin/app */ "firebase-admin/app");
/* harmony import */ var firebase_admin_database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-admin/database */ "firebase-admin/database");
/* harmony import */ var firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase-admin/firestore */ "firebase-admin/firestore");
/* harmony import */ var firebase_admin_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase-admin/storage */ "firebase-admin/storage");




var cachedApp = null;
var getBeApp = function getBeApp() {
  // const projectIdObjForLocalScript = {
  //   databaseURL: `https://${getProjectId()}-default-rtdb.firebaseio.com`,
  // }
  cachedApp = cachedApp || (0,firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)();
  return cachedApp;
};
var getBeFirestore = function getBeFirestore() {
  var app = getBeApp();
  return (0,firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__.initializeFirestore)(app);
};
var getBeStorage = function getBeStorage() {
  var app = getBeApp();
  return (0,firebase_admin_storage__WEBPACK_IMPORTED_MODULE_3__.getStorage)(app);
};
var getBeRealtimeDb = function getBeRealtimeDb() {
  var app = getBeApp();
  return (0,firebase_admin_database__WEBPACK_IMPORTED_MODULE_1__.getDatabase)(app);
};

/***/ }),

/***/ "./functions/src/helpers/isDemoMode.ts":
/*!*********************************************!*\
  !*** ./functions/src/helpers/isDemoMode.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isDemoMode: () => (/* binding */ isDemoMode)
/* harmony export */ });
/* harmony import */ var firebase_functions_params__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions/params */ "firebase-functions/params");

var isDemoModeParam = (0,firebase_functions_params__WEBPACK_IMPORTED_MODULE_0__.defineBoolean)("DEMO_MODE");
var isDemoMode = function isDemoMode() {
  console.log("isDemoModePa", isDemoModeParam.value());
  return isDemoModeParam.value();
};

/***/ }),

/***/ "./functions/src/helpers/reader.ts":
/*!*****************************************!*\
  !*** ./functions/src/helpers/reader.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   countDocs: () => (/* binding */ countDocs),
/* harmony export */   queryDocs: () => (/* binding */ queryDocs),
/* harmony export */   readDoc: () => (/* binding */ readDoc),
/* harmony export */   runTransaction: () => (/* binding */ runTransaction)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase-admin/firestore */ "firebase-admin/firestore");



function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }

// import moment from "moment"

var readDoc = /*#__PURE__*/function () {
  var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee(collectionName, id) {
    var firestore, snap;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          firestore = (0,firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_3__.getFirestore)();
          _context.next = 3;
          return firestore.collection(collectionName).doc(id).get();
        case 3:
          snap = _context.sent;
          return _context.abrupt("return", _objectSpread(_objectSpread({}, snap.data()), {}, {
            uid: id
          }));
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function readDoc(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var queryDocs = /*#__PURE__*/function () {
  var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee2(collectionName, buildQuery) {
    var firestore, ref, query, snap, docs;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          firestore = (0,firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_3__.getFirestore)();
          ref = firestore.collection(collectionName);
          query = buildQuery(ref);
          _context2.next = 5;
          return query.get();
        case 5:
          snap = _context2.sent;
          docs = snap.docs;
          return _context2.abrupt("return", docs.map(function (doc) {
            return _objectSpread(_objectSpread({}, doc.data()), {}, {
              uid: doc.id
            });
          }));
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function queryDocs(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var countDocs = /*#__PURE__*/function () {
  var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee3(collectionName, buildQuery) {
    var firestore, ref, query, snap;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          firestore = (0,firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_3__.getFirestore)();
          ref = firestore.collection(collectionName);
          query = buildQuery(ref);
          _context3.next = 5;
          return query.count().get();
        case 5:
          snap = _context3.sent;
          return _context3.abrupt("return", snap.data().count);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function countDocs(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// export const pitForQuery = async <
//   CollectionName extends keyof CollectionModels,
// >(
//   collectionName: CollectionName,
//   buildQuery: (
//     ref: CollectionReferenceWithTypedWhere<CollectionModels[CollectionName]>
//   ) => QueryWithTypedWhere<CollectionModels[CollectionName]>,
//   readTime: Timestamp
// ): Promise<CollectionModels[CollectionName][]> => {
//   const firestore = getFirestore()
//   const ref = firestore
//     .collection(collectionName)
//     .withConverter(
//       buildConverterForTypeAdmin<CollectionModels[CollectionName]>()
//     )
//   const query = buildQuery(
//     ref as CollectionReferenceWithTypedWhere<CollectionModels[CollectionName]>
//   )

//   const minuteGranularity = new Timestamp(
//     moment.utc(readTime.toDate()).startOf("minute").unix(),
//     0
//   )

//   const querySnapshot = await firestore.runTransaction(
//     (updateFunction) =>
//       updateFunction.get(query as Query<CollectionModels[CollectionName]>),
//     { readOnly: true, readTime: minuteGranularity }
//   )

//   return querySnapshot.docs.map((doc) =>
//     doc.data()
//   ) as CollectionModels[CollectionName][]
// }

var runTransaction = /*#__PURE__*/function () {
  var _ref4 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee5(collectionName, id, transactionFn) {
    var firestore, snapRef;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          firestore = (0,firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_3__.getFirestore)();
          snapRef = firestore.collection(collectionName).doc(id);
          return _context5.abrupt("return", firestore.runTransaction(/*#__PURE__*/function () {
            var _ref5 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee4(tr) {
              var doc, docData, valueToSave;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return tr.get(snapRef);
                  case 2:
                    doc = _context4.sent;
                    docData = doc.data();
                    valueToSave = transactionFn(docData);
                    if (valueToSave) {
                      _context4.next = 7;
                      break;
                    }
                    return _context4.abrupt("return", docData);
                  case 7:
                    tr.set(snapRef, valueToSave, {
                      merge: true
                    });
                    return _context4.abrupt("return", _objectSpread(_objectSpread({}, docData), valueToSave));
                  case 9:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            return function (_x10) {
              return _ref5.apply(this, arguments);
            };
          }()));
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function runTransaction(_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./functions/src/helpers/toTimestamp.ts":
/*!**********************************************!*\
  !*** ./functions/src/helpers/toTimestamp.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toTimestamp: () => (/* binding */ toTimestamp)
/* harmony export */ });
/* harmony import */ var _firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/firestore */ "@firebase/firestore");

var toTimestamp = function toTimestamp(feTimestamp) {
  return new _firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.Timestamp((feTimestamp === null || feTimestamp === void 0 ? void 0 : feTimestamp.seconds) || 0, (feTimestamp === null || feTimestamp === void 0 ? void 0 : feTimestamp.nanoseconds) || 0);
};

/***/ }),

/***/ "./functions/src/helpers/writer.ts":
/*!*****************************************!*\
  !*** ./functions/src/helpers/writer.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   backendNow: () => (/* binding */ backendNow),
/* harmony export */   fbBatchDelete: () => (/* binding */ fbBatchDelete),
/* harmony export */   fbBatchSet: () => (/* binding */ fbBatchSet),
/* harmony export */   fbCreate: () => (/* binding */ fbCreate),
/* harmony export */   fbDelete: () => (/* binding */ fbDelete),
/* harmony export */   fbSet: () => (/* binding */ fbSet),
/* harmony export */   fbUpdate: () => (/* binding */ fbUpdate),
/* harmony export */   genExtraData: () => (/* binding */ genExtraData)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "@babel/runtime/helpers/slicedToArray");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var batch_promises__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! batch-promises */ "batch-promises");
/* harmony import */ var firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! firebase-admin/firestore */ "firebase-admin/firestore");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "lodash-es");
/* harmony import */ var _getBeFirestore__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getBeFirestore */ "./functions/src/helpers/getBeFirestore.ts");




function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }




var genExtraData = function genExtraData() {
  return {
    createdAt: firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_5__.Timestamp.now(),
    updatedAt: firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_5__.Timestamp.now(),
    archived: false
  };
};
var backendNow = function backendNow() {
  return firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_5__.Timestamp.now();
}; //Timestamp.now() as FeTimestamp

var fbSet = /*#__PURE__*/function () {
  var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee(collectionName, docId, data) {
    var firestore;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          firestore = (0,_getBeFirestore__WEBPACK_IMPORTED_MODULE_7__.getBeFirestore)();
          _context.next = 3;
          return firestore.collection(collectionName).doc(docId).set(_objectSpread({
            updatedAt: firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_5__.Timestamp.now()
          }, data), {
            merge: true
          });
        case 3:
          return _context.abrupt("return", firestore.collection(collectionName).doc(docId));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fbSet(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var fbDelete = /*#__PURE__*/function () {
  var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee2(collectionName, docId) {
    var firestore;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          firestore = (0,_getBeFirestore__WEBPACK_IMPORTED_MODULE_7__.getBeFirestore)();
          _context2.next = 3;
          return firestore.collection(collectionName).doc(docId)["delete"]();
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fbDelete(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
var fbUpdate = /*#__PURE__*/function () {
  var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee3(collectionName, docId, data) {
    var firestore;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          firestore = (0,_getBeFirestore__WEBPACK_IMPORTED_MODULE_7__.getBeFirestore)();
          _context3.next = 3;
          return firestore.collection(collectionName).doc(docId).update(_objectSpread({
            updatedAt: firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_5__.Timestamp.now()
          }, data));
        case 3:
          return _context3.abrupt("return", firestore.collection(collectionName).doc(docId));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function fbUpdate(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();
var fbCreate = /*#__PURE__*/function () {
  var _ref4 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee4(collectionName, data, opts) {
    var firestore, ref;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          firestore = (0,_getBeFirestore__WEBPACK_IMPORTED_MODULE_7__.getBeFirestore)();
          ref = opts !== null && opts !== void 0 && opts.id ? firestore.collection(collectionName).doc(opts.id) : firestore.collection(collectionName).doc();
          _context4.next = 4;
          return ref.set(_objectSpread(_objectSpread({}, genExtraData()), data), {
            merge: true
          });
        case 4:
          return _context4.abrupt("return", ref);
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function fbCreate(_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();
var fbBatchSet = /*#__PURE__*/function () {
  var _ref5 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee6(collectionName, records, getDocKey) {
    var batchSize,
      firestore,
      chunked,
      entries,
      _args6 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          batchSize = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : 100;
          firestore = (0,_getBeFirestore__WEBPACK_IMPORTED_MODULE_7__.getBeFirestore)();
          chunked = (0,lodash_es__WEBPACK_IMPORTED_MODULE_6__.chunk)(records, batchSize);
          entries = Array.from(chunked.entries()); // console.log(`starting ${collectionName} save for ${records.length} documents`)
          return _context6.abrupt("return", (0,batch_promises__WEBPACK_IMPORTED_MODULE_4__["default"])(5, entries, /*#__PURE__*/function () {
            var _ref7 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee5(_ref6) {
              var _ref8, batchIndex, sentenceBatch, writer;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _ref8 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref6, 2), batchIndex = _ref8[0], sentenceBatch = _ref8[1];
                    writer = firestore.batch();
                    sentenceBatch.forEach(function (record, sentenceIndex) {
                      var recordToWrite = _objectSpread(_objectSpread({}, record), genExtraData());
                      var recordRef = getDocKey ? firestore.collection(collectionName).doc(getDocKey(record, sentenceIndex + batchIndex * batchSize)) : firestore.collection(collectionName).doc();
                      writer.set(recordRef, recordToWrite, {
                        merge: true
                      });
                    });
                    // console.log(
                    //   `commiting ${collectionName} batch ${batchIndex} out of ${
                    //     chunked.length - 1
                    //   }`
                    // )
                    return _context5.abrupt("return", writer.commit());
                  case 4:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function (_x15) {
              return _ref7.apply(this, arguments);
            };
          }()));
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function fbBatchSet(_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();
var fbBatchDelete = /*#__PURE__*/function () {
  var _ref9 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee8(collectionName, recordIds) {
    var batchSize,
      firestore,
      chunked,
      entries,
      _args8 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          batchSize = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : 100;
          firestore = (0,_getBeFirestore__WEBPACK_IMPORTED_MODULE_7__.getBeFirestore)();
          chunked = (0,lodash_es__WEBPACK_IMPORTED_MODULE_6__.chunk)(recordIds, batchSize);
          entries = Array.from(chunked.entries());
          return _context8.abrupt("return", (0,batch_promises__WEBPACK_IMPORTED_MODULE_4__["default"])(5, entries, /*#__PURE__*/function () {
            var _ref11 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].mark(function _callee7(_ref10) {
              var _ref12, sentenceBatch, writer;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__["default"].wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    _ref12 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref10, 2), sentenceBatch = _ref12[1];
                    writer = firestore.batch();
                    sentenceBatch.forEach(function (recordId) {
                      var recordRef = firestore.collection(collectionName).doc(recordId);
                      writer["delete"](recordRef);
                    });
                    return _context7.abrupt("return", writer.commit());
                  case 4:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            }));
            return function (_x18) {
              return _ref11.apply(this, arguments);
            };
          }()));
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function fbBatchDelete(_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./functions/src/mocks/sampleTileDescriptions.ts":
/*!*******************************************************!*\
  !*** ./functions/src/mocks/sampleTileDescriptions.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sampleTileDescriptions: () => (/* binding */ sampleTileDescriptions)
/* harmony export */ });
var sampleTileDescriptions = {
  tiles: [{
    posX: 0,
    posY: 0,
    description: "A gentle river emerges from rocky highlands, creating a small waterfall that feeds into a clear pool. Dense pine forest surrounds the water's edge."
  }, {
    posX: 0,
    posY: 1,
    description: "The river widens as it meanders through a valley, with fertile soil supporting a mix of wildflowers and tall grasses along its banks."
  }, {
    posX: 0,
    posY: 2,
    description: "A marshy area where the river splits into several smaller streams, creating a wetland habitat rich with reeds and water-loving plants."
  }, {
    posX: 0,
    posY: 3,
    description: "The streams converge again into a wider, slower-moving river section, bordered by ancient willows whose branches touch the water."
  }, {
    posX: 1,
    posY: 0,
    description: "Rocky cliffs rise sharply, dotted with hardy mountain shrubs and small caves. A narrow path winds its way up the cliff face."
  }, {
    posX: 1,
    posY: 1,
    description: "A sheltered valley nestled between hills, featuring a small grove of fruit trees and patches of medicinal herbs."
  }, {
    posX: 1,
    posY: 2,
    description: "Rolling meadows filled with tall grasses and scattered clusters of birch trees, providing excellent grazing land."
  }, {
    posX: 1,
    posY: 3,
    description: "A dense deciduous forest with a thick canopy, home to numerous species of birds and small mammals."
  }, {
    posX: 2,
    posY: 0,
    description: "Craggy mountain peaks rise dramatically, their slopes covered in hardy alpine vegetation and patches of year-round snow."
  }, {
    posX: 2,
    posY: 1,
    description: "A protected mountain valley featuring hot springs and unusual rock formations, with steam rising in the cooler air."
  }, {
    posX: 2,
    posY: 2,
    description: "An ancient forest of towering redwood-like trees, their massive trunks creating natural corridors below."
  }, {
    posX: 2,
    posY: 3,
    description: "A mysterious grove where the trees thin out to reveal a perfect circular clearing, filled with unusual flowering plants."
  }, {
    posX: 3,
    posY: 0,
    description: "Barren rocky terrain gives way to a hidden valley, where a small oasis thrives around a natural spring."
  }, {
    posX: 3,
    posY: 1,
    description: "A series of small interconnected ponds, surrounded by bamboo groves and flowering water plants."
  }, {
    posX: 3,
    posY: 2,
    description: "Gently sloping hills covered in a patchwork of wildflowers and aromatic herbs, buzzing with insect life."
  }, {
    posX: 3,
    posY: 3,
    description: "A peaceful meadow where the forest opens up, featuring a single enormous ancient tree at its center."
  }]
};

/***/ }),

/***/ "./functions/src/mocks/sampleTileSVGs.ts":
/*!***********************************************!*\
  !*** ./functions/src/mocks/sampleTileSVGs.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sampleTileSVGs: () => (/* binding */ sampleTileSVGs)
/* harmony export */ });
var sampleTileSVGs = {
  tileSVGs: [{
    posX: 0,
    posY: 0,
    svg: "<svg viewBox='0 0 100 100'><defs><linearGradient id='water' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:#4a90e2'/><stop offset='100%' style='stop-color:#357abd'/></linearGradient></defs><rect x='0' y='0' width='100' height='100' fill='#8bc34a'/><path d='M10,30 Q50,35 90,30' stroke='url(#water)' stroke-width='8' fill='none'/><path d='M60,10 L80,30 L60,30 Z' fill='#795548'/><circle cx='75' cy='15' r='5' fill='#2e7d32'/></svg>"
  }, {
    posX: 0,
    posY: 1,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#8bc34a'/><path d='M10,50 Q30,40 50,50 Q70,60 90,50' stroke='#4a90e2' stroke-width='10' fill='none'/><circle cx='20' cy='30' r='3' fill='#e91e63'/><circle cx='70' cy='70' r='3' fill='#e91e63'/></svg>"
  }, {
    posX: 0,
    posY: 2,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#81c784'/><path d='M20,50 Q40,45 60,50' stroke='#4a90e2' stroke-width='3' fill='none'/><path d='M30,60 Q50,55 70,60' stroke='#4a90e2' stroke-width='3' fill='none'/><path d='M40,40 Q60,35 80,40' stroke='#4a90e2' stroke-width='3' fill='none'/></svg>"
  }, {
    posX: 0,
    posY: 3,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#81c784'/><path d='M10,50 Q50,45 90,50' stroke='#4a90e2' stroke-width='12' fill='none'/><path d='M20,10 Q20,50 20,90' stroke='#5d4037' stroke-width='4' fill='none'/><path d='M80,10 Q80,50 80,90' stroke='#5d4037' stroke-width='4' fill='none'/></svg>"
  }, {
    posX: 1,
    posY: 0,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#795548'/><path d='M20,80 L50,20 L80,80' fill='#8d6e63'/><path d='M40,50 L60,50' stroke='#5d4037' stroke-width='2' fill='none'/></svg>"
  }, {
    posX: 1,
    posY: 1,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#a5d6a7'/><circle cx='30' cy='30' r='10' fill='#4caf50'/><circle cx='70' cy='70' r='10' fill='#4caf50'/><circle cx='70' cy='30' r='10' fill='#4caf50'/></svg>"
  }, {
    posX: 1,
    posY: 2,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#c5e1a5'/><circle cx='25' cy='25' r='5' fill='#ffffff'/><circle cx='75' cy='75' r='5' fill='#ffffff'/><circle cx='75' cy='25' r='5' fill='#ffffff'/></svg>"
  }, {
    posX: 1,
    posY: 3,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#2e7d32'/><circle cx='50' cy='50' r='30' fill='#1b5e20'/><circle cx='20' cy='20' r='15' fill='#388e3c'/><circle cx='80' cy='80' r='15' fill='#388e3c'/></svg>"
  }, {
    posX: 2,
    posY: 0,
    svg: "<svg viewBox='0 0 100 100'><path d='M0,100 L30,20 L50,60 L70,10 L100,100 Z' fill='#795548'/><path d='M30,20 L50,0 L70,10' fill='#fff'/></svg>"
  }, {
    posX: 2,
    posY: 1,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#795548'/><circle cx='30' cy='30' r='10' fill='#4a90e2'/><path d='M25,25 Q50,45 75,25' stroke='#white' stroke-width='2' opacity='0.5'/></svg>"
  }, {
    posX: 2,
    posY: 2,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#33691e'/><rect x='30' y='0' width='10' height='100' fill='#4a342a'/><rect x='60' y='0' width='10' height='100' fill='#4a342a'/></svg>"
  }, {
    posX: 2,
    posY: 3,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#81c784'/><circle cx='50' cy='50' r='30' fill='#c5e1a5'/><circle cx='50' cy='50' r='25' fill='#e8f5e9'/></svg>"
  }, {
    posX: 3,
    posY: 0,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#8d6e63'/><circle cx='50' cy='50' r='20' fill='#4a90e2'/><circle cx='50' cy='50' r='15' fill='#81d4fa'/></svg>"
  }, {
    posX: 3,
    posY: 1,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#81c784'/><circle cx='30' cy='30' r='15' fill='#4a90e2'/><circle cx='70' cy='70' r='15' fill='#4a90e2'/><rect x='40' y='0' width='5' height='100' fill='#33691e'/></svg>"
  }, {
    posX: 3,
    posY: 2,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#c5e1a5'/><circle cx='20' cy='20' r='3' fill='#e91e63'/><circle cx='50' cy='50' r='3' fill='#9c27b0'/><circle cx='80' cy='80' r='3' fill='#e91e63'/></svg>"
  }, {
    posX: 3,
    posY: 3,
    svg: "<svg viewBox='0 0 100 100'><rect x='0' y='0' width='100' height='100' fill='#c5e1a5'/><circle cx='50' cy='50' r='20' fill='#33691e'/><path d='M50,30 Q30,50 50,70 Q70,50 50,30' fill='#1b5e20'/></svg>"
  }]
};

/***/ }),

/***/ "./functions/src/triggers/processGame/gameProcessingTriggered.ts":
/*!***********************************************************************!*\
  !*** ./functions/src/triggers/processGame/gameProcessingTriggered.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   gameProcessingTriggered: () => (/* binding */ gameProcessingTriggered)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _helpers_reader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/reader */ "./functions/src/helpers/reader.ts");
/* harmony import */ var _setupGameAtStart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./setupGameAtStart */ "./functions/src/triggers/processGame/setupGameAtStart.ts");


function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



function getGameData(_x) {
  return _getGameData.apply(this, arguments);
}
function _getGameData() {
  _getGameData = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee3(gameId) {
    var data, refresh;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          data = {};
          refresh = /*#__PURE__*/function () {
            var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee2() {
              var game, players, rounds, currentRound;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0,_helpers_reader__WEBPACK_IMPORTED_MODULE_3__.readDoc)("games", gameId);
                  case 2:
                    game = _context2.sent;
                    _context2.next = 5;
                    return (0,_helpers_reader__WEBPACK_IMPORTED_MODULE_3__.queryDocs)("players", function (ref) {
                      return ref.where("gameId", "==", game.uid).where("archived", "==", false);
                    });
                  case 5:
                    players = _context2.sent;
                    _context2.next = 8;
                    return (0,_helpers_reader__WEBPACK_IMPORTED_MODULE_3__.queryDocs)("rounds", function (ref) {
                      return ref.where("gameId", "==", game.uid).orderBy("index").limit(1);
                    });
                  case 8:
                    rounds = _context2.sent;
                    currentRound = rounds[0] || null;
                    Object.assign(data, {
                      game: game,
                      players: players,
                      currentRound: currentRound
                    });
                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            return function refresh() {
              return _ref3.apply(this, arguments);
            };
          }();
          _context3.next = 4;
          return refresh();
        case 4:
          return _context3.abrupt("return", _objectSpread(_objectSpread({}, data), {}, {
            refresh: refresh
          }));
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _getGameData.apply(this, arguments);
}
var gameProcessingTriggered = /*#__PURE__*/function () {
  var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee(_ref) {
    var docId, args, shouldProcessGameStarted;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          docId = _ref.docId;
          _context.next = 3;
          return getGameData(docId);
        case 3:
          args = _context.sent;
          shouldProcessGameStarted = !args.game.gameSetupCompletedAt;
          if (shouldProcessGameStarted) {
            (0,_setupGameAtStart__WEBPACK_IMPORTED_MODULE_4__.setupGameAtStart)(args);
          }
          return _context.abrupt("return", false);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function gameProcessingTriggered(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./functions/src/triggers/processGame/setupGameAtStart.ts":
/*!****************************************************************!*\
  !*** ./functions/src/triggers/processGame/setupGameAtStart.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupGameAtStart: () => (/* binding */ setupGameAtStart)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase-admin/firestore */ "firebase-admin/firestore");
/* harmony import */ var _helpers_writer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/writer */ "./functions/src/helpers/writer.ts");
/* harmony import */ var _setupGameTilesAtStart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./setupGameTilesAtStart */ "./functions/src/triggers/processGame/setupGameTilesAtStart.ts");
/* harmony import */ var _setupNPCsForEachPlayer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./setupNPCsForEachPlayer */ "./functions/src/triggers/processGame/setupNPCsForEachPlayer.ts");
/* harmony import */ var _startNewRound__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./startNewRound */ "./functions/src/triggers/processGame/startNewRound.ts");







var setupGameAtStart = /*#__PURE__*/function () {
  var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__["default"].mark(function _callee(args) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0,_setupGameTilesAtStart__WEBPACK_IMPORTED_MODULE_4__.setupGameTilesAtStart)(args);
        case 2:
          _context.next = 4;
          return (0,_startNewRound__WEBPACK_IMPORTED_MODULE_6__.startNewRound)(args);
        case 4:
          _context.next = 6;
          return args.refresh();
        case 6:
          _context.next = 8;
          return (0,_setupNPCsForEachPlayer__WEBPACK_IMPORTED_MODULE_5__.addNewNPCForEachPlayer)(args);
        case 8:
          console.log("setup complete");
          _context.next = 11;
          return (0,_helpers_writer__WEBPACK_IMPORTED_MODULE_3__.fbSet)("games", args.game.uid, {
            gameSetupCompletedAt: firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__.Timestamp.now()
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function setupGameAtStart(_x) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./functions/src/triggers/processGame/setupGameTilesAtStart.ts":
/*!*********************************************************************!*\
  !*** ./functions/src/triggers/processGame/setupGameTilesAtStart.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupGameTilesAtStart: () => (/* binding */ setupGameTilesAtStart)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _helpers_reader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/reader */ "./functions/src/helpers/reader.ts");
/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! openai */ "openai");
/* harmony import */ var firebase_functions_params__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! firebase-functions/params */ "firebase-functions/params");
/* harmony import */ var openai_helpers_zod__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! openai/helpers/zod */ "openai/helpers/zod");
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! zod */ "zod");
/* harmony import */ var _mocks_sampleTileDescriptions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../mocks/sampleTileDescriptions */ "./functions/src/mocks/sampleTileDescriptions.ts");
/* harmony import */ var _mocks_sampleTileSVGs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../mocks/sampleTileSVGs */ "./functions/src/mocks/sampleTileSVGs.ts");
/* harmony import */ var _helpers_isDemoMode__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../helpers/isDemoMode */ "./functions/src/helpers/isDemoMode.ts");
/* harmony import */ var _helpers_writer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../helpers/writer */ "./functions/src/helpers/writer.ts");



function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }









var openAiApiKey = (0,firebase_functions_params__WEBPACK_IMPORTED_MODULE_5__.defineString)("OPENAI_API_KEY");
var TileDescriptions = zod__WEBPACK_IMPORTED_MODULE_7__.z.object({
  tiles: zod__WEBPACK_IMPORTED_MODULE_7__.z.array(zod__WEBPACK_IMPORTED_MODULE_7__.z.object({
    posX: zod__WEBPACK_IMPORTED_MODULE_7__.z.number(),
    posY: zod__WEBPACK_IMPORTED_MODULE_7__.z.number(),
    description: zod__WEBPACK_IMPORTED_MODULE_7__.z.string()
  }))
});
var SVGResponses = zod__WEBPACK_IMPORTED_MODULE_7__.z.object({
  tileSVGs: zod__WEBPACK_IMPORTED_MODULE_7__.z.array(zod__WEBPACK_IMPORTED_MODULE_7__.z.object({
    posX: zod__WEBPACK_IMPORTED_MODULE_7__.z.number(),
    posY: zod__WEBPACK_IMPORTED_MODULE_7__.z.number(),
    svg: zod__WEBPACK_IMPORTED_MODULE_7__.z.string()
  }))
});
var getPrompt = function getPrompt(sizeOfGrid) {
  return "Design a ".concat(sizeOfGrid, "x").concat(sizeOfGrid, " valley map where each tile is 3km square. Create a coherent geographical layout where each tile's environment makes sense given its surrounding tiles.\n\nConsider:\n- Rivers and water bodies\n- Mountains and elevation changes\n- Forests and vegetation types\n- Natural landmarks\n\nEnsure environments transition logically between adjacent tiles.");
};
var getSVGsPrompt = function getSVGsPrompt(tiles) {
  var tileList = tiles.map(function (t) {
    return "Tile (".concat(t.posX, ",").concat(t.posY, "): ").concat(t.description);
  }).join("\n");
  return "Create simple SVG representations for these connected environments:\n\n".concat(tileList, "\n\nRequirements for each SVG:\n- Use basic shapes and paths\n- Be minimalistic but recognizable\n- Use appropriate colors\n- Fit within a 100x100 viewBox\n- Include only essential visual elements\n- Ensure visual consistency between adjacent tiles\n- Use similar style and scale across all tiles");
};
var setupGameTilesAtStart = /*#__PURE__*/function () {
  var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee2(_ref) {
    var game, openAiClient, tileDescriptions, completion, svgResults, svgCompletion, currentTiles;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          game = _ref.game;
          openAiClient = new openai__WEBPACK_IMPORTED_MODULE_4__["default"]({
            apiKey: openAiApiKey.value()
          });
          tileDescriptions = _mocks_sampleTileDescriptions__WEBPACK_IMPORTED_MODULE_8__.sampleTileDescriptions.tiles;
          if ((0,_helpers_isDemoMode__WEBPACK_IMPORTED_MODULE_10__.isDemoMode)()) {
            _context2.next = 8;
            break;
          }
          _context2.next = 6;
          return openAiClient.beta.chat.completions.parse({
            model: "gpt-4",
            messages: [{
              role: "system",
              content: "You are a skilled cartographer and environmental designer."
            }, {
              role: "user",
              content: getPrompt(game.mapSize)
            }],
            response_format: (0,openai_helpers_zod__WEBPACK_IMPORTED_MODULE_6__.zodResponseFormat)(TileDescriptions, "tiles"),
            temperature: 0.7
          });
        case 6:
          completion = _context2.sent;
          tileDescriptions = completion.choices[0].message.parsed.tiles;
        case 8:
          // Generate all SVGs in a single call
          svgResults = _mocks_sampleTileSVGs__WEBPACK_IMPORTED_MODULE_9__.sampleTileSVGs.tileSVGs;
          if ((0,_helpers_isDemoMode__WEBPACK_IMPORTED_MODULE_10__.isDemoMode)()) {
            _context2.next = 14;
            break;
          }
          _context2.next = 12;
          return openAiClient.beta.chat.completions.parse({
            model: "gpt-4",
            messages: [{
              role: "system",
              content: "You are a skilled SVG artist specializing in creating cohesive map tile sets."
            }, {
              role: "user",
              content: getSVGsPrompt(tileDescriptions)
            }],
            response_format: (0,openai_helpers_zod__WEBPACK_IMPORTED_MODULE_6__.zodResponseFormat)(SVGResponses, "tileSVGs"),
            temperature: 0.7
          });
        case 12:
          svgCompletion = _context2.sent;
          svgResults = svgCompletion.choices[0].message.parsed.tileSVGs;
        case 14:
          _context2.next = 16;
          return (0,_helpers_reader__WEBPACK_IMPORTED_MODULE_3__.queryDocs)("mapTiles", function (ref) {
            return ref.where("gameId", "==", game.uid).where("archived", "==", false);
          });
        case 16:
          currentTiles = _context2.sent;
          _context2.next = 19;
          return Promise.all(tileDescriptions.map(/*#__PURE__*/function () {
            var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee(tile) {
              var existingTile, _svgResults, newTile;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    existingTile = currentTiles.find(function (t) {
                      return t.position.x === tile.posX && t.position.y === tile.posY;
                    });
                    if (!existingTile) {
                      _context.next = 6;
                      break;
                    }
                    newTile = _objectSpread(_objectSpread({}, existingTile), {}, {
                      svg: ((_svgResults = svgResults) === null || _svgResults === void 0 || (_svgResults = _svgResults.find(function (svg) {
                        return svg.posX === tile.posX && svg.posY === tile.posY;
                      })) === null || _svgResults === void 0 ? void 0 : _svgResults.svg) || null,
                      history: [{
                        entryText: tile.description
                      }]
                    });
                    _context.next = 5;
                    return (0,_helpers_writer__WEBPACK_IMPORTED_MODULE_11__.fbSet)("mapTiles", existingTile.uid, newTile);
                  case 5:
                    return _context.abrupt("return", newTile);
                  case 6:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x2) {
              return _ref3.apply(this, arguments);
            };
          }()));
        case 19:
          return _context2.abrupt("return", _context2.sent);
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function setupGameTilesAtStart(_x) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./functions/src/triggers/processGame/setupNPCsForEachPlayer.ts":
/*!**********************************************************************!*\
  !*** ./functions/src/triggers/processGame/setupNPCsForEachPlayer.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addNewNPCForEachPlayer: () => (/* binding */ addNewNPCForEachPlayer)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _data_types_NPC__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/data/types/NPC */ "./data/types/NPC.ts");
/* harmony import */ var _helpers_writer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/writer */ "./functions/src/helpers/writer.ts");




var addNewNPCForEachPlayer = /*#__PURE__*/function () {
  var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__["default"].mark(function _callee(_ref) {
    var players, currentRound, roundIndex;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          players = _ref.players, currentRound = _ref.currentRound;
          roundIndex = currentRound.index;
          console.log("round index", roundIndex);
          _context.next = 5;
          return Promise.all(players.map(function (player) {
            var npc = (0,_data_types_NPC__WEBPACK_IMPORTED_MODULE_2__.getNPCDataForPlayer)(player, roundIndex);
            return (0,_helpers_writer__WEBPACK_IMPORTED_MODULE_3__.fbCreate)("npcs", npc);
          }));
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function addNewNPCForEachPlayer(_x) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./functions/src/triggers/processGame/startNewRound.ts":
/*!*************************************************************!*\
  !*** ./functions/src/triggers/processGame/startNewRound.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   startNewRound: () => (/* binding */ startNewRound)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _data_types_Round__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/data/types/Round */ "./data/types/Round.ts");
/* harmony import */ var _helpers_writer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/writer */ "./functions/src/helpers/writer.ts");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "lodash-es");



function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var startNewRound = /*#__PURE__*/function () {
  var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].mark(function _callee(_ref) {
    var game, currentRound, players, currentRoundIndex, newRoundIndex, charactersInCurrentRound, newRound;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          game = _ref.game, currentRound = _ref.currentRound, players = _ref.players;
          currentRoundIndex = (0,lodash_es__WEBPACK_IMPORTED_MODULE_5__.isNil)(currentRound === null || currentRound === void 0 ? void 0 : currentRound.index) ? -1 : currentRound.index;
          newRoundIndex = currentRoundIndex + 1;
          charactersInCurrentRound = game.startingCharacterCount - newRoundIndex * 10;
          newRound = _objectSpread(_objectSpread({}, (0,_data_types_Round__WEBPACK_IMPORTED_MODULE_3__.getDefaultRoundData)()), {}, {
            gameId: game.uid,
            index: newRoundIndex,
            playersCompletedAt: {}
          });
          _context.next = 7;
          return Promise.all(players.map(function (player) {
            return (0,_helpers_writer__WEBPACK_IMPORTED_MODULE_4__.fbSet)("players", player.uid, {
              letters: charactersInCurrentRound
            });
          }));
        case 7:
          _context.next = 9;
          return (0,_helpers_writer__WEBPACK_IMPORTED_MODULE_4__.fbCreate)("rounds", newRound);
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function startNewRound(_x) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./functions/src/triggers/triggerProcessJob.ts":
/*!*****************************************************!*\
  !*** ./functions/src/triggers/triggerProcessJob.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   triggerProcessJob: () => (/* binding */ triggerProcessJob)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "@babel/runtime/helpers/asyncToGenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase-admin/firestore */ "firebase-admin/firestore");
/* harmony import */ var firebase_functions_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase-functions/logger */ "firebase-functions/logger");
/* harmony import */ var firebase_functions_v2_firestore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase-functions/v2/firestore */ "firebase-functions/v2/firestore");
/* harmony import */ var _helpers_writer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/writer */ "./functions/src/helpers/writer.ts");
/* harmony import */ var _helpers_toTimestamp__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/toTimestamp */ "./functions/src/helpers/toTimestamp.ts");
/* harmony import */ var _processGame_gameProcessingTriggered__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./processGame/gameProcessingTriggered */ "./functions/src/triggers/processGame/gameProcessingTriggered.ts");








var jobTypeMap = {
  games: _processGame_gameProcessingTriggered__WEBPACK_IMPORTED_MODULE_7__.gameProcessingTriggered
};
var timeoutSeconds = 540;
var triggerProcessJob = (0,firebase_functions_v2_firestore__WEBPACK_IMPORTED_MODULE_4__.onDocumentWritten)({
  document: "processingJob/{docId}",
  maxInstances: 80,
  minInstances: 1,
  memory: "4GiB",
  timeoutSeconds: timeoutSeconds,
  cpu: 2
}, /*#__PURE__*/function () {
  var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__["default"].mark(function _callee(change) {
    var after, before, oldTrigger, newTrigger, jobfn, shouldRetrigger;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          after = change.data.after.data() || {};
          before = change.data.before.data() || {};
          oldTrigger = (0,_helpers_toTimestamp__WEBPACK_IMPORTED_MODULE_6__.toTimestamp)(before === null || before === void 0 ? void 0 : before.triggeredAt);
          newTrigger = (0,_helpers_toTimestamp__WEBPACK_IMPORTED_MODULE_6__.toTimestamp)(after.triggeredAt);
          if (!(after.retriggerCount > 200)) {
            _context.next = 7;
            break;
          }
          (0,firebase_functions_logger__WEBPACK_IMPORTED_MODULE_3__.error)("retrigger count exceeeded", change.data.after.id);
          return _context.abrupt("return");
        case 7:
          if (!(oldTrigger.toMillis() !== newTrigger.toMillis())) {
            _context.next = 18;
            break;
          }
          if (after.retriggerCount > 0) {
            console.log("running retrigger", change.data.after.id, after.retriggerCount);
          }
          jobfn = jobTypeMap[after.jobType];
          if (jobfn) {
            _context.next = 13;
            break;
          }
          console.error("No job type found: ", after.jobType);
          return _context.abrupt("return");
        case 13:
          _context.next = 15;
          return jobfn({
            docId: change.data.after.id,
            trigger: newTrigger.toMillis(),
            oneOffJobData: after.oneOffJobData
          });
        case 15:
          shouldRetrigger = _context.sent;
          if (shouldRetrigger) {
            console.log("retriggering", change.data.after.id, after.retriggerCount);
            (0,_helpers_writer__WEBPACK_IMPORTED_MODULE_5__.fbSet)("processingJob", change.data.after.id, {
              triggeredAt: firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__.Timestamp.now(),
              retriggerCount: firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__.FieldValue.increment(1)
            });
          }
          return _context.abrupt("return");
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

/***/ }),

/***/ "@babel/runtime/helpers/asyncToGenerator":
/*!**********************************************************!*\
  !*** external "@babel/runtime/helpers/asyncToGenerator" ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__babel_runtime_helpers_asyncToGenerator_44d189ce__;

/***/ }),

/***/ "@babel/runtime/helpers/defineProperty":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/defineProperty" ***!
  \********************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__babel_runtime_helpers_defineProperty_f2f42996__;

/***/ }),

/***/ "@babel/runtime/helpers/slicedToArray":
/*!*******************************************************!*\
  !*** external "@babel/runtime/helpers/slicedToArray" ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__babel_runtime_helpers_slicedToArray_6101a560__;

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__babel_runtime_regenerator_76f951bf__;

/***/ }),

/***/ "@firebase/firestore":
/*!**************************************!*\
  !*** external "@firebase/firestore" ***!
  \**************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__firebase_firestore_bcad1b64__;

/***/ }),

/***/ "batch-promises":
/*!*********************************!*\
  !*** external "batch-promises" ***!
  \*********************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_batch_promises_0f3ddb37__;

/***/ }),

/***/ "firebase-admin/app":
/*!*************************************!*\
  !*** external "firebase-admin/app" ***!
  \*************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_firebase_admin_app_b7102b6a__;

/***/ }),

/***/ "firebase-admin/database":
/*!******************************************!*\
  !*** external "firebase-admin/database" ***!
  \******************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_firebase_admin_database_2c685aaa__;

/***/ }),

/***/ "firebase-admin/firestore":
/*!*******************************************!*\
  !*** external "firebase-admin/firestore" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_firebase_admin_firestore_6055576b__;

/***/ }),

/***/ "firebase-admin/storage":
/*!*****************************************!*\
  !*** external "firebase-admin/storage" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_firebase_admin_storage_4664a9e0__;

/***/ }),

/***/ "firebase-functions/logger":
/*!********************************************!*\
  !*** external "firebase-functions/logger" ***!
  \********************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_firebase_functions_logger_471b9a2b__;

/***/ }),

/***/ "firebase-functions/params":
/*!********************************************!*\
  !*** external "firebase-functions/params" ***!
  \********************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_firebase_functions_params_b6cd8450__;

/***/ }),

/***/ "firebase-functions/v2/firestore":
/*!**************************************************!*\
  !*** external "firebase-functions/v2/firestore" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_firebase_functions_v2_firestore_3895e331__;

/***/ }),

/***/ "lodash-es":
/*!****************************!*\
  !*** external "lodash-es" ***!
  \****************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash_es_87a6bcbc__;

/***/ }),

/***/ "openai":
/*!*************************!*\
  !*** external "openai" ***!
  \*************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_openai__;

/***/ }),

/***/ "openai/helpers/zod":
/*!*************************************!*\
  !*** external "openai/helpers/zod" ***!
  \*************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_openai_helpers_zod_49d8105d__;

/***/ }),

/***/ "zod":
/*!**********************!*\
  !*** external "zod" ***!
  \**********************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_zod__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./functions/src/index.ts ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   triggerProcessJob: () => (/* reexport safe */ _triggers_triggerProcessJob__WEBPACK_IMPORTED_MODULE_1__.triggerProcessJob)
/* harmony export */ });
/* harmony import */ var _helpers_getBeFirestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/getBeFirestore */ "./functions/src/helpers/getBeFirestore.ts");
/* harmony import */ var _triggers_triggerProcessJob__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./triggers/triggerProcessJob */ "./functions/src/triggers/triggerProcessJob.ts");
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */



(0,_helpers_getBeFirestore__WEBPACK_IMPORTED_MODULE_0__.getBeApp)();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript


})();

var __webpack_exports__triggerProcessJob = __webpack_exports__.triggerProcessJob;
export { __webpack_exports__triggerProcessJob as triggerProcessJob };

//# sourceMappingURL=index.js.map