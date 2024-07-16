'use client'
import { User } from '@supabase/supabase-js';
import React, { useEffect } from 'react';

interface StripePricingTableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  'pricing-table-id': string;
  'publishable-key': string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': StripePricingTableProps;
    }
  }
}

type Props = {
  user: User;
  accountId: string;
}

// Prod
// const tableId = 'prctbl_1PVlenAioP3hJRa8dqzAzKf1';
// const publicKey = "pk_live_51NK8XQAioP3hJRa8Ytpa5l3st8U2jX26UjUOkgMFfzw9q6B3H8PhKzuZpCbIUnFhW7PbhsmjBYlcium7tUkVPRHn00b6o0XCAC";

// Dev
const tableId = 'prctbl_1PUXAQAioP3hJRa8pe1JHLsm';
const publicKey = "pk_test_51NK8XQAioP3hJRa8GZm4J9MYyeXmLmNNwaWulKxk9uRoQFEkox7h1ARBLYFjFqzE3vEhtPkdHnRlbRCGCCD3sbnl00XjlDMt6k";

const StripePricingTable = ({ user, accountId }: Props) => {
  

  return (
    <div className='flex flex-col w-full'>

    </div>
  );
}

export default StripePricingTable;
