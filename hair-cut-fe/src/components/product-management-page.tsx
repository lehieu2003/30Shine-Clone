import React, { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'
import type {
  InventoryTransaction,
  Product,
  ProductImage,
  ProductVariant,
} from '@/types/product'

import { useProduct } from '@/contexts/ProductContext'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function ProductManagementPage() {
  const {
    products,
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateInventory,
    getInventoryTransactions,
    getAllInventoryTransactions,
  } = useProduct()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProductInventory, setSelectedProductInventory] = useState<
    Array<InventoryTransaction>
  >([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Form states
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [inventoryFormOpen, setInventoryFormOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    brand: '',
    brandSlug: '',
    category: '',
    categorySlug: '',
    subcategory: '',
    subcategorySlug: '',
    price: 0,
    listedPrice: 0,
    cost: 0,
    discountPercent: 0,
    isDiscount: false,
    minimumStock: 5,
    imageUrl: '',
    sku: '',
    tags: '',
    ingredients: '',
    manual: '',
    isActive: true,
  })

  const [inventoryFormData, setInventoryFormData] = useState({
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    notes: '',
    employeeId: 0,
  })

  // Add state for product images and variants
  const [productImages, setProductImages] = useState<Array<ProductImage>>([])
  const [productVariants, setProductVariants] = useState<Array<ProductVariant>>(
    [],
  )
  const [newImage, setNewImage] = useState({ name: '', url: '', alt: '' })
  const [newVariant, setNewVariant] = useState({
    name: '',
    price: 0,
    listedPrice: 0,
    sku: '',
    imageUrl: '',
    isDiscount: false,
    discountPercent: 0,
    isOutOfStock: false,
  })

  // Add state for active tabs in the product form
  const [productFormTab, setProductFormTab] = useState('details')

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      brand: product.brand || '',
      brandSlug: product.brandSlug || '',
      category: product.category || '',
      categorySlug: product.categorySlug || '',
      subcategory: product.subcategory || '',
      subcategorySlug: product.subcategorySlug || '',
      price: product.price,
      listedPrice: product.listedPrice,
      cost: product.cost || 0,
      discountPercent: product.discountPercent,
      isDiscount: product.isDiscount,
      minimumStock: product.minimumStock,
      imageUrl: product.imageUrl || '',
      sku: product.sku || '',
      tags: product.tags || '',
      ingredients: product.ingredients || '',
      manual: product.manual || '',
      isActive: product.isActive,
    })
    setProductImages(product.images)
    setProductVariants(product.variants)
    setFormMode('edit')
    setProductFormOpen(true)
    setProductFormTab('details')
  }

  // Handle inventory update
  const handleInventoryUpdate = async (product: Product) => {
    setSelectedProduct(product)
    try {
      const transactions = await getInventoryTransactions(product.id)
      setSelectedProductInventory(transactions)
      setInventoryFormOpen(true)
    } catch (error) {
      console.error('Error fetching inventory transactions:', error)
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirm = (product: Product) => {
    setSelectedProduct(product)
    setDeleteConfirmOpen(true)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (formMode === 'create') {
        await createProduct({
          ...formData,
          images: productImages,
          variants: productVariants,
        })
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, {
          ...formData,
          images: productImages,
          variants: productVariants,
        })
      }
      setProductFormOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error submitting product:', error)
    }
  }

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    try {
      await updateInventory(selectedProduct.id, inventoryFormData)
      const transactions = await getInventoryTransactions(selectedProduct.id)
      setSelectedProductInventory(transactions)
      setInventoryFormOpen(false)
      resetInventoryForm()
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      await deleteProduct(selectedProduct.id)
      setDeleteConfirmOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  // Reset forms
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      brand: '',
      brandSlug: '',
      category: '',
      categorySlug: '',
      subcategory: '',
      subcategorySlug: '',
      price: 0,
      listedPrice: 0,
      cost: 0,
      discountPercent: 0,
      isDiscount: false,
      minimumStock: 5,
      imageUrl: '',
      sku: '',
      tags: '',
      ingredients: '',
      manual: '',
      isActive: true,
    })
    setProductImages([])
    setProductVariants([])
    setSelectedProduct(null)
  }

  const resetInventoryForm = () => {
    setInventoryFormData({
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      notes: '',
      employeeId: 0,
    })
  }

  // Add a function to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Add a function to handle name change and auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  // Add a function to handle brand change and auto-generate brandSlug
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const brand = e.target.value
    setFormData({
      ...formData,
      brand,
      brandSlug: generateSlug(brand),
    })
  }

  // Add a function to handle category change and auto-generate categorySlug
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.value
    setFormData({
      ...formData,
      category,
      categorySlug: generateSlug(category),
    })
  }

  // Add a function to handle subcategory change and auto-generate subcategorySlug
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subcategory = e.target.value
    setFormData({
      ...formData,
      subcategory,
      subcategorySlug: generateSlug(subcategory),
    })
  }

  // Add a function to handle discount change
  const handleDiscountChange = (isDiscount: boolean) => {
    setFormData({
      ...formData,
      isDiscount,
      discountPercent: isDiscount ? formData.discountPercent : 0,
    })
  }

  // Add a function to calculate total price for inventory transactions
  const calculateTotalPrice = () => {
    const total = inventoryFormData.quantity * inventoryFormData.unitPrice
    setInventoryFormData({
      ...inventoryFormData,
      totalPrice: total,
    })
  }

  // Add a function to add a new image to the product
  const addProductImage = () => {
    if (newImage.name && newImage.url) {
      setProductImages([
        ...productImages,
        { ...newImage, id: Date.now(), productId: selectedProduct?.id || '' },
      ])
      setNewImage({ name: '', url: '', alt: '' })
    }
  }

  // Add a function to remove an image from the product
  const removeProductImage = (id: number) => {
    setProductImages(productImages.filter((image) => image.id !== id))
  }

  // Add a function to add a new variant to the product
  const addProductVariant = () => {
    if (newVariant.name && newVariant.price > 0) {
      setProductVariants([
        ...productVariants,
        { ...newVariant, id: Date.now(), productId: selectedProduct?.id || '' },
      ])
      setNewVariant({
        name: '',
        price: 0,
        listedPrice: 0,
        sku: '',
        imageUrl: '',
        isDiscount: false,
        discountPercent: 0,
        isOutOfStock: false,
      })
    }
  }

  // Add a function to remove a variant from the product
  const removeProductVariant = (id: number) => {
    setProductVariants(productVariants.filter((variant) => variant.id !== id))
  }

  // Filter products based on search query
  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.category?.toLowerCase() || '').includes(
            searchQuery.toLowerCase(),
          ),
      )
    : []

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  )
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý sản phẩm</CardTitle>
          <CardDescription>
            Quản lý sản phẩm và hàng tồn kho của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products">
            <TabsList className="mb-4">
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger
                value="inventory"
                onClick={getAllInventoryTransactions}
              >
                Giao dịch hàng tồn kho
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    setFormMode('create')
                    resetForm()
                    setProductFormOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Tồn kho</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                          <p className="mt-2">Loading products...</p>
                        </TableCell>
                      </TableRow>
                    ) : currentProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p>No products found</p>
                          {searchQuery && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Try adjusting your search query
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            {product.category || 'Uncategorized'}
                          </TableCell>
                          <TableCell>
                            ${Number(product.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            ${Number(product.listedPrice).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {product.quantity}{' '}
                            {product.quantity <= product.minimumStock && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 ml-2"
                              >
                                Low Stock
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {product.isOutOfStock ? (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800"
                              >
                                Out of Stock
                              </Badge>
                            ) : product.isActive ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
                              >
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-800"
                              >
                                Inactive
                              </Badge>
                            )}
                            {product.isDiscount && (
                              <Badge
                                variant="outline"
                                className="bg-purple-100 text-purple-800 ml-2"
                              >
                                {product.discountPercent}% Off
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleInventoryUpdate(product)}
                              >
                                <Package className="h-4 w-4" />
                                <span className="sr-only">Inventory</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteConfirm(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredProducts.length > itemsPerPage && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inventory">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                          <p className="mt-2">
                            Loading inventory transactions...
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : selectedProductInventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p>No inventory transactions found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedProductInventory.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.productName}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.quantity > 0
                                  ? 'default'
                                  : 'destructive'
                              }
                            >
                              {transaction.quantity > 0 ? '+' : ''}
                              {transaction.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${transaction.unitPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            ${transaction.totalPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {transaction.employeeName || transaction.employeeId}
                          </TableCell>
                          <TableCell>{transaction.notes || '-'}</TableCell>
                          <TableCell>
                            {new Date(
                              transaction.transactionDate,
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'create'
                ? 'Điền thông tin để tạo sản phẩm mới.'
                : 'Cập nhật thông tin sản phẩm.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs value={productFormTab} onValueChange={setProductFormTab}>
              <TabsList className="mb-4 grid grid-cols-4">
                <TabsTrigger value="details">Chi tiết cơ bản</TabsTrigger>
                <TabsTrigger value="pricing">Giá</TabsTrigger>
                <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                <TabsTrigger value="variants">Biến thể</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Tên
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="slug" className="text-right">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shortDescription" className="text-right">
                      Mô tả ngắn
                    </Label>
                    <Input
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDescription: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Mô tả
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="brand" className="text-right">
                      Thương hiệu
                    </Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={handleBrandChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Loại
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subcategory" className="text-right">
                      Subcategory
                    </Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={handleSubcategoryChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tags" className="text-right">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Comma separated tags"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isActive" className="text-right">
                      Status
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isActive" className="text-sm font-normal">
                        Active
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Giá
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number.parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="listedPrice" className="text-right">
                      Listed Price
                    </Label>
                    <Input
                      id="listedPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.listedPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          listedPrice: Number.parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Cost
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cost: Number.parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isDiscount" className="text-right">
                      Discount
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDiscount"
                        checked={formData.isDiscount}
                        onChange={(e) => handleDiscountChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label
                        htmlFor="isDiscount"
                        className="text-sm font-normal"
                      >
                        Apply Discount
                      </Label>
                    </div>
                  </div>
                  {formData.isDiscount && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="discountPercent" className="text-right">
                        Discount %
                      </Label>
                      <Input
                        id="discountPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discountPercent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPercent: Number.parseInt(e.target.value),
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minimumStock" className="text-right">
                      Minimum Stock
                    </Label>
                    <Input
                      id="minimumStock"
                      type="number"
                      min="0"
                      value={formData.minimumStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumStock: Number.parseInt(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrl" className="text-right">
                      Main Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <h4 className="font-medium mb-2">Additional Images</h4>

                    {productImages.length > 0 && (
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        {productImages.map((image) => (
                          <div
                            key={image.id}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                                {image.url && (
                                  <img
                                    src={image.url || '/placeholder.svg'}
                                    alt={image.alt || image.name}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{image.name}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {image.url}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProductImage(image.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid gap-4 mb-2">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageName" className="text-right">
                          Image Name
                        </Label>
                        <Input
                          id="imageName"
                          value={newImage.name}
                          onChange={(e) =>
                            setNewImage({ ...newImage, name: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageUrl" className="text-right">
                          Image URL
                        </Label>
                        <Input
                          id="imageUrl"
                          value={newImage.url}
                          onChange={(e) =>
                            setNewImage({ ...newImage, url: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageAlt" className="text-right">
                          Alt Text
                        </Label>
                        <Input
                          id="imageAlt"
                          value={newImage.alt}
                          onChange={(e) =>
                            setNewImage({ ...newImage, alt: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addProductImage}
                          disabled={!newImage.name || !newImage.url}
                        >
                          Add Image
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variants">
                <div className="grid gap-4 py-4">
                  {productVariants.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      {productVariants.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div>
                            <p className="font-medium">{variant.name}</p>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <span>
                                Price: ${Number(variant.price).toFixed(2)}
                              </span>
                              <span>
                                Listed: $
                                {Number(variant.listedPrice).toFixed(2)}
                              </span>
                              {variant.sku && <span>SKU: {variant.sku}</span>}
                              {variant.isDiscount && (
                                <span>
                                  Discount: {variant.discountPercent}%
                                </span>
                              )}
                              {variant.isOutOfStock && (
                                <span className="text-red-500">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProductVariant(variant.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-4 mt-2">
                    <h4 className="font-medium mb-2">Add Variant</h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="variantName" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="variantName"
                          value={newVariant.name}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              name: e.target.value,
                            })
                          }
                          className="col-span-3"
                          placeholder="e.g. Small, Red, 256GB"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="variantPrice" className="text-right">
                          Price
                        </Label>
                        <Input
                          id="variantPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newVariant.price}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              price: Number.parseFloat(e.target.value),
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="variantListedPrice"
                          className="text-right"
                        >
                          Listed Price
                        </Label>
                        <Input
                          id="variantListedPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newVariant.listedPrice}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              listedPrice: Number.parseFloat(e.target.value),
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="variantSku" className="text-right">
                          SKU
                        </Label>
                        <Input
                          id="variantSku"
                          value={newVariant.sku}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              sku: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="variantImageUrl" className="text-right">
                          Image URL
                        </Label>
                        <Input
                          id="variantImageUrl"
                          value={newVariant.imageUrl}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              imageUrl: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right">
                          <Label htmlFor="variantIsDiscount">Discount</Label>
                        </div>
                        <div className="col-span-3 flex flex-col gap-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="variantIsDiscount"
                              checked={newVariant.isDiscount}
                              onChange={(e) =>
                                setNewVariant({
                                  ...newVariant,
                                  isDiscount: e.target.checked,
                                  discountPercent: e.target.checked
                                    ? newVariant.discountPercent
                                    : 0,
                                })
                              }
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label
                              htmlFor="variantIsDiscount"
                              className="text-sm font-normal"
                            >
                              Apply Discount
                            </Label>
                          </div>

                          {newVariant.isDiscount && (
                            <div className="flex items-center gap-2">
                              <Input
                                id="variantDiscountPercent"
                                type="number"
                                min="0"
                                max="100"
                                value={newVariant.discountPercent}
                                onChange={(e) =>
                                  setNewVariant({
                                    ...newVariant,
                                    discountPercent: Number.parseInt(
                                      e.target.value,
                                    ),
                                  })
                                }
                                className="w-20"
                              />
                              <span>%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right">
                          <Label htmlFor="variantIsOutOfStock">
                            Stock Status
                          </Label>
                        </div>
                        <div className="col-span-3 flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="variantIsOutOfStock"
                            checked={newVariant.isOutOfStock}
                            onChange={(e) =>
                              setNewVariant({
                                ...newVariant,
                                isOutOfStock: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor="variantIsOutOfStock"
                            className="text-sm font-normal"
                          >
                            Out of Stock
                          </Label>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addProductVariant}
                          disabled={!newVariant.name || newVariant.price <= 0}
                        >
                          Add Variant
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ingredients" className="text-right">
                  Ingredients
                </Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Product ingredients (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="manual" className="text-right">
                  Manual
                </Label>
                <Textarea
                  id="manual"
                  value={formData.manual}
                  onChange={(e) =>
                    setFormData({ ...formData, manual: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Usage instructions (optional)"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {formMode === 'create' ? 'Create' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inventory Update Dialog */}
      <Dialog open={inventoryFormOpen} onOpenChange={setInventoryFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
            <DialogDescription>
              {selectedProduct &&
                `Update inventory for ${selectedProduct.name}`}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="update">
            <TabsList className="mb-4">
              <TabsTrigger value="update">Update Inventory</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>

            <TabsContent value="update">
              <form onSubmit={handleInventorySubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={inventoryFormData.quantity}
                      onChange={(e) => {
                        const quantity = Number.parseInt(e.target.value)
                        setInventoryFormData({
                          ...inventoryFormData,
                          quantity,
                        })
                        // Recalculate total price when quantity changes
                        calculateTotalPrice()
                      }}
                      className="col-span-3"
                      required
                    />
                    <div className="col-span-4 text-sm text-muted-foreground text-right">
                      Use positive values to add stock, negative to remove
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unitPrice" className="text-right">
                      Unit Price
                    </Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={inventoryFormData.unitPrice}
                      onChange={(e) => {
                        const unitPrice = Number.parseFloat(e.target.value)
                        setInventoryFormData({
                          ...inventoryFormData,
                          unitPrice,
                        })
                        // Recalculate total price when unit price changes
                        calculateTotalPrice()
                      }}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalPrice" className="text-right">
                      Total Price
                    </Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={inventoryFormData.totalPrice}
                      readOnly
                      className="col-span-3 bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employeeId" className="text-right">
                      Employee ID
                    </Label>
                    <Input
                      id="employeeId"
                      type="number"
                      value={inventoryFormData.employeeId}
                      onChange={(e) =>
                        setInventoryFormData({
                          ...inventoryFormData,
                          employeeId: Number.parseInt(e.target.value),
                        })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={inventoryFormData.notes}
                      onChange={(e) =>
                        setInventoryFormData({
                          ...inventoryFormData,
                          notes: e.target.value,
                        })
                      }
                      className="col-span-3"
                      placeholder="Optional notes about this transaction"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInventoryFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Inventory</Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="history">
              <div className="border rounded-md max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                          <p className="mt-2">Loading transactions...</p>
                        </TableCell>
                      </TableRow>
                    ) : selectedProductInventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p>
                            No inventory transactions found for this product
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedProductInventory.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.quantity > 0
                                  ? 'default'
                                  : 'destructive'
                              }
                            >
                              {transaction.quantity > 0 ? '+' : ''}
                              {transaction.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${transaction.unitPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            ${transaction.totalPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>{transaction.notes || '-'}</TableCell>
                          <TableCell>
                            {new Date(
                              transaction.transactionDate,
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProduct?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
