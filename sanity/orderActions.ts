import { DocumentActionComponent, DocumentActionProps, useClient } from 'sanity'

// --- TYPE DEFINITIONS ---
// These types should align with what your order documents contain.

interface OrderItem {
  product?: { _ref: string }
  variant?: { variantKey: string; variantName?: string }
  quantity?: number
}

interface VoucherReference {
  _key: string
  _ref: string
  _type: 'reference'
}

interface OrderDocument {
  _id: string
  _type: string
  status?: string
  items?: OrderItem[]
  purchasedVouchers?: VoucherReference[] // Array of references to voucher documents
}

/**
 * A custom document action hook that intercepts the 'publish' action for 'order' documents.
 * It adds logic to:
 * 1. Restore stock for physical products when an order is cancelled.
 * 2. Void associated vouchers when an order is cancelled.
 * 3. Prevent a cancelled order from being re-opened.
 */
export function useOrderActions(
  originalActions: DocumentActionComponent[]
): DocumentActionComponent[] {
  return originalActions.map((Action) => {
    // We are only modifying the 'publish' action
    if (Action && (Action as any).action === 'publish') {
      const CustomPublishAction: DocumentActionComponent = (
        props: DocumentActionProps
      ) => {
        const client = useClient({ apiVersion: '2024-01-01' })
        const defaultAction = Action(props)

        if (!defaultAction) return null

        return {
          ...defaultAction,
          // onHandle is the function that runs when the action is triggered
          onHandle: async () => {
            const { draft, published } = props
            const order: OrderDocument = (draft || published) as OrderDocument

            // Only apply this custom logic to 'order' documents
            if (order._type === 'order') {
              const oldStatus = (published as OrderDocument)?.status
              const newStatus = (draft as OrderDocument)?.status

              // --- A: STOCK RESTORATION & VOUCHER VOIDING LOGIC ---
              // This runs only when an order's status changes TO 'cancelled'
              if (oldStatus !== 'cancelled' && newStatus === 'cancelled') {
                const transaction = client.transaction()

                // 1. Restore stock for physical products
                for (const item of order.items || []) {
                  const productRef = item.product?._ref
                  const variantKey = item.variant?.variantKey
                  const quantity = item.quantity

                  if (
                    !productRef ||
                    !variantKey ||
                    typeof quantity !== 'number'
                  ) {
                    console.warn('Skipping stock restore for item with missing data:', item)
                    continue
                  }

                  // Fetch current stockOut for this variant to prevent negative values
                  const currentStockOut = await client.fetch<number | null>(
                    `*[_type=="product" && _id==$id][0].variants[_key==$key].stockOut`,
                    { id: productRef, key: variantKey }
                  )

                  // Only adjust by a value that won't make stockOut negative
                  const adjustment = Math.min(quantity, currentStockOut || 0)

                  if (adjustment > 0) {
                    // Decrement the 'stockOut' count for the specific variant
                    transaction.patch(productRef, (p) =>
                      p.inc({
                        [`variants[_key=="${variantKey}"].stockOut`]: -adjustment,
                      })
                    )
                  }
                }

                // 2. Void associated vouchers
                for (const voucherRef of order.purchasedVouchers || []) {
                  if (!voucherRef?._ref) continue

                  // Patch the voucher document to mark it as 'redeemed', effectively voiding it.
                  // For more advanced logic, you could add a 'status' field to the voucher schema.
                  transaction.patch(voucherRef._ref, (p) =>
                    p.set({ redeemed: true })
                  )
                }

                // Commit both stock and voucher changes in a single transaction
                try {
                  await transaction.commit()
                  console.log(
                    '✅ Stock restored and vouchers voided for cancelled order:',
                    order._id
                  )
                } catch (err) {
                  console.error('Transaction failed for order cancellation:', err)
                  // Optionally show an error to the user in the Studio
                  // props.onComplete() is called by the default handler, so we can just show an alert
                  window.alert(
                    'Failed to restore stock or void vouchers. Please check the console for errors.'
                  )
                  return // Stop the publish action if the transaction fails
                }
              }

              // --- B: PREVENT RE-OPENING CANCELLED ORDERS ---
              if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
                window.alert(
                  'This order has been cancelled and its stock has been restored. It cannot be reopened. Please create a new order if needed.'
                )
                return // Stop the publish action
              }
            }

            // If none of the custom logic applies, proceed with the default publish action
            defaultAction.onHandle?.()
          },
        }
      }
      return CustomPublishAction
    }

    // Return all other actions unmodified
    return Action
  })
}
