<template>
  <div>
    <el-header
      style="padding: 0px;display:flex;justify-content:space-between;align-items: center;height:70px"
    ></el-header>

    <!-- <div
      style="width:80%;margin-left:10%;margin-top:20px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="display:flex;align-items: center;margin-top:30px">
        当前版本信息
        <el-tag>当前版本</el-tag>
        <el-input v-model="version.versionCode" disabled="" placeholder="请输入内容" style="margin: 10px;width:40%"></el-input>
      </div>
    </div>-->
    <div
      style="width:80%;margin-left:10%;margin-top:20px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      安卓版本更新
      <div style="display:flex;align-items: center;margin-top:10px">
        <el-upload
          :show-file-list="false"
          class="upload-demo"
          action="version/apk"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="fileUploadBtnText=='正在上传'"
          :before-upload="beforeFileUpload"
          style="display: inline"
          multiple
        >
          <el-button
            size="mini"
            type="success"
            :loading="fileUploadBtnText=='正在上传'"
          >{{fileUploadBtnText}}</el-button>
        </el-upload>
        <el-tag style="margin-left: 10px;">链接：</el-tag>
        <el-input v-model="version.url" disabled placeholder="请输入内容" style="margin: 5px;width:70%"></el-input>
      </div>

      <div style="display:flex;align-items: center;margin-top:30px">
        <el-tag>版本号：</el-tag>
        <el-input v-model="version.versionCode" placeholder="请输入内容" style="margin: 5px;width:40%"></el-input>
      </div>
      <div style="display:flex;align-items: center;margin-top:30px">
        <el-tag>版本名称：</el-tag>
        <el-input v-model="version.versionName" placeholder="请输入内容" style="margin: 5px;width:40%"></el-input>
      </div>
      <div style="display:flex;align-items: center;margin-top:30px">
        <el-tag>版本内容：</el-tag>
        <el-input
          v-model="version.content"
          type="textarea"
          placeholder="可不填"
          style="margin: 5px;width:60%"
        ></el-input>
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
      fileUploadBtnText: "上传安装包",

      version: {
        id: "",
        versionCode: "",
        versionName: "",
        url: "",
        content: ""
      }
    };
  },

  mounted: function() {
    var _this = this;
    this.loadTableData();
  },
  methods: {
    fileUploadSuccess(response, file, fileList) {
      this.$message({ type: "success", message: response.msg });
      this.loadTableData();

      this.fileUploadBtnText = "上传安装包";
    },
    fileUploadError(err, file, fileList) {
      this.$message({ type: "error", message: "上传失败!" });
      this.fileUploadBtnText = "上传安装包";
    },
    beforeFileUpload(file) {
      this.fileUploadBtnText = "正在上传";
    },
    updatePer() {
      var _this = this;
      this.postRequest("/version/", _this.version).then(resp => {
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
      this.getRequest("/version/?type=1").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.version = resp.data.obj.version;
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
