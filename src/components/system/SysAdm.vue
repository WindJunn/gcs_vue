<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:5px"
    ></el-header>

    <!-- <div
      style="width: 100%;height: 1px;background-color: #20a0ff;margin-top: 8px;margin-bottom: 0px;"
    ></div> -->
    <div
      style="width: 90%;height: 50px;margin-top: 18px;margin-bottom: 0px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;">
      <div>
        <el-row style="margin-top: 8px;">
          <el-col :span="6">
            手机号:
            <el-input v-model="phone" size="mini" placeholder="请输入手机号" style="width: 70%"></el-input>
          </el-col>

          <!-- <el-col :span="10 ">
            公司选择:
            <el-popover
              v-model="showOrHidePop"
              placement="right"
              title="选择被管理公司"
              trigger="manual"
              style="width:50%"
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
                style="width: 50%;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                @click.left="showDepTree"
                v-bind:style="{color: depTextColor}"
              >{{departmentName}}</div>
            </el-popover>
          </el-col> -->
          <el-col :span="4">
            <el-button size="mini" type="primary" @click="addAdm()">添加管理员</el-button>
          </el-col>
          <el-col :span="4">
            <el-tag>此管理员负责注册用户的审核工作，管理员只能审核他所在公司用户的注册操作</el-tag>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :data="users"
      tooltip-effect="dark"
      border
      stripe
      size="mini"
      style="width: 100%;margin-top:20px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" align="left" width="30"></el-table-column>
      <el-table-column prop="name" align="left" fixed label="姓名" width="100"></el-table-column>

      <el-table-column prop="phone" width="250" align="left" label="手机号"></el-table-column>

      <el-table-column prop="department.name" label="所在公司" width="250"></el-table-column>
      <!-- <el-table-column prop="administrator.departmentName" label="被管理公司" width="250"></el-table-column> -->

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="showEditEmpView(scope.row)">编辑</el-button> -->
          <!-- <el-button size="mini" type="primary" @click="updateTop(scope.row)">置顶</el-button> -->
          <el-button size="mini" type="danger" @click="deleteServer(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;margin: 2px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        articles: [],
        selItems: [],
        loading: false,
        keywords: "",
        dialogVisible: false,
        dustbinData: [],
        users: [],
        deps: [],
        depTextColor: "#c0c4cc",
        defaultProps: {
          label: "name",
          isLeaf: "leaf",
          children: "children"
        },
        totalCount: -1,
        currentPage: 1,
        pageSize: 10,
        departmentId: "",
        phone: "",
        rid: "",
        showOrHidePop: false,
        departmentName: "选择被管理公司",
        departmentId: "",
        uid: "",
        user: {
          id: "",
          name: "",
          phone: "",
          departmentId: "",
          enabled: "",
          username: "",
          email: "",
          departmentName: "选择被管理公司"
        }
      };
    },

    mounted: function () {
      var _this = this;
      this.loading = true;
      this.initData();

      this.loadTableData();
    },
    methods: {
      addAdm() {
        var _this = this;
        this.tableLoading = true;
        this.postRequest(
          "/system/user/allAdm?departmentId=" +
          this.departmentId +
          "&phone=" +
          this.phone
        ).then(resp => {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.dialogVisible = false;
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
      loadTableData() {
        var _this = this;
        this.loading = true;
        this.getRequest(
          "/system/user/allAdm?page=" +
          this.currentPage +
          "&size=" +
          this.pageSize +
          "&keywords=" +
          this.keywords +
          "&departmentId=" +
          this.departmentId
        ).then(resp => {
          _this.loading = false;
          if (resp && resp.status == 200) {

            _this.users = resp.data.users;
            _this.totalCount = resp.data.count;
          }
        });
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

      getAllBus() {
        var _this = this;
        this.getRequest("/iuser/bus/all").then(resp => {
          _this.loading = false;
          if (resp && resp.status == 200) {
            _this.bus = resp.data.bus;
          }
        });
      },
      handleSelectionChange(val) {
        this.selItems = val;
      },

      deleteServer(row) {
        this.$confirm(
          "此操作将删除[" + row.name + "]的管理员身份, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.doDelete(row.id);
          })
          .catch(() => {
          });
      },
      doDelete(id) {
        this.tableLoading = true;
        var _this = this;
        this.postRequest("/system/user/delete?uid=" + id).then(resp => {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.loadTableData();
          }
        });
      }
    }
  };
</script>
<style>
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
