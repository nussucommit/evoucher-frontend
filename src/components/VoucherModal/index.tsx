import React, { useState, useEffect, useLayoutEffect } from "react"
import { Skeleton, SkeletonText } from "@chakra-ui/react"

import {
  redeemVoucher
} from "api/voucher"

import usePrevious from "hooks/usePrevious"
import { dateToString } from "utils/date"

import { Modal, ModalProps, Heading, Text, Button } from "@commitUI/index"

import styles from "./VoucherModal.module.css"

type Props = Omit<ModalProps, "children"> & {
  voucher?: Voucher
  isValidating: boolean
  user?: User
  redeemed?: String[] | undefined
  onCloseHandler: VoidFunction
}

const VoucherModal = ({ onCloseHandler, redeemed, user, voucher, isOpen, onClose, isValidating }: Props) => {
  const currVoucher = voucher?.uuid
  const prevVoucher = usePrevious(currVoucher)
  const [loading, setLoading] = useState(
    isValidating || prevVoucher !== currVoucher
  )

  const handleRedeem = async () => {
    const data = {
      voucher: voucher?.uuid,
      email: user?.username + "@u.nus.edu"
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

          {voucher?.voucher_type !== "Dinamically allocated" && 
            <Text className={styles.footer}>Flash this eVoucher to redeem.</Text>}

          {voucher?.voucher_type === "Dinamically allocated" &&  !redeemed?.includes(voucher?.uuid || "") &&
            
            <Button
              className={styles.btn}
              onClick={handleRedeem}
              >
              Redeem
            </Button>}

            {voucher?.voucher_type === "Dinamically allocated" && redeemed?.includes(voucher?.uuid || "") && 
            
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
