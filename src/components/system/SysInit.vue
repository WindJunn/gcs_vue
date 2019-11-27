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
        <el-button
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
        </el-button>
      </div>
      <div style="margin-left: 5px;margin-right: 20px;display: inline">
        <el-upload
          :show-file-list="false"
          accept=".xlsx"
          action="/girth/importGirthWeld"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="fileUploadBtnText=='正在导入'"
          :before-upload="beforeFileUpload"
          style="display: inline"
        >
          <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
            <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>
            {{fileUploadBtnText}}
          </el-button>
        </el-upload>
        <el-button type="success" size="mini" @click="exportUsers">
          <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导入评价数据
        </el-button>

        <el-button type="success" size="mini" @click="exportUsers">
          <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
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

      <el-table-column prop="nondestructiveTestingResult" align="left" label="无损检测结果" width="280"></el-table-column>
      <el-table-column width="150" label="检测时间">
        <template slot-scope="scope">{{ scope.row.testTime | formatDate}}</template>
      </el-table-column>
      <el-table-column prop="applicabilityEvaluationResult" width="150" label="适用性评价结果"></el-table-column>
      <el-table-column prop="disposalAdvice" width="200" label="处置建议"></el-table-column>

      <!-- <el-table-column prop="checkMileage" width="90" label="检测里程"></el-table-column>
      <el-table-column prop="steelGrade" width="90" label="钢级"></el-table-column>
      <el-table-column prop="diameter" width="90" label="外径"></el-table-column>
      <el-table-column prop="designWallThickness" width="90" label="设计壁厚"></el-table-column>
      <el-table-column prop="pipeLength" width="200" label="上下游管节长度"></el-table-column>
      <el-table-column prop="lineAreaLevel" width="90" label="线路地区级别"></el-table-column>
      <el-table-column prop="designPressure" width="90" label="设计压力MPa"></el-table-column>
      <el-table-column prop="highConsequenceAreas" width="90" label="高后果区"></el-table-column>
      <el-table-column prop="poleLaying" width="90" label="钢管铺设"></el-table-column>
      <el-table-column prop="landscape" width="90" label="地貌"></el-table-column>-->

      <el-table-column align="left" label="评价时间" width="150">
        <template slot-scope="scope">{{ scope.row.createTime | formatDate}}</template>
      </el-table-column>

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

    <el-form :model="weld" ref="editUserForm" style="margin: 0px;padding: 0px;">
      <el-dialog
        title="环焊缝详情"
        style="padding: 0px;"
        :close-on-click-modal="true"
        :visible.sync="dialogVisible"
        width="77%"
      >
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              管线名称:
              <el-tag style="margin-left:20px;">{{weld.pipelineName}}</el-tag>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="环焊缝编号:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.number"
                  size="mini"
                  style="width: 60%"
                  placeholder="请输入环焊缝编号"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="检测里程:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.checkMileage"
                  size="mini"
                  style="width: 60%"
                  placeholder="请输入检测里程"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="钢级:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.steelGrade"
                  size="mini"
                  style="width: 60%"
                  placeholder="请输入钢级"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="外径(mm):" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.diameter"
                  size="mini"
                  style="width: 60%"
                  placeholder="请输入外径"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="设计壁厚(mm):" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.designWallThickness"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入设计壁厚"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="线路地区级别:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.lineAreaLevel"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入线路地区级别"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="设计压力(MPa):" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.designPressure"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入设计压力"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="高后果区:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.highConsequenceAreas"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入高后果区"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="钢管铺设:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.poleLaying"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入钢管铺设"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="地貌:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.landscape"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入地貌"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="是否为连头口:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.connector"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入是否为连头口"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="环焊缝上下游管节长度:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.upstreamPipe"
                  size="mini"
                  style="width: 30%"
                  placeholder="请输入上游管节长度"
                ></el-input>
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.downstreamPipe"
                  size="mini"
                  style="width: 30%"
                  placeholder="请输入下游管节长度"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="补口带外观检查:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.patchOutwardTest"
                  size="mini"
                  style="width: 80%"
                  placeholder="请输入补口带外观检查"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="补口带厚度mm:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.patchThickness"
                  size="mini"
                  style="width: 40%"
                  placeholder="请输入补口带厚度"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="补口带电火花检测:" prop="name">
                电压:
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.patchVoltage"
                  size="mini"
                  style="width: 30%"
                  placeholder="请输入电压"
                ></el-input>结果:
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.patchVoltageResult"
                  size="mini"
                  style="width: 30%"
                  placeholder="请输入结果"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="补口带剥离强度测试:" prop="name">
                温度:
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.patchTemperature"
                  size="mini"
                  style="width: 30%"
                  placeholder="请输入温度"
                ></el-input>结果:
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.patchTemperatureResult"
                  size="mini"
                  style="width:30%"
                  placeholder="请输入结果"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        
        环焊缝外观检测结果:
        <el-row :gutter="20">
          <el-col :offset="2" :span="6">
            <div class="grid-content bg-purple">钟点位置</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">0点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">1点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">2点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">3点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">4点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">5点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">6点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">7点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">8点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">9点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">10点</div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">11点</div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="2" :span="6">
            <div class="grid-content bg-purple">上游管壁测厚mm</div>
          </el-col>
          <div v-for="o in upstreamPipe" :key="o" class="text item">
            <el-col :span="1">
              <div class="grid-content bg-purple">{{o}}</div>
            </el-col>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="2" :span="6">
            <div class="grid-content bg-purple">下游管壁测厚mm</div>
          </el-col>
          <div v-for="o in downstreamPipe" :key="o" class="text item">
            <el-col :span="1">
              <div class="grid-content bg-purple">{{o}}</div>
            </el-col>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="2" :span="6">
            <div class="grid-content bg-purple">焊缝宽度mm</div>
          </el-col>
          <div v-for="o in weldWidth" :key="o" class="text item">
            <el-col :span="1">
              <div class="grid-content bg-purple">{{o}}</div>
            </el-col>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="2" :span="6">
            <div class="grid-content bg-purple">焊缝余高mm</div>
          </el-col>
          <div v-for="o in weldHight" :key="o" class="text item">
            <el-col :span="1">
              <div class="grid-content bg-purple">{{o }}</div>
            </el-col>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="2" :span="6">
            <div class="grid-content bg-purple">错边量mm</div>
          </el-col>
          <div v-for="o in cuoBian" :key="o" class="text item">
            <el-col :span="1">
              <div class="grid-content bg-purple">{{o}}</div>
            </el-col>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="5">
            <div class="grid-content bg-purple">
              <el-form-item label="上下游钢管焊缝错开间距:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.staggerSpacing"
                  size="mini"
                  style="width: 30%"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item label="外观检测:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.outwardResult"
                  size="mini"
                  style="width: 90%"
                  placeholder="请输入外观检测"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="21">
            <div class="grid-content bg-purple">
              <el-form-item label="内检测异常点钟及尺寸:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.abnormalPoints"
                  size="mini"
                  style="width: 80%"
                  placeholder="请输入内检测异常点钟及尺寸"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>环焊缝无损检测结果:
        <el-row :gutter="20">
          <el-col :offset="1" :span="4">
            <div class="grid-content bg-purple">磁粉/渗透</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleStandard"
                size="mini"
                style="width:100%"
                placeholder="请输入标准"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleTest"
                size="mini"
                style="width:100%"
                placeholder="请输入结果"
              ></el-input>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="1" :span="4">
            <div class="grid-content bg-purple">超声</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleStandard"
                size="mini"
                style="width:100%"
                placeholder="请输入标准"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleTest"
                size="mini"
                style="width:100%"
                placeholder="请输入结果"
              ></el-input>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="1" :span="4">
            <div class="grid-content bg-purple">相控阵</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleStandard"
                size="mini"
                style="width:100%"
                placeholder="请输入标准"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleTest"
                size="mini"
                style="width:100%"
                placeholder="请输入结果"
              ></el-input>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="1" :span="4">
            <div class="grid-content bg-purple">射线</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleStandard"
                size="mini"
                style="width:100%"
                placeholder="请输入标准"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleTest"
                size="mini"
                style="width:100%"
                placeholder="请输入结果"
              ></el-input>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="1" :span="4">
            <div class="grid-content bg-purple">TOFD</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleStandard"
                size="mini"
                style="width:100%"
                placeholder="请输入标准"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-input
                prefix-icon="el-icon-edit"
                v-model="weld.magneticParticleTest"
                size="mini"
                style="width:100%"
                placeholder="请输入结果"
              ></el-input>
            </div>
          </el-col>
        </el-row>环焊缝安全评价结果:
        <el-row :gutter="20">
          <el-col :offset="1" :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="Kr:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.kr"
                  size="mini"
                  style="width: 50%"
                  placeholder="请输入Kr"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="Lr:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.lr"
                  size="mini"
                  style="width: 50%"
                  placeholder="请输入Lr"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="评价结果:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.applicabilityEvaluationResult"
                  size="mini"
                  style="width: 70%"
                  placeholder="请输入评价结果"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="评价日期:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.evaluateTime"
                  size="mini"
                  style="width: 70%"
                  placeholder="请输入评价日期"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :offset="1" :span="10">
            <div class="grid-content bg-purple">
              <el-form-item label="结论:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.conclusion"
                  size="mini"
                  style="width: 80%"
                  placeholder="请输入结论"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-form-item label="处置建议:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  v-model="weld.disposalAdvice"
                  size="mini"
                  style="width: 80%"
                  placeholder="请输入处置建议"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
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

      fileUploadBtnText: "导入数据",
      faangledoubleup: "fa-angle-double-up",
      faangledoubledown: "fa-angle-double-down",
      multipleSelection: [],

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
        this.$message({ type: response.status, message: response.msg });
      }
      // this.loadEmps();
      this.fileUploadBtnText = "导入数据";
    },
    fileUploadError(err, file, fileList) {
      this.$message({ type: "error", message: "导入失败!" });
      this.fileUploadBtnText = "导入数据";
    },
    beforeFileUpload(file) {
      this.fileUploadBtnText = "正在导入";
    },
    keywordsChange() {},
    exportUsers() {},
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
      this.putRequest("/busServer/shield", {
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
      this.putRequest("/busServer/shield", {
        enable: 0,
        id: row.id
      }).then(resp => {
        if (resp && resp.status == 200) {
          this.loadTableData();
        }
      });
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
      this.deleteRequest("/busServer/" + id).then(resp => {
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
  background: #99a9bf;
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
