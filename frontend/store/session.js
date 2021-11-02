export const state = () => ({
  devid: undefined,
  companyid: undefined,
  adminid: undefined,
  role: undefined
})

export const mutations = {
  auth (state, { id, role }) {

    if (role === 'ADMIN') {
      state.adminid = id
      console.log(id)
    } else if (role === 'COMPANY') {
      state.companyid = id
      console.log(id)
    } else if (role === 'DEVELOPER') {
      state.devid = id
      console.log(id)
    }

    state.role = role
  }
}
