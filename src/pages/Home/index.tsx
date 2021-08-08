import React, { useState, useEffect } from "react"

import useModal from "hooks/useModal"
import { useVoucher, useVouchers } from "api/voucher"

import VoucherCard, { VoucherCardSkeleton } from "components/VoucherCard"
import VoucherModal from "components/VoucherModal"
import Navbar from "components/Navbar"

const Home = () => {
  const { isOpen, onClose, onOpen } = useModal()
  const { data: vouchers } = useVouchers("e0412934@u.nus.edu") // placeholder email
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
      <Navbar />
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
                  voucherID={voucher.voucher_id}
                  onClick={() => openModal(voucher.voucher_id)}
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
      />
    </>
  )
}

export default Home
