import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!apiKey || !variantId || !storeId) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            product_options: {
              redirect_url: `${appUrl}/success`,
            },
          },
          relationships: {
            store: { data: { type: 'stores', id: storeId } },
            variant: { data: { type: 'variants', id: variantId } },
          },
        },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Lemon Squeezy error:', data)
      return NextResponse.json({ error: 'Erreur création checkout' }, { status: 500 })
    }

    return NextResponse.json({ url: data?.data?.attributes?.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}