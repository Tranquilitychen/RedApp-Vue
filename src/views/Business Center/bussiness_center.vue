<template>
  <div>
    <!-- 营业中心 -->
    <div class="d-flex flex-row">
      <div>
        <!-- 操作按钮 -->
        <div style="padding:0px;">
          <el-row>
            <div class="div-flex-row">
              <div
                v-for="(btn, index) in groupButton"
                :key="'opeartion' + index"
              >
                <el-button
                  :icon="btn.icon"
                  :style="{
                    'background-color': btn.color,
                    color: btn.fontColor
                  }"
                  class="operation-btn"
                  @click="selectorMethos(btn.event)"
                >
                  <br />
                  {{ btn.content }}
                </el-button>
              </div>
            </div>
          </el-row>
        </div>
        <!-- 房间类型 -->
        <div class="div-flex-row">
          <div class="tab-left">
            <!-- 房间类型的 for循环 -->
            <el-tabs
              v-model="activeTypeName"
              type="border-card"
              class="el-tabs-class"
              v-loading="tabsLoading"
            >
              <el-tab-pane
                v-for="(type, index) in roomType"
                :key="'type' + index"
                :label="type.roomlbname"
                :name="type.roomlbno"
              >
                <div class="table-content">
                  <!-- 显示全部房间 -->
                  <template v-if="type.roomlbno == '00'">
                    <!-- 显示房间信息 -->
                    <div class="tab-space">
                      <div
                        v-for="(bsjson, index) in bsJson"
                        :key="index"
                        class="room-button"
                        :class="{
                          'empty-green': bsjson.room.rstatus == '0',
                          'living-yellow': bsjson.room.rstatus == '1',
                          'book-violet': bsjson.room.rstatus == '2',
                          'dirty-blueness': bsjson.room.rstatus == '3',
                          'self-orange': bsjson.room.rstatus == '4',
                          'repair-red': bsjson.room.rstatus == '5'
                        }"
                        @click="roomInfo(bsjson, index)"
                      >
                        <!-- 空房信息 -->
                        <template v-if="bsjson.room.rstatus == '0'">
                          <div class="btn-roomname">
                            <div class="d-flex flex-row">
                              <div class="info-roomname">
                                {{ bsjson.room.roomname }}
                              </div>
                              <v-chip
                                class="ma-2 title-chip rstatu-chip"
                                color="#4c221b"
                                outlined
                                x-small
                              >
                                空房
                              </v-chip>
                            </div>
                            <div
                              v-if="selectedBtnWithIcon == index"
                              class="choose-btn"
                            >
                              <v-icon>mdi-check-circle-outline</v-icon>
                            </div>
                          </div>
                          <v-divider></v-divider>
                          <div class="btn-room-info">
                            <div class="btn-info">
                              <div class="info-roomlbname">
                                {{ bsjson.roomlb.roomlbname }}
                              </div>
                              <div class="info-price">
                                单价：{{ bsjson.roomlb.price }}
                              </div>
                              <div class="info-floor">
                                楼层：{{ bsjson.floor.floorname }}
                              </div>
                            </div>
                            <div class="btn-title">
                              <div v-if="bsjson.booking != null">
                                <v-chip
                                  class="ma-2 title-chip"
                                  color="#a98175"
                                  outlined
                                  x-small
                                >
                                  被预定
                                </v-chip>
                              </div>
                            </div>
                          </div>
                        </template>
                        <!-- 在住房信息 -->
                        <template v-if="bsjson.room.rstatus == '1'">
                          <div class="btn-roomname">
                            <div class="d-flex flex-row">
                              <div class="info-roomname">
                                {{ bsjson.room.roomname }}
                              </div>
                              <v-chip
                                class="ma-2 title-chip rstatu-chip"
                                color="#4c221b"
                                outlined
                                x-small
                              >
                                在住
                              </v-chip>
                            </div>
                            <div
                              v-if="selectedBtnWithIcon == index"
                              class="choose-btn"
                            >
                              <v-icon>mdi-check-circle-outline</v-icon>
                            </div>
                          </div>
                          <v-divider></v-divider>
                          <div class="btn-room-info">
                            <div class="btn-info">
                              <div class="info-guestname">
                                {{ bsjson.guest.guestname }}
                              </div>
                              <div class="info-roomlbname">
                                {{ bsjson.roomlb.roomlbname }}
                              </div>
                              <div class="info-price">
                                价格：{{ bsjson.reg.price }}
                              </div>
                              <div class="info-floor">
                                楼层：{{ bsjson.floor.floorname }}
                              </div>
                            </div>
                            <div class="btn-title">
                              <div v-if="bsjson.booking != null">
                                <v-chip
                                  class="ma-2 title-chip"
                                  color="#a98175"
                                  outlined
                                  x-small
                                >
                                  被预定
                                </v-chip>
                              </div>
                              <div v-if="bsjson.reg.linkid != 0">
                                <v-chip
                                  class="ma-2 title-chip link-chip"
                                  color="#e2041b"
                                  outlined
                                  x-small
                                >
                                  <div
                                    v-if="
                                      bsjson.reg.linkno == bsjson.reg.roomno
                                    "
                                  >
                                    主
                                  </div>
                                  联{{ bsjson.reg.linkid }}
                                </v-chip>
                              </div>
                              <div v-if="bsjson.reg.groupid != 0">
                                <v-chip
                                  class="ma-2 title-chip link-chip"
                                  color="#e2041b"
                                  outlined
                                  x-small
                                  >团体{{ bsjson.reg.groupid }}</v-chip
                                >
                              </div>
                            </div>
                          </div>
                        </template>
                        <!-- 预定房信息 -->
                        <template v-if="bsjson.room.rstatus == '2'">
                          <div class="btn-roomname">
                            <div class="d-flex flex-row">
                              <div class="info-roomname">
                                {{ bsjson.room.roomname }}
                              </div>
                              <v-chip
                                class="ma-2 title-chip rstatu-chip"
                                color="#4c221b"
                                outlined
                                x-small
                              >
                                预定
                              </v-chip>
                            </div>
                            <div
                              v-if="selectedBtnWithIcon == index"
                              class="choose-btn"
                            >
                              <v-icon>mdi-check-circle-outline</v-icon>
                            </div>
                          </div>
                          <v-divider></v-divider>
                          <div class="btn-room-info">
                            <div class="btn-info">
                              <div class="info-guestname">
                                {{ bsjson.guest.guestname }}
                              </div>
                              <div class="info-roomlbname">
                                {{ bsjson.roomlb.roomlbname }}
                              </div>
                              <div class="info-price">
                                价格：{{ bsjson.room.price }}
                              </div>
                              <div class="info-floor">
                                楼层：{{ bsjson.floor.floorname }}
                              </div>
                              <div class="info-floor">
                                押金：{{ bsjson.booking.securityReal }}
                              </div>
                            </div>
                            <div class="btn-title">
                              <div v-if="bsjson.booking != null">
                                <v-chip
                                  class="ma-2 title-chip"
                                  color="#4c221b"
                                  outlined
                                  x-small
                                >
                                  预定
                                </v-chip>
                              </div>
                              <div v-if="bsjson.booking.linkno != null">
                                <v-chip
                                  class="ma-2 title-chip link-chip"
                                  color="#e2041b"
                                  outlined
                                  x-small
                                >
                                  联房
                                </v-chip>
                              </div>
                              <div v-if="bsjson.booking.groupno != null">
                                <v-chip
                                  class="ma-2 title-chip link-chip"
                                  color="#e2041b"
                                  outlined
                                  x-small
                                  >团体</v-chip
                                >
                              </div>
                            </div>
                          </div>
                        </template>
                        <!-- 脏房信息 -->
                        <template v-if="bsjson.room.rstatus == '3'">
                          <div class="btn-roomname">
                            <div class="d-flex flex-row">
                              <div class="info-roomname">
                                {{ bsjson.room.roomname }}
                              </div>
                              <v-chip
                                class="ma-2 title-chip rstatu-chip"
                                color="#4c221b"
                                outlined
                                x-small
                              >
                                脏房
                              </v-chip>
                            </div>
                            <div
                              v-if="selectedBtnWithIcon == index"
                              class="choose-btn"
                            >
                              <v-icon>mdi-check-circle-outline</v-icon>
                            </div>
                          </div>
                          <v-divider></v-divider>
                          <div class="btn-room-info">
                            <div class="btn-info">
                              <div class="info-roomlbname">
                                {{ bsjson.roomlb.roomlbname }}
                              </div>
                              <div class="info-price">
                                价格：{{ bsjson.room.price }}
                              </div>
                              <div class="info-floor">
                                楼层：{{ bsjson.floor.floorname }}
                              </div>
                            </div>
                            <div class="btn-title">
                              <div v-if="bsjson.booking != null">
                                <v-chip
                                  class="ma-2 title-chip"
                                  color="#a98175"
                                  outlined
                                  x-small
                                >
                                  被预定
                                </v-chip>
                              </div>
                            </div>
                          </div>
                        </template>
                        <!-- 自用房信息 -->
                        <template v-if="bsjson.room.rstatus == '4'">
                          <div>{{ bsjson.room.roomname }}</div>
                          <div>{{ bsjson.roomlb.roomlbname }}</div>
                        </template>
                        <!-- 维修房信息 -->
                        <template v-if="bsjson.room.rstatus == '5'">
                          <div>{{ bsjson.room.roomname }}</div>
                          <div>{{ bsjson.roomlb.roomlbname }}</div>
                        </template>
                      </div>
                    </div>
                  </template>
                  <!-- 显示其他类别的房间 -->
                  <template v-else>
                    <div class="tab-space">
                      <template v-for="(bsjson, index) in bsJson">
                        <div
                          v-if="bsjson.room.roomlbno == activeTypeName"
                          class="room-button"
                          :key="index"
                          :class="{
                            'empty-green': bsjson.room.rstatus == '0',
                            'living-yellow': bsjson.room.rstatus == '1',
                            'book-violet': bsjson.room.rstatus == '2',
                            'dirty-blueness': bsjson.room.rstatus == '3',
                            'self-orange': bsjson.room.rstatus == '4',
                            'repair-red': bsjson.room.rstatus == '5'
                          }"
                          @click="roomInfo(bsjson, index)"
                        >
                          <!-- 空房信息 -->
                          <template v-if="bsjson.room.rstatus == '0'">
                            <div class="btn-roomname">
                              <div class="d-flex flex-row">
                                <div class="info-roomname">
                                  {{ bsjson.room.roomname }}
                                </div>
                                <v-chip
                                  class="ma-2 title-chip rstatu-chip"
                                  color="#4c221b"
                                  outlined
                                  x-small
                                >
                                  空房
                                </v-chip>
                              </div>
                              <div
                                v-if="selectedBtnWithIcon == index"
                                class="choose-btn"
                              >
                                <v-icon>mdi-check-circle-outline</v-icon>
                              </div>
                            </div>
                            <v-divider></v-divider>
                            <div class="btn-room-info">
                              <div class="btn-info">
                                <div class="info-roomlbname">
                                  {{ bsjson.roomlb.roomlbname }}
                                </div>
                                <div class="info-price">
                                  单价：{{ bsjson.roomlb.price }}
                                </div>
                                <div class="info-floor">
                                  楼层：{{ bsjson.floor.floorname }}
                                </div>
                              </div>
                              <div class="btn-title">
                                <div v-if="bsjson.booking != null">
                                  <v-chip
                                    class="ma-2 title-chip"
                                    color="#a98175"
                                    outlined
                                    x-small
                                  >
                                    被预定
                                  </v-chip>
                                </div>
                              </div>
                            </div>
                          </template>
                          <!-- 在住房信息 -->
                          <template v-if="bsjson.room.rstatus == '1'">
                            <div class="btn-roomname">
                              <div class="d-flex flex-row">
                                <div class="info-roomname">
                                  {{ bsjson.room.roomname }}
                                </div>
                                <v-chip
                                  class="ma-2 title-chip rstatu-chip"
                                  color="#4c221b"
                                  outlined
                                  x-small
                                >
                                  在住
                                </v-chip>
                              </div>
                              <div
                                v-if="selectedBtnWithIcon == index"
                                class="choose-btn"
                              >
                                <v-icon>mdi-check-circle-outline</v-icon>
                              </div>
                            </div>
                            <v-divider></v-divider>
                            <div class="btn-room-info">
                              <div class="btn-info">
                                <div class="info-guestname">
                                  {{ bsjson.guest.guestname }}
                                </div>
                                <div class="info-roomlbname">
                                  {{ bsjson.roomlb.roomlbname }}
                                </div>
                                <div class="info-price">
                                  价格：{{ bsjson.reg.price }}
                                </div>
                                <div class="info-floor">
                                  楼层：{{ bsjson.floor.floorname }}
                                </div>
                              </div>
                              <div class="btn-title">
                                <div v-if="bsjson.booking != null">
                                  <v-chip
                                    class="ma-2 title-chip"
                                    color="#a98175"
                                    outlined
                                    x-small
                                  >
                                    被预定
                                  </v-chip>
                                </div>
                                <div v-if="bsjson.reg.linkid != 0">
                                  <v-chip
                                    class="ma-2 title-chip link-chip"
                                    color="#e2041b"
                                    outlined
                                    x-small
                                  >
                                    <div
                                      v-if="
                                        bsjson.reg.linkno == bsjson.reg.roomno
                                      "
                                    >
                                      主
                                    </div>
                                    联{{ bsjson.reg.linkid }}
                                  </v-chip>
                                </div>
                                <div v-if="bsjson.reg.groupid != 0">
                                  <v-chip
                                    class="ma-2 title-chip link-chip"
                                    color="#e2041b"
                                    outlined
                                    x-small
                                    >团体{{ bsjson.reg.groupid }}</v-chip
                                  >
                                </div>
                              </div>
                            </div>
                          </template>
                          <!-- 预定房信息 -->
                          <template v-if="bsjson.room.rstatus == '2'">
                            <div class="btn-roomname">
                              <div class="d-flex flex-row">
                                <div class="info-roomname">
                                  {{ bsjson.room.roomname }}
                                </div>
                                <v-chip
                                  class="ma-2 title-chip rstatu-chip"
                                  color="#4c221b"
                                  outlined
                                  x-small
                                >
                                  预定
                                </v-chip>
                              </div>
                              <div
                                v-if="selectedBtnWithIcon == index"
                                class="choose-btn"
                              >
                                <v-icon>mdi-check-circle-outline</v-icon>
                              </div>
                            </div>
                            <v-divider></v-divider>
                            <div class="btn-room-info">
                              <div class="btn-info">
                                <div class="info-guestname">
                                  {{ bsjson.guest.guestname }}
                                </div>
                                <div class="info-roomlbname">
                                  {{ bsjson.roomlb.roomlbname }}
                                </div>
                                <div class="info-price">
                                  价格：{{ bsjson.room.price }}
                                </div>
                                <div class="info-floor">
                                  楼层：{{ bsjson.floor.floorname }}
                                </div>
                                <div class="info-floor">
                                  押金：{{ bsjson.booking.securityReal }}
                                </div>
                              </div>
                              <div class="btn-title">
                                <div v-if="bsjson.booking != null">
                                  <v-chip
                                    class="ma-2 title-chip"
                                    color="#4c221b"
                                    outlined
                                    x-small
                                  >
                                    预定
                                  </v-chip>
                                </div>
                                <div v-if="bsjson.booking.linkno != null">
                                  <v-chip
                                    class="ma-2 title-chip link-chip"
                                    color="#e2041b"
                                    outlined
                                    x-small
                                  >
                                    联房
                                  </v-chip>
                                </div>
                                <div v-if="bsjson.booking.groupno != null">
                                  <v-chip
                                    class="ma-2 title-chip link-chip"
                                    color="#e2041b"
                                    outlined
                                    x-small
                                    >团体</v-chip
                                  >
                                </div>
                              </div>
                            </div>
                          </template>
                          <!-- 脏房信息 -->
                          <template v-if="bsjson.room.rstatus == '3'">
                            <div class="btn-roomname">
                              <div class="d-flex flex-row">
                                <div class="info-roomname">
                                  {{ bsjson.room.roomname }}
                                </div>
                                <v-chip
                                  class="ma-2 title-chip rstatu-chip"
                                  color="#4c221b"
                                  outlined
                                  x-small
                                >
                                  脏房
                                </v-chip>
                              </div>
                              <div
                                v-if="selectedBtnWithIcon == index"
                                class="choose-btn"
                              >
                                <v-icon>mdi-check-circle-outline</v-icon>
                              </div>
                            </div>
                            <v-divider></v-divider>
                            <div class="btn-room-info">
                              <div class="btn-info">
                                <div class="info-roomlbname">
                                  {{ bsjson.roomlb.roomlbname }}
                                </div>
                                <div class="info-price">
                                  价格：{{ bsjson.room.price }}
                                </div>
                                <div class="info-floor">
                                  楼层：{{ bsjson.floor.floorname }}
                                </div>
                              </div>
                              <div class="btn-title">
                                <div v-if="bsjson.booking != null">
                                  <v-chip
                                    class="ma-2 title-chip"
                                    color="#a98175"
                                    outlined
                                    x-small
                                  >
                                    被预定
                                  </v-chip>
                                </div>
                              </div>
                            </div>
                          </template>
                          <!-- 自用房信息 -->
                          <template v-if="bsjson.room.rstatus == '4'">
                            <div>{{ bsjson.room.roomname }}</div>
                            <div>{{ bsjson.roomlb.roomlbname }}</div>
                          </template>
                          <!-- 维修房信息 -->
                          <template v-if="bsjson.room.rstatus == '5'">
                            <div>{{ bsjson.room.roomname }}</div>
                            <div>{{ bsjson.roomlb.roomlbname }}</div>
                          </template>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
                <!-- 房间图标以及注解 -->
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div>
        <!-- 营业中心右侧区域 -->
        <div class="tab-right">
          <div>
            <el-input placeholder="请输入内容" v-model="searchRoom">
              <template slot="prepend">房间号或客人姓名：</template>
              <template slot="append">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchRoomInfo()"
                ></el-button>
              </template>
            </el-input>
          </div>
          <div class="tab-right-top">
            <reg-info ref="regInfoPage" />
          </div>
          <div class="tab-right-bottom">
            <regbill-info ref="regBillInfoPage" />
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="chooseAccountTypeDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">选择结算方式</v-card-title>
        <v-card-text class="d-flex flex-column">
          <v-btn class="ma-2" outlined color="indigo" @click="singleRegClose"
            >单独结算</v-btn
          >
          <v-btn class="ma-2" outlined color="indigo" @click="groupRegClose"
            >团体结算</v-btn
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="chooseAccountTypeDialog = false"
            >取消结算</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 房间结算 -->
    <div v-if="finishRegDialog">
      <v-dialog v-model="finishRegDialog" persistent max-width="800">
        <finish-reg
          :finishRegData="finishRegData"
          :finishRegDialog.sync="finishRegDialog"
          @FinishRegPageReload="pageReload"
        />
      </v-dialog>
    </div>
    <!-- 房间续住 -->
    <div v-if="renewRegDialog">
      <v-dialog v-model="renewRegDialog" persistent max-width="800">
        <renew-reg
          :renewRegData="renewRegData"
          :renewRegDialog.sync="renewRegDialog"
          @renewPageReload="pageReload"
        />
      </v-dialog>
    </div>
    <!-- 联房 -->
    <div v-if="linkRoomDialog">
      <v-dialog v-model="linkRoomDialog" persistent max-width="800">
        <link-room
          :linkRoomDialog.sync="linkRoomDialog"
          :linkRoomData="linkRoomData"
          :linkChooseRoom="linkChooseRoom"
          @linkRoomReload="pageReload"
        />
      </v-dialog>
    </div>
    <!-- 拆房 -->
    <div v-if="unpackDialog">
      <v-dialog v-model="unpackDialog" persistent max-width="800">
        <unpack-room
          :unpackDialog.sync="unpackDialog"
          :unpackData="unpackData"
          @unpackReload="pageReload"
        />
      </v-dialog>
    </div>
    <!-- 消费录入 -->
    <div v-if="billEnterDialog">
      <v-dialog v-model="billEnterDialog" persistent max-width="1600">
        <bill-enter
          :billEnterDialog.sync="billEnterDialog"
          :billEnterData="billEnterData"
          @billEnterReload="pageReload"
        />
      </v-dialog>
    </div>
    <!--换房-->
    <div v-if="swapRoomDialog">
      <v-dialog v-model="swapRoomDialog" persistent max-width="800">
        <swap-room
          :swapRoomDialog.sync="swapRoomDialog"
          :swapRoomData="swapRoomData"
          @swapRoomReload="pageReload"
        />
      </v-dialog>
    </div>
    <div v-show="hideRefPage">
      <guest ref="guest" />
      <team ref="team" />
    </div>
  </div>
</template>

<script>
/**
 *营业中心画面
 */
import {
  apiRoomData,
  apiRoomlbData,
  apiRegData,
  apiBussinessCenterData,
  apUpdBookingRoomRstatus,
  apiOverTimeBooking
} from "@/request/api";
import { mapGetters } from "vuex";
import { parseTime, deepClone } from "../../utils";
import RegInfo from "./RegInfo";
import RegbillInfo from "./RegBillnfo";
import Guest from "../Reception/Guest/guest";
import Team from "../Reception/Team/team";
import FinishReg from "./finishReg/FinishReg";
import RenewReg from "./renewReg/RenewReg";
import LinkRoom from "./linkRoom/linkRoom";
import unpackRoom from "./unpackRoom/unpackRoom";
import BillEnter from "./billEnter/BillEnter";
import SwapRoom from "./swapRoom/SwapRoom";
export default {
  name: "Dashboard",
  components: {
    RegInfo,
    RegbillInfo,
    Guest,
    Team,
    FinishReg,
    RenewReg,
    LinkRoom,
    unpackRoom,
    BillEnter,
    SwapRoom
  },
  inject: ["reload"],
  data() {
    return {
      tabsLoading: true,
      // 客人名称或房间号
      travellerName: "",
      // Tab 初始选项
      activeTypeName: "00",
      // Tab 的所有选项
      roomType: [
        { roomlbno: "01", roomlbname: "全部房间" },
        { roomlbno: "02", roomlbname: "标准单人间" },
        { roomlbno: "03", roomlbname: "标准双人间" },
        { roomlbno: "04", roomlbname: "客房" },
        { roomlbno: "05", roomlbname: "普通单间" },
        { roomlbno: "06", roomlbname: "普通标间" },
        { roomlbno: "07", roomlbname: "电脑单间" }
      ],
      // 所有房间信息
      roomData: [],
      // 搜索框（房间号或客人姓名）
      searchRoom: "",
      groupButton: [
        {
          type: 1,
          content: "散客入住",
          icon: "el-icon-search",
          color: "#e6e6fa",
          fontColor: "#000000",
          event: "regGuest"
        },
        {
          type: 1,
          content: "团体入住",
          icon: "el-icon-search",
          color: "#e6e6fa",
          fontColor: "#000000",
          event: "regTeam"
        },
        {
          type: 2,
          content: "结算退房",
          icon: "el-icon-search",
          color: "#00ced1",
          fontColor: "#000000",
          event: "checkOut"
        },
        {
          type: 3,
          content: "客房续住",
          icon: "el-icon-search",
          color: "#ffffe0",
          fontColor: "#000000",
          event: "continued"
        },
        {
          type: 3,
          content: "换房",
          icon: "el-icon-search",
          color: "#ffffe0",
          fontColor: "#000000",
          event: "swapRoom"
        },
        {
          type: 3,
          content: "联房",
          icon: "el-icon-search",
          color: "#ffffe0",
          fontColor: "#000000",
          event: "linkRoom"
        },
        {
          type: 3,
          content: "拆房",
          icon: "el-icon-search",
          color: "#ffffe0",
          fontColor: "#000000",
          event: "hungRoom"
        },
        {
          type: 4,
          content: "消费录入",
          icon: "el-icon-search",
          color: "#409EFF",
          fontColor: "#000000",
          event: "billEnter"
        },
        {
          type: 4,
          content: "当前在住客人",
          icon: "el-icon-search",
          color: "#409EFF",
          fontColor: "#000000",
          event: "regGuestNote"
        },
        {
          type: 5,
          content: "刷新",
          icon: "el-icon-edit",
          color: "#ff6a6a",
          fontColor: "#000000",
          event: "fresh"
        }
      ],
      bsJson: [],
      regInfoData: {},
      hideRefPage: false,
      // 选中状态的图标
      selectedBtnWithIcon: 0,
      // 选择 那种结算状态 Dialog，有两种： 1. 单独结算；2. 一起结算。
      chooseAccountTypeDialog: false,
      finishRegDialog: false,
      finishRegData: [],
      // RenewReg 续住页面 Dialog
      renewRegDialog: false,
      // 续住的客房信息
      renewRegData: [],
      // 联房Dialog
      linkRoomDialog: false,
      // 可以联房的房间
      linkRoomData: [],
      // 被选中的房间
      linkChooseRoom: [],
      // 拆房 Dialog
      unpackDialog: false,
      // 拆房的 联房信息
      unpackData: [],
      // 消费录入
      billEnterDialog: false,
      billEnterData: [],
      // 换房
      swapRoomDialog: false,
      swapRoomData: {}
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  created() {
    this.init();
  },
  methods: {
    // 1. 初始化
    init() {
      // 房间类型数据
      let p1 = new Promise((resolve, reject) => {
        resolve(apiRoomlbData({}));
      });
      // 房间数据
      let p2 = new Promise((resolve, reject) => {
        resolve(apiRoomData({}));
      });
      let p3 = new Promise((resolve, reject) => {
        resolve(apiRegData({}));
      });
      apiBussinessCenterData;
      let p4 = new Promise((resolve, reject) => {
        resolve(apiBussinessCenterData({}));
      });
      Promise.all([p1, p2, p3, p4])
        .then(res => {
          this.roomType = res[0];
          this.roomType.unshift({ roomlbno: "00", roomlbname: "全部房间" });

          this.roomData = res[1];
          this.regData = res[2];
          console.log(this.roomType);
          console.log(this.roomData);
          console.log(this.regData);
          console.log("=============================================");
          this.bsJson = res[3].data;
          console.log(this.bsJson);
          this.regInfoData = this.bsJson[0];
          this.tabsLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    //房间点击事件
    roomInfo(bsjson, index) {
      // 更新 选中状态下的 房间
      this.selectedBtnWithIcon = index;
      // 更新 选中的房间信息（没有深拷贝，但如果深拷贝了，可能就失去了双向绑定）
      this.regInfoData = bsjson;
      let roomRegPageData;
      console.log("选中的房间", bsjson);
      if (bsjson.reg != null) {
        let linkidStr = "";
        let groupidStr = "";
        if (bsjson.reg.linkid != 0) {
          for (var i = 0; i < this.bsJson.length; i++) {
            // 排除没有的订单
            if (this.bsJson[i].reg != null) {
              if (this.bsJson[i].reg.linkid == bsjson.reg.linkid) {
                linkidStr += this.bsJson[i].reg.roomno + "  ";
              }
            }
          }
        }
        if (bsjson.reg.grooupid != 0) {
          for (var j = 0; j < this.bsJson.length; j++) {
            // 排除没有的订单
            if (this.bsJson[j].reg != null) {
              if (this.bsJson[j].reg.groupid == bsjson.reg.groupid) {
                groupidStr += this.bsJson[j].reg.roomno + "  ";
              }
            }
          }
        }
        roomRegPageData = {
          roomno: bsjson.reg.roomno,
          sureflag: bsjson.reg.sureflag == "Y" ? "在住" : "未入住",
          guestname: bsjson.guest.guestname,
          tel: bsjson.guest.tel,
          dtIndate: parseTime(new Date(bsjson.reg.dtIndate)),
          dtOutdate: parseTime(new Date(bsjson.reg.dtOutdate)),
          linkid: bsjson.reg.isgroup == "0" ? linkidStr : groupidStr,
          price: bsjson.reg.price,
          securityReal: bsjson.reg.securityReal,
          specialMemo: bsjson.reg.specialMemo,
          sex: bsjson.guest.sex
        };
      } else if (bsjson.booking != null) {
        roomRegPageData = {
          roomno: bsjson.room.roomno,
          sureflag: "被预定",
          guestname: bsjson.guest.guestname,
          tel: "",
          dtIndate: parseTime(new Date(bsjson.booking.dtIndate)),
          dtOutdate: parseTime(new Date(bsjson.booking.dtOutdate)),
          linkid: "",
          price: bsjson.roomlb.price,
          securityReal: "",
          specialMemo: "",
          sex: null
        };
      } else {
        // 有空房，有预定
        roomRegPageData = {
          roomno: bsjson.room.roomno,
          sureflag: "未入住",
          guestname: "",
          tel: "",
          dtIndate: "",
          dtOutdate: "",
          linkid: "",
          price: bsjson.roomlb.price,
          securityReal: "",
          specialMemo: "",
          sex: null
        };
      }
      console.log(roomRegPageData);
      this.$refs["regInfoPage"].changeRoomRegData(roomRegPageData);

      // 以上是进行 右侧上部房间信息的操纵
      // 以下是进行 右侧下部账单信息的操作
      /* regBillInfoPage */
      console.log(bsjson);
      this.$refs["regBillInfoPage"].allData = bsjson;
      this.$refs["regBillInfoPage"].trigger();
    },
    // 房间号码搜索
    searchRoomInfo() {
      console.log(this.searchRoom);
      let flagIndex;
      let arr = this.bsJson.filter((res, index) => {
        if (res.room.roomno == this.searchRoom) {
          flagIndex = index;
        }
        return res.room.roomno == this.searchRoom;
      });

      alert("选中状态：" + flagIndex + ", 选中的房间信息：" + arr[0]);

      if (arr.length != 0) {
        this.roomInfo(arr[0], flagIndex);
      } else {
        this.$message.warning("未找到" + this.searchRoom + "的房间信息");
      }
      this.searchRoom = "";
    },
    // 计时器（判断房间状态）
    roomDateValid() {
      let regDateArr = [];
      let bookingDateArr = [];
      for (var i = 0; i < this.bsJson.length; i++) {
        // 1. 判断在住房间的有效时间
        if (this.bsJson[i].reg != null) {
          let regdateObj = {
            regno: this.bsJson[i].reg.regno,
            roomno: this.bsJson[i].reg.roomno,
            rstatus: this.bsJson[i].room.rstatus,
            dtIndate: this.bsJson[i].reg.dtIndate,
            dtOutdate: this.bsJson[i].reg.dtOutdate,
            dtKeepdate: null
          };
          console.log(regdateObj);
          regDateArr.push(regdateObj);
        }
        // 2. 判断预定房间的有效时间 (添加 this.bsJson[i].reg == null，暂时解决问题 顾客故意 拖房)
        if (this.bsJson[i].booking != null && this.bsJson[i].reg == null) {
          let bookingdateObj = {
            bookingno: this.bsJson[i].booking.bookingno,
            roomno: this.bsJson[i].booking.roomno,
            rstatus: this.bsJson[i].room.rstatus,
            dtIndate: this.bsJson[i].booking.dtIndate,
            dtOutdate: this.bsJson[i].booking.dtOutdate,
            dtKeepdate: this.bsJson[i].booking.dtKeep
          };
          console.log(bookingdateObj);
          bookingDateArr.push(bookingdateObj);
        }
      }
      console.log(
        "------------------- 所有有效的订单信息 reg -----------------------"
      );
      console.log(regDateArr);
      console.log(
        "------------------- 所有有效的预定信息 booking -----------------------"
      );
      console.log(bookingDateArr);

      // 遍历 已入住房间
      let nowDate = new Date().getTime();
      console.log(nowDate);
      // 1. 已过了 预计离开时间，但还没有退房的房间（订单信息）
      let updRegCheckout = regDateArr.filter(res => {
        // 预计离开时间小于当前时间说明应该离开了
        return res.dtOutdate < nowDate;
      });
      // 3. 已过了 预计入住时间，但还没有入住的房间 （预定 信息）
      let updBookingCheckout = [];
      let updBookingRoomStatus = [];
      for (var j = 0; j < bookingDateArr.length; j++) {
        if (nowDate > bookingDateArr[j].dtIndate) {
          // 存在问题，已经过了 保留时间 但还有账单存在怎么办 ？？？ 顾客故意 拖房
          if (nowDate > bookingDateArr[j].dtKeepdate) {
            // 当前时间 大于 保留时间 则 提示取消预定
            updBookingCheckout.push(bookingDateArr[j]);
          } else {
            if (bookingDateArr[j].rstatus == "0") {
              // 当前时间 大于 预计入住时间  且小于保留时间 说明还未入住，需要修改房间状态为紫色
              updBookingRoomStatus.push(bookingDateArr[j]);
            }
          }
        }
      }
      // 1. 已过了 预计离开时间，但还没有退房的房间（订单信息）
      console.log(updRegCheckout);
      if (updRegCheckout.length != 0) {
        let msg = "";
        for (var k = 0; k < updRegCheckout.length; k++) {
          msg += updRegCheckout[k].roomno + "  ";
        }
        msg = "房间：" + msg + "已经到期，请通知顾客退房或续期！";
        this.$notify({
          title: "提示",
          message: msg,
          offset: 60,
          type: "warning",
          duration: 3000
        });
      }
      // 2. 已过了 预计入住时间但还没有超过保留时间的，到了之后请求修改房间状态（）
      console.log(updBookingRoomStatus);
      if (updBookingRoomStatus.length != 0) {
        apUpdBookingRoomRstatus({
          roomjson: JSON.stringify(updBookingRoomStatus)
        }).then(res => {
          console.log("res", res);
          if (res.code == "200") {
            this.reload();
          }
        });
      }
      // 3. 已过了 预计入住时间并且过了保留时间，但还没有入住的房间 （预定 信息）,取消预定信息
      console.log(updBookingCheckout);
      if (updBookingCheckout.length != 0) {
        apiOverTimeBooking({
          roomjson: JSON.stringify(updBookingCheckout)
        }).then(res => {
          console.log("res", res);
          if (res.code == "200") {
            this.reload();
          }
        });
      }
    },
    // 按钮 方法选择器
    selectorMethos(value) {
      this[value]();
    },
    regGuest() {
      console.log("regGuest");
      this.hideRefPage = true;
      this.$refs["guest"].guestCheckIndialogVisible = true;
    },
    regTeam() {
      console.log("regTeam");
      this.hideRefPage = true;
      this.$refs["team"].teamCheckIndialogVisible = true;
    },
    checkOut() {
      // 获取被选中的 房间信息
      let chooseRoom = this.bsJson[this.selectedBtnWithIcon];
      if (chooseRoom.room.rstatus != 1) {
        return this.$message.error("请选择已经入住的房间进行退房");
      }
      // 先初始化
      this.finishRegData = [];
      // 判断是是否是联房 或者 团体房 或者 普通房间
      let resultReg = deepClone(this.bsJson[this.selectedBtnWithIcon]);
      if (resultReg.reg.isgroup == "0") {
        if (resultReg.reg.linkid != 0 || resultReg.reg.linkno != "") {
          this.chooseAccountTypeDialog = true;
        } else {
          // 普通房间 结算
          this.finishRegDialog = true;
          this.finishRegData.push(resultReg);
        }
      } else {
        // 团体房 绝对会存在 groupid 以及 groupno
        this.chooseAccountTypeDialog = true;
      }
    },
    singleRegClose() {
      // 关闭选择方式的Dialog
      this.chooseAccountTypeDialog = false;
      let resultReg = deepClone(this.bsJson[this.selectedBtnWithIcon]);
      this.finishRegData.push(resultReg);
      console.log("单独结算");
      console.log(this.finishRegData);
      this.finishRegDialog = true;
    },
    groupRegClose() {
      // 团体结算需要判断是 联房 还是 团体房
      // 关闭选择方式的Dialog
      this.chooseAccountTypeDialog = false;
      // 获取选中的房间
      let resultReg = deepClone(this.bsJson[this.selectedBtnWithIcon]);
      console.log(resultReg);
      if (resultReg.reg.isgroup == "0") {
        // 联房的数据
        alert("联房");
        /* res.reg.linkno == resultReg.reg.linkno && */
        let arr = this.bsJson.filter(res => {
          return (
            res.reg != null &&
            res.reg.linkno != null &&
            res.reg.linkid == resultReg.reg.linkid
          );
        });
        this.finishRegData = deepClone(arr);
        console.log("联房");
        console.log(this.finishRegData);
        this.finishRegDialog = true;
      } else {
        // 团体房的数据
        alert("团体房");
        let arr = this.bsJson.filter(res => {
          return (
            res.reg != null &&
            res.reg.groupno != null &&
            res.reg.groupno == resultReg.reg.groupno &&
            res.reg.groupid == resultReg.reg.groupid
          );
        });
        this.finishRegData = deepClone(arr);
        console.log("团体房");
        console.log(this.finishRegData);
        this.finishRegDialog = true;
      }
    },
    continued() {
      // 房间续住需要重新写
      // 获取被选中的 房间信息
      let chooseRoom = this.bsJson[this.selectedBtnWithIcon];
      if (chooseRoom.room.rstatus != 1) {
        return this.$message.error("请选择已经入住的房间进行退房");
      }
      // 初始化数组
      this.renewRegData = [];
      this.renewRegData.push(this.bsJson[this.selectedBtnWithIcon]);
      this.renewRegDialog = true;
    },
    swapRoom() {
      // 获取被选中的 房间信息
      let chooseRoom = this.bsJson[this.selectedBtnWithIcon];
      // 不是在住状态就放弃
      if (chooseRoom.room.rstatus != 1) {
        return this.$message.error("请选择已经入住的房间进行拆房");
      }
      this.swapRoomData = chooseRoom;
      this.swapRoomDialog = true;
    },
    linkRoom() {
      // 点击时先初始化
      this.linkChooseRoom = [];
      this.linkRoomData = [];

      // 获取被选中的 房间信息
      let chooseRoom = this.bsJson[this.selectedBtnWithIcon];
      // 不是在住状态就放弃
      if (chooseRoom.room.rstatus != 1) {
        return this.$message.error("请选择已经入住的房间进行联房");
      }
      if (chooseRoom.reg.isgroup == 1) {
        return this.$message.error("团体房不能进行联房操纵");
      }
      /* this.linkChooseRoom = chooseRoom; */
      console.log("chooseRoom", chooseRoom);
      console.log(chooseRoom.reg.linkid);
      // 再根据linkid 进行一次区分
      if (chooseRoom.reg.linkid == 0) {
        // 无 联房房间进行联房操作.
        this.linkChooseRoom.push(chooseRoom);
      } else {
        // 联房房间进行联房操作
        this.linkChooseRoom = this.bsJson.filter(res => {
          return (
            res.room.rstatus == 1 && res.reg.linkid == chooseRoom.reg.linkid
          );
        });
      }
      console.log("after");
      this.linkRoomData = this.bsJson.filter(res => {
        return (
          res.room.rstatus == 1 &&
          res.reg.isgroup == 0 &&
          res.reg.linkid == 0 &&
          res.room.roomno != chooseRoom.room.roomno
        );
      });
      // 获取可以联房的房间信息
      this.linkRoomDialog = true;
    },
    hungRoom() {
      // 获取被选中的 房间信息
      let chooseRoom = this.bsJson[this.selectedBtnWithIcon];
      // 不是在住状态就放弃
      if (chooseRoom.room.rstatus != 1) {
        return this.$message.error("请选择已经入住的房间进行拆房");
      }
      if (chooseRoom.reg.linkid == 0) {
        return this.$message.error("请选择已经联房的房间进行拆房");
      }
      console.log(chooseRoom);
      // 获取选中联房的所有联房信息
      let linkRoomInfo = this.bsJson.filter(res => {
        return res.room.rstatus == 1 && res.reg.linkid == chooseRoom.reg.linkid;
      });
      this.unpackData = linkRoomInfo;
      console.log(linkRoomInfo);
      this.unpackDialog = true;
    },
    billEnter() {
      console.log("billEnter");
      let chooseRoom = this.bsJson[this.selectedBtnWithIcon];
      // 不是在住状态就放弃
      if (chooseRoom.room.rstatus != 1) {
        return this.$message.error("请选择已经入住的房间进行消费录入");
      }
      console.log(chooseRoom);
      this.billEnterData = chooseRoom;
      this.billEnterDialog = true;
    },
    regGuestNote() {
      console.log("regGuestNote");
    },
    fresh() {
      console.log("fresh");
    },
    pageReload() {
      this.reload();
    }
  },
  mounted() {
    this.roomDateValid();
    /* setInterval(this.roomDateValid, 3000); */
  }
};
</script>

<style scoped>
.margin-zero {
  margin: 0px !important;
}
.padding-zero {
  padding: 0px;
}
.el-flex-direction-row {
  display: flex;
  flex-direction: row;
}
/* 操作按钮样式 */
.operation-btn {
  color: #ffffff;
  font-size: 10px;
}
/* 房间分类按钮类型 */
.type-button {
  width: 112px;
  color: #000000;
  background-image: linear-gradient(#00bfff, #87ceeb, #ffffff);
}
.div-flex-row {
  display: flex;
  flex-direction: row;
}
/* 左侧tab 控件大小 */
.tab-space {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 445px;
  /*   background-color: #87ceeb; */
}
/* 左侧tab */
.tab-left {
  width: 850px;
  height: 300px;
}
.el-tabs-class >>> .el-tabs__header {
  margin: 0px !important;
}
.el-tabs-class >>> .el-tabs__content {
  padding: 0px !important;
}
.table-content {
  overflow: scroll;
  /*   background-color: #87ceeb; */
}
.tab-right {
  margin-left: 3px;
}
.tab-right-top {
  height: 223px;
  overflow: auto;
  border: 3px inset #ffffff;
  background-color: #f2ecde;
  margin-bottom: 3px;
}
.tab-right-bottom {
  height: 290px;
}
/* 房间div样式 */
.room-button {
  margin: 3px;
  height: 130px !important;
  width: 160px !important;
  border: 1px solid #3b2e7e;
  cursor: pointer;
  /*   position: relative; */
}
.btn-roomname {
  /*   height: 10%; */
  height: 30px;
  position: relative;
}
.btn-room-info {
  display: flex;
  flex-direction: row;

  position: relative;
  height: 100px;
  border: 1px solid #d6ecf0;
  background-color: #e0f0e9 !important;
}
.info-roomname {
  margin: 3px;
  color: #566aad;
}
.info-guestname {
  /*   font-size: 13px; */
  color: #078383;
}
.info-roomlbname {
  font-size: 13px;
}
.info-price {
  font-size: 13px;
}
.info-floor {
  font-size: 13px;
}
.choose-btn {
  position: absolute;
  right: 0px;
  top: 0px;
}
.btn-title {
  position: absolute;
  top: 0px;
  right: 0px;
}
.rstatu-chip {
  position: absolute;
  top: 0px;
  right: 25px;
  height: 24px !important;
}
.title-chip {
  height: 100%;
  margin: 3px !important;
}
.link-chip {
  float: right;
}
/* 房间状态按钮样式 */
/* 空房状态 */
.empty-green {
  background-color: #aff53d;
  border-color: #92ec00;
}
.empty-green:hover {
  background-color: #7cd12d;
}
/* 在住房间状态 */
.living-yellow {
  background-color: #ffdd93;
  border-color: #bfa66e;
}
.living-yellow:hover {
  background-color: #ffd26f;
}
/* 预定房间状态 */
.book-violet {
  background-color: #cc86e9;
  border-color: #d642fa;
}
.book-violet:hover {
  background-color: #cc86e9;
}
/* 空脏房间状态 */
.dirty-blueness {
  background-color: #a3cdff;
  border-color: #91a6ff;
}
.dirty-blueness:hover {
  background-color: #a3cdff;
}
/* 维修房间状态 */
.repair-red {
  background-color: #d83306;
  border-color: #d63308;
}
.repair-red:hover {
  background-color: #d83306;
}
/* 自用房间状态 */
.self-orange {
  background-color: #f8901f;
  border-color: #ed6318;
}
.self-orange:hover {
  background-color: #f8901f;
}
.bottom-line {
  width: 80px;
  border-bottom: 1px solid #000000;
}
.room-info {
}
.details-div {
  width: 160px;
  padding-left: 5px;
  padding-right: 5px;
}
.details-font {
  font-size: 13px;
}
</style>
