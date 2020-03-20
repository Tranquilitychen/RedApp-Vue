// 实时监听state值的变化（最新状态）, 相当与 computed计算属性
const getters = {
  userInfo: state => state.userInfo.userInfo
};
export default getters;
