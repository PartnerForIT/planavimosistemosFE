const BASE_URL = 'https://staging.grownu.com/api'

const request = async (url, method, params) => {
  const token = localStorage.getItem('token')
  const query = method === 'GET' && params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(
    `${BASE_URL}/${url}${query}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      ...(method !== 'GET' ? {body: JSON.stringify(params)} : null),
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

export const getPlaces = async (companyId) => {
  const res = await request(`company/${companyId}/places`, 'GET')  
  return res
}

export const getCompanyEmployeesAll = async (companyId) => {
  const res = await request(`company/${companyId}/employees/all`, 'GET')
  return res
}

export const getCompanyTimeOffRequests = async (companyId, params) => {
  const res = await request(`company/${companyId}/time-off/all/policy/all/request-behalf/employee/all`, 'GET', params)
  return res
}

export const getCompanyTimeOffPolicies = async (companyId) => {
  const res = await request(`company/${companyId}/time-off/all/policy`, 'GET')
  return res
}