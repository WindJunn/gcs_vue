<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:70px"
    >
   
    </el-header>

<h1>建设中</h1>
    
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
      totalCount: -1,
      currentPage: 1,
      pageSize: 10,
      depart: "",
      depart1: "",
      checkeda: false,
      checkedb: false,

      // activeName: "post",
      server: {
        id: "",
        busId: "",
        bustime: "",
        depart: 0,
        number: ""
      },
      busServer: [],
      config: {
        buson: "",
        busoff: ""
      }
    };
  },

  mounted: function() {
    var _this = this;
    this.loading = true;
    // this.loadTableData();
    // this.getbusconfig();
  },
  methods: {
    handleCheckAllChange1(checkeda) {
      // this.isIndeterminate = false;
      // if(val == 1){
      //   this.buson=1;
      // } else{
      //   this.buson=0;
      // }
       this.putRequest("/busconfig/config?buson=" + checkeda 
      ).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          this.loadTableData();
        }
      });
    },
    handleCheckAllChange2(checkedb) {
      // this.isIndeterminate = false;
     
    
       this.putRequest(
        "/busconfig/config?busoff=" + checkedb
      ).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          this.loadTableData();
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
      this.postRequest(
        "/busServer/add?bustime=" + this.bustime + "&busId=" + this.busId
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
        "/busServer/onAudit?page=" + this.currentPage + "&size=" + this.pageSize
      ).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.busServer = resp.data.onAudit;
          // _this.totalCount = resp.data.count;
        }
      });
    },
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
      if (row.depart == 1) {
        _this.enable = 0;
      }
      if (row.depart == 0) {
        _this.enable = 1;
      }
      this.putRequest("/busServer/shield", {
        enable: _this.enable,
        id: row.id
      }).then(resp => {
        if (resp && resp.status == 200) {
          this.putRequest("/busServer/audit", {
            audit: 0,
            id: row.id,
            status: 1
          }).then(resp => {
            if (resp.status == 200) {
              resp.msg = "";
              this.loadTableData();
            }
          });
        }
      });
    },
    reshield(row) {
      var _this = this;
      this.putRequest("/busServer/audit", {
        audit: 0,
        id: row.id,
        status: 0
      }).then(resp => {
        if (resp && resp.status == 200) {
          this.loadTableData();
        }
      });
    },
    deleteServer(row) {
      this.$confirm("此操作将删除[" + row.number + "], 是否继续?", "提示", {
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
      this.deleteRequest("/busServer/" + id).then(resp => {
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
