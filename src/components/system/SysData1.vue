<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:5px"
    ></el-header>

    <div
      style="width: 100%;height: 1px;background-color: #20a0ff;margin-top: 8px;margin-bottom: 0px;"
    ></div>
    <div style="width: 100%;height: 50px;margin-top: 8px;margin-bottom: 0px;">
      <div>
        <el-row>
          <el-col :span="8">
            身份证号:
            <el-input
              v-model="idCard"
              size="mini"
              placeholder="请输入身份证号"
              style="width: 70%"
            ></el-input>
          </el-col>
          
          <el-col :span="7">
            角色权限选择:
            <el-select v-model="rid" placeholder="请选择" size="mini" style="width: 60%">
              <el-option label="管理员" value="1"></el-option>
              <el-option label="超级管理员" value="2"></el-option>
            </el-select>
          </el-col>
          <el-button size="mini" type="primary" @click="addBusServer()">增加管理员</el-button>
        </el-row>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :data="iusers"
      tooltip-effect="dark"
      border
      stripe
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" align="left" width="30"></el-table-column>
       <el-table-column prop="name" align="left" fixed label="姓名" width="100"></el-table-column>

            <!-- <el-table-column prop="gender" label="性别" width="50"></el-table-column> -->

            <el-table-column prop="idCard" width="250" align="left" label="身份证号码"></el-table-column>

<el-table-column prop="roles[0].nameZh" label="角色" width="250"></el-table-column>


      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="showEditEmpView(scope.row)">编辑</el-button> -->
          <!-- <el-button size="mini" type="primary" @click="updateTop(scope.row)">置顶</el-button> -->
          <el-button size="mini" type="danger" @click="deleteServer(scope.row)">删除</el-button>

          
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="display: flex;justify-content: space-between;margin: 2px;">
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
    </div> -->
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
      bus: [],
      busId: "",
      bustime: "",
      route: "",
      totalCount: -1,
      currentPage: 1,
      pageSize: 10,
      // activeName: "post",
      idCard:"",
      rid:"",
      server: {
        id: "",
        busId: "",
        bustime: "",
        depart: 0,
        number: "",
        route: "",
        audit: ""
      },
      busServer: []
    };
  },

  mounted: function() {
    var _this = this;
    this.loading = true;
    this.loadTableData();
    // this.getAllBus();
    // this.getbusconfig();

  },
  methods: {
    getbusconfig() {
      var _this = this;
      this.getRequest("/busconfig/").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.config = resp.data.config;
          _this.checkeda = _this.config.buson == 1;
          _this.checkedb = _this.config.busoff == 1;
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
    addBusServer() {
      var _this = this;
      this.tableLoading = true;
      this.putRequest(
        "/system/iuser/role?idCard=" +
          this.idCard +
          "&rid=" +
          this.rid 
      ).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.dialogVisible = false;
          this.loadTableData();
        }
      });
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

    loadTableData() {
      var _this = this;
      this.loading = true;
      this.getRequest(
        "/system/iuser/byrole").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.iusers = resp.data.iusers;
          // _this.totalCount = resp.data.count;
        }
      });
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

    updateTop(row) {
      var _this = this;
      this.putRequest("/top/aid", {
        aid: row.id
      }).then(resp => {
        if (resp && resp.status == 200) {
        }
      });
    },
    shield(row) {
      var _this = this;

      if (_this.checkeda) {
        this.putRequest("/busServer/audit", {
          audit: 1,
          id: row.id,
          status: 0
        }).then(resp => {
          if (resp && resp.status == 200) {
            this.loadTableData();
          }
        });
      } else {
        this.putRequest("/busServer/shield", {
          enable: 1,
          id: row.id
        }).then(resp => {
          if (resp && resp.status == 200) {
            this.loadTableData();
          }
        });
      }
    },
    reshield(row) {
      var _this = this;
      if (_this.checkedb) {
        this.putRequest("/busServer/audit", {
          audit: 1,
          id: row.id,
          status: 0
        }).then(resp => {
          if (resp && resp.status == 200) {
            this.loadTableData();
          }
        });
      } else {
        this.putRequest("/busServer/shield", {
          enable: 0,
          id: row.id
        }).then(resp => {
          if (resp && resp.status == 200) {
            this.loadTableData();
          }
        });
      }
    },
    deleteServer(row) {
      this.$confirm("此操作将删除[" + row.name + "]的管理员身份, 是否继续?", "提示", {
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
    },
    deleteToDustBin(state) {
      var _this = this;
      this.$confirm(
        state != 2
          ? "将该文件放入回收站，是否继续?"
          : "永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          _this.loading = true;
          var url = "";
          if (_this.state == -2) {
            url = "/admin/article/dustbin";
          } else {
            url = "/article/dustbin";
          }
          putRequest(url, { aids: _this.dustbinData, state: state }).then(
            resp => {
              if (resp.status == 200) {
                var data = resp.data;
                _this.$message({ type: data.status, message: data.msg });
                if (data.status == "success") {
                  window.bus.$emit("blogTableReload"); //通过选项卡都重新加载数据
                }
              } else {
                _this.$message({ type: "error", message: "删除失败!" });
              }
              _this.loading = false;
              _this.dustbinData = [];
            },
            resp => {
              _this.loading = false;
              _this.$message({ type: "error", message: "删除失败!" });
              _this.dustbinData = [];
            }
          );
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
          _this.dustbinData = [];
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
