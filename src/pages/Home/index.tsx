import React, { useState } from "react"

import useModal from "hooks/useModal"
import { useDynamicVouchers, useVoucher, useVouchers } from "api/voucher"
import { useUser } from "api/user"

import VoucherCard, { VoucherCardSkeleton } from "components/VoucherCard"
import VoucherModal from "components/VoucherModal"
import Navbar from "components/Navbar"

const Home = () => {
  const { isOpen, onClose, onOpen } = useModal()
  const { data: user } = useUser();
  const { data: vouchers } = useVouchers("e0123456789@u.nus.edu") // placeholder email
  const { data: dynamicVouchers } = useDynamicVouchers()//"e0123456789@u.nus.edu") // placeholder email
  const [openVoucher, setOpenVoucher] = useState<number>(0)
  const { data: voucher, isValidating } = useVoucher(openVoucher)
  const arr = React.useMemo(() => [...Array(20)], [])

  //   useEffect(() => {
  //     if (openVoucher === 0) revalidate()
  //   })

  const openModal = (voucherID: number) => {
    if (voucherID !== openVoucher) {
      setOpenVoucher(voucherID)
    }
    onOpen()
  }

  return (
    <>
      <div style={{ backgroundColor: "#fff", margin: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {vouchers?.data
            ? vouchers.data?.map((voucher) => (
                <VoucherCard
                  isRedeemable = {false}
                  voucherID={voucher.voucher_id}
                  onClick={() => openModal(voucher.voucher_id)}
                />
              ))
            : arr.map(() => <VoucherCardSkeleton />)}

          {dynamicVouchers?.data
            ? dynamicVouchers.data?.map((voucher) => (
                <VoucherCard
                  isRedeemable = {true}
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
        user={user}
      />
    </>
  )
}

export default Home
