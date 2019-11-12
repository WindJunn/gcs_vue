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
    >
      <!-- <div style="margin-left: 5px;margin-right: 20px;display: inline">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddView">添加车辆</el-button>
      </div>-->
    </el-header>

    <div
      style="width:80%;margin-left:10%;margin-top:0px;box-shadow: 1px 1px 10px #6d83f1;padding: 10px 10px 10px 10px;border-radius: 15px;"
    >
      <div style="font-size:25px">在线评价</div>
      <div style="display:flex;align-items: center;margin: 20px;">
        <!-- <el-tag style="margin-left:20px;">缺陷位置</el-tag>
        <el-select v-model="evaluation.defectLocation" placeholder="请选择" style="margin-left:10px;">
          <el-option label="焊缝" value="1.0"></el-option>
          <el-option label="母材" value="0.0"></el-option>
        </el-select> -->

        <el-tag style="margin-left:20px;">测量裂纹半长度(c测量)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.measuringCrackLength"
          clearable
        ></el-input>

        <el-tag style="margin-left:20px;">测量裂纹半深度(a测量)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.measuringCrackDepth"
          clearable
        ></el-input>

           <el-tag style="margin-left:20px;">计算裂纹半深度</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.calculationCrackDepth"
          clearable
        ></el-input>
      </div>

      <div style="display:flex;align-items: center;margin: 20px;">
        <el-tag style="margin-left:20px;">是否返修</el-tag>
        <el-select v-model="evaluation.repairFactor" placeholder="请选择" style="margin-left:10px;">
          <el-option label="未返修" value="1.0"></el-option>
          <el-option label="返修" value="1.25"></el-option>
        </el-select>
        <el-tag style="margin-left:20px;">材料屈服强度(σy)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.materialYieldStrength"
          clearable
        ></el-input>

        <el-tag style="margin-left:20px;">冲击功(CVN)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.impactPower"
          clearable
        ></el-input>
      </div>
      <div style="display:flex;align-items: center;margin: 20px;">
        <el-tag style="margin-left:20px;">服役压力(P)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.servicePressure"
          clearable
        ></el-input>
        <el-tag style="margin-left:20px;">管外直径(D)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.outsideDiameter"
          clearable
        ></el-input>
        <el-tag style="margin-left:20px;">管壁厚(t)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.wallThickness"
          clearable
        ></el-input>
      </div>
      <div style="display:flex;align-items: center;margin: 20px;">
        <el-tag style="margin-left:20px;">错边因内压引起弯曲系数(e)</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.bendingCoefficients"
          clearable
        ></el-input>
        <el-tag style="margin-left:20px;">地区等级</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.areaLevel"
          clearable
        ></el-input>
     
      </div>

      <div>
        <el-button type="primary" @click="evaluationOnline()">开始在线评价</el-button>
      </div>
      <div style="display:flex;align-items: center;margin: 10px;">
        <el-tag style="margin-left:20px;">评价结果：</el-tag>
        <div>{{result}}</div>
      </div>
    </div>
  </div>
</template>



  
 

<script>
export default {
  data() {
    return {
      images: [],
      imagesList: [],
      value: "",
      dataUrl: {},
      header: "",
      selItems: [],
      loading: false,
      keywords: "",
      dialogVisible: false,
      dustbinData: [],
      activeName: "post",
      status: false,
      statusList: [],
      month: "",
      input: "",
      evaluation: {
        // defectLocation: "1.0",
        measuringCrackLength: 16.5,
        measuringCrackDepth: 1.5,
        materialYieldStrength: 245.0,
        repairFactor: "1.0",
        impactPower: 27.0,
        servicePressure: 1.0,
        outsideDiameter: 210.0,
        wallThickness: 7.0,
        bendingCoefficients: 0.0,
        areaLevel: 4.0,
        calculationCrackDepth:-1
      },
      result: ""
    };
  },
  mounted: function() {
    var _this = this;
    this.loading = true;
    // this.getImageUrls('');
    // this.getDevStatus();
    // this.getMonth();
    var _this = this;
  },
  methods: {
    evaluationOnline() {
      this.postsRequest("/evaluation/", this.evaluation).then(resp => {
        if (resp && resp.status == 200) {
          this.result =
            "【Kr: " + resp.data.obj.Kr + " 】【Lr: " + resp.data.obj.Lr + "】"+resp.data.obj.result;
        }
        // console.log(resp);
      });
    },
    getImageUrls(month) {
      var _this = this;
      this.getRequest("/evaluation/?evaluationParams=" + this.evaluation).then(
        resp => {
          console.log(resp);
        }
      );
    },

    showEditEmpView(row) {
      console.log(row);
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