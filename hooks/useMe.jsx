import { useEffect, useState } from "react"
import useStorage from "./useToken"


const useMe = () => {
  const [me, setMe] = useState(null)
  const token = useStorage()
  useEffect(() => {
    console.log(token)
    const getMe = () => {
      if (!token) {
        return null
      }
      return token
    }
    setMe(getMe())
  
    const removeMe = () => {
      removeToken()
      setMe(null)
      return me
    }
  
    return {
      me,
      removeMe
    }
  }, [])
  
}

export { useMe }