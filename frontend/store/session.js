export const state = () => ({
  devid: localStorage.getItem('developer-id'),
  companyid: localStorage.getItem('company-id'),
  adminid: localStorage.getItem('admin-id')
})

export const mutations = {
  auth (state, data) {
    state.devid = data.devid
    state.companyid = data.companyid
    state.adminid = data.adminid
  }
}