import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const getAll = async () => {
      const res = await axios.get(baseUrl)
      setResources(res.data)
    }

    getAll()
  }, [baseUrl])

  const create = async (resource) => {
    const res = await axios.post(baseUrl, resource)
    setResources(preResources => preResources.concat(res.data))
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}
