Mongo Collections:
    - Orders:
        - id: uuid // primary key & uniq
        - name: string
        - price: number
        - quantity: number
        - productCode: uuid // Products.code
        - customerTaxNumber: string
        - paymentMethod: PAYMENT_METHODS_ENUM - string
        - status: ORDER_ORDER_STATUS_ENUM - string
        - paid: boolean;
        - createdAt: Datetime
        - voucherCode: string
    - FailedOrders:
        - id: uuid // primary key & uniq
        - name: string
        - price: number
        - quantity: number
        - productCode: uuid // Products.code
        - customerTaxNumber: string
        - paymentMethod: PAYMENT_METHODS_ENUM - string
        - createdAt: Datetime TTL 30 days
        - failReason: string
    - Users:
        - id: uuid; // primary key & uniq
        - name: string
        - taxNumber: string // uniq and index
        - createdAt: Datetime
        - lastLogin: Datetime
        - cards?: CardsType[]
        - availableVouchers?: string[] // Vouchers.code
        - email: string
        - profilePicture?: string;
        - address: AddressType[]
        - phoneNumbers: PhoneNumbersType[]
        - history?: string[] // armazena os Orders.id do usuário
        - isActive: boolean;
        - deletionDate?: Datetime;
    - Products:
        - id: uuid; // primary key & uniq
        - name: string // index & uniq
        - displayName: string
        - brand: string
        - price: number
        - stock: number
        - logo?: string;
        - images?: string[];
        - discount?: number
        - reviews?: ReviewsType[]
        - productType: string // ProductTypes.name
        - tags: string[] // Tags.string
        - isActive: boolean;
        - deletionDate?: Datetime;
    - Tags:
        - id: uuid;
        - name: string // primary key & uniq
        - displayName: string
    - ProductTypes:
        - id: uuid;
        - name: string // primary key & uniq
        - displayName: string
    - Brands:
        - id: uuid
        - name: string // primary key & uniq
        - logo: string;
        - displayName: string
    - Vouchers:
        id: uuid;
        code: string;
        discount: number;
        expireDate: Date

ENUMS:
PAYMENT_METHODS_ENUM {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBT_CARD = 'DEBT_CARD',
    BANKSLIP = 'BANKSLIP',
    PIX = 'PIX',
}
ORDER_ORDER_STATUS_ENUM {
    NEW = 'NEW',
    WAITING_PAYMENT = 'WAITING_PAYMENT'
    PROCESSING = 'PROCESSING',
    DELIVERY = 'DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
    FAILED = 'FAILED'
}

TYPES:
CardsType {
    name: string;
    lastFourDigits: string;
    expireDate: string; // MM/yyyy
    validated: boolean;
    type: "CREDIT" | "DEBT";
    brand: string;
}
AddressType {
    street: string;
    number: string;
    complements?: string;
    reference?: string;
    city: string;
    uf: string;
    country: string;
    zipCode: string;
    default: boolean;
    isBillingAddress: boolean
}
PhoneNumbersType {
    ddd: string;
    phoneNumber: string;
    default: boolean;
}
ReviewsType {
    id: uuid;
    userId: string; // Users.id
    grade: number; // 1~5
    comment: description
}

Cart Class (saved on Redis) { // a key dele é CART/ORDER/${userId}
    orderId: string;
    price: number;
    quantity: number;
    createdAt: Datetime;
    orderStatus: string;
    orderLogo: string;
}

Notification Class (pub/sub on Redis) { // a key dele é NOTIFICATION/${userId}
    notificationId: string;
    message: string;
    isImportant: boolean;
}

APP API ():
    - Endpoint CreateOrder (POST)[orders.controller]:
        - map order using automapper
        - add bull on single queue (ingestion)
            - validates order with fluent-validation:
            - add on command handler (commandBus):
            - If Ok SaveNewOrderCommand:
                - Saves on mongodb the order with status: NEW_ORDER
                - if(order.paid is true)
                    - updates order.status to PROCESSING
                    - send to sqs (order-management-queue)
            - If not ok SaveFailedOrderCommand:
                - save to different collection "failed_orders" with ttl
    - Endpoint CancelOrder (DELETE)[orders.controller]:
        - receives orderId
        - verifies if orderId belongs to userId (based on jwt) or if status is not "ON_THE_WAY", "DELIVERED", "CANCELED", "FAILED"
        - update order to CANCELED
    - Endpoint PaymentReturn (PUT)[orders.controller]:
        - receives orderId, userId, paymentType
        - send to new command handler (commandBus) PaymentCallBackCommand:
            - updates order.paid and order.status to PROCESSING
            - send to sqs queue (order-management-queue)
    - Endpoint Find (GET)[orders.controller]:
        - return order based on filters
    - Endpoint FindOne (GET)[orders.controller]:
        - return one order based on id
    - Endpoint getPaginated (GET)[orders.controller]:
        - return paginated orders based on filters

    - Endpoint GetCart (GET) [cart.controller]; //integrates with redis, not mongo
        - get cart by userId
    - Endpoint EmptyCart (DELETE) [cart.controller]; //integrates with redis, not mongo
        - delete cart by userId

    - WebSocket GetNotifications (GET) [notifications.controller]; //integrates with redis, not mongo
        - get notifications by userId

    - Endpoint CreateUser (POST)[users.controller]:
        - validates if email and taxNumber already exists
        - create user
    - Endpoint EditUser (PUT)[users.controller]:
        - validates if email and taxNumber exists and if userId from token belongs to 
        - edit user
    - Endpoint Find (GET)[users.controller]:
        - return user based on filters
    - Endpoint FindOne (GET)[users.controller]:
        - return one user based on id
    - Endpoint getPaginated (GET)[users.controller]:
        - return paginated users based on filters


    - Endpoint CreateProduct (POST)[products.controller]:
        - create product
    - Endpoint EditProduct (PUT)[products.controller]:
        - edit product
    - Endpoint DeleteProduct (DELETE)[products.controller]:
        - delete product
    - Endpoint PostReview (POST)[products.controller]:
        - push review on product object
    - Endpoint Find (GET)[products.controller]:
        - return products based on filters
    - Endpoint FindAll (GET)[products.controller]:
        - return all products based on id
    - Endpoint getPaginated (GET)[products.controller]:
        - return paginated products based on filters

    - Endpoint CreateType (POST)[product-types.controller]:
        - create product-types
    - Endpoint EditProductType (PUT)[product-types.controller]:
        - edit product-types
    - Endpoint DeleteProductType (DELETE)[product-types.controller]:
        - delete product-types
    - Endpoint Find (GET)[product-types.controller]:
        - return product-types based on filters
    - Endpoint FindAll (GET)[product-types.controller]:
        - return all product-types based on id
    - Endpoint getPaginated (GET)[product-types.controller]:
        - return paginated product-types based on filters

    - Endpoint CreateBrands (POST)[brands.controller]:
        - create brands
    - Endpoint EditBrands (PUT)[brands.controller]:
        - edit brands
    - Endpoint DeleteBrands (DELETE)[brands.controller]:
        - delete brands
    - Endpoint Find (GET)[brands.controller]:
        - return brands based on filters
    - Endpoint FindAll (GET)[brands.controller]:
        - return all brands based on id
    - Endpoint getPaginated (GET)[brands.controller]:
        - return paginated brands based on filters

    - Endpoint CreateTag (POST)[tags.controller]:
        - create tags
    - Endpoint DeleteTag  (DELETE)[tags.controller]:
        - delete tags
    - Endpoint Find (GET)[tags.controller]:
        - return tags based on filters
    - Endpoint FindAll (GET)[tags.controller]:
        - return all tags based on id
    - Endpoint getPaginated (GET)[tags.controller]:
        - return paginated tags based on filters
