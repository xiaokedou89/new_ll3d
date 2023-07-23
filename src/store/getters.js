const getters = {
  token: state => state.user.token,
  userId: state => state.user.userId,
  userInfo: state => state.user.userInfo,
  config: state => state.config.config,
  user: state => state.config.user
};
export default getters;