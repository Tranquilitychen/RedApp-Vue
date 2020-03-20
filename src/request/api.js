/**
 * api接口统一管理
 */
import { get, post } from "./http";

// 权限登录
export const apiCheckLogin = p => post("login/checkLogin", p);

/* RoomlbController */

// 获取所有的 客房类型 信息
export const apiRoomlbData = p => get("type/getAllRoomlbData", p);
// 新增 客房类型 信息
export const apiInsRoomlbInfo = p => post("type/insRoomlb", p);
// 修改 客房类型 信息
export const apiUpdRoomlbInfo = p => post("type/updRoomlb", p);
// 删除 客房类型 信息
export const apiDelRoomlbForRoomlbno = p =>
  post("type/delRoomlbForRoomlbno", p);

/* FloorController */
// 获取所有的 楼层 信息
export const apiFloorData = p => get("floor/getAllFloorData", p);
// 新增楼层信息
export const apiInsFloorData = p => post("floor/insFloor", p);
// 更新楼层信息
export const apiUpdFloorData = p => post("floor/updFloor", p);
// 删除楼层信息
export const apiDelFloorForFloorno = p => post("floor/delFloor", p);

/* RoomController */

// 获取所有的 客房 信息
export const apiRoomData = p => get("room/getAllRoomData", p);
// 获取所有的 空房 信息
export const apiEmptyRoomData = p => get("room/getEmptyRoomData", p);
// 获取所有的 脏房 信息
export const apiDirtyRoomData = p => get("room/getDirtyRoomData", p);
// 插入单个房间信息
export const apiInsertSingleRoomData = p => post("room/insertRoomData", p);
// 批量插入房间信息
export const apiInsertBatchRoomData = p => post("room/insertBatchRoom", p);
// 清洁房间
export const apiupdCleanRoom = p => post("room/updCleanRoom", p);
/* RegController */

// 获取所有账单信息
export const apiRegData = p => get("reg/getAllReg", p);
// 创建账单信息
export const apiInsertRegin = p => post("reg/insRegData", p);

/* BookingController */
// 获取所有预定信息
export const apiBookingData = p => get("booking/getValidBooking", p);
// 预定查询中需要的预定信息
export const apiQueryBookingData = p => get("booking/selQueryBooking", p);
// 创建预定信息
export const apiInsertBooking = p => post("booking/insBookingData", p);

// 预定转入住
export const apiInsRegForBooking = p => post("booking/insRegForBooking", p);
// 散客取消预定
export const apiCancelGuestBooking = p => post("booking/cancelGuestBooking", p);
// 团体取消预定
export const apiCalcelTeamBooking = p => post("booking/cancelTeamBooking", p);

/* BussinessCenterController */

// 营业中心 所有 数据
export const apiBussinessCenterData = p =>
  get("bussinessCenter/getAllBCData", p);
// 修改预定房间但未入住的房间状态
export const apUpdBookingRoomRstatus = p =>
  post("bussinessCenter/bookingUpRoomRstatus", p);
// 超时取消预订
export const apiOverTimeBooking = p =>
  post("bussinessCenter/overTimeBooking", p);
// 续房
export const apiRoomqtyReg = p => post("bussinessCenter/roomqtyReg", p);
// 退房
export const apiCloseReg = p => post("bussinessCenter/closeReg", p);

// 联房
export const apiLinkRoomReg = p => post("reg/updRegLinkData", p);
// 联房
export const apiUnpackRoomReg = p => post("reg/updRegUnpackData", p);

// 消费项目资料
export const apiGetAllItems = p => get("item/selAllItems", p);
export const apiInsItem = p => post("item/insItemData", p);
export const apiUpdateItem = p => post("item/updItemData", p);
export const apiDelItem = p => post("item/delItemData", p);
// 消费账单
export const apiRegBillForRegno = p => get("reg/selRegBillForRegno", p);
export const apiInsRegBills = p => post("reg/insRegBills", p);
export const apiDelRegBill = p => post("reg/delRegBill", p);

// 换房
export const apiSwapRoom = p => post("bussinessCenter/swapRoom", p);

// 客人列表
export const apiGuestData = p => post("guest/getAllGuestData", p);
// 获取明细账单
export const apiAllPayDetailed = p => get("payDetailed/selAllData", p);
