<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:5px"
    ></el-header>

    <div
      style="width: 100%;height: 1px;background-color: #20a0ff;margin-top: 8px;margin-bottom: 0px;"
    ></div>
    <div
      style="width: 90%;height: 100px;margin-left:5%;margin-top: 18px;margin-bottom: 0px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div>
        <el-row style="margin-top: 8px;">
          <el-col :span="6">
            手机号:
            <el-input v-model="phone" size="mini" placeholder="请输入手机号" style="width: 70%"></el-input>
          </el-col>

          <el-col :span="4">
            <el-button size="mini" type="primary" @click="addByPhone()">添加不推送消息用户</el-button>
          </el-col>
          <el-col :span="4">
            <el-tag>添加后，系统不会给此用户推送消息</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-top: 18px;">
          <el-col :span="8">
            公司选择:
            <el-popover
              v-model="showOrHidePop"
              placement="right"
              title="选择不推送消息公司"
              trigger="manual"
              style="width:70%"
            >
              <el-tree
                :data="deps"
                :default-expand-all="false"
                :props="defaultProps"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              ></el-tree>
              <div
                slot="reference"
                style="width: 70%;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                @click.left="showDepTree"
                v-bind:style="{color: depTextColor}"
              >{{departmentName}}
              </div>
            </el-popover>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" type="primary" @click="addByDep()">添加不推送消息公司</el-button>
          </el-col>
          <el-col :span="4">
            <el-tag>添加后，系统不会给此公司推送消息</el-tag>
          </el-col>
        </el-row>
      </div>
    </div>

    <div
      style="width:90%;margin-left:5%;margin-top:10px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="font-size:25px;margin-bottom:15px">下列公司不会接受推送消息</div>
      <el-scrollbar
        wrapClass="scrollbar-wrap"
        :style="{height: scrollHeight}"
        ref="scrollbarContainer"
      >
        <div v-for="item in nodeps" :key="item.id" style="margin-top:10px;">
          <el-tag style="margin-left:0px;width:20%">公司名称：</el-tag>
          <el-tag style="margin-left:10px;width:20%">{{item.name}}</el-tag>
          <el-button type="primary" style="margin-top:10px;" @click="deleteOneDep(item)">取消不推送</el-button>
        </div>
      </el-scrollbar>
    </div>

    <div
      style="width:90%;margin-left:5%;margin-top:10px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="font-size:25px;margin-bottom:15px">下列用户不会接受推送消息</div>
      <el-scrollbar
        wrapClass="scrollbar-wrap"
        :style="{height: scrollHeight}"
        ref="scrollbarContainer"
      >
        <div v-for="item in users" :key="item.id" style="margin-top:10px;">
          <el-tag style="margin-left:10px;width:20%">姓名：{{item.name}}</el-tag>
          <el-tag style="margin-left:10px;width:20%">电话：{{item.phone}}</el-tag>
          <el-tag style="margin-left:10px;width:20%">公司：{{item.departmentName}}</el-tag>
          <el-button type="primary" style="margin-top:10px;" @click="deleteOne(item)">取消不推送</el-button>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        scrollHeight: "0px",

        selItems: [],
        loading: false,
        keywords: "",
        dialogVisible: false,
        dustbinData: [],
        users: [],
        deps: [],
        nodeps: [],
        depTextColor: "#c0c4cc",
        defaultProps: {
          label: "name",
          isLeaf: "leaf",
          children: "children"
        },

        departmentId: "",
        phone: "",
        rid: "",
        showOrHidePop: false,
        departmentName: "选择不推送消息公司",
        uid: ""
      };
    },

    mounted: function () {
      var _this = this;
      this.scrollHeight = window.innerHeight * 0.3 + "px";
      this.initData();
      this.loadTableData();
    },
    methods: {
      loadTableData() {
        var _this = this;
        this.getRequest("/no/push").then(resp => {
          if (resp && resp.status == 200) {
            _this.users = resp.data.obj.user;
            _this.nodeps = resp.data.obj.dep;
          }
        });
      },
      addByPhone() {
        var _this = this;
        this.postRequest("/no/push/phone?phone=" + this.phone).then(resp => {
          if (resp && resp.status == 200) {
            this.departmentId = "";
            this.phone = "";
            this.departmentName = "";
            this.loadTableData();
          }
        });
      },
      addByDep() {
        var _this = this;
        this.postRequest("/no/push/dep?id=" + this.departmentId).then(resp => {
          if (resp && resp.status == 200) {
            this.departmentId = "";
            this.phone = "";
            this.departmentName = "";
            this.loadTableData();
          }
        });
      },

      initData() {
        var _this = this;
        this.getRequest("/system/user/basicdata").then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.deps = data.deps;
            // _this.role = data.roles;
          }
        });
      },
      showDepTree() {
        this.showOrHidePop = !this.showOrHidePop;
      },
      handleNodeClick(data) {
        this.departmentName = data.name;
        this.departmentId = data.id;
        this.showOrHidePop = false;
        this.depTextColor = "#606266";
      },

      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.loadTableData();
      },
      currentChange(currentChange) {
        this.currentPage = currentChange;
        this.loadTableData();
      },

      showEditEmpView(row) {
        // console.log(row);
        this.dialogTitle = "编辑学员";
        this.bus = row;
        // this.bus.bustime = this.formatDate(row.bustime);
        // this.bus.bustime = this.bus.bustime;

        // this.bus.firstNumber = "";
        // this.bus.lastNumber = "";
        this.dialogVisible = true;
      },
      cancelEidt() {
        this.dialogVisible = false;
      },
      searchClick() {
        this.loadBlogs(1, this.pageSize);
      },

      deleteMany() {
        var selItems = this.selItems;
        for (var i = 0; i < selItems.length; i++) {
          this.dustbinData.push(selItems[i].id);
        }
        this.deleteToDustBin(selItems[0].state);
      },

      handleSelectionChange(val) {
        this.selItems = val;
      },
      deleteOneDep(item) {
        this.$confirm("此操作将取消不推送, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteRequest("/no/push/del/" + item.id).then(resp => {
              if (resp && resp.status == 200) {
                this.loadTableData();
              }
            });
          })
          .catch(() => {
          });
      },
      deleteOne(row) {
        this.$confirm("此操作将取消不推送, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.doDelete(row.id);
          })
          .catch(() => {
          });
      },
      doDelete(id) {
        var _this = this;
        this.deleteRequest("/no/push/delete/" + id).then(resp => {
          if (resp && resp.status == 200) {
            this.loadTableData();
          }
        });
      }
    }
  };
</script>
<style>
  .scrollbar-wrap {
    overflow-x: hidden;
  }

  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .slide-fade-enter-active {
    transition: all 0.8s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  .user-info {
    font-size: 12px;
    color: #09c0f6;
  }
</style>
