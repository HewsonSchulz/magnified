import { apiUrl, fetchOptions } from '../helper'

export const getUserById = async (id) => {
  return await fetch(`${apiUrl}/users/${id}`).then((res) => res.json())
}

export const getUserByEmail = async (email) => {
  return await fetch(`${apiUrl}/users?email=${email}`).then((res) => res.json())
}

export const createUser = async (user) => {
  return await fetch(`${apiUrl}/users`, fetchOptions('POST', user)).then(
    (res) => res.json()
  )
}