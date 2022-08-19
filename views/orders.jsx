import { Box, Modal } from "@mui/material"
import { Fragment, useEffect, useState } from "react"
import { useMe } from "../hooks/useMe"
import api from "../utils/api"

const OrderItems = ({item}) => {
  return (
    <div className="row justify-content-around mt-3">
      <div className="col-4">{item.quantity} X</div>
      <div className="col-4">{item.name}</div>
      <div className="col-4">{(item.price/100).toFixed(2)} €</div>
    </div>
  )
}

const Order = ({item}) => {
  const [open, setOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const handleOpen = () => {
    api.get("orders/items", {
      params: {
        "order_id": item.id
      }
    })
      .then(res => setOrderItems(res.data))
    setOpen(true)
  };
  const handleClose = () => setOpen(false);
  let date = new Date(item.created_at)
  return (
    <Fragment>
      <div className="shadow-sm rounded" onClick={handleOpen} style={{cursor:"pointer"}}>
        <h2 className="mb-2">
          {item.reference}
        </h2>
        <p className="fw-bold">Le {date.toLocaleDateString()}</p>
        <p className="fw-bold">Restaurant : {item.name}</p>
        <p><span className="fw-bold">Statut de la commande :</span> {item.status}</p>
        <p><span className="fw-bold">Total :</span> {(item.total/100).toFixed(2)} €</p>
      </div>
      <Modal
        open={open}
        onClose={() => {
          handleClose()
          }
        }
      >
        <Box className="position-absolute top-50 start-50 translate-middle bg-light px-5 py-1 text-center">
          <h2>{item.reference}</h2>
          {orderItems.map(orderItem => <OrderItems key={orderItem.id} item={orderItem}/>)}
        </Box>
      </Modal>
    </Fragment>
  )
}

const Orders = () => {
  const [isLoaded, setLoaded] = useState(false)
  const [error, setError] = useState()
  const [orders, setOrders] = useState([])
  const {me} = useMe();
  useEffect(() => {
    setLoaded(false)
    api.get("orders/users",{
      params: {
        "user_id": me?.id
      }
    })
      .then(res => {
        setLoaded(true)
        setOrders(res.data)
      })
      .catch(error => {
        setError(error)
        setLoaded(true)
      })
  }, [me])

  if (error) {
    return <div>{error}</div>
  }
  else if (!isLoaded) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }
  return (
    <div className="container my-5 bg-white shadow rounded-3 p-4">
      <h2 className="text-center mb-4">Vos Commandes</h2>
      <div className="row gy-4">
        {orders.map(order => <Order key={order.id} item={order}/>)}
      </div>
    </div>
  )
}

export { Orders }