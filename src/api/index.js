const BASE_URL = 'https://app.grownu.com/api'

const request = async (url, method, params) => {
  const token = localStorage.getItem('token')
  const res = await fetch(
    `${BASE_URL}/${url}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    },
  ).catch(err => {
    console.log('REQUEST ERROR', err)
    return {ok: false}
  })
  if (res.ok) {
    if (res.headers.get('Content-Type') === 'application/json') {
      return await res.json()
    }
    return true
  } else {
    // const error = await res.json()
    // console.log(error)
  }
  return null
}

export const getCompanyEmployeesAll = async (companyId) => {
  const res = await request(`company/${companyId}/employees/all`, 'GET')
  return res
}