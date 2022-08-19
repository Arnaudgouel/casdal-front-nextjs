import { useMe } from "./useMe"

const useLogged = () => {
  const {me} = useMe();
  return me !== null
}

export { useLogged }