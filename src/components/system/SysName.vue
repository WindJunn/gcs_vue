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
        </el-select>-->

        <el-tag style="margin-left:20px;">{{repairFactorName}}</el-tag>
        <el-select v-model="evaluation.repairFactor" placeholder="请选择" style="margin-left:10px;">
          <el-option label="未返修" value="1.0"></el-option>
          <el-option label="返修" value="1.25"></el-option>
        </el-select>

        <el-tag style="margin-left:20px;">{{steelLevelName}}</el-tag>

        <el-select v-model="evaluation.calculationCrackDepth" placeholder="请选择" style="margin-left:10px;">
          <el-option :label="item" :value="index" v-for="(item,index) in array.steel" :key="index"></el-option>
        </el-select>
        <el-tag style="margin-left:20px;">{{areaLevelName}}</el-tag>

        <el-select v-model="evaluation.areaLevel" placeholder="请选择" style="margin-left:10px;">
          <el-option label="一级" value="1.0"></el-option>
          <el-option label="二级" value="2.0"></el-option>
          <el-option label="三级" value="3.0"></el-option>
          <el-option label="四级" value="4.0"></el-option>
        </el-select>
      </div>

      <div style="display:flex;align-items: center;margin: 20px;">
        <el-tag style="margin-left:20px;">{{measuringCrackLengthName}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.measuringCrackLength"
          clearable
        ></el-input>

        <el-tag style="margin-left:20px;">{{measuringCrackDepthName}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.measuringCrackDepth"
          clearable
        ></el-input>
        <el-tag style="margin-left:20px;">{{bendingCoefficientsName}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.bendingCoefficients"
          clearable
        ></el-input>
        <!-- <el-tag style="margin-left:20px;">{{param[2].name}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.materialYieldStrength"
          clearable
        ></el-input>-->

        <!-- <el-tag style="margin-left:20px;">{{param[4].name}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.impactPower"
          clearable
        ></el-input>-->
      </div>
      <div style="display:flex;align-items: center;margin: 20px;">
        <el-tag style="margin-left:20px;">{{servicePressureName}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.servicePressure"
          clearable
        ></el-input>
        <el-tag style="margin-left:20px;">{{outsideDiameterName}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.outsideDiameter"
          clearable
        ></el-input>
        <el-tag style="margin-left:20px;">{{wallThicknessName}}</el-tag>
        <el-input
          style="margin-left:10px;width:15%"
          placeholder="请输入内容"
          v-model="evaluation.wallThickness"
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
      param: [],
      measuringCrackLengthName: "",
      measuringCrackDepthName: "",
      repairFactorName: "",
      servicePressureName: "",
      outsideDiameterName: "",
      wallThicknessName: "",
      bendingCoefficientsName: "",
      areaLevelName: "",
      steelLevelName: "",
      evaluation: {
        // defectLocation: "1.0",
        measuringCrackLength: 33,
        measuringCrackDepth: 3,
        materialYieldStrength: 245.0,
        repairFactor: "1.0",
        impactPower: 27.0,
        servicePressure: 1.0,
        outsideDiameter: 210.0,
        wallThickness: 7.0,
        bendingCoefficients: 0.0,
        areaLevel: "",
        calculationCrackDepth: "",
        steelLevel: ""
      },
      result: "",
      array: []
    };
  },
  mounted: function() {
    var _this = this;
    this.loading = true;
    // this.getImageUrls('');
    // this.getDevStatus();
    // this.getMonth();
    this.loadTableData();
    this.getArrays();
    var _this = this;
  },
  methods: {
    evaluationOnline() {
      this.evaluation.steelLevel = parseInt(this.evaluation.calculationCrackDepth)+1;
      this.postsRequest("/evaluation/", this.evaluation).then(resp => {
        if (resp && resp.status == 200) {
          this.result =
            "【Kr: " +
            resp.data.obj.Kr +
            " 】【Lr: " +
            resp.data.obj.Lr +
            "】" +
            resp.data.obj.result;
        }
        // console.log(resp);
      });
    },
    getArrays() {
      var _this = this;
      this.getRequest("/evaluation/array").then(resp => {
        console.log(resp);
        this.array = resp.data.obj;
        console.log(this.array);
        console.log(this.array.steel["1"]);
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
      this.getRequest("/evaluation/").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.param = resp.data.obj;
          this.measuringCrackLengthName = _this.param[0].name;
          this.measuringCrackDepthName = _this.param[1].name;
          this.repairFactorName = _this.param[2].name;
          this.servicePressureName = _this.param[3].name;
          this.outsideDiameterName = _this.param[4].name;
          this.wallThicknessName = _this.param[5].name;
          this.bendingCoefficientsName = _this.param[6].name;
          this.areaLevelName = _this.param[7].name;
          this.steelLevelName = _this.param[8].name;
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