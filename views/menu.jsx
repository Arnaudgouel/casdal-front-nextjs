import { Box, Modal } from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import logo from "../assets/img/casdal_500.png"
import { useMe } from "../hooks/useMe"
import { CartContext } from "../utils"
import api from "../utils/api"

const ProductCategoriesHeader = ({item}) => {
  return (
    <li className="nav-item">
      <a className="nav-link" href={`#scrollspycategory${item.id}`}>{item.name}</a>
    </li>
  )
}

const ProductsCategories = ({item, products}) => {
  return (
    <Fragment>
      <h4 id={`scrollspycategory${item.id}`} className="fs-2 mt-4">{item.name}</h4>
      <div className="row gy-3">
        {products.map(product => <Products key={product.id} item={product}/>)}
      </div>
    </Fragment>
  )
}

const Products = ({item}) => {
  const [open, setOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {me} = useMe();
  const {setPrice, setQuantity} = useContext(CartContext);


  const handleOnAddToCart = () => {
    let data = new FormData();
    data.append("product_id", item.id)
    data.append("quantity", cartQuantity)
    data.append("user_id", me.id)
    api.post('cart/items',data)
      .then(res => {
        setPrice(res.data.total.price)
        setQuantity(res.data.total.quantity)
        handleClose()
        setCartQuantity(1)
      })
  }

  return (
    <div className="col-md-4">
      <div className="bg-light p-2 shadow-sm" onClick={handleOpen}>
        <div className="row align-items-center">
          <div className="col-8">
            <p className="fw-bold">{item.name}</p>
            <p className="">{item.description}</p>
            <div>{(item.price/100).toFixed(2)} €</div>
          </div>
          <div className="col-4">
            {item.image && 
              <img className="img-fluid" src={require(`../assets/img/company/products/${item.image}`)} alt="produit" />
            }
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => {
          handleClose() 
          setCartQuantity(1)
          }
        }
        disableScrollLock={true}
      >
        <Box className="position-absolute top-50 start-50 translate-middle bg-light px-5 py-1 text-center mw-100">
          <h2>{item.name}</h2>
          {item.image &&
            <img src={require(`../assets/img/company/products/${item.image}`)} alt={item.name} className="img-fluid" width={"200px"} />
          }
          <div className="row justify-content-around mt-3">
            <div className="col-4">
              <i 
                className="bi bi-dash-circle" 
                onClick={() => {
                  if (cartQuantity > 1) setCartQuantity(cartQuantity-1)
                }} 
                style={{cursor: "pointer"}}
              ></i>
            </div>
            <div className="col-4">{cartQuantity}</div>
            <div className="col-4"><i className="bi bi-plus-circle" onClick={() => {setCartQuantity(cartQuantity+1)}} style={{cursor: "pointer"}}></i></div>
          </div>
          <button onClick={handleOnAddToCart} className="btn btn-primary mt-3 text-white">Ajouter au panier</button>
        </Box>
      </Modal>
    </div>
  )
}

const Menu = () => {

  const [address, setAddress] = useState()
  const [company, setCompany] = useState()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  let params = useParams()

  useEffect(() => {
    setIsLoaded(false)
    api.get(`companies/products`, {
      params : {
        company_id: params.id
      }
    })
      .then(res => {
        setProducts(res.data.products)
        setCategories(res.data.productsCategories)
        setAddress(res.data.address)
        setCompany(res.data.company)
        setIsLoaded(true)
      })
      .catch(error => {
        setError(error)
        setIsLoaded(true)
      })
  }, [params.id])

  if (error) {
    return <div>Erreur : {error.message}</div>
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
    <Fragment>
      <div className="bg-info container-fluid pt-5">
        <div className="row h-100 pb-2">
          <div className="col-md-4 text-center"><img src={require(`../assets/img/company/${company.image}`)} alt="logo restaurant" className="img-fluid w-50" /></div>
          <div className="col-md-8">
            <h2 className="fs-1">{company.name}</h2>
            <h3 className="fs-2">{company.category}</h3>
            <p className="fs-5">{`${address.address_line1} ${address.city} ${address.postal_code}`}</p>
          </div>
        </div>
      </div>
      <nav id="navbar-category" className="navbar navbar-expand-lg navbar-light bg-light px-3 sticky-top">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul className="nav nav-pills navbar-nav navbar-nav-scroll">
              {categories.map(category => <ProductCategoriesHeader key={category.id} item={category}/>)}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        {categories.map(category => <ProductsCategories key={category.id} item={category} products={products.filter(product => product.product_category_id === category.id)}/>)}
      </div>
    </Fragment>
  )
}

export { Menu }