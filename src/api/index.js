import config from '../config'

const BASE_URL = config.api.url

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

export const getCompanyHolidays = async (companyId, params) => {
  const res = await request(`company/${companyId}/holidays`, 'GET', params)
  return res
}

export const getCompanyEmployeesAll = async (companyId) => {
  const res = await request(`company/${companyId}/employees/all`, 'GET')
  return res
}

export const getCompanyShifts = async (companyId, params) => {
  const res = await request(`company/${companyId}/shift`, 'GET', params)
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

export const createRequest = async (companyId, timeOffId, policyId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/store`, 'POST', data)
  return res
}

export const updateRequest = async (companyId, timeOffId, policyId, requestId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/${requestId}`, 'POST', data)
  return res
}

export const getEmployeePolicies = async (companyId, employeeId) => {
  const res = await request(`company/${companyId}/time-off/all/policy/employee/${employeeId}`)
  if (Array.isArray(res?.policies)) {
    return res.policies
  }
  return []
}

export const getTimeOffEmployeeRequests = async (companyId, employeeId) => {
  const res = await request(`company/${companyId}/time-off/all/policy/all/request-behalf/employee/${employeeId}`)
  if (Array.isArray(res?.request_behalf)) {
    return res.request_behalf
  }
  return []
}