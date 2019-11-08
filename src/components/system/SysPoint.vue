<style type="text/css">
.blog_table_footer {
  display: flex;
  box-sizing: content-box;
  padding-top: 10px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  justify-content: space-between;
}
</style>
<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:55px"
    >
      <!-- <div style="margin-left: 5px;margin-right: 20px;display: inline">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddView">添加车辆</el-button>
      </div>-->
    </el-header>
    <div
      style="width:80%;margin-left:10%;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <span style="font-size: 22px;display: inline;margin-left: 8px;">图表位置修改</span>
      <el-row :gutter="40">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[0].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="6" style="margin-left: 50%;">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[9].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[1].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="margin-left: 50%;">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[8].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[2].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" style="margin-left: 50%;">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[7].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[3].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[4].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[5].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-select v-model="charts[6].value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row style="display:flex;display: flex;justify-content: center;">
        <el-col :span="6">
          <div>
            <el-button type="primary" @click="revCharts(charts)">复原</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-button type="primary" @click="updateCharts(charts)">确定修改</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div
      style="width:80%;margin-left:10%;margin-top:20px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="display:flex;align-items: center;">
        <el-tag>标题修改</el-tag>
        <el-input v-model="header.name" placeholder="请输入内容" style="margin: 10px;"></el-input>
        <el-button type="primary" @click="updateHeader()">确定修改</el-button>
      </div>
    
      <div style="display:flex;align-items: center;">
        <el-tag>标题字体大小修改</el-tag>
        <el-input v-model="header.size" placeholder="请输入内容" style="margin: 10px;"></el-input>
        <el-button type="primary" @click="updateHeader()">确定修改</el-button>
      </div>
        <div style="display:flex;align-items: center;">
        <el-tag>首页密码修改</el-tag>
        <el-input v-model="header.password" placeholder="请输入内容" style="margin: 10px;"></el-input>
        <el-button type="primary" @click="updateHeader()">确定修改</el-button>
      </div>
    </div>

    <div
      style="width:80%;margin-left:10%;margin-top:20px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="display:flex;align-items: center;">
        <el-tag>数据来源URL修改</el-tag>
        <el-input v-model="dataUrl.url" placeholder="请输入内容" style="margin: 10px;"></el-input>
        <el-button type="primary" @click="updateDataUrl()">确定修改</el-button>
      </div>
    </div>
  </div>
</template>



  
 

<script>
// import { putRequest } from "../../utils/api";
// import { getRequest } from "../../utils/api";
//  import Vue from 'vue'
//  var bus = new Vue()

export default {
  data() {
    return {
      options: [
        { key: "trwd", value: "土壤温度" },
        { key: "kqwd", value: "空气温度" },
        { key: "kqsd", value: "空气湿度" },
        { key: "trsd", value: "土壤湿度" },
        { key: "trsjd", value: "PH值" },
        { key: "tryd", value: "EC值" },
        { key: "jyl", value: "降雨量" },
        { key: "fs", value: "风速" },
        { key: "fx", value: "风向" },
        { key: "gzd", value: "光照强度" }
      ],
      charts: [],
      value: "",
      dataUrl: {},
      header: "",
      selItems: [],
      loading: false,
      keywords: "",
      dialogVisible: false,
      dustbinData: [],
      activeName: "post",
      tables: [
        { key: "trwd", value: "土壤温度" },
        { key: "kqwd", value: "空气温度" },
        { key: "kqsd", value: "空气湿度" },
        { key: "trsd", value: "土壤湿度" },
        { key: "trsjd", value: "PH值" },
        { key: "tryd", value: "EC值" },
        { key: "jyl", value: "降雨量" },
        { key: "fs", value: "风速" },
        { key: "fx", value: "风向" },
        { key: "gzd", value: "光照强度" }
      ]
    };
  },
  mounted: function() {
    var _this = this;
    this.loading = true;
    this.loadTableData();
    var _this = this;
  },
  methods: {
    updateDataUrl() {
      this.putRequest("/chart/dataUrl", this.dataUrl).then(resp => {
        if (resp && resp.status == 200) {
          this.loadTableData();
        }
      });
    },
    updateHeader() {
      this.putRequest("/chart/header", this.header).then(resp => {
        if (resp && resp.status == 200) {
          this.loadTableData();
        }
      });
    },
    revCharts() {
      for (var i = 0; i < 10; i++) {
        this.charts[i].key = this.tables[i].key;
        this.charts[i].value = this.tables[i].value;
      }
      this.putRequest("/chart/", { charts: JSON.stringify(this.charts) }).then(
        resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.loadTableData();
          }
        }
      );
    },
    updateCharts(charts) {
      debugger;
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (this.tables[j].value == charts[i].value) {
            charts[i].key = this.tables[j].key;
          }
        }
      }
      for (let m = 0; m < 10; m++) {
        let k = 0;
        for (let n = 0; n < 10; n++) {
          if (charts[m].value == charts[n].value) {
            k++;
          }
          if (k > 1) {
            alert("存在重复值");
            return;
          }
        }
      }

      this.putRequest("/chart/", { charts: JSON.stringify(charts) }).then(
        resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.loadTableData();
          }
        }
      );
    },

    showEditEmpView(row) {
      console.log(row);
      this.dialogTitle = "编辑车辆";
      this.bus = row;

      this.bus.plateNumber = row.plateNumber;
      this.bus.firstNumber = 4;
      this.bus.lastNumber = row.lastNumber;
      this.bus.rowNumber = row.rowNumber;
      this.bus.lineNumber = row.lineNumber;
      this.bus.total = row.total;
      this.bus.des = row.des;
      this.bus.price = row.price;
      this.busOne.time = new Date();
      this.bus.additionalSeat = 0;
      this.dialogVisible = true;
    },
    showAddView() {
      this.dialogTitle = "增加车辆";

      this.dialogVisible = true;
    },
    cancelEidt() {
      this.dialogVisible = false;
      this.emptyEmpData();
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
      this.getRequest("/chart/").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.charts = resp.data;
        }
      });
      this.getRequest("/chart/header").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.header = resp.data.header;
        }
      });
      this.getRequest("/chart/dataUrl").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.dataUrl = resp.data.dataUrl;
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
      this.putRequest("/iuser/shield", {
        enable: 1,
        id: row.id
      }).then(resp => {
        if (resp && resp.status == 200) {
          this.loadTableData();
        }
      });
    },
    reshield(row) {
      var _this = this;
      this.putRequest("/iuser/shield", {
        enable: 0,
        id: row.id
      }).then(resp => {
        if (resp && resp.status == 200) {
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
    },
    emptyEmpData() {
      this.bus = {
        id: "",
        plateNumber: "",
        lastNumber: "",
        rowNumber: "",
        lineNumber: "",
        additionalSeat: "",
        total: "",
        des: "",
        bustime: "",
        price: ""
      };
    }
  }
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #d3dce6;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;

  background-color: #f9fafc;
}
</style>