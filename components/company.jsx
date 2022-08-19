import Link from "next/link"
import Image from "next/image";
import { useRouter } from "next/router"
import { Fragment, useEffect, useState } from "react"
import API from "../utils/api"


const CompanyItem = ({className, item}) => {

  let image = require(`../img/company/restaurant.jpg`)
  if (null !== item.image) {
    image = require(`../img/company/${item.image}`)
  }

  return (
    <div className={`${className}`}>
      <Link href={`/menu/${item.id}`} className="text-decoration-none text-black">
        <div className="h-100 bg-white shadow">
          <Image className="img-fluid" src={image} alt="company logo" />
          <div className="fw-bold">{item.name}</div>
          <div>{item.category}</div>
        </div>
      </Link>
    </div>
  )
}

const Company = ({filter}) => {
  const [companies, setCompanies] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  let {query} = useRouter()
  let url = "companies"


  switch (filter) {
    case "category":
      url = `companies/category?category_id=${query.categoryId}`
      break;
  
    default:
      break;
  }


  useEffect(() => {
    setIsLoaded(false)
    API.get(`${url}`)
      .then(res => {
        setCompanies(res.data)
        setIsLoaded(true)
      })
      .catch(error => {
        setError(error)
        setIsLoaded(true)
      })
  }, [url])

  if (error) {
    return <div>Erreur : {error.message}</div>
  }
  else if (!isLoaded) {
    return (
      <div className="row rows-col-md-3 rows-col-sm-2 rows-col-1">
        <div className="card" aria-hidden="true">
          <div className="card-body">
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-6"></span>
            </h5>
            <p className="card-text placeholder-glow">
              <span className="placeholder col-7"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-8"></span>
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Fragment>
      <div>
        <h3>Restaurants</h3>
      </div>
      <div className="row gy-3 justify-content-around align-items-stretch">
        {companies.map(company => <CompanyItem key={company.id} item={company} className="col-6 col-lg-2" ></CompanyItem>)}
      </div>
    </Fragment>
  )
}

export { Company }