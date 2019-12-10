<template>
  <div>
    <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;">
      <div style="display: inline">
        <el-input
          placeholder="通过环焊缝编号搜索,记得回车哦..."
          clearable
          style="width: 300px;margin: 0px;padding: 0px;"
          size="mini"
          :disabled="advanceSearchViewVisible"
          @keyup.enter.native="searchData"
          prefix-icon="el-icon-search"
          v-model="keywords"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 5px"
          icon="el-icon-search"
          @click="searchData"
        >搜索</el-button>
        <!-- <el-button
          slot="reference"
          type="primary"
          size="mini"
          style="margin-left: 5px"
          @click="showAdvanceSearchView"
        >
          <i
            class="fa fa-lg"
            v-bind:class="[advanceSearchViewVisible ? faangledoubleup:faangledoubledown]"
            style="margin-right: 5px"
          ></i>高级搜索
        </el-button>-->
      </div>
      <div style="margin-left: 5px;margin-right: 20px;display: inline">
        <el-upload
          :show-file-list="false"
          accept=".xlsx"
          action="/girth/importGirthWeld"
          :before-upload="beforeUpload"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="fileUploadBtnText=='正在导入'"
          style="display: inline"
        >
          <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
            <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>
            {{fileUploadBtnText}}
          </el-button>
        </el-upload>

        <el-upload
          :show-file-list="false"
          accept=".xlsx"
          action="/girth/importGirthWeldEvaluation"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="fileUploadBtnText=='正在导入'"
          :before-upload="beforeFileUpload"
          style="display: inline"
        >
          <el-button class="success1" type="success" size="mini">
            <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>导入评价数据
          </el-button>
        </el-upload>
        <!-- <el-button class="success2" type="success" size="mini">
          <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>导入评价数据
        </el-button>-->

        <el-button type="success" size="mini" @click="exportData">
          <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出评价数据
        </el-button>
        <!-- <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddEmpView">添加记录</el-button> -->
      </div>
    </el-header>

    <el-table
      ref="multipleTable"
      :data="girthWeld"
      tooltip-effect="dark"
      border
      stripe
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" align="left" width="30"></el-table-column>
      <el-table-column fixed prop="department.name" align="left" label="分公司" width="150"></el-table-column>

      <el-table-column fixed prop="pipelineName" align="left" label="管线名称" width="100"></el-table-column>
      <el-table-column fixed prop="number" align="left" label="环焊缝编号" width="180"></el-table-column>
      <el-table-column prop="evaluateTime" align="left" label="评价时间" width="150"></el-table-column>
      <el-table-column prop="applicabilityEvaluationResult" width="150" label="适用性评价结果"></el-table-column>
      <el-table-column prop="disposalAdvice" width="200" label="处置建议"></el-table-column>

      <el-table-column prop="nondestructiveTestingResult" align="left" label="无损检测结果" width="280"></el-table-column>
      <el-table-column prop="stagger" align="left" label="错边量" width="200"></el-table-column>
      <el-table-column prop="testTime" width="150" label="检测时间"></el-table-column>

      <el-table-column fixed="right" label="操作" width="270">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="showEditEmpView(scope.row)">编辑</el-button> -->
          <el-button size="mini" type="primary" @click="showDetailed(scope.row)">详细信息</el-button>
          <el-button size="mini" type="danger" @click="deleteServer(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;margin: 2px;">
      <!-- <el-button
        type="danger"
        size="mini"
        v-if="girthWeld.length>0"
        :disabled="multipleSelection.length==0"
        @click="deleteManyEmps"
      >批量删除</el-button>-->
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
    </div>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-form :model="weld" ref="editUserForm" style="margin: 0px;padding: 0px;">
      <el-dialog
        title="环焊缝详情"
        style="padding: 0px;"
        :close-on-click-modal="true"
        :visible.sync="dialogVisible"
        width="90%"
      >
        <el-scrollbar
          wrapClass="scrollbar-wrap"
          :style="{height: scrollHeight}"
          ref="scrollbarContainer"
        >
          <h4 class="del-title">环焊缝安全评价结果:</h4>
          <el-row :gutter="20">
            <el-col :offset="1" :span="4">
              <div class="grid-content">
                <el-form-item label="Kr:" prop="name">
                  <el-input v-model="weld.kr" size="mini" style="width: 50%" placeholder></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-form-item label="Lr:" prop="name">
                  <el-input v-model="weld.lr" size="mini" style="width: 50%" placeholder></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="评价结果:" prop="name">
                  <el-input
                    v-model="weld.applicabilityEvaluationResult"
                    size="mini"
                    style="width: 70%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="评价日期:" prop="name">
                  <el-input v-model="weld.evaluateTime" size="mini" style="width: 70%" placeholder></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :offset="1" :span="10">
              <div class="grid-content">
                <el-form-item label="结论:" prop="name">
                  <el-input v-model="weld.conclusion" size="mini" style="width: 80%" placeholder></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item label="处置建议:" prop="name">
                  <el-input
                    v-model="weld.disposalAdvice"
                    size="mini"
                    style="width: 80%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <h4 class="del-title">环焊缝基础信息</h4>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content">
                <!-- 管线名称: -->
                <el-form-item label="管线名称:" prop="name">
                  <el-tag>{{weld.pipelineName}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="环焊缝编号:" prop="name">
                  <el-tag>{{weld.number}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="检测里程:" prop="name">
                  <el-tag>{{weld.checkMileage}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="钢级:" prop="name">
                  <el-tag>{{weld.steelGrade}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="外径(mm):" prop="name">
                  <el-tag>{{weld.diameter}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="设计壁厚(mm):" prop="name">
                  <el-tag>{{weld.designWallThickness}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="线路地区级别:" prop="name">
                  <el-tag>{{weld.lineAreaLevel}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="设计压力(MPa):" prop="name">
                  <el-tag>{{weld.designPressure}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="高后果区:" prop="name">
                  <el-tag>{{weld.highConsequenceAreas}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="钢管铺设:" prop="name">
                  <el-tag>{{weld.poleLaying}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="地貌:" prop="name">
                  <el-tag>{{weld.landscape}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="是否为连头口:" prop="name">
                  <el-tag>{{weld.connector}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <div class="grid-content">
                <el-form-item label="环焊缝上下游管节长度:" prop="name">
                  <el-input v-model="weld.upstreamPipe" size="mini" style="width: 30%" placeholder></el-input>
                  <el-input
                    v-model="weld.downstreamPipe"
                    size="mini"
                    style="width: 30%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="补口带厚度mm:" prop="name">
                  <el-tag>{{weld.patchThickness}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <div>
                <el-form-item label="补口带外观检查:" prop="name">
                  <el-input
                    v-model="weld.patchOutwardTest"
                    size="mini"
                    style="width: 80%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <div class="grid-content">
                <el-form-item label="补口带电火花检测:" prop="name">
                  电压:
                  <el-input v-model="weld.patchVoltage" size="mini" style="width: 25%" placeholder></el-input>结果:
                  <el-input
                    v-model="weld.patchVoltageResult"
                    size="mini"
                    style="width: 25%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-form-item label="补口带剥离强度测试:" prop="name">
                  温度:
                  <el-input
                    v-model="weld.patchTemperature"
                    size="mini"
                    style="width: 25%"
                    placeholder
                  ></el-input>结果:
                  <el-input
                    v-model="weld.patchTemperatureResult"
                    size="mini"
                    style="width:25%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <h4 class="del-title">环焊缝外观检测结果:</h4>
          <el-row :gutter="20">
            <el-col :offset="2" :span="6">
              <div class="grid-content">钟点位置</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">0点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">1点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">2点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">3点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">4点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">5点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">6点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">7点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">8点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">9点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">10点</div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">11点</div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :offset="2" :span="6">
              <div class="grid-content">上游管壁测厚mm</div>
            </el-col>
            <div v-for="(o,index) in upstreamPipe" :key="index" class="text item">
              <el-col :span="1">
                <div class="grid-content">{{o}}</div>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="2" :span="6">
              <div class="grid-content">下游管壁测厚mm</div>
            </el-col>
            <div v-for="(o,index) in downstreamPipe" :key="index" class="text item">
              <el-col :span="1">
                <div class="grid-content">{{o}}</div>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="2" :span="6">
              <div class="grid-content">焊缝宽度mm</div>
            </el-col>
            <div v-for="(o,index) in weldWidth" :key="index" class="text item">
              <el-col :span="1">
                <div class="grid-content">{{o}}</div>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="2" :span="6">
              <div class="grid-content">焊缝余高mm</div>
            </el-col>
            <div v-for="(o,index) in weldHight" :key="index" class="text item">
              <el-col :span="1">
                <div class="grid-content">{{o }}</div>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="2" :span="6">
              <div class="grid-content">错边量mm</div>
            </el-col>
            <div v-for="(o,index) in cuoBian" :key="index" class="text item">
              <el-col :span="1">
                <div class="grid-content">{{o}}</div>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="1" :span="7">
              <div class="grid-content">
                <el-form-item label="上下游钢管焊缝错开间距:" prop="name">
                  <el-input
                    v-model="weld.staggerSpacing"
                    size="mini"
                    style="width: 35%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content">
                <el-form-item label="外观检测:" prop="name">
                  <el-input v-model="weld.outwardResult" size="mini" style="width: 70%" placeholder></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="1" :span="21">
              <div class="grid-content">
                <el-form-item label="内检测异常点钟及尺寸:" prop="name">
                  <el-input
                    v-model="weld.abnormalPoints"
                    size="mini"
                    style="width: 80%"
                    placeholder
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <h4 class="del-title">环焊缝无损检测结果:</h4>
          <el-row :gutter="20">
            <el-col :offset="1" :span="4">
              <div class="grid-content">磁粉/渗透</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-input
                  v-model="weld.magneticParticleStandard"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-input
                  type="textarea"
                  v-model="weld.magneticParticleTest"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-top:15px">
            <el-col :offset="1" :span="4">
              <div class="grid-content">超声</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-input
                  v-model="weld.ultrasonicStandard"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-input
                  type="textarea"
                  v-model="weld.ultrasonicTest"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-top:15px">
            <el-col :offset="1" :span="4">
              <div class="grid-content">相控阵</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-input
                  v-model="weld.xiangkongzhenStandard"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-input
                  type="textarea"
                  v-model="weld.xiangkongzhenTest"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-top:15px">
            <el-col :offset="1" :span="4">
              <div class="grid-content">射线</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-input
                  v-model="weld.radiographicStandard"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-input
                  type="textarea"
                  v-model="weld.radiographicTest"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-top:15px">
            <el-col :offset="1" :span="4">
              <div class="grid-content">TOFD</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-input v-model="weld.tofdStandard" size="mini" style="width:100%" placeholder></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-input
                  type="textarea"
                  v-model="weld.tofdTest"
                  size="mini"
                  style="width:100%"
                  placeholder
                ></el-input>
              </div>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scrollHeight: "0px",
      articles: [],
      selItems: [],
      loading: false,
      keywords: "",
      departmentId: "",
      testingResultId: "",
      evaluationResultId: "",
      disposalAdviceId: "",
      defectId: "",
      disposalAdviceIdNo: "",
      pipelineName: "",

      fileUploadBtnText: "导入检测数据",

      faangledoubleup: "fa-angle-double-up",
      faangledoubledown: "fa-angle-double-down",
      multipleSelection: [],
      centerDialogVisible: false,
      dialogVisible: false,
      dustbinData: [],
      totalCount: -1,
      currentPage: 1,
      pageSize: 10,
      datas: [],
      tableLoading: false,
      advanceSearchViewVisible: false,
      showOrHidePop: false,
      showOrHidePop2: false,
      girthWeld: [],
      gwId: "",
      gwOutwards: [],
      upstreamPipe: [],
      downstreamPipe: [],
      weldWidth: [],
      weldHight: [],
      cuoBian: [],

      weld: {},
      bools: "",
      girth: {
        id: "",
        departmentId: "",
        pipelineName: "",
        number: "",
        nondestructiveTestingResult: "",
        applicabilityEvaluationResult: "",
        disposalAdvice: "",
        checkArea: "",
        checkMileage: "",
        steelGrade: "",
        diameter: "",
        designWallThickness: "",
        pipeLength: "",
        lineAreaLevel: "",
        designPressure: "",
        highConsequenceAreas: "",
        poleLaying: "",
        landscape: ""
      }
    };
  },

  mounted: function() {
    var _this = this;
    this.loading = true;
    this.loadTableData();
    this.scrollHeight = window.innerHeight * 0.7 + "px";
  },
  methods: {
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.keywords = "";
      if (!this.advanceSearchViewVisible) {
        // this.emptyEmpData();
        // this.beginDateScope = "";
        // this.loadEmps();
      }
    },
    fileUploadSuccess(response, file, fileList) {
      if (response) {
        this.$message({ type: "success", message: response.msg });
      }
      this.loadTableData();

      this.fileUploadBtnText = "导入检测数据";
    },
    fileUploadError(err, file, fileList) {
      console.log(err);
      // this.$message({ type: "error", message: "导入失败!" });
      this.fileUploadBtnText = "导入检测数据";
    },

    upload(file) {
      let formData = new FormData();
      formData.append("file", file);
      let _this = this;
      this.uploadFileRequest("/girth/findLetter", formData).then(resp => {
        if (resp && resp.status == 200) {
          let list = resp.data.obj;
          // console.log(list);
          if (list.length == 0) {
            this.bools = true;
            _this.fileUploadBtnText = "正在导入";
            // return _this.bools;
          } else {
            let datas = list[0];
            this.$confirm(
              "确定下列数据中的英文字母 “I” 或 “V” 不表达罗马字母Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ,  \n " +
                datas.number +
                " \n " +
                datas.magneticParticleTest +
                " \n " +
                datas.ultrasonicTest +
                " \n " +
                datas.xiangkongzhenTest +
                " \n " +
                datas.radiographicTest +
                " \n " +
                datas.tofdTest +
                " \n " +
                "是否继续?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.bools = true;
                console.log(this.bools + "确定执行");
                let formData1 = new FormData();
                formData1.append("file", file);
                this.uploadFileRequest("/girth/importGirthWeld", formData1);
                // return _this.bools;
              })
              .catch(() => {
                this.bools = false;
                console.log(this.bools + "取消执行");
                this.$message({ type: success, message: "已取消上传" });
              });
          }
        }
      });
    },
    beforeUpload(file) {
      const _self = this;
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("file", file);
        this.uploadFileRequest("/girth/findLetter", formData)
          .then(resp => {
            if (resp && resp.status == 200) {
              let list = resp.data.obj;
              // console.log(list);
              if (list.length == 0) {
                this.bools = true;
                resolve(true);
                _self.fileUploadBtnText = "正在导入";
              } else {
                let datas = list[0];
                let s = [];
                if (datas.number != null) {
                  s.push(datas.number);
                }
                if (datas.magneticParticleTest != null) {
                  s.push(datas.magneticParticleTest);
                }
                if (datas.ultrasonicTest != null) {
                  s.push(datas.ultrasonicTest);
                }
                if (datas.xiangkongzhenTest != null) {
                  s.push(datas.xiangkongzhenTest);
                }
                if (datas.radiographicTest != null) {
                  s.push(datas.radiographicTest);
                }
                if (datas.tofdTest != null) {
                  s.push(datas.tofdTest);
                }
                let reminder =
                  "确定下列数据中的英文字母 “I”或“V”或阿拉伯数字“1”，不表达罗马数字Ⅰ、Ⅱ、Ⅲ、Ⅳ、Ⅴ。若是，则点击取消修改后再次上传；否则点击继续上传。 <hr><div style='height:200px;overflow-y:scroll'> ";
                s.forEach(v => {
                  v = v
                    .replace(/I/g, "<span style='color: #f50a0a;'>I</span>")
                    .replace(/V/g, "<span style='color: #f50a0a;'>V</span>")
                    .replace(/1/g, "<span style='color: #f50a0a;'>1</span>");
                  reminder = reminder + v + "<hr>";
                });
                reminder = reminder + "</div>";

                this.$confirm(reminder, "提示", {
                  confirmButtonText: "继续上传",
                  cancelButtonText: "取消",
                  type: "warning",
                  dangerouslyUseHTMLString: true
                })
                  .then(() => {
                    _self.bools = true;
                    resolve(true);
                    console.log(_self.bools + "确定执行");
                  })
                  .catch(() => {
                    this.bools = false;
                    console.log(this.bools + "取消执行");
                    reject(false);
                    this.$message({ type: "info", message: "已取消上传" });
                  });
              }
            }
          })
          .catch(err => {
            console.log(err);
            reject(false);
          });
      });
    },
    beforeFileUpload(file) {
      const _self = this;
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("file", file);
        this.uploadFileRequest("/girth/findLetterEvaluation", formData)
          .then(resp => {
            if (resp && resp.status == 200) {
              let list = resp.data.obj;
              if (list.length == 0) {
                resolve(true);
                _self.fileUploadBtnText = "正在导入";
              } else {
                let s = [];
                list.forEach(v => {
                  s.push(v.number);
                });

                let reminder =
                  "确定下列数据中的英文字母 “I”或“V”或阿拉伯数字“1”，不表示罗马数字Ⅰ、Ⅱ、Ⅲ、Ⅳ、Ⅴ。若是，则点击取消修改后再上传；否则点击继续上传。 <hr> <div style='height:200px;overflow-y:scroll'>";
                s.forEach(v => {
                  v = v
                    .replace(/I/g, "<span style='color: #f50a0a;'>I</span>")
                    .replace(/V/g, "<span style='color: #f50a0a;'>V</span>")
                    .replace(/1/g, "<span style='color: #f50a0a;'>1</span>");
                  reminder = reminder + v + "<hr>";
                });
                reminder = reminder + "</div>";
                this.$confirm(reminder, "提示", {
                  confirmButtonText: "继续上传",
                  cancelButtonText: "取消",
                  type: "warning",
                  dangerouslyUseHTMLString: true
                })
                  .then(() => {
                    _self.bools = true;
                    resolve(true);
                    console.log(_self.bools + "确定执行");
                  })
                  .catch(() => {
                    this.bools = false;
                    console.log(this.bools + "取消执行");
                    reject(false);
                    this.$message({ type: "info", message: "已取消上传" });
                  });
              }
            }
          })
          .catch(err => {
            console.log(err);
            reject(false);
          });
      });
    },

    keywordsChange() {},
    exportData() {
      window.open(
        "/girth/exportGirthWeld?keywords=" +
          this.keywords +
          "&departmentId=" +
          this.departmentId +
          "&testingResultId=" +
          this.testingResultId +
          "&evaluationResultId=" +
          this.evaluationResultId +
          "&disposalAdviceId=" +
          this.disposalAdviceId +
          "&defectId=" +
          this.defectId +
          "&disposalAdviceIdNo=" +
          this.disposalAdviceIdNo +
          "&pipelineName=" +
          this.pipelineName,
        "_parent"
      );
    },
    showDetailed(row) {
      this.weld = row;
      console.log(this.weld);
      this.getGwOutwardByGwId(row);

      this.dialogVisible = true;
    },
    itemClick(row) {
      this.$router.push({
        path: "/sys/name",
        query: { serverId: row.serverId }
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
    getGwOutwardByGwId(row) {
      var _this = this;
      this.getRequest("/girth/gwOutward?gwId=" + row.id).then(resp => {
        console.log(resp);

        if (resp && resp.status == 200) {
          _this.gwOutwards = resp.data.obj.gwOutwards;
          console.log(_this.gwOutwards);

          _this.upstreamPipe = [];
          _this.downstreamPipe = [];
          _this.weldWidth = [];
          _this.weldHight = [];
          _this.cuoBian = [];

          for (let i = 0; i < _this.gwOutwards.length; i++) {
            let data = _this.gwOutwards[i];
            console.log(data);
            if (data.type == 1) {
              delete data.id;
              delete data.gwId;
              delete data.type;

              _this.upstreamPipe = data;
            }
            if (data.type == 2) {
              delete data.id;
              delete data.gwId;
              delete data.type;
              _this.downstreamPipe = data;
            }
            if (data.type == 3) {
              delete data.id;
              delete data.gwId;
              delete data.type;
              _this.weldWidth = data;
            }
            if (data.type == 4) {
              delete data.id;
              delete data.gwId;
              delete data.type;
              _this.weldHight = data;
            }
            if (data.type == 5) {
              delete data.id;
              delete data.gwId;
              delete data.type;
              _this.cuoBian = data;
            }
          }

          console.log(_this.gwOutwards);
          console.log(_this.upstreamPipe);
        }
      });
    },

    showEditEmpView(row) {
      // console.log(row);
      this.dialogTitle = "编辑学员";

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
    searchData() {
      this.loadTableData();
    },

    loadTableData() {
      var _this = this;
      let departmentId = this.$route.query.departmentId;
      let testingResultId = this.$route.query.testingResultId;
      let evaluationResultId = this.$route.query.evaluationResultId;
      let disposalAdviceId = this.$route.query.disposalAdviceId;
      let defectId = this.$route.query.defectId;
      let disposalAdviceIdNo = this.$route.query.disposalAdviceIdNo;
      let pipelineName = this.$route.query.pipelineName;

      if (departmentId != null) {
        this.departmentId = departmentId;
      }
      if (testingResultId != null) {
        this.testingResultId = testingResultId;
      }
      if (evaluationResultId != null) {
        this.evaluationResultId = evaluationResultId;
      }
      if (disposalAdviceId != null) {
        this.disposalAdviceId = disposalAdviceId;
      }
      if (defectId != null) {
        this.defectId = defectId;
      }
      if (disposalAdviceIdNo != null) {
        this.disposalAdviceIdNo = disposalAdviceIdNo;
      }
      if (pipelineName != null) {
        this.pipelineName = pipelineName;
      }
      this.getRequest(
        "/girth/?page=" +
          this.currentPage +
          "&size=" +
          this.pageSize +
          "&keywords=" +
          this.keywords +
          "&departmentId=" +
          this.departmentId +
          "&testingResultId=" +
          this.testingResultId +
          "&evaluationResultId=" +
          this.evaluationResultId +
          "&disposalAdviceId=" +
          this.disposalAdviceId +
          "&defectId=" +
          this.defectId +
          "&disposalAdviceIdNo=" +
          this.disposalAdviceIdNo +
          "&pipelineName=" +
          this.pipelineName
      ).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.girthWeld = resp.data.obj.girthWelds;
          _this.totalCount = resp.data.obj.count;
        }
      });
    },

    handleSelectionChange(val) {
      this.selItems = val;
    },

    deleteServer(row) {
      this.$confirm(
        "此操作将删除[" + row.number + "]相关所有数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/girth/" + id).then(resp => {
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
<style scoped>
.el-scrollbar {
  height: 90%;
}
.scrollbar-wrap {
  overflow-x: hidden;
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
.el-row {
  margin-bottom: 1px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.-dark {
  background: #99a9bf;
}
.-light {
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
.el-form .el-tag {
  width: 100%;
}
.el-form .el-form-item__content {
  width: 65%;
  float: left;
}
.del-title {
  font-weight: 500;
  padding-bottom: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #eee;
}
</style>