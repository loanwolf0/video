const crypto = require('crypto');
const Razorpay = require('razorpay');
const { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});


// Create a Razorpay customer
module.exports.createCustomer = async function (name, email, contact) {
    try {
        console.log('Creating customer')

        return await instance.customers.create({
            name: name,
            email: email,
            contact: contact
        });
    } catch (error) {
        throw error;
    }
}

// Create a Razorpay plan
module.exports.createPlan = async (planData) => {
    try {
        return await instance.plans.create(planData)
    } catch (error) {
        throw error;
    }
}

// Create a Razorpay subscription
module.exports.createSubscription = async function (planId, customerId) {
    try {
        console.log('Creating subscription', planId)

        return await instance.subscriptions.create({
            plan_id: planId,
            total_count: 12,
            quantity: 1, //videoCount,
            customer_notify: 1,
            customer_id: customerId  // Associate the customer with the subscription
        });
    } catch (error) {
        throw error;
    }
}

// Create a Razorpay order
module.exports.createRazorPayOrder = async function (amount, currency, rid) {
    try {
        console.log('Creating Order', rid)

        return await instance.orders.create({
            amount: amount,
            currency: currency,
            payment_capture: 1,
            receipt: rid
        });
    } catch (error) {
        throw error;
    }
}

// Update a Razorpay subscription
module.exports.updateSubscription = async function (subscriptionId, planId, schedule_change_at) {
    try {
        console.log('Updating subscription', subscriptionId, planId);
        return await instance.subscriptions.update(subscriptionId, {
            plan_id: planId,
            remaining_count: 12,
            quantity: 1, //videoCount,
            customer_notify: 1,
            schedule_change_at: schedule_change_at,
            // schedule_change_at: "cycle_end",
        });
    } catch (error) {
        throw error;
    }
}

// Cancel a Razorpay subscription
module.exports.cancelSubscription = async function (subscriptionId, cancel_at_cycle_end) {
    try {
        return await instance.subscriptions.cancel(subscriptionId, cancel_at_cycle_end);
    } catch (error) {
        throw error;
    }
}

module.exports.fetchInvoices = async function (subscriptionId) {
    try {
        return await instance.invoices.all({
            subscription_id: subscriptionId
        })
    } catch (error) {
        throw error;
    }
}


// Verify Razorpay paymment
module.exports.verifyPayment = async ({ razorpay_order_id, razorpay_subscription_id, razorpay_payment_id, razorpay_signature }) => {
    try {
        return validatePaymentVerification({ order_id: razorpay_order_id, subscription_id: razorpay_subscription_id, payment_id: razorpay_payment_id }, razorpay_signature, process.env.RAZORPAY_SECRET);


        // CUSTOM METHOD
        // // Determine the correct string for hashing
        // const body_data = razorpay_order_id
        //     ? `${razorpay_order_id}|${razorpay_payment_id}`  // For one-time payments
        //     : `${razorpay_payment_id}|${razorpay_subscription_id}`; // For subscriptions

        // // Generate HMAC SHA256 signature
        // const generated_signature = crypto
        //     .createHmac("sha256", process.env.RAZORPAY_SECRET)
        //     .update(body_data)
        //     .digest("hex");

        // return generated_signature === razorpay_signature.trim();
    } catch (error) {
        console.error(error)
        return false;
    }
};

module.exports.validateWebhook = async (body, signature) => {
    try {
        return validateWebhookSignature(body, signature, process.env.RAZORPAY_SECRET)
    } catch (error) {
        console.error(error)
        return false
    }
}
