<template>
  <div>
    <div style="text-align: left">
      <el-input
        placeholder="输入公司名称搜索公司..."
        style="width: 500px;margin: 0px;padding: 0px;"
        size="mini"
        prefix-icon="el-icon-search"
        v-model="keywords"
      ></el-input>
    </div>
    <div>
      <el-tree
        :props="defaultProps"
        :data="treeData"
        ref="tree"
        :filter-node-method="filterNode"
        v-loading="treeLoading"
        style="width: 500px;margin-top: 10px"
        :render-content="renderContent"
      ></el-tree>
      <div style="text-align: left">
        <el-dialog title="添加公司" :visible.sync="dialogVisible" width="25%">
          <div>
            <span>上级公司</span>
            <el-select v-model="pDep" style="width: 200px" placeholder="请选择" size="mini">
              <el-option v-for="item in allDeps" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span>公司名称</span>
            <el-input
              size="mini"
              style="width: 200px;"
              v-model="depName"
              placeholder="请输入公司名称..."
              @keyup.enter.native="addDep"
            ></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
            <el-button size="small" type="primary" @click="addDep">添加</el-button>
          </span>
        </el-dialog>
      </div>
      <div style="text-align: left">
        <el-dialog title="修改公司" :visible.sync="dialogVisible1" width="25%">
          <div>
            <span>当前公司</span>
            <el-select v-model="pmid" disabled style="width: 200px" placeholder="请选择" size="mini">
              <el-option v-for="item in allDeps" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span>修改后公司名称</span>
            <el-input
              size="mini"
              style="width: 200px;"
              v-model="depName"
              placeholder="请输入公司名称..."
              @keyup.enter.native="updateDep"
            ></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible1 = false">取消</el-button>
            <el-button size="small" type="primary" @click="updateDep">确定修改</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keywords: "",
      depName: "",
      treeLoading: false,
      dialogVisible: false,
      dialogVisible1: false,
      allDeps: [],
      pDep: "",
      pmid: "",

      treeData: [],
      defaultProps: {
        label: "name",
        isLeaf: "leaf",
        children: "children"
      }
    };
  },
  mounted: function() {
    this.treeLoading = true;
    this.loadTreeData();
  },
  watch: {
    keywords(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    loadTreeData() {
      var _this = this;
      this.getRequest("/system/basic/dep/-1").then(resp => {
        _this.treeLoading = false;
        if (resp && resp.status == 200) {
          _this.treeData = resp.data;
        }
      });
    },
    setDataToTree(treeData, pId, respData) {
      for (var i = 0; i < treeData.length; i++) {
        var td = treeData[i];
        if (td.id == pId) {
          treeData[i].children = treeData[i].children.concat(respData);
          return;
        } else {
          this.setDataToTree(td.children, pId, respData);
        }
      }
    },
    addDep() {
      var _this = this;
      this.dialogVisible = false;
      this.treeLoading = true;
      this.postRequest("/system/basic/dep", {
        name: this.depName,
        parentId: this.pDep
      }).then(resp => {
        _this.treeLoading = false;
        if (resp && resp.status == 200) {
          var respData = resp.data;
          _this.depName = "";
          _this.setDataToTree(_this.treeData, _this.pDep, respData.msg);
        }
      });
    },

    updateDep() {
      var _this = this;
      this.dialogVisible1 = false;
      this.treeLoading = false;
      this.putRequest("/system/basic/dep", {
        name: this.depName,
        id: this.pmid
      }).then(resp => {
        _this.treeLoading = false;
        _this.depName = "";
        console.log(resp);
          _this.setDataToTree(_this.treeData, _this.pDep, respData.msg);

          // _this.loadTreeData();

      });
    },

    loadAllDeps() {
      var _this = this;
      this.getRequest("/system/basic/deps").then(resp => {
        if (resp && resp.status == 200) {
          _this.allDeps = resp.data;
        }
      });
    },
    showAddDepView(data, event) {
      this.loadAllDeps();
      this.dialogVisible = true;
      this.pDep = data.id;
      event.stopPropagation();
    },
    showUpdateDepView(data, event) {
      this.loadAllDeps();
      this.dialogVisible1 = true;
      this.pmid = data.id;
      event.stopPropagation();
    },
    deleteDep(data, event) {
      var _this = this;
      if (data.children.length > 0) {
        this.$message({
          message: "该公司下尚有其他公司，不能被删除!",
          type: "warning"
        });
      } else {
        this.$confirm("删除[" + data.name + "]公司, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            _this.treeLoading = true;
            _this.deleteRequest("/system/basic/dep/" + data.id).then(resp => {
              _this.treeLoading = false;
              if (resp && resp.status == 200) {
                var respData = resp.data;

                _this.deleteLocalDep(_this.treeData, data);
              }
            });
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
      event.stopPropagation();
    },
    deleteLocalDep(treeData, data) {
      for (var i = 0; i < treeData.length; i++) {
        var td = treeData[i];
        if (td.id == data.id) {
          treeData.splice(i, 1);
          return;
        } else {
          this.deleteLocalDep(td.children, data);
        }
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button
              style="font-size: 12px;"
              type="primary"
              size="mini"
              style="padding:3px"
              on-click={() => this.showAddDepView(data, event)}
            >
              添加公司
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="primary"
              size="mini"
              style="padding:3px"
              on-click={() => this.showUpdateDepView(data, event)}
            >
              修改公司
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="danger"
              size="mini"
              style="padding:3px"
              on-click={() => this.deleteDep(data, event)}
            >
              删除公司
            </el-button>
          </span>
        </span>
      );
    }
  }
};
</script>
