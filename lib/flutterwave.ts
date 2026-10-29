const API_BASE = "https://api.flutterwave.com/v3";

function getSecret() {
  const key = process.env.FLW_SECRET_KEY;
  if (!key) throw new Error("Flutterwave is not configured. Add FLW_SECRET_KEY on the server.");
  return key;
}

export async function initializeFlutterwavePayment(input: {
  txRef: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingReference: string;
  serviceName: string;
}) {
  const response = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecret()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tx_ref: input.txRef,
      amount: input.amount,
      currency: input.currency,
      redirect_url: `${process.env.APP_URL}/booking/result`,
      customer: {
        email: input.customerEmail,
        name: input.customerName,
        phonenumber: input.customerPhone
      },
      customizations: {
        title: "Motika Services Ultra Fast",
        description: `Payment for ${input.serviceName}`,
        logo: `${process.env.APP_URL}/logo.png`
      },
      meta: {
        booking_reference: input.bookingReference,
        service_name: input.serviceName
      }
    }),
    cache: "no-store"
  });

  const json = await response.json();
  if (!response.ok || json.status !== "success" || !json.data?.link) {
    throw new Error("Could not initialize the payment with Flutterwave.");
  }
  return { link: json.data.link as string };
}

export async function verifyFlutterwaveTransaction(transactionId: string | number) {
  const response = await fetch(`${API_BASE}/transactions/${encodeURIComponent(String(transactionId))}/verify`, {
    headers: { Authorization: `Bearer ${getSecret()}` },
    cache: "no-store"
  });
  const json = await response.json();
  if (!response.ok || json.status !== "success" || !json.data) {
    throw new Error("Flutterwave transaction verification failed.");
  }
  return json.data as {
    id: number;
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
    charged_amount?: number;
  };
}
