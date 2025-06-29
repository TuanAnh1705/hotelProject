
/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */

Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.9.0
 * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
 */
Prisma.prismaVersion = {
  client: "6.9.0",
  engine: "81e4af48011447c3cc503a190e86995b66d2a28e"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone'
};

exports.Prisma.HotelScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  city: 'city',
  imageUrl: 'imageUrl',
  rating: 'rating'
};

exports.Prisma.RoomScalarFieldEnum = {
  id: 'id',
  hotelId: 'hotelId',
  price: 'price',
  availability: 'availability',
  roomType: 'roomType',
  imageUrl: 'imageUrl'
};

exports.Prisma.BookingStatusScalarFieldEnum = {
  id: 'id',
  statusName: 'statusName'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  roomId: 'roomId',
  statusId: 'statusId',
  checkIn: 'checkIn',
  checkOut: 'checkOut',
  totalPrice: 'totalPrice'
};

exports.Prisma.ServiceScalarFieldEnum = {
  id: 'id',
  serviceName: 'serviceName',
  price: 'price'
};

exports.Prisma.BookingServiceScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  serviceId: 'serviceId',
  quantity: 'quantity'
};

exports.Prisma.EmployeeRoleScalarFieldEnum = {
  id: 'id',
  roleName: 'roleName',
  description: 'description'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  departmentName: 'departmentName'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  departmentId: 'departmentId',
  name: 'name',
  position: 'position',
  salary: 'salary'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  amount: 'amount',
  paymentDate: 'paymentDate',
  paymentMethod: 'paymentMethod'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  hotelId: 'hotelId',
  rating: 'rating',
  comments: 'comments',
  reviewDate: 'reviewDate'
};

exports.Prisma.PromotionScalarFieldEnum = {
  id: 'id',
  description: 'description',
  discount: 'discount',
  startDate: 'startDate',
  endDate: 'endDate'
};

exports.Prisma.RoomAmenityScalarFieldEnum = {
  id: 'id',
  amenityName: 'amenityName',
  description: 'description'
};

exports.Prisma.HotelAmenityScalarFieldEnum = {
  id: 'id',
  amenityName: 'amenityName',
  description: 'description',
  icon: 'icon'
};

exports.Prisma.HotelPolicyScalarFieldEnum = {
  id: 'id',
  hotelId: 'hotelId',
  policyDescription: 'policyDescription'
};

exports.Prisma.PromotionAppliedScalarFieldEnum = {
  id: 'id',
  promotionId: 'promotionId',
  bookingId: 'bookingId'
};

exports.Prisma.ActivityLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  logDate: 'logDate'
};

exports.Prisma.HotelEventScalarFieldEnum = {
  id: 'id',
  hotelId: 'hotelId',
  eventName: 'eventName',
  eventDate: 'eventDate',
  description: 'description'
};

exports.Prisma.SystemNotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  message: 'message',
  notificationDate: 'notificationDate'
};

exports.Prisma.RoomAmenitiesLinkScalarFieldEnum = {
  id: 'id',
  roomId: 'roomId',
  amenityId: 'amenityId'
};

exports.Prisma.HotelAmenitiesLinkScalarFieldEnum = {
  id: 'id',
  hotelId: 'hotelId',
  amenityId: 'amenityId'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  customerId: 'customerId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.CustomerOrderByRelevanceFieldEnum = {
  name: 'name',
  email: 'email',
  phone: 'phone'
};

exports.Prisma.HotelOrderByRelevanceFieldEnum = {
  name: 'name',
  address: 'address',
  city: 'city',
  imageUrl: 'imageUrl'
};

exports.Prisma.RoomOrderByRelevanceFieldEnum = {
  roomType: 'roomType',
  imageUrl: 'imageUrl'
};

exports.Prisma.BookingStatusOrderByRelevanceFieldEnum = {
  statusName: 'statusName'
};

exports.Prisma.ServiceOrderByRelevanceFieldEnum = {
  serviceName: 'serviceName'
};

exports.Prisma.EmployeeRoleOrderByRelevanceFieldEnum = {
  roleName: 'roleName',
  description: 'description'
};

exports.Prisma.DepartmentOrderByRelevanceFieldEnum = {
  departmentName: 'departmentName'
};

exports.Prisma.EmployeeOrderByRelevanceFieldEnum = {
  name: 'name',
  position: 'position'
};

exports.Prisma.PaymentOrderByRelevanceFieldEnum = {
  paymentMethod: 'paymentMethod'
};

exports.Prisma.ReviewOrderByRelevanceFieldEnum = {
  comments: 'comments'
};

exports.Prisma.PromotionOrderByRelevanceFieldEnum = {
  description: 'description'
};

exports.Prisma.RoomAmenityOrderByRelevanceFieldEnum = {
  amenityName: 'amenityName',
  description: 'description'
};

exports.Prisma.HotelAmenityOrderByRelevanceFieldEnum = {
  amenityName: 'amenityName',
  description: 'description',
  icon: 'icon'
};

exports.Prisma.HotelPolicyOrderByRelevanceFieldEnum = {
  policyDescription: 'policyDescription'
};

exports.Prisma.ActivityLogOrderByRelevanceFieldEnum = {
  action: 'action'
};

exports.Prisma.HotelEventOrderByRelevanceFieldEnum = {
  eventName: 'eventName',
  description: 'description'
};

exports.Prisma.SystemNotificationOrderByRelevanceFieldEnum = {
  message: 'message'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  email: 'email',
  password: 'password',
  name: 'name'
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

exports.Prisma.ModelName = {
  Customer: 'Customer',
  Hotel: 'Hotel',
  Room: 'Room',
  BookingStatus: 'BookingStatus',
  Booking: 'Booking',
  Service: 'Service',
  BookingService: 'BookingService',
  EmployeeRole: 'EmployeeRole',
  Department: 'Department',
  Employee: 'Employee',
  Payment: 'Payment',
  Review: 'Review',
  Promotion: 'Promotion',
  RoomAmenity: 'RoomAmenity',
  HotelAmenity: 'HotelAmenity',
  HotelPolicy: 'HotelPolicy',
  PromotionApplied: 'PromotionApplied',
  ActivityLog: 'ActivityLog',
  HotelEvent: 'HotelEvent',
  SystemNotification: 'SystemNotification',
  RoomAmenitiesLink: 'RoomAmenitiesLink',
  HotelAmenitiesLink: 'HotelAmenitiesLink',
  User: 'User'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
