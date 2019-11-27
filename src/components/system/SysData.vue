<template>
  <div>
    <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
      <div style="margin-left: 5px;margin-right: 20px;display: inline">
        <el-button
          style="margin-right: 5px"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="showAddAdvView"
        >添加数据</el-button>
      </div>
    </el-header>

    <el-table
      ref="multipleTable"
      :data="advertisements"
      tooltip-effect="dark"
      border
      stripe
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" align="left" width="30"></el-table-column>
      <el-table-column prop="name" align="left" fixed label="名称" width="200"></el-table-column>

      <el-table-column label="是否启用" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeSwith($event,scope.row)"
          >></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="imageUrl" width="350" align="left" label="图片地址"></el-table-column>
      <el-table-column prop="skipUrl" label="跳转地址" width="350"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="showEditAdv(scope.row)">编辑</el-button>
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

    <el-form :model="advertisement" ref="editUserForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="60%"
        >
          <el-row>
            <el-col :span="10">
              <div>
                <el-form-item label="名称:" prop="name">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="advertisement.name"
                    size="mini"
                    style="width: 80%"
                    placeholder="请输入名称"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <div>
                <el-form-item label="图片地址:" prop="phone">
                  <el-input
                    prefix-icon="el-icon-phone"
                    v-model="advertisement.imageUrl"
                    size="mini"
                    style="width: 80%"
                    placeholder="图片链接地址..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <div>
                <el-form-item label="跳转地址:" prop="phone">
                  <el-input
                    prefix-icon="el-icon-phone"
                    v-model="advertisement.skipUrl"
                    size="mini"
                    style="width: 80%"
                    placeholder="跳转地址..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addAdv('editUserForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selItems: [],
      loading: false,
      keywords: "",

      dialogTitle: "",

      dialogVisible: false,
      dustbinData: [],
      advertisements: [],
      totalCount: -1,
      currentPage: 1,
      pageSize: 10,
      advertisement: {
        name: "",
        imageUrl: "",
        skipUrl: "",
        enable: false
      },
      adv: {
        id:'',
        name: "",
        imageUrl: "",
        skipUrl: "",
        enable: ''
      }
    };
  },

  mounted: function() {
    var _this = this;
    this.loadTableData();
  },
  methods: {
    changeSwith(vaule, row) {
      this.adv.id = row.id;
      this.adv.name = row.name;
      this.adv.imageUrl = row.imageUrl;
      this.adv.skipUrl = row.skipUrl;
      this.adv.enable = row.enable;

      this.putRequest("/advertisement/", this.adv).then(resp => {
        if (resp && resp.status == 200) {
          this.emptyData();
          this.loadTableData();
        }
      });
    },
    loadTableData() {
      var _this = this;
      this.loading = true;
      this.getRequest("/advertisement/all").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.advertisements = resp.data.obj.advertisement;
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
    showEditAdv(row) {
      this.dialogTitle = "编辑数据";
      this.advertisement = row;
      this.dialogVisible = true;
    },
    showAddAdvView() {
      this.emptyData();
      this.dialogTitle = "添加数据";
      this.dialogVisible = true;
      var _this = this;
      _this.user.enabled = true;
    },
    cancelEidt() {
      this.dialogVisible = false;
    },
    deleteAdv(id) {
      var _this = this;
      this.deleteRequest("/advertisement/" + id).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          this.loadTableData();
        }
      });
    },
    addAdv(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.advertisement.id) {
            //更新
            this.tableLoading = true;
            this.putRequest("/advertisement/", this.advertisement).then(
              resp => {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;

                  _this.dialogVisible = false;
                  this.emptyData();
                  this.loadTableData();
                }
              }
            );
          } else {
            //添加
            this.tableLoading = true;
            this.postRequest("/advertisement/", this.advertisement).then(
              resp => {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;

                  _this.dialogVisible = false;
                  _this.emptyData();
                  _this.loadTableData();
                }
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    emptyData() {
      this.advertisement = {
        id: "",
        name: "",
        imageUrl: "",
        skipUrl: "",
        enable: false
      };
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
        "此操作将删除名称为[" + row.name + "]的数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteAdv(row.id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/system/iuser/del/" + id).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          this.loadTableData();
        }
      });
    },
    handleDelete(index, row) {
      this.dustbinData.push(row.id);
      this.deleteToDustBin(row.state);
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
