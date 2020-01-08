<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:35px"
    >
      <div style="margin-left: 5px;margin-top: 10px;margin-right: 20px;display: inline">
        <el-upload
          :show-file-list="false"
          accept=".pdf"
          action="/standard/import"
          :before-upload="beforeFileUpload"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="fileUploadBtnText=='正在导入'"
          style="display: inline"
        >
          <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
            <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>
            {{fileUploadBtnText}}
          </el-button>
        </el-upload>
      </div>
    </el-header>

    <el-table
      ref="multipleTable"
      :data="standards"
      tooltip-effect="dark"
      border
      stripe
      size="mini"
      style="width: 100%;margin-top:20px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" align="left" width="30"></el-table-column>
      <el-table-column prop="name" align="left" fixed label="名称" width="500"></el-table-column>
      <!-- <el-table-column prop="url" width="350" align="left" label="链接地址"></el-table-column> -->
      <el-table-column prop="title" width="400" align="left" label="链接全地址"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
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
      standards: [],
      deps: [],
      fileUploadBtnText: "导入标准",

      faangledoubleup: "fa-angle-double-up",
      faangledoubledown: "fa-angle-double-down",
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

  mounted: function() {
    var _this = this;
    this.loading = true;
    this.initData();

    this.loadTableData();
  },
  methods: {
    fileUploadSuccess(response, file, fileList) {
      if (response) {
        this.$message({ type: "success", message: response.msg });
      }
      this.loadTableData();
      this.fileUploadBtnText = "导入标准数据";

    },
    beforeFileUpload(file) {
      this.fileUploadBtnText = "正在导入";
    },
    fileUploadError(err, file, fileList) {
      this.$message({ type: "error", message: "导入失败!" });
      this.fileUploadBtnText = "导入标准数据";
    },
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
        "/standard?page=" +
          this.currentPage +
          "&size=" +
          this.pageSize +
          "&keywords=" +
          this.keywords
      ).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.standards = resp.data.obj.standards;
          _this.totalCount = resp.data.obj.count;
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
      this.$confirm("此操作将删除[" + row.name + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/standard/delete/" + id).then(resp => {
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
