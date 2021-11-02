export const state = () => ({
  devid: localStorage.getItem('developer-id'),
  companyid: localStorage.getItem('company-id')
})

export const mutations = {
  auth (state, data) {
    state.devid = data.devid
    state.companyid = data.companyid
  }
}