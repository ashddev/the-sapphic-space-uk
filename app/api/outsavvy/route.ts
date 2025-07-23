import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const outSavvyCustomerSchema = z.object({
  id: z.number().int(),
  organiser_id: z.number().int(),
  customer_first_name: z.string(),
  customer_last_name: z.string(),
  customer_email: z.email(),
  can_email: z.boolean(),
  date_created: z.iso.datetime(),
});

const paginatedResponseSchema = z.object({
  total_items: z.number().int().positive(),
  page_number: z.number().int().positive(),
  page_size: z.number().int().positive(),
  list: outSavvyCustomerSchema.array(),
  total_pages: z.number().int().positive(),
  has_previous_page: z.boolean(),
  has_next_page: z.boolean(),
  next_page_number: z.number().int().positive(),
  previous_page_number: z.number().int().positive(),
});

type OutsavvyCusomter = z.infer<typeof outSavvyCustomerSchema>;

const getAllCustomersOnMailingList = async (): Promise<OutsavvyCusomter[]> => {
  const OUTSAVVY_ACCESS_TOKEN = process.env.OUTSAVVY_ACCESS_TOKEN;
  const PAGE_SIZE = 1000;

  const outsavvyCustomerUrl = `https://api.outsavvy.com/v1/customers?page_size=${PAGE_SIZE}`;
  const outsavvyCustomerHeaders = {
    Authorization: `Partner ${OUTSAVVY_ACCESS_TOKEN}`,
  };

  const outsavvyCustomersApiResponse = await fetch(outsavvyCustomerUrl, {
    headers: outsavvyCustomerHeaders,
  }).then((response) => response.json());

  const parsedOutsavvyCustomers = paginatedResponseSchema.parse(
    outsavvyCustomersApiResponse
  );

  return parsedOutsavvyCustomers.list.filter(
    (customer) => customer.can_email && customer.customer_email
  );
};

const mailerLiteBatchResponseSchema = z.object({
  total: z.number().int().positive(),
  successful: z.number().int(),
  failed: z.number().int(),
  responses: z
    .object({
      code: z.number().int(),
      body: z.object({
        data: z.any(),
      }),
    })
    .array(),
});

const uploadCustomersToMailerLite = async (customers: OutsavvyCusomter[]) => {
  const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;
  const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

  const MAX_REQUESTS = 50;

  const subscribeRequests = customers.map(
    ({ customer_email, customer_first_name, customer_last_name }) => ({
      method: "POST",
      path: "api/subscribers",
      body: {
        email: customer_email,
        fields: {
          name: customer_first_name,
          last_name: customer_last_name,
        },
        groups: [MAILERLITE_GROUP_ID],
      },
    })
  );

  const chunkedSubscribeRequests = [];
  for (let i = 0; i <= subscribeRequests.length; i += MAX_REQUESTS) {
    if (i + MAX_REQUESTS > subscribeRequests.length) {
      chunkedSubscribeRequests.push(
        subscribeRequests.slice(i, subscribeRequests.length)
      );
    } else {
      chunkedSubscribeRequests.push(
        subscribeRequests.slice(i, i + MAX_REQUESTS)
      );
    }
  }

  const mailerLiteBatchUrl = "https://connect.mailerlite.com/api/batch";

  const chunkResponses = [];

  for (let i = 0; i <= chunkedSubscribeRequests.length; i++) {
    if (!chunkedSubscribeRequests[i]) break;

    const res = await fetch(mailerLiteBatchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILERLITE_API_KEY!}`,
      },
      body: JSON.stringify({ requests: chunkedSubscribeRequests[i] }),
    }).then((response) => response.json());

    const parsedRes = mailerLiteBatchResponseSchema.parse(res);
    chunkResponses.push(parsedRes);
  }

  return chunkResponses;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const customersOnEmailingList = await getAllCustomersOnMailingList();
  const mailerLiteResponse = await uploadCustomersToMailerLite(
    customersOnEmailingList
  );

  return NextResponse.json({
    status: 201,
    message: "Synced customers with subscribers!",
    body: mailerLiteResponse,
  });
}
