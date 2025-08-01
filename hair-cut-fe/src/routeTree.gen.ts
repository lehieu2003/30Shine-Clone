/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AdminImport } from './routes/admin'
import { Route as LayoutImport } from './routes/_layout'
import { Route as AdminIndexImport } from './routes/admin/index'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutWeddingImport } from './routes/_layout/wedding'
import { Route as LayoutTestHairImport } from './routes/_layout/test-hair'
import { Route as LayoutProfileImport } from './routes/_layout/profile'
import { Route as LayoutPartnersImport } from './routes/_layout/partners'
import { Route as LayoutMyBookingsImport } from './routes/_layout/my-bookings'
import { Route as LayoutLocationsImport } from './routes/_layout/locations'
import { Route as LayoutFranchiseImport } from './routes/_layout/franchise'
import { Route as LayoutBookingImport } from './routes/_layout/booking'
import { Route as LayoutAboutImport } from './routes/_layout/about'
import { Route as AdminStaffIndexImport } from './routes/admin/staff/index'
import { Route as AdminServicesIndexImport } from './routes/admin/services/index'
import { Route as AdminReportIndexImport } from './routes/admin/report/index'
import { Route as AdminProductsIndexImport } from './routes/admin/products/index'
import { Route as AdminCustomersIndexImport } from './routes/admin/customers/index'
import { Route as AdminBranchesIndexImport } from './routes/admin/branches/index'
import { Route as AdminBookingsIndexImport } from './routes/admin/bookings/index'
import { Route as LayoutShoppingIndexImport } from './routes/_layout/shopping/index'
import { Route as LayoutServicesHairCutIndexImport } from './routes/_layout/services/hair-cut/index'
import { Route as AdminServicesIdEditImport } from './routes/admin/services/$id.edit'
import { Route as LayoutShoppingProductIdImport } from './routes/_layout/shopping/product/$id'
import { Route as LayoutShoppingCartCartImport } from './routes/_layout/shopping/cart/cart'
import { Route as LayoutServicesHairCutIdImport } from './routes/_layout/services/hair-cut/$id'
import { Route as LayoutShoppingCartPaymentMomoImport } from './routes/_layout/shopping/cart/payment/momo'

// Create/Update Routes

const AdminRoute = AdminImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AdminRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutWeddingRoute = LayoutWeddingImport.update({
  id: '/wedding',
  path: '/wedding',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTestHairRoute = LayoutTestHairImport.update({
  id: '/test-hair',
  path: '/test-hair',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutProfileRoute = LayoutProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutPartnersRoute = LayoutPartnersImport.update({
  id: '/partners',
  path: '/partners',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutMyBookingsRoute = LayoutMyBookingsImport.update({
  id: '/my-bookings',
  path: '/my-bookings',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutLocationsRoute = LayoutLocationsImport.update({
  id: '/locations',
  path: '/locations',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutFranchiseRoute = LayoutFranchiseImport.update({
  id: '/franchise',
  path: '/franchise',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutBookingRoute = LayoutBookingImport.update({
  id: '/booking',
  path: '/booking',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAboutRoute = LayoutAboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => LayoutRoute,
} as any)

const AdminStaffIndexRoute = AdminStaffIndexImport.update({
  id: '/staff/',
  path: '/staff/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminServicesIndexRoute = AdminServicesIndexImport.update({
  id: '/services/',
  path: '/services/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminReportIndexRoute = AdminReportIndexImport.update({
  id: '/report/',
  path: '/report/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminProductsIndexRoute = AdminProductsIndexImport.update({
  id: '/products/',
  path: '/products/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminCustomersIndexRoute = AdminCustomersIndexImport.update({
  id: '/customers/',
  path: '/customers/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminBranchesIndexRoute = AdminBranchesIndexImport.update({
  id: '/branches/',
  path: '/branches/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminBookingsIndexRoute = AdminBookingsIndexImport.update({
  id: '/bookings/',
  path: '/bookings/',
  getParentRoute: () => AdminRoute,
} as any)

const LayoutShoppingIndexRoute = LayoutShoppingIndexImport.update({
  id: '/shopping/',
  path: '/shopping/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutServicesHairCutIndexRoute = LayoutServicesHairCutIndexImport.update(
  {
    id: '/services/hair-cut/',
    path: '/services/hair-cut/',
    getParentRoute: () => LayoutRoute,
  } as any,
)

const AdminServicesIdEditRoute = AdminServicesIdEditImport.update({
  id: '/services/$id/edit',
  path: '/services/$id/edit',
  getParentRoute: () => AdminRoute,
} as any)

const LayoutShoppingProductIdRoute = LayoutShoppingProductIdImport.update({
  id: '/shopping/product/$id',
  path: '/shopping/product/$id',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutShoppingCartCartRoute = LayoutShoppingCartCartImport.update({
  id: '/shopping/cart/cart',
  path: '/shopping/cart/cart',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutServicesHairCutIdRoute = LayoutServicesHairCutIdImport.update({
  id: '/services/hair-cut/$id',
  path: '/services/hair-cut/$id',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutShoppingCartPaymentMomoRoute =
  LayoutShoppingCartPaymentMomoImport.update({
    id: '/shopping/cart/payment/momo',
    path: '/shopping/cart/payment/momo',
    getParentRoute: () => LayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/_layout/about': {
      id: '/_layout/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof LayoutAboutImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/booking': {
      id: '/_layout/booking'
      path: '/booking'
      fullPath: '/booking'
      preLoaderRoute: typeof LayoutBookingImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/franchise': {
      id: '/_layout/franchise'
      path: '/franchise'
      fullPath: '/franchise'
      preLoaderRoute: typeof LayoutFranchiseImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/locations': {
      id: '/_layout/locations'
      path: '/locations'
      fullPath: '/locations'
      preLoaderRoute: typeof LayoutLocationsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/my-bookings': {
      id: '/_layout/my-bookings'
      path: '/my-bookings'
      fullPath: '/my-bookings'
      preLoaderRoute: typeof LayoutMyBookingsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/partners': {
      id: '/_layout/partners'
      path: '/partners'
      fullPath: '/partners'
      preLoaderRoute: typeof LayoutPartnersImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/profile': {
      id: '/_layout/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof LayoutProfileImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/test-hair': {
      id: '/_layout/test-hair'
      path: '/test-hair'
      fullPath: '/test-hair'
      preLoaderRoute: typeof LayoutTestHairImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/wedding': {
      id: '/_layout/wedding'
      path: '/wedding'
      fullPath: '/wedding'
      preLoaderRoute: typeof LayoutWeddingImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/admin/': {
      id: '/admin/'
      path: '/'
      fullPath: '/admin/'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof AdminImport
    }
    '/_layout/shopping/': {
      id: '/_layout/shopping/'
      path: '/shopping'
      fullPath: '/shopping'
      preLoaderRoute: typeof LayoutShoppingIndexImport
      parentRoute: typeof LayoutImport
    }
    '/admin/bookings/': {
      id: '/admin/bookings/'
      path: '/bookings'
      fullPath: '/admin/bookings'
      preLoaderRoute: typeof AdminBookingsIndexImport
      parentRoute: typeof AdminImport
    }
    '/admin/branches/': {
      id: '/admin/branches/'
      path: '/branches'
      fullPath: '/admin/branches'
      preLoaderRoute: typeof AdminBranchesIndexImport
      parentRoute: typeof AdminImport
    }
    '/admin/customers/': {
      id: '/admin/customers/'
      path: '/customers'
      fullPath: '/admin/customers'
      preLoaderRoute: typeof AdminCustomersIndexImport
      parentRoute: typeof AdminImport
    }
    '/admin/products/': {
      id: '/admin/products/'
      path: '/products'
      fullPath: '/admin/products'
      preLoaderRoute: typeof AdminProductsIndexImport
      parentRoute: typeof AdminImport
    }
    '/admin/report/': {
      id: '/admin/report/'
      path: '/report'
      fullPath: '/admin/report'
      preLoaderRoute: typeof AdminReportIndexImport
      parentRoute: typeof AdminImport
    }
    '/admin/services/': {
      id: '/admin/services/'
      path: '/services'
      fullPath: '/admin/services'
      preLoaderRoute: typeof AdminServicesIndexImport
      parentRoute: typeof AdminImport
    }
    '/admin/staff/': {
      id: '/admin/staff/'
      path: '/staff'
      fullPath: '/admin/staff'
      preLoaderRoute: typeof AdminStaffIndexImport
      parentRoute: typeof AdminImport
    }
    '/_layout/services/hair-cut/$id': {
      id: '/_layout/services/hair-cut/$id'
      path: '/services/hair-cut/$id'
      fullPath: '/services/hair-cut/$id'
      preLoaderRoute: typeof LayoutServicesHairCutIdImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/shopping/cart/cart': {
      id: '/_layout/shopping/cart/cart'
      path: '/shopping/cart/cart'
      fullPath: '/shopping/cart/cart'
      preLoaderRoute: typeof LayoutShoppingCartCartImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/shopping/product/$id': {
      id: '/_layout/shopping/product/$id'
      path: '/shopping/product/$id'
      fullPath: '/shopping/product/$id'
      preLoaderRoute: typeof LayoutShoppingProductIdImport
      parentRoute: typeof LayoutImport
    }
    '/admin/services/$id/edit': {
      id: '/admin/services/$id/edit'
      path: '/services/$id/edit'
      fullPath: '/admin/services/$id/edit'
      preLoaderRoute: typeof AdminServicesIdEditImport
      parentRoute: typeof AdminImport
    }
    '/_layout/services/hair-cut/': {
      id: '/_layout/services/hair-cut/'
      path: '/services/hair-cut'
      fullPath: '/services/hair-cut'
      preLoaderRoute: typeof LayoutServicesHairCutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/shopping/cart/payment/momo': {
      id: '/_layout/shopping/cart/payment/momo'
      path: '/shopping/cart/payment/momo'
      fullPath: '/shopping/cart/payment/momo'
      preLoaderRoute: typeof LayoutShoppingCartPaymentMomoImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutAboutRoute: typeof LayoutAboutRoute
  LayoutBookingRoute: typeof LayoutBookingRoute
  LayoutFranchiseRoute: typeof LayoutFranchiseRoute
  LayoutLocationsRoute: typeof LayoutLocationsRoute
  LayoutMyBookingsRoute: typeof LayoutMyBookingsRoute
  LayoutPartnersRoute: typeof LayoutPartnersRoute
  LayoutProfileRoute: typeof LayoutProfileRoute
  LayoutTestHairRoute: typeof LayoutTestHairRoute
  LayoutWeddingRoute: typeof LayoutWeddingRoute
  LayoutIndexRoute: typeof LayoutIndexRoute
  LayoutShoppingIndexRoute: typeof LayoutShoppingIndexRoute
  LayoutServicesHairCutIdRoute: typeof LayoutServicesHairCutIdRoute
  LayoutShoppingCartCartRoute: typeof LayoutShoppingCartCartRoute
  LayoutShoppingProductIdRoute: typeof LayoutShoppingProductIdRoute
  LayoutServicesHairCutIndexRoute: typeof LayoutServicesHairCutIndexRoute
  LayoutShoppingCartPaymentMomoRoute: typeof LayoutShoppingCartPaymentMomoRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutAboutRoute: LayoutAboutRoute,
  LayoutBookingRoute: LayoutBookingRoute,
  LayoutFranchiseRoute: LayoutFranchiseRoute,
  LayoutLocationsRoute: LayoutLocationsRoute,
  LayoutMyBookingsRoute: LayoutMyBookingsRoute,
  LayoutPartnersRoute: LayoutPartnersRoute,
  LayoutProfileRoute: LayoutProfileRoute,
  LayoutTestHairRoute: LayoutTestHairRoute,
  LayoutWeddingRoute: LayoutWeddingRoute,
  LayoutIndexRoute: LayoutIndexRoute,
  LayoutShoppingIndexRoute: LayoutShoppingIndexRoute,
  LayoutServicesHairCutIdRoute: LayoutServicesHairCutIdRoute,
  LayoutShoppingCartCartRoute: LayoutShoppingCartCartRoute,
  LayoutShoppingProductIdRoute: LayoutShoppingProductIdRoute,
  LayoutServicesHairCutIndexRoute: LayoutServicesHairCutIndexRoute,
  LayoutShoppingCartPaymentMomoRoute: LayoutShoppingCartPaymentMomoRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

interface AdminRouteChildren {
  AdminIndexRoute: typeof AdminIndexRoute
  AdminBookingsIndexRoute: typeof AdminBookingsIndexRoute
  AdminBranchesIndexRoute: typeof AdminBranchesIndexRoute
  AdminCustomersIndexRoute: typeof AdminCustomersIndexRoute
  AdminProductsIndexRoute: typeof AdminProductsIndexRoute
  AdminReportIndexRoute: typeof AdminReportIndexRoute
  AdminServicesIndexRoute: typeof AdminServicesIndexRoute
  AdminStaffIndexRoute: typeof AdminStaffIndexRoute
  AdminServicesIdEditRoute: typeof AdminServicesIdEditRoute
}

const AdminRouteChildren: AdminRouteChildren = {
  AdminIndexRoute: AdminIndexRoute,
  AdminBookingsIndexRoute: AdminBookingsIndexRoute,
  AdminBranchesIndexRoute: AdminBranchesIndexRoute,
  AdminCustomersIndexRoute: AdminCustomersIndexRoute,
  AdminProductsIndexRoute: AdminProductsIndexRoute,
  AdminReportIndexRoute: AdminReportIndexRoute,
  AdminServicesIndexRoute: AdminServicesIndexRoute,
  AdminStaffIndexRoute: AdminStaffIndexRoute,
  AdminServicesIdEditRoute: AdminServicesIdEditRoute,
}

const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/admin': typeof AdminRouteWithChildren
  '/about': typeof LayoutAboutRoute
  '/booking': typeof LayoutBookingRoute
  '/franchise': typeof LayoutFranchiseRoute
  '/locations': typeof LayoutLocationsRoute
  '/my-bookings': typeof LayoutMyBookingsRoute
  '/partners': typeof LayoutPartnersRoute
  '/profile': typeof LayoutProfileRoute
  '/test-hair': typeof LayoutTestHairRoute
  '/wedding': typeof LayoutWeddingRoute
  '/': typeof LayoutIndexRoute
  '/admin/': typeof AdminIndexRoute
  '/shopping': typeof LayoutShoppingIndexRoute
  '/admin/bookings': typeof AdminBookingsIndexRoute
  '/admin/branches': typeof AdminBranchesIndexRoute
  '/admin/customers': typeof AdminCustomersIndexRoute
  '/admin/products': typeof AdminProductsIndexRoute
  '/admin/report': typeof AdminReportIndexRoute
  '/admin/services': typeof AdminServicesIndexRoute
  '/admin/staff': typeof AdminStaffIndexRoute
  '/services/hair-cut/$id': typeof LayoutServicesHairCutIdRoute
  '/shopping/cart/cart': typeof LayoutShoppingCartCartRoute
  '/shopping/product/$id': typeof LayoutShoppingProductIdRoute
  '/admin/services/$id/edit': typeof AdminServicesIdEditRoute
  '/services/hair-cut': typeof LayoutServicesHairCutIndexRoute
  '/shopping/cart/payment/momo': typeof LayoutShoppingCartPaymentMomoRoute
}

export interface FileRoutesByTo {
  '/about': typeof LayoutAboutRoute
  '/booking': typeof LayoutBookingRoute
  '/franchise': typeof LayoutFranchiseRoute
  '/locations': typeof LayoutLocationsRoute
  '/my-bookings': typeof LayoutMyBookingsRoute
  '/partners': typeof LayoutPartnersRoute
  '/profile': typeof LayoutProfileRoute
  '/test-hair': typeof LayoutTestHairRoute
  '/wedding': typeof LayoutWeddingRoute
  '/': typeof LayoutIndexRoute
  '/admin': typeof AdminIndexRoute
  '/shopping': typeof LayoutShoppingIndexRoute
  '/admin/bookings': typeof AdminBookingsIndexRoute
  '/admin/branches': typeof AdminBranchesIndexRoute
  '/admin/customers': typeof AdminCustomersIndexRoute
  '/admin/products': typeof AdminProductsIndexRoute
  '/admin/report': typeof AdminReportIndexRoute
  '/admin/services': typeof AdminServicesIndexRoute
  '/admin/staff': typeof AdminStaffIndexRoute
  '/services/hair-cut/$id': typeof LayoutServicesHairCutIdRoute
  '/shopping/cart/cart': typeof LayoutShoppingCartCartRoute
  '/shopping/product/$id': typeof LayoutShoppingProductIdRoute
  '/admin/services/$id/edit': typeof AdminServicesIdEditRoute
  '/services/hair-cut': typeof LayoutServicesHairCutIndexRoute
  '/shopping/cart/payment/momo': typeof LayoutShoppingCartPaymentMomoRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/admin': typeof AdminRouteWithChildren
  '/_layout/about': typeof LayoutAboutRoute
  '/_layout/booking': typeof LayoutBookingRoute
  '/_layout/franchise': typeof LayoutFranchiseRoute
  '/_layout/locations': typeof LayoutLocationsRoute
  '/_layout/my-bookings': typeof LayoutMyBookingsRoute
  '/_layout/partners': typeof LayoutPartnersRoute
  '/_layout/profile': typeof LayoutProfileRoute
  '/_layout/test-hair': typeof LayoutTestHairRoute
  '/_layout/wedding': typeof LayoutWeddingRoute
  '/_layout/': typeof LayoutIndexRoute
  '/admin/': typeof AdminIndexRoute
  '/_layout/shopping/': typeof LayoutShoppingIndexRoute
  '/admin/bookings/': typeof AdminBookingsIndexRoute
  '/admin/branches/': typeof AdminBranchesIndexRoute
  '/admin/customers/': typeof AdminCustomersIndexRoute
  '/admin/products/': typeof AdminProductsIndexRoute
  '/admin/report/': typeof AdminReportIndexRoute
  '/admin/services/': typeof AdminServicesIndexRoute
  '/admin/staff/': typeof AdminStaffIndexRoute
  '/_layout/services/hair-cut/$id': typeof LayoutServicesHairCutIdRoute
  '/_layout/shopping/cart/cart': typeof LayoutShoppingCartCartRoute
  '/_layout/shopping/product/$id': typeof LayoutShoppingProductIdRoute
  '/admin/services/$id/edit': typeof AdminServicesIdEditRoute
  '/_layout/services/hair-cut/': typeof LayoutServicesHairCutIndexRoute
  '/_layout/shopping/cart/payment/momo': typeof LayoutShoppingCartPaymentMomoRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/admin'
    | '/about'
    | '/booking'
    | '/franchise'
    | '/locations'
    | '/my-bookings'
    | '/partners'
    | '/profile'
    | '/test-hair'
    | '/wedding'
    | '/'
    | '/admin/'
    | '/shopping'
    | '/admin/bookings'
    | '/admin/branches'
    | '/admin/customers'
    | '/admin/products'
    | '/admin/report'
    | '/admin/services'
    | '/admin/staff'
    | '/services/hair-cut/$id'
    | '/shopping/cart/cart'
    | '/shopping/product/$id'
    | '/admin/services/$id/edit'
    | '/services/hair-cut'
    | '/shopping/cart/payment/momo'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/about'
    | '/booking'
    | '/franchise'
    | '/locations'
    | '/my-bookings'
    | '/partners'
    | '/profile'
    | '/test-hair'
    | '/wedding'
    | '/'
    | '/admin'
    | '/shopping'
    | '/admin/bookings'
    | '/admin/branches'
    | '/admin/customers'
    | '/admin/products'
    | '/admin/report'
    | '/admin/services'
    | '/admin/staff'
    | '/services/hair-cut/$id'
    | '/shopping/cart/cart'
    | '/shopping/product/$id'
    | '/admin/services/$id/edit'
    | '/services/hair-cut'
    | '/shopping/cart/payment/momo'
  id:
    | '__root__'
    | '/_layout'
    | '/admin'
    | '/_layout/about'
    | '/_layout/booking'
    | '/_layout/franchise'
    | '/_layout/locations'
    | '/_layout/my-bookings'
    | '/_layout/partners'
    | '/_layout/profile'
    | '/_layout/test-hair'
    | '/_layout/wedding'
    | '/_layout/'
    | '/admin/'
    | '/_layout/shopping/'
    | '/admin/bookings/'
    | '/admin/branches/'
    | '/admin/customers/'
    | '/admin/products/'
    | '/admin/report/'
    | '/admin/services/'
    | '/admin/staff/'
    | '/_layout/services/hair-cut/$id'
    | '/_layout/shopping/cart/cart'
    | '/_layout/shopping/product/$id'
    | '/admin/services/$id/edit'
    | '/_layout/services/hair-cut/'
    | '/_layout/shopping/cart/payment/momo'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  AdminRoute: typeof AdminRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  AdminRoute: AdminRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/admin"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/about",
        "/_layout/booking",
        "/_layout/franchise",
        "/_layout/locations",
        "/_layout/my-bookings",
        "/_layout/partners",
        "/_layout/profile",
        "/_layout/test-hair",
        "/_layout/wedding",
        "/_layout/",
        "/_layout/shopping/",
        "/_layout/services/hair-cut/$id",
        "/_layout/shopping/cart/cart",
        "/_layout/shopping/product/$id",
        "/_layout/services/hair-cut/",
        "/_layout/shopping/cart/payment/momo"
      ]
    },
    "/admin": {
      "filePath": "admin.tsx",
      "children": [
        "/admin/",
        "/admin/bookings/",
        "/admin/branches/",
        "/admin/customers/",
        "/admin/products/",
        "/admin/report/",
        "/admin/services/",
        "/admin/staff/",
        "/admin/services/$id/edit"
      ]
    },
    "/_layout/about": {
      "filePath": "_layout/about.tsx",
      "parent": "/_layout"
    },
    "/_layout/booking": {
      "filePath": "_layout/booking.tsx",
      "parent": "/_layout"
    },
    "/_layout/franchise": {
      "filePath": "_layout/franchise.tsx",
      "parent": "/_layout"
    },
    "/_layout/locations": {
      "filePath": "_layout/locations.tsx",
      "parent": "/_layout"
    },
    "/_layout/my-bookings": {
      "filePath": "_layout/my-bookings.tsx",
      "parent": "/_layout"
    },
    "/_layout/partners": {
      "filePath": "_layout/partners.tsx",
      "parent": "/_layout"
    },
    "/_layout/profile": {
      "filePath": "_layout/profile.tsx",
      "parent": "/_layout"
    },
    "/_layout/test-hair": {
      "filePath": "_layout/test-hair.tsx",
      "parent": "/_layout"
    },
    "/_layout/wedding": {
      "filePath": "_layout/wedding.tsx",
      "parent": "/_layout"
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/admin/": {
      "filePath": "admin/index.tsx",
      "parent": "/admin"
    },
    "/_layout/shopping/": {
      "filePath": "_layout/shopping/index.tsx",
      "parent": "/_layout"
    },
    "/admin/bookings/": {
      "filePath": "admin/bookings/index.tsx",
      "parent": "/admin"
    },
    "/admin/branches/": {
      "filePath": "admin/branches/index.tsx",
      "parent": "/admin"
    },
    "/admin/customers/": {
      "filePath": "admin/customers/index.tsx",
      "parent": "/admin"
    },
    "/admin/products/": {
      "filePath": "admin/products/index.tsx",
      "parent": "/admin"
    },
    "/admin/report/": {
      "filePath": "admin/report/index.tsx",
      "parent": "/admin"
    },
    "/admin/services/": {
      "filePath": "admin/services/index.tsx",
      "parent": "/admin"
    },
    "/admin/staff/": {
      "filePath": "admin/staff/index.tsx",
      "parent": "/admin"
    },
    "/_layout/services/hair-cut/$id": {
      "filePath": "_layout/services/hair-cut/$id.tsx",
      "parent": "/_layout"
    },
    "/_layout/shopping/cart/cart": {
      "filePath": "_layout/shopping/cart/cart.tsx",
      "parent": "/_layout"
    },
    "/_layout/shopping/product/$id": {
      "filePath": "_layout/shopping/product/$id.tsx",
      "parent": "/_layout"
    },
    "/admin/services/$id/edit": {
      "filePath": "admin/services/$id.edit.tsx",
      "parent": "/admin"
    },
    "/_layout/services/hair-cut/": {
      "filePath": "_layout/services/hair-cut/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/shopping/cart/payment/momo": {
      "filePath": "_layout/shopping/cart/payment/momo.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
