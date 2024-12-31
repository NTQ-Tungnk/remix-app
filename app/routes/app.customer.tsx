import { Button, Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import CustomerHeader from "../components/customer/header";
import { authenticate } from "app/shopify.server";
import prisma from "app/db.server";
import { useFetcher, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const customer = await prisma.customer.findMany();

  return customer;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  // admin.graphql("...")

  const response = await prisma.customer.create({
    data: {
      email: 'newcustomer@gmail.com',
      first_name: 'Hello'
    }
  })

  return response
};

export default function CustomerPage() {
  const customer = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const createCustomer = () => fetcher.submit({}, { method: "POST" });
  
  return (
    <Page>
      <TitleBar title="Customer Page" />
      <div>
        <CustomerHeader />
        <Button variant="primary" onClick={createCustomer}>Create customer</Button>
        {fetcher.data && (
          <div>
            <p>Customer created:</p>
            <p>{fetcher.data.id}</p>
            <p>{fetcher.data.email}</p>
            <p>{fetcher.data.first_name}</p>
            <p>{fetcher.data.last_name}</p>
          </div>
        )}
      </div>
    </Page>
  );
}
