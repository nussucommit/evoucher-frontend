import React, { useState, useEffect, useLayoutEffect } from "react"
import { Skeleton, SkeletonText } from "@chakra-ui/react"

import {
  redeemVoucher
} from "api/voucher"

import usePrevious from "hooks/usePrevious"
import { useUser } from "api/user"
import { dateToString } from "utils/date"
import { Emails } from "constants/email"

import { Modal, ModalProps, Heading, Text, Button } from "@commitUI/index"

import styles from "./VoucherModal.module.css"

type Props = Omit<ModalProps, "children"> & {
  voucher?: Voucher
  isValidating: boolean
  redeemed?: String[] | undefined
  onCloseHandler: () => void
}

const VoucherModal = ({ onCloseHandler, redeemed, voucher, isOpen, onClose, isValidating }: Props) => {
  const { data: user } = useUser();
  const currVoucher = voucher?.uuid
  const prevVoucher = usePrevious(currVoucher)
  const [loading, setLoading] = useState(
    isValidating || prevVoucher !== currVoucher
  )
  const isRedeemed = redeemed?.includes(voucher?.uuid || "")
  const isDynamic = voucher?.voucher_type === "Dinamically allocated"

  const handleRedeem = async () => {
    const data = {
      voucher: voucher?.uuid,
      email: user?.username + Emails.studentDomain
    }
    await redeemVoucher(data).then(() =>
      onCloseHandler()
    );
  }

  // VoucherModal does not unmount when we close it, hence the loading state is not reset on each open
  // Hence we have to use useLayoutEffect to "reset" this component on every open
  useLayoutEffect(() => {
    if (prevVoucher !== currVoucher) {
      setLoading(isValidating)
    }
  }, [currVoucher, prevVoucher, isValidating])

  useEffect(() => {
    if (!isValidating && loading) {
      setLoading(false)
    }
  }, [isValidating, loading])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      isCentered
    >
      {loading ? (
        <VoucherModalSkeleton />
      ) : (
        <>
          <Heading>{voucher?.name}</Heading>

          <div className={styles.subheader}>
            <Text
              className={styles.provider}
            >{`Provided by ${voucher?.organization}`}</Text>
            <Text>{`Promotion ends on ${dateToString(
              voucher?.expiry_date || ""
            )}`}</Text>
          </div>

          <img src={voucher?.image} className={styles.img} alt="Voucher" />

          <Text
            className={styles.description}
          >{`${voucher?.description}`}</Text>

          <hr />

          {isDynamic && 
            <Text className={styles.footer}>Flash this eVoucher to redeem.</Text>}

          {isDynamic &&  !isRedeemed &&
            
            <Button
              className={styles.btn}
              onClick={handleRedeem}
              >
              Redeem
            </Button>}

            {isDynamic && isRedeemed && 
            
            <Button
              className={styles.btn}
              disabled = {true}
              >
              Voucher has already been redeemed
            </Button>}

        </>
      )}
    </Modal>
  )
}

const VoucherModalSkeleton = () => {
  return (
    <>
      <Skeleton fadeDuration={2}>
        <Heading>Blablabla</Heading>
      </Skeleton>

      <div className={styles.subheader}>
        <SkeletonText mt="2" noOfLines={2} spacing="2" width="200px" />
      </div>

      <Skeleton height="160px" />

      <SkeletonText
        mt="2"
        noOfLines={3}
        spacing="2"
        className={styles.description}
      />

      <hr />

      <SkeletonText
        mt="2"
        noOfLines={1}
        spacing="2"
        className={styles.footer}
      />
    </>
  )
}

export default VoucherModal
