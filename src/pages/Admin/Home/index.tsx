import React from "react"
import { Column } from "react-table"

import { logout } from "api/auth"
import { getToken } from "utils/auth"
import useAuth from "hooks/useAuth"

import { Button, Table } from "@commitUI"

import styles from "./AdminHome.module.scss"

type AdminVoucher = {
  id: number
  posted_date: string
  available_date: string
  expiry_date: string
  name: string
  voucher_type: string
  description: string
  counter: number
  image: string
  code_uploaded: boolean
  organization: string
}

const MOCK_DATA = {
  count: 27,
  next:
    "https://evoucher-backend.herokuapp.com/api/voucher/?Available=&Faculty=&OrderBy=&Organization=NUSSU+Welfare&VoucherType=&page=2&page_size=10",
  previous: null,
  results: [
    {
      id: 27,
      posted_date: "2021-05-13T16:40:21Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-05-30T16:00:00Z",
      name: "Flash Coffee",
      voucher_type: "Food",
      description:
        "50% off all drinks (except bottled) at YIH\n\nTerms and conditions:\n1. Coupon Code is valid for 1 time use only\n2. Promo code is valid on all drinks (hot/iced) except for bottled drinks\n3. Valid for use until 31 May 2021\n\nTo redeem: \n1. Download Flash Coffee App, create an account with us.\n 2. Choose your drink of choice and enter the promo code 'NUS50' upon checkout",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Flash_Coffee_Voucher.jpg?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=EWEiPEagoiR733nPJ%2FE86%2B%2BCdnc%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 47,
      posted_date: "2021-05-13T16:40:27Z",
      available_date: "2021-03-31T16:00:00Z",
      expiry_date: "2021-12-30T16:00:00Z",
      name: "Soot Kopi",
      voucher_type: "Food",
      description: "10% off with no minimum spending with code NUSSUKOPI10",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Soot_Kopi_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=VnezfAwLjTrVhbJIn33uuN9eBdA%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 29,
      posted_date: "2021-05-13T16:39:46Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-07-30T16:00:00Z",
      name: "Heritage Collection",
      voucher_type: "Others",
      description: "10% off using code HCXNUSSU",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Heritage_Collection_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=%2BNdTezx7e0RmF2JS6lRQVVRWzx4%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 44,
      posted_date: "2021-05-13T16:39:52Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-12-30T16:00:00Z",
      name: "Wes Medical Care",
      voucher_type: "Others",
      description: "$2 off with min. order of 10 boxes",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Wes_Medical_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=yuWXqWJFyUbmEkRVm29vH7fpafY%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 31,
      posted_date: "2021-05-13T16:39:57Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-06-14T16:00:00Z",
      name: "KUNDAL",
      voucher_type: "Others",
      description: "10% off min. $30 on Shopee",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/KUNDAL_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=0IWyZFgtsHH14W07%2BEy8ueyKTs8%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 35,
      posted_date: "2021-05-13T16:40:04Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-12-30T16:00:00Z",
      name: "Mofo Chili",
      voucher_type: "Food",
      description: "20% off with code NUSSU",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Mofo_Chili_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=aHX4kgTxz99sTqhgX%2F%2Bj%2FaNqAhY%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 37,
      posted_date: "2021-05-13T16:40:09Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-12-30T16:00:00Z",
      name: "NinjaVan",
      voucher_type: "Others",
      description: "$3 for all Regular Ninja Packs",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/NinjaVan_Ninja_Packs_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=%2BGM4mEpJNZ%2B0bmxsAXBaDNPYi0w%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 20,
      posted_date: "2021-05-13T16:40:33Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-09-16T16:00:00Z",
      name: "Acai Fix",
      voucher_type: "Food",
      description: "10% off 1 regular Acai Bowl",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Acai_Fix_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=KHdSO5q25tXVZHTrm%2FXzSPWb120%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 25,
      posted_date: "2021-05-13T16:40:39Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-12-30T16:00:00Z",
      name: "Burger & Pasta",
      voucher_type: "Food",
      description: "10% off min. $20 spending",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Burger__Pasta_e-voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=k62dN5bS2FNE1jNJYQSbYJYi4VE%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
    {
      id: 43,
      posted_date: "2021-05-13T16:40:50Z",
      available_date: "2021-04-20T16:00:00Z",
      expiry_date: "2021-05-29T16:00:00Z",
      name: "Wear Peachi",
      voucher_type: "Fashion",
      description: "15% off with code PEACHIXNUSSU",
      counter: 0,
      image:
        "https://s3.ap-southeast-1.amazonaws.com/evoucher-bucket2/images/Wear_Peachi_Voucher.png?AWSAccessKeyId=AKIAXKP65BHU3UH3VKOZ&Signature=vRD4niXGodoCJAEWTslEjChdvrg%3D&Expires=1626539837",
      code_uploaded: false,
      organization: "NUSSU Welfare",
    },
  ],
}

const Home = () => {
  const { logout: localLogout } = useAuth()

  const columns = React.useMemo<Column<AdminVoucher>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Voucher Name",
        accessor: "name",
      },
      {
        Header: "Available Date",
        accessor: "available_date",
      },
      {
        Header: "Expiry Date",
        accessor: "expiry_date",
      },
      {
        Header: "Voucher Type",
        accessor: "voucher_type",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Claims Left",
        accessor: "counter",
      },
    ],
    []
  )

  return (
    <div className={styles.screen}>
      <h1>Admin Home Page</h1>

      <Table
        data={MOCK_DATA.results}
        columns={columns}
        className={styles.table}
      />

      <Button
        onClick={() => {
          const token = getToken()
          console.log(token)
          logout({ refresh_token: token!.refresh })
          localLogout()
        }}
      >
        Log out
      </Button>
    </div>
  )
}

export default Home

type Data = {
  fromUnit: string
  toUnit: string
  factor: number
}
