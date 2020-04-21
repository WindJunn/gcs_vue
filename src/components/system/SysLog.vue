<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:70px"
    ></el-header>

    <div
      style="width:80%;margin-left:10%;margin-top:20px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <!-- <div style="display:flex;align-items: center;margin-top:10px">
        <el-tag>是否开启期刊栏目</el-tag>
        <el-switch
          style="margin: 10px;"
          v-model="periodical.enable"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </div> -->

      <div style="display:flex;align-items: center;margin-top:30px">
        <el-tag>期刊链接修改</el-tag>
        <el-input v-model="periodical.link" placeholder="请输入内容" style="margin: 10px;width:40%"></el-input>
      </div>
      <div style="display:flex;align-items: center;justify-content: center;margin-top:20px">
        <el-button type="primary" @click="updatePer()">确定修改</el-button>
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
        dustbinData: [],
        // periodicals: [],
        totalCount: -1,
        currentPage: 1,
        pageSize: 10,
        periodical: {
          id: "",
          enable: true,
          link: "http://www.gcyq.org"
        }
      };
    },

    mounted: function () {
      var _this = this;
      this.loadTableData();
    },
    methods: {
      updatePer() {
        var _this = this;
        this.postsRequest("/periodical/", this.periodical).then(resp => {
          if (resp && resp.status == 200) {
            _this.loadTableData();
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

      loadTableData() {
        var _this = this;
        this.loading = true;
        this.getRequest("/periodical/").then(resp => {
          _this.loading = false;
          if (resp && resp.status == 200) {
            _this.periodical = resp.data.obj.periodical;
            console.log(_this.periodical);
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
