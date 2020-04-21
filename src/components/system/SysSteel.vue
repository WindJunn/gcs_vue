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
      <div style="font-size:25px;margin-bottom:15px">在线评价钢级参数管理</div>
      <div>
        <el-tag style="margin-left:10px;width:20%">钢级</el-tag>
        <el-tag style="margin-left:10px;width:20%">屈服强度(MPa)</el-tag>
        <el-tag style="margin-left:10px;width:20%">抗拉强度(MPa)</el-tag>
        <el-tag style="margin-left:10px;width:20%">冲击功(J)</el-tag>
        <el-button type="primary" plain>操作</el-button>
      </div>

      <div style="margin-top:10px;">
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="steelParam.steel"></el-input>
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="steelParam.qfqd"></el-input>
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="steelParam.klqd"></el-input>
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="steelParam.cjg"></el-input>
        <el-button type="success" style="margin-top:10px;" @click="addParam()">增加</el-button>
      </div>
      <hr/>

      <div v-for="item in steelParams" :key="item.id" style="margin-top:10px;">
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="item.steel"></el-input>
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="item.qfqd"></el-input>
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="item.klqd"></el-input>
        <el-input style="margin-left:10px;width:20%" placeholder="请输入内容" v-model="item.cjg"></el-input>
        <el-button type="primary" style="margin-top:10px;" @click="deleteOne(item.id)">删除</el-button>
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
        steelParams: [],
        steelParam: {
          id: "",
          steel: "",
          qfqd: "",
          klqd: "",
          cjg: ""
        }
      };
    },
    mounted: function () {
      var _this = this;
      _this.findParamData();
    },
    methods: {
      findParamData() {
        var _this = this;
        this.getRequest("/steel/param/").then(resp => {
          _this.steelParams = resp.data.obj.steelParams;
        });
      },
      deleteOne(id) {
        this.deleteRequest("/steel/param/" + id).then(resp => {
          if (resp && resp.status == 200) {
            this.findParamData();
          }
        });
      },
      addParam() {
        this.postRequest("/steel/param/", this.steelParam).then(resp => {
          if (resp && resp.status == 200) {
            this.steelParam = {
              steel: "",
              qfqd: "",
              klqd: "",
              cjg: ""
            };
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
