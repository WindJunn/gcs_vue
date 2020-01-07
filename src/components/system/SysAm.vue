<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:5px"
    ></el-header>

    <div
      style="width:90%;margin-left:5%;margin-top:10px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"

    >
      <div>
        <el-row style="margin-top: 8px;">
          <el-col :span="10 ">
            公司选择:
            <el-popover
              v-model="showOrHidePop"
              placement="right"
              title="选择公司"
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
          </el-col>
          <el-col :span="4">
            <el-button size="mini" type="primary" @click="addAdm()">添加在线评价权限</el-button>
          </el-col>
          <el-col :span="4">
            <el-tag>添加完成后，该公司的成员即拥有在线评价权限</el-tag>
          </el-col>
        </el-row>
      </div>
    </div>
    <div
      style="width:90%;margin-left:5%;margin-top:10px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="font-size:25px;margin-bottom:15px">在线评价权限公司名称</div>

      <div v-for="item in onlineAdms" :key="item.id" style="margin-top:10px;">
        <el-tag style="margin-left:0px;width:20%">公司名称</el-tag>
        <el-tag style="margin-left:10px;width:20%">{{item.name}}</el-tag>
        <el-button type="primary" style="margin-top:10px;" @click="deleteOne(item)">删除</el-button>
      </div>
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
      onlineAdms: [],
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
      onlineAdm: {
        name: "",
        departmentId: ""
      }
    };
  },

  mounted: function() {
    var _this = this;
    this.loading = true;
    this.initData();

    this.loadTableData();
  },
  methods: {
    addAdm() {
      var _this = this;
      this.tableLoading = true;
      this.postRequest("/online/adm", this.onlineAdm).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.dialogVisible = false;
          this.departmentId = "";
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
      this.onlineAdm.name = this.departmentName;
      this.onlineAdm.departmentId = this.departmentId;
      this.showOrHidePop = false;
      this.depTextColor = "#606266";
    },
    loadTableData() {
      var _this = this;
      this.loading = true;
      this.getRequest(
        "/online/adm"
      ).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.onlineAdms = resp.data.obj.onlineAdms;
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

 
    handleSelectionChange(val) {
      this.selItems = val;
    },

    deleteOne(row) {
      this.$confirm(
        "此操作将删除[" + row.name + "]的在线评价权限, 是否继续?",
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
        .catch(() => {});
    },
    doDelete(id) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/online/adm/" + id).then(resp => {
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
