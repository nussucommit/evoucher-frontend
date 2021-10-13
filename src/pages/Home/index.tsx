import React, { useState } from "react";

import useModal from "hooks/useModal";
import { useDynamicVouchers, useVoucher, useVouchers } from "api/voucher";
import { useUser } from "api/user";
import { Emails } from "constants/email";

import VoucherCard, { VoucherCardSkeleton } from "components/VoucherCard";
import VoucherModal from "components/VoucherModal";

import styles from "./Home.module.css";

const Home = () => {
  const { data: user } = useUser();
  const { isOpen, onClose, onOpen } = useModal();
  const { data: vouchers, mutate: mutateVouchers } = useVouchers(
    user?.username + Emails.studentDomain
  );
  const {
    data: dynamicVouchers,
    mutate: mutateDynamicVouchers,
  } = useDynamicVouchers(user?.username + Emails.studentDomain);
  const [openVoucher, setOpenVoucher] = useState<number>(0);
  const { data: voucher, isValidating } = useVoucher(openVoucher);
  const arr = React.useMemo(() => [...Array(20)], []);

  //   useEffect(() => {
  //     if (openVoucher === 0) revalidate()
  //   })

  const onCloseHandler = () => {
    onClose();
    mutateDynamicVouchers();
    mutateVouchers();
  };

  const openModal = (voucherID: number) => {
    if (voucherID !== openVoucher) {
      setOpenVoucher(voucherID);
    }
    onOpen();
  };

  return (
    <>
      <div className={styles.screen}>
        <div className={styles.container}>
          {vouchers?.data
            ? vouchers.data?.map((voucher) => (
                <VoucherCard
                  isRedeemable={false}
                  hasRedeemed
                  voucherID={voucher.voucher_id}
                  onClick={() => openModal(voucher.voucher_id)}
                />
              ))
            : arr.map(() => <VoucherCardSkeleton />)}

          {dynamicVouchers?.unredeemed
            ? dynamicVouchers.unredeemed?.map((voucher) => (
                <VoucherCard
                  isRedeemable
                  hasRedeemed={false}
                  voucherID={voucher.uuid}
                  onClick={() => openModal(voucher.uuid)}
                />
              ))
            : arr.map(() => <VoucherCardSkeleton />)}
        </div>
      </div>

      <VoucherModal
        onClose={onClose}
        isOpen={isOpen}
        voucher={voucher}
        isValidating={isValidating}
        redeemed={dynamicVouchers?.redeemed}
        onCloseHandler={onCloseHandler}
      />
    </>
  );
};

export default Home;
