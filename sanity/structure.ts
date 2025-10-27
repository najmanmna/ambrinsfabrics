import {
  type StructureBuilder,
  type DefaultDocumentNodeResolver,
  type ListItemBuilder,
} from 'sanity/structure'
import { OrderSummaryView } from './views/OrderSummaryView' // Adjust path if needed
import {
  TagIcon,
  PackageIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  SyncIcon,
  RocketIcon,
  CloseCircleIcon,
  CogIcon,
  BillIcon,
} from '@sanity/icons'

// This function determines which views to show when a document is opened.
export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }: { schemaType: string }
) => {
  // If the schema is 'order', show our custom summary view as the default
  if (schemaType === 'order') {
    return S.document().views([
      S.view.component(OrderSummaryView).title('Order Summary'),
      // Keep the standard "Edit" form as an option
      S.view.form().title('Edit'),
    ])
  }

  // For all other schemas, just show the default form view
  // (We've removed the custom 'category' view)
  return S.document().views([S.view.form()])
}

// This function organizes the main navigation list in the Sanity Studio.
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // 1. Singleton for Site-wide Settings
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('settings') // Assumes you have a 'settings' schema
            .documentId('settings') // Use a single, consistent ID
            .title('Site Settings')
        ),

      S.divider(),

      // 2. Custom "Orders" list item with status filters and icons
      S.listItem()
        .title('Orders')
        .icon(PackageIcon)
        .child(
          S.list()
            .title('Orders by Status')
            .items([
              S.listItem()
                .title('All Orders')
                .child(
                  S.documentList()
                    .title('All Orders')
                    .filter('_type == "order"')
                    .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
                ),
              S.divider(),
              S.listItem()
                .title('Pending')
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title('Pending Orders')
                    .filter('_type == "order" && status == "pending"')
                    .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Processing')
                .icon(SyncIcon)
                .child(
                  S.documentList()
                    .title('Processing Orders')
                    .filter('_type == "order" && status == "processing"')
                    .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Shipped')
                .icon(RocketIcon) // Using RocketIcon
                .child(
                  S.documentList()
                    .title('Shipped Orders')
                    .filter('_type == "order" && status == "shipped"')
                    .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Delivered')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Delivered Orders')
                    .filter('_type == "order" && status == "delivered"')
                    .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Cancelled')
                .icon(CloseCircleIcon)
                .child(
                  S.documentList()
                    .title('Cancelled Orders')
                    .filter('_type == "order" && status == "cancelled"')
                    .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
                ),
            ])
        ),
      
      S.divider(),

      // 3. Products (as a top-level item)
      S.documentTypeListItem('product').title('All Products').icon(PackageIcon),

      // 4. Categories (as a top-level item, showing all in a flat list)
      S.documentTypeListItem('category').title('Categories & Subcategories').icon(TagIcon),

      // 5. Voucher Management
      S.listItem()
        .title('Vouchers')
        .icon(BillIcon)
        .child(
            S.list()
                .title('Voucher Management')
                .items([
                    S.listItem()
                        .title('Voucher Templates')
                        .icon(BillIcon)
                        .child(
                            S.documentList()
                                .title('Voucher Templates')
                                .filter('_type == "voucherTemplate"')
                                .defaultOrdering([{field: 'amount', direction: 'asc'}])
                        ),
                     S.listItem()
                        .title('Vouchers Purchased')
                        .icon(BillIcon)
                        .child(
                            S.documentList()
                                .title('Vouchers Purchased')
                                .filter('_type == "voucher"')
                                .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                        ),
                ])
        ),

      S.divider(),

      // 6. List all other document types, filtering out the ones we've customized
      ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) =>
          ![
            'settings',
            'order',
            'orderItem',
            'category', 
            'product',
            'voucherTemplate',
            'voucher',
          ].includes(listItem.getId() ?? '')
      ),
    ])

