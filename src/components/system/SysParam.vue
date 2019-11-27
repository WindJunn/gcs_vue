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
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:5px"
    ></el-header>

    <div
      style="width:90%;margin-left:5%;margin-top:10px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="font-size:25px">在线评价参数管理</div>
      <div v-for="item in paramExplanations" :key="item.id">
        <div style="margin-top:10px;">
          <el-tag style="margin-left:10px;">列：{{item.colum}}</el-tag>
          <el-input
            style="margin-left:10px;width:20%"
            placeholder="请输入内容"
            v-model="item.name"
          ></el-input>
          <el-tag style="margin-left:20px;">解释说明：</el-tag>
          <el-input
            style="width:50%"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="item.explanation"
          ></el-input>
        </div>
      </div>

      <div>
        <el-button type="primary" style="margin-top:10px;" @click="updateParam()">确定修改</el-button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      loading: false,
      keywords: "",
      dialogVisible: false,
      paramExplanations: [],
      paramExplanation: {
        id: "",
        param: "",
        colum: "",
        name: "",
        explanation: ""
      }
    };
  },
  mounted: function() {
    var _this = this;

    _this.findParamData();
  },
  methods: {
    findParamData() {
      var _this = this;
      this.getRequest("/evaluation/").then(resp => {
        _this.paramExplanations = resp.data.obj;
        console.log(resp);
      });
    },
    updateParam() {
      this.putsRequest("/evaluation/update", {
        paramExplanations: JSON.stringify(this.paramExplanations)
      }).then(resp => {
        if (resp && resp.status == 200) {
          this.findParamData();
        }
      });
    },

    searchClick() {
      this.loadBlogs(1, this.pageSize);
    },

    handleSelectionChange(val) {
      this.selItems = val;
    },

    handleDelete(index, row) {
      this.dustbinData.push(row.id);
      this.deleteToDustBin(row.state);
    }
  }
};
</script>

<style>
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