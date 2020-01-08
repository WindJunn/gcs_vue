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
        
      </div>
      <div style="margin-left: 5px;margin-right: 20px;display: inline">
        <el-tag>罗马数字 Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ</el-tag>
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
      <el-table-column fixed prop="department.name" align="left" label="分公司" width="130"></el-table-column>

      <el-table-column fixed prop="pipelineName" align="left" label="管线名称" width="80"></el-table-column>
      <el-table-column fixed prop="number" align="left" label="环焊缝编号" width="180"></el-table-column>
      <el-table-column prop="evaluateTime" align="left" label="评价时间" width="100"></el-table-column>
      <el-table-column prop="applicabilityEvaluationResult" width="100" label="适用性评价结果"></el-table-column>
      <el-table-column prop="disposalAdvice" width="180" label="处置建议"></el-table-column>

      <el-table-column prop="nondestructiveTestingResult" align="left" label="无损检测结果" width="280"></el-table-column>
      <el-table-column prop="stagger" align="left" label="错边量" width="200"></el-table-column>
      <el-table-column prop="testTime" width="150" label="检测时间"></el-table-column>

      <el-table-column fixed="right" label="操作" width="400">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showEditResult(scope.row)">修改提取结果</el-button>
          <el-button size="mini" type="primary" @click="showDetailed(scope.row)">详细信息</el-button>
          <el-button size="mini" type="primary" @click="picManagement(scope.row)">裂纹图片</el-button>
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

    <el-form :model="weld" ref="editResultForm" style="margin: 0px;padding: 0px;">
      <el-dialog
        title="检测评价数据提取详情"
        style="padding: 0px;"
        :close-on-click-modal="true"
        :visible.sync="dialogVisible1"
        width="80%"
      >
        <el-row :gutter="20">
          <el-col :offset="1" :span="8">
            <div class="grid-content">
              <el-form-item label="焊缝编号:" prop="name">
                <el-input v-model="weld.number" size="mini" style="width: 70%" placeholder></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="管线名称:" prop="name">
                <el-input v-model="weld.pipelineName" size="mini" style="width: 60%" placeholder></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
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
                <!-- <el-tag style="width: 80%">{{weld.disposalAdvice}}</el-tag> -->
                <el-input v-model="weld.disposalAdvice" size="mini" style="width: 80%" placeholder></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="6">
            <div class="grid-content">
              <el-form-item label="评价日期:" prop="name">
                <el-date-picker
                  v-model="weld.evaluateTime"
                  type="date"
                  style="width: 70%"
                  placeholder="选择日期"
                ></el-date-picker>
                <!-- <el-input v-model="weld.evaluateTime" size="mini" style="width: 70%" placeholder></el-input> -->
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <el-form-item label="检测日期:" prop="name">
                <el-date-picker
                  v-model="weld.testTime"
                  type="date"
                  style="width: 70%"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <hr />
        <!-- <h3>提取数据</h3> -->
        <h3>下列数据根据所上传Excel表提取，前三个选择框结果决定数据统计结果，若有误，直接修改即可。罗马数字 Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ</h3>
        <el-row :gutter="20">
          <el-col :offset="1" :span="8">
            <div class="grid-content">
              <el-form-item label="适用性评价结果:" prop="name">
                <el-select v-model="weld.evaluationResultId" placeholder="请选择">
                  <el-option
                    v-for="item in optionsEvaluationResult"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="处置建议:" prop="name">
                <el-select v-model="weld.disposalAdviceId" style="width: 70%" placeholder="请选择">
                  <el-option
                    v-for="item in optionsDisposalAdvice"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="8">
            <div class="grid-content">
              <el-form-item label="无损检测结果:" prop="name">
                <el-select v-model="weld.testingResultId" placeholder="请选择是否合格">
                  <el-option
                    v-for="item in optionsTestingResult"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="10">
            <div class="grid-content">
              <el-form-item label="无损检测结果详情:" prop="name">
                <el-input
                  v-model="weld.nondestructiveTestingResult"
                  style="width: 70%"
                  placeholder="请输入详细信息"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="8">
            <div class="grid-content">
              <el-form-item label="错边量:" prop="name">
                <el-input v-model="weld.stagger" style="width: 70%" placeholder="请输入错边量信息"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <el-form-item label="射线检测缺陷性质:" prop="name">
                <el-input
                  v-model="weld.defectProperty"
                  style="width: 70%"
                  placeholder="请输入射线检测缺陷性质"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelEidt">取 消</el-button>
          <el-button size="mini" type="primary" @click="editResult('editResultForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>

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
                  <el-tag style="width: 50%">{{weld.kr}}</el-tag>

                  <!-- <el-input v-model="weld.kr" size="mini" style="width: 50%" placeholder></el-input> -->
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-form-item label="Lr:" prop="name">
                  <el-tag style="width: 50%">{{weld.lr}}</el-tag>
                  <!-- <el-input v-model="weld.lr" size="mini" style="width: 50%" placeholder></el-input> -->
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="评价结果:" prop="name">
                  <el-tag style="width: 70%">{{weld.applicabilityEvaluationResult}}</el-tag>
                  <!-- <el-input
                    v-model="weld.applicabilityEvaluationResult"
                    size="mini"
                    style="width: 70%"
                    placeholder
                  ></el-input>-->
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="评价日期:" prop="name">
                  <el-tag style="width: 70%">{{weld.evaluateTime}}</el-tag>

                  <!-- <el-input v-model="weld.evaluateTime" size="mini" style="width: 70%" placeholder></el-input> -->
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :offset="1" :span="10">
              <div class="grid-content">
                <el-form-item label="结论:" prop="name">
                  <el-tag style="width: 80%">{{weld.conclusion}}</el-tag>
                  <!-- <el-input v-model="weld.conclusion" size="mini" style="width: 80%" placeholder></el-input> -->
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item label="处置建议:" prop="name">
                  <el-tag style="width: 80%">{{weld.disposalAdvice}}</el-tag>
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
                  <el-tag style="width: 30%">{{weld.upstreamPipe}}</el-tag>
                  <el-tag style="width: 30%">{{weld.downstreamPipe}}</el-tag>
                  <!-- <el-input v-model="weld.upstreamPipe" size="mini" style="width: 30%" placeholder></el-input>
                  <el-input
                    v-model="weld.downstreamPipe"
                    size="mini"
                    style="width: 30%"
                    placeholder
                  ></el-input>-->
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-form-item label="补口带厚度mm:" prop="name">
                  <el-tag style="width: 70%">{{weld.patchThickness}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <div>
                <el-form-item label="补口带外观检查:" prop="name">
                  <el-tag style="width: 80%">{{weld.patchOutwardTest}}</el-tag>

                  <!-- <el-input
                    v-model="weld.patchOutwardTest"
                    size="mini"
                    style="width: 70%"
                    placeholder
                  ></el-input>-->
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <div class="grid-content">
                <el-form-item label="补口带电火花检测:" prop="name">
                  电压:
                  <el-tag style="width: 25%">{{weld.patchVoltage}}</el-tag>

                  <!-- <el-input v-model="weld.patchVoltage" size="mini" style="width: 25%" placeholder></el-input> -->
                  结果:
                  <el-tag style="width: 25%">{{weld.patchVoltageResult}}</el-tag>
                  <!-- <el-input
                    v-model="weld.patchVoltageResult"
                    size="mini"
                    style="width: 25%"
                    placeholder
                  ></el-input>-->
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-form-item label="补口带剥离强度测试:" prop="name">
                  温度:
                  <el-tag style="width: 25%">{{weld.patchTemperature}}</el-tag>结果:
                  <el-tag style="width: 25%">{{weld.patchTemperatureResult}}</el-tag>
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
                  <el-tag style="width: 35%">{{weld.staggerSpacing}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content">
                <el-form-item label="外观检测:" prop="name">
                  <el-tag style="width: 70%">{{weld.outwardResult}}</el-tag>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :offset="1" :span="21">
              <div class="grid-content">
                <el-form-item label="内检测异常点钟及尺寸:" prop="name">
                  <el-tag style="width: 80%">{{weld.abnormalPoints}}</el-tag>
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

    <el-form :model="weld" ref="editUserForm" style="margin: 0px;padding: 0px;">
      <el-dialog
        title
        style="padding: 0px;"
        :close-on-click-modal="true"
        :visible.sync="dialogVisible2"
        width="80%"
      >
        <el-upload
          class="upload-pic"
          action="/girth/image/upload"
          :show-file-list="false"
          :data="uploadData"
          :before-upload="beforeUploadImage"
          :on-success="uploadSuccess"
        >
          <el-button size="small" type="primary" :loading="imageUploadBtnText=='正在导入'">{{imageUploadBtnText}}</el-button>
        </el-upload>
        <div v-show="images.length==0">暂无数据</div>
        <el-scrollbar
          wrapClass="scrollbar-wrap"
          :style="{height: scrollHeight}"
          ref="scrollbarContainer"
          v-show="images.length!=0"
        >
          <div class="upload_parent">
            <div class="defind_img_s" v-for="(item, index) in images" :key="index">
              <img :src="item.url" class="defind" />
              <el-button size="mini" type="text" class @click="delupload(item,index)">删除</el-button>
            </div>
          </div>
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
      imageUploadBtnText: "上传图片",

      faangledoubleup: "fa-angle-double-up",
      faangledoubledown: "fa-angle-double-down",
      multipleSelection: [],
      centerDialogVisible: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
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

      images: [],
      weld: {},
      weldResult: {},

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
      },
      optionsTestingResult: [
        {
          value: 1,
          label: "合格"
        },
        {
          value: 2,
          label: "不合格"
        }
      ],
      optionsEvaluationResult: [
        {
          value: 1,
          label: "可接受"
        },
        {
          value: 2,
          label: "不可接受"
        }
      ],
      optionsDisposalAdvice: [
        {
          value: 1,
          label: "按普通焊缝管理，严格防腐后回填"
        },
        {
          value: 2,
          label: "1-2年后复检"
        },
        {
          value: 3,
          label: "随内检测周期复检"
        },
        {
          value: 4,
          label: "复合材料修复"
        },
        {
          value: 5,
          label: "钢制环氧套筒修复"
        },
        {
          value: 6,
          label: "B型套筒修复或换管处理"
        }
      ],
      uploadData: "",
      dialogImageUrl: "",
      // 上传图片文件列表
      // fileList: [],
      //        图片上传数组
    
    };
  },

  mounted: function() {
    var _this = this;
    this.loading = true;
    this.loadTableData();
    this.scrollHeight = window.innerHeight * 0.7 + "px";
  },
  methods: {
    editResult() {},
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
                  "确定下列数据中的英文字母 “I”或“V”或阿拉伯数字“1”(被红色标记)，不表达罗马数字Ⅰ、Ⅱ、Ⅲ、Ⅳ、Ⅴ。若是，则点击取消修改后再次上传；否则点击继续上传。 <hr><div style='height:200px;overflow-y:scroll'> ";
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
                  "确定下列数据中的英文字母 “I”或“V”或阿拉伯数字“1”(被红色标记)，不表示罗马数字Ⅰ、Ⅱ、Ⅲ、Ⅳ、Ⅴ。若是，则点击取消修改后再上传；否则点击继续上传。 <hr> <div style='height:200px;overflow-y:scroll'>";
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
    beforeUploadImage(file) {
      this.imageUploadBtnText = "正在上传";

      this.uploadData = {
        gwId: this.gwId
      };
      console.log(this.uploadData);
      let promise = new Promise(resolve => {
        this.$nextTick(function() {
          resolve(true);
        });
      });
      return promise; //通过返回一个promis对象解决
    },
    uploadSuccess(response) {
      if (response) {
        this.$message({ type: "success", message: response.msg });
      }
      this.getImagesByGwId(this.gwId);
      this.imageUploadBtnText = "上传图片";

    },
    keywordsChange() {},
    exportData() {
      this.keywordsConvert = this.keywords
        .replace("+", "%2B")
        .replace(/ /g, "");
      window.open(
        "/girth/exportGirthWeld?keywords=" +
          this.keywordsConvert +
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
      this.getGwOutwardByGwId(row);

      this.dialogVisible = true;
    },
    showEditResult(row) {
      this.weld = row;
      console.log(this.weld);

      this.dialogVisible1 = true;
    },
    picManagement(row) {
      this.gwId = row.id;
      this.getImagesByGwId(this.gwId);
      this.dialogVisible2 = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
  
    
    //上传图片-删除
    delupload(item, index) {
      console.log(item)
      this.$confirm("此操作将删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteRequest("/girth/delete/image/" + item.id).then(resp => {
            if (resp && resp.status == 200) {
              this.getImagesByGwId(this.gwId);
              
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    
 
    cancelEidt() {
      this.dialogVisible1 = false;
    },
    editResult() {
      var _this = this;
      this.postsRequest("/girth/", this.weld).then(resp => {
        if (resp && resp.status == 200) {
          this.dialogVisible1 = false;
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
    getImagesByGwId(id) {
      var _this = this;
      this.getRequest("/girth/images?gwId=" + id).then(resp => {
        if (resp && resp.status == 200) {
          _this.images = resp.data.obj.images;
          console.log(_this.images);
        }
      });
    },
    getGwOutwardByGwId(row) {
      var _this = this;
      this.getRequest("/girth/gwOutward?gwId=" + row.id).then(resp => {
        console.log(resp);

        if (resp && resp.status == 200) {
          _this.gwOutwards = resp.data.obj.gwOutwards;
          _this.images = resp.data.obj.images;
          console.log(_this.gwOutwards);

          _this.upstreamPipe = [];
          _this.downstreamPipe = [];
          _this.weldWidth = [];
          _this.weldHight = [];
          _this.cuoBian = [];

          if (_this.gwOutwards.length != 0) {
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
          }

          console.log(_this.gwOutwards);
          console.log(_this.upstreamPipe);
        }
      });
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
      this.keywordsConvert = this.keywords
        .replace("+", "%2B")
        .replace(/ /g, "");
      this.getRequest(
        "/girth/?page=" +
          this.currentPage +
          "&size=" +
          this.pageSize +
          "&keywords=" +
          this.keywordsConvert +
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
          // var data = resp.data;

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
.upload-demo {
  display: inline-block;
}
.upload-pic {
  margin-bottom: 20px;
}
.upload_parent {
  display: flex;
  flex-wrap: wrap;
}
.defind {
  width: 100%;
  height: 200px;
}
.defind_img_s {
  width: 30%;
  height: 220px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.defind_img_s:nth-of-type(3n) {
  margin-right: 0;
}
</style>