import { NextResponse } from "next/server";
import * as z from "zod";

const customerSchema = z
  .object({
    id: z.number().int(),
    organiser_id: z.number().int(),
    customer_first_name: z.string(),
    customer_last_name: z.string(),
    customer_email: z.email(),
    can_email: z.boolean(),
    date_created: z.iso.datetime(),
  })
  .array();

const paginatedResponseSchema = z.object({
  total_items: z.number().int().positive(),
  page_number: z.number().int().positive(),
  page_size: z.number().int().positive(),
  list: customerSchema,
  total_pages: z.number().int().positive(),
  has_previous_page: z.boolean(),
  has_next_page: z.boolean(),
  next_page_number: z.number().int().positive(),
  previous_page_number: z.number().int().positive(),
});

const OUTSAVVY_ACCESS_TOKEN = process.env.OUTSAVVY_ACCESS_TOKEN;
const PAGE_SIZE = 1000;

export async function GET() {
  const fetchCustomerUrl = `https://api.outsavvy.com/v1/customers?page_size=${PAGE_SIZE}`;
  const fetchCustomerHeaders = {
    Authorization: `Partner ${OUTSAVVY_ACCESS_TOKEN}`,
  };

  const outsavvyCustomersApiResponse = await fetch(fetchCustomerUrl, {
    headers: fetchCustomerHeaders,
  }).then((response) => response.json());

  const parsedOutsavvyCustomers = paginatedResponseSchema.parse(
    outsavvyCustomersApiResponse
  );

  const customersOnEmailingList = parsedOutsavvyCustomers.list.filter(
    (customer) => customer.can_email && customer.customer_email
  );

  return NextResponse.json(customersOnEmailingList);
}
