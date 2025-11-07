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
      signal: AbortSignal.timeout(3000),
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
  }
  console.log('RESPONSE ERROR', res.status, res.statusText)
  return null
}

export const getPlaces = async (companyId) => {
  const res = await request(`company/${companyId}/places`, 'GET')  
  return res
}

export const getCompanyInfo = async (companyId) => {
  const res = await request(`company/${companyId}/edit`, 'GET')
  return res
}

export const getCompanyHolidays = async (companyId, params) => {
  const res = await request(`company/${companyId}/holidays`, 'GET', params)
  return res
}

export const getCompanyWorkTimeSettings = async (companyId) => {
  const res = await request(`company/${companyId}/work-time`, 'GET')
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

export const getCompanyTimeOffs = async (companyId) => {
  const res = await request(`company/${companyId}/time-off`, 'GET')
  return res?.time_offs || []
}

export const createRequest = async (companyId, timeOffId, policyId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/store`, 'POST', data)
  return res
}

export const updateRequest = async (companyId, timeOffId, policyId, requestId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/${requestId}`, 'POST', data)
  return res
}

export const createAdjustBalance = async (companyId, timeOffId, policyId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/adjust-balance/store`, 'POST', data)
  return res
}

export const createAdjustTimeUsed = async (companyId, timeOffId, policyId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/adjust-time-used/store`, 'POST', data)
  return res
}

export const updateRequestStatus = async (companyId, timeOffId, policyId, requestId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/${requestId}/status`, 'POST', data)
  return res
}

export const updateRequestStatusBulk = async (companyId, data) => {
  const res = await request(`company/${companyId}/time-off/update-request-status`, 'POST', data)
  return res
}

export const getEmployeePolicies = async (companyId, employeeId) => {
  const res = await request(`company/${companyId}/time-off/all/policy/employee/${employeeId}`)
  if (Array.isArray(res?.policies)) {
    return res.policies
  }
  return []
}

export const getPolicyEmployee = async (companyId, timeOffId, policyId, employeeId) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/employee/${employeeId}`)
  return res
}

export const getTimeOffEmployeeRequests = async (companyId, employeeId) => {
  const res = await request(`company/${companyId}/time-off/all/policy/all/request-behalf/employee/${employeeId}`)
  if (Array.isArray(res?.request_behalf)) {
    return res.request_behalf
  }
  return []
}

export const removePolicyActivity = async (companyId, timeOffId, policyId, employeeId, activityId) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/employee/${employeeId}/activity/${activityId}`, 'DELETE')
  return res
}

export const updatePolicyActivity = async (companyId, timeOffId, policyId, employeeId, activityId, data) => {
  const res = await request(`company/${companyId}/time-off/${timeOffId}/policy/${policyId}/employee/${employeeId}/activity/${activityId}`, 'PATCH', data)
  return res
}

export const publishSchedule = async (companyId, data) => {
  const res = await request(`company/${companyId}/shift/publish`, 'POST', data)
  return res
}

export const notifySchedule = async (companyId, data) => {
  const res = await request(`company/${companyId}/shift/notify`, 'POST', data)
  return res
}

export const scheduleChangesLog = async (companyId, data) => {
  const res = await request(`company/${companyId}/shift/changes-log`, 'POST', data)
  return res
}

export const getCompanySkills = async (companyId) => {
  const res = await request(`company/${companyId}/specialities`, 'GET')
  return res
}

export const getAIGenerationSettings = async (companyId) => {
  const res = await request(`company/${companyId}/ai/schedule-generation-settings`, 'GET')
  return res
}

export const updateAIGenerationSettings = async (companyId, data) => {
  const res = await request(`company/${companyId}/ai/schedule-generation-settings`, 'POST', data)
  return res
}

export const generateAIShiftEvents = async (companyId, shiftId, data) => {
  const res = await request(`company/${companyId}/shift/${shiftId}/generate-ai-times`, 'PATCH', data)
  return res
}

export const updateDemandToolsForDate = async (companyId, shiftId, data) => {
  const res = await request(`company/${companyId}/shift/${shiftId}/demand-tools/update`, 'POST', data)
  return res
}
