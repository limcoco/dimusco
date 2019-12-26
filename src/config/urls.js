export default {
  'library-read': 'account/libraries/',
  'composer-read': 'item/composer/',
  'category-read': 'item/category/',
  'edition-read': 'item/edition/',
  'instrument-read': 'item/instrument/',

  'ensemble-create': 'account/ensemble/register/',
  'ensemble-read': 'account/ensemble/',
  'ensemble-active': 'account/ensemble/auth/',
  'ensemble-members': 'account/ensemble/{}/read/',
  'ensemble-remove': 'account/ensemble/delete/',
  'ensemble-update': 'account/ensemble/update/',
  'account-details': 'account/details/',
  'account-contacts': 'account/contact/',
  'delete-contact': 'account/contact/{}/',
  'update-contact': 'account/contact/{}/',
  'get-group-contacts': 'account/contact-group-members/?cgid={}',
  'create-invitation': 'account/invitation-bulk/',
  'invitation' : 'account/invitation/',
  'institution-remove': 'account/institution/delete/',
  'institution-update': 'account/institution/update/',

  'publisher-remove': 'account/publisher/delete/',
  'publisher-update': 'account/publisher/update/',
  'account-update': 'account/update/',
  'language-read': 'system/page/content/',
  'language-list': 'system/langcur/',
  countries: 'system/country/',

  'purchase-read': 'item/purchase/list/',
  'library-publisher-read': 'item/purchase/list/',
  'purchase-assigned-read': 'item/assignment/list/{}/',
  'purchase-assign': 'item/score/assign/',
  // "purchase-score-delete"  : "item/score/assign/?pid={}",
  'purchase-score-delete': 'item/assignment/list/{}/',
  'purchase-unassign': 'item/score/assign/?assignment={}',

  'permission-read': 'account/permission/',
  'group-detail': 'account/group/details/{}/',
  'group-permission-add-remove': 'account/group/permission/{}/',

  // Paypal
  'deposit-option': 'payment/deposite/options/',
  'paypal-create': 'payment/deposite/paypal/create/',
  'paypal-execute': 'payment/deposite/paypal/execute/',

  // Trial
  'check-trial': 'system/trial/{}/',

  // Offer list
  'read-offer_1': 'item/score/loved/',
  'read-offer_2': 'item/score/new/',
  'read-offer_3': 'item/score/offered/',
  'read-offer': 'item/hot/',

  // Set Price
  'read-score-price': 'item/scores/price/get/',
  'read-price-dr': 'item/score/price/daily-rate/',
  'create-price-dr': 'item/score/price/daily-rate/',
  'update-price-dr': 'item/score/price/daily-rate/',
  'delete-price-dr': 'item/score/price/daily-rate/',

  'read-price-otp': 'item/score/price/one-time-price/',
  'create-price-otp': 'item/score/price/one-time-price/',
  'update-price-otp': 'item/score/price/one-time-price/',
  'delete-price-otp': 'item/score/price/one-time-price/',

  'read-price-institution': 'item/score/price/instituion-set-price/',
  'create-price-institution': 'item/score/price/instituion-set-price/register/',
  'update-price-institution':
    'item/score/price/instituion-set-price/update/{}/',
  'delete-price-institution':
    'item/score/price/instituion-set-price/delete/{}/',

  // Set Discount
  'read-price-so': 'item/score/price/special-offer/',
  'create-price-so': 'item/score/price/special-offer/register/',
  'update-price-so': 'item/score/price/special-offer/update/{}/',
  'delete-price-so': 'item/score/price/special-offer/delete/{}/',

  //Score Upload
  'read-score-upload': 'item/score/getuploads/',
  'delete-score-upload': '/item/score/delete/{}/',

  //Pub Library
  'read-pub-library': 'item/score/publibrary/',

  // Upload
  upload: 'item/pdf/upload/bulk/',

  'dr-bulk': 'item/score/price/daily-rate/bulk/',
  'otp-bulk': 'item/score/price/one-time-price/bulk/',
  'so-bulk': 'item/score/price/special-offer/bulk/',

  // Payment Method
  'add-payment-method': 'account/payment-method/register/',
  'read-payment-method': 'account/payment-method/',
  'set-primary-payment': 'account/payment-method/primary/',
  'delete-payment-method': 'account/payment-method/delete/{}/',

  // Layer
  'read-layer': 'account/layer/',
  'layer-read-assignment': 'account/layer/assign/?lid={}',
  'register-layer': 'account/layer/register/',
  'layer-assign': 'account/layer/assign/',
  'layer-unassign-group': 'account/layer/assign/delete/{}/',
  'layer-unassign-master': 'account/layer/assign/?lid={}',
  'delete-layer': 'account/layer/delete/?',
  'update-layer': 'account/layer/update/?',

  'institution-order': 'item/purchase/',
  'institution-order-list': 'item/score/cart/summary/',

  'check-token': 'account/token/check/',

  'get-payer-id': 'payment/purchase/request/',
  'item-purchase': 'item/purchase/',
  // deposit
  'create-deposit': 'account/payment/deposit/paypal/create/',
  'execute-deposit': 'account/payment/deposit/paypal/execute/',
  'account-deposit': 'account/payment/deposit/card/',
  // addresses
  'get-addresses': 'account/address/list/',
  'register-address': 'account/address/register/',
  'update-address': 'account/address/update/{}/',
  'delete-address': 'account/address/delete/{}/',
  'set-default-address': 'account/address/set-default/{}/',
  'update-interests': 'account/auto-distribution/register/',

  'get-inst-pub-contract-list': 'account/publisher-institution-contract/list/',
  'create-contract': 'account/publisher-institution-contract/create/',
  'get-contacts' : 'account/publisher-institution-contract/history/',

  interests: 'item/interests/all/',

  // Scores
  'get-scores': 'item/score/',
  'get-score': 'item/score/detail/',
  'get-score-copy': 'item/score-detail/',

  // cart
  'get-cart-scores': 'item/score/cart/summary/',

  // remembered products
  'create-list' : 'item/memlist/',
  'delete-list' : 'item/memlist/{}/',
  'add-product-toList' : 'item/memlist-scores/',
  'get-list-detail' : 'item/memlist-scores/',
  'get-import-log' : 'account/publisher/importlog/',
  'productions' : 'item/production/',
  'production-group-list' : 'item/production-group-list/{}/',
  'production-library' : 'item/production-library/',
  'create-group' : 'account/group/register/',
  'group-members' : 'account/group/member/{}/',
  'score-copy' : 'item/score/copy/',
  'related-scores' : 'item/score/modify/',
  'score-pages' : 'item/score/pages/',
  'order-score-pages' : 'item/score/pages/move/',
  'copy-score-page' : 'item/score/pages/copy/',
  'score-page' : 'item/score/page/',
  'update-title' : 'item/score/update-title/',
  'virtual-score-libraries' : 'account/virtual-score-libraries/',
  'has-contract' : 'item/play/has-contract/',
  'production-virtual-score-library' : 'item/production-virtual-score-library/',
  'production-groups' : 'item/production-assign-score/',
  'production-unassign-groups' : 'item/production-assign-score/?assignment={}',
  'import' : 'account/groups/import/',
  'export' : 'account/groups/export/',
  'add-blank' : 'item/score/pages/add-blank/',
  'remove-blank' : 'item/score/pages/remove-blank/',
  'contacts-groups' : 'account/contact-group/',
  'contacts-group' : 'account/contact-group/{}/',
  'contact-group-members' : 'account/contact-group-members/',

  'production-group-copy' : 'item/production-group-copy-into/',

  'contacts-import' : 'account/contacts/import/',
  'contacts-export': 'account/contacts/export/',

  'ticket' : 'item/ticket/',
  'single-ticket' : 'item/ticket/history/{}/',
  'update-group' : 'account/group/update/{}/',
  'update-contact-group' : 'account/contact-group/{}/',
  'score-library': 'item/score/library/',
  'update-score' : 'item/score/update/{}/',
  'update-score-bulk' : 'item/score/update-bulk/',

  'update-upload' : 'item/pdf/upload/meta-data/',
  'authorities' : 'item/authorities/',
  'authority-replace' : 'item/authority-replace/',
  'delete-authority' : 'item/authority/{}/'
};
