export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    console.log('Дані з форми Checkout:', body)

    return {
        success: true,
        message: 'Підписку успішно оформлено!'
    }
})