import React from "react"
import { Skeleton, SkeletonText } from "@chakra-ui/react"

import { useVoucher } from "api/voucher"
import { dateToString } from "utils/date"

import { Card, CardProps, Text, Heading } from "@commitUI/index"

import styles from "./VoucherCard.module.css"

export interface Props extends CardProps {
  voucherID: number
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLDivElement>
  isRedeemable: boolean
  hasRedeemed: boolean
}

const VoucherCard = ({
  voucherID,
  style,
  children,
  onClick,
  isRedeemable,
  hasRedeemed
}: Props): JSX.Element => {
  const { data: voucher } = useVoucher(voucherID)
  const isLoading = !voucher

  return isLoading ? (
    <VoucherCardSkeleton />
  ) : (
    <Card className={styles.container} onClick={onClick}>
      <>
        <div className={styles.imgContainer}>
          <img
            src={voucher && voucher.image}
            className={styles.img}
            alt="Voucher"
          />
        </div>

        <div className={styles.textContainer}>
          <Heading>{voucher?.name}</Heading>

          <div className={styles.description}>
            <Text>{`Provided by ${voucher?.organization}`}</Text>
            <Text>{`Promotion ends on ${dateToString(
              voucher?.expiry_date || ""
            )}`}</Text>
          </div>

          {(!isRedeemable || hasRedeemed) &&
            <Text>Flash this eVoucher to redeem</Text>}

          {isRedeemable && !hasRedeemed &&
            <Text>Click this eVoucher to redeem</Text>}

        </div>
      </>
    </Card>
  )
}

export const VoucherCardSkeleton = () => {
  return (
    <Card className={styles.container}>
      <div className={styles.imgContainer}>
        <Skeleton
          height="200px"
          startColor="gray.400"
          endColor="gray.400"
          className={styles.imgSkeleton}
        />
      </div>

      <div className={styles.textContainer}>
        <Skeleton
          width="180px"
          height="26px"
          startColor="gray.400"
          endColor="gray.400"
          className={styles.headingSkeleton}
        />

        <div className={styles.descriptionSkeletion}>
          <SkeletonText
            startColor="gray.400"
            endColor="gray.400"
            mt="2"
            noOfLines={2}
            spacing="3"
            width="280px"
          />
        </div>

        <SkeletonText
          startColor="gray.400"
          endColor="gray.400"
          mt="2"
          noOfLines={1}
          width="200px"
          height="16px"
        />
      </div>
    </Card>
  )
}

export default VoucherCard
